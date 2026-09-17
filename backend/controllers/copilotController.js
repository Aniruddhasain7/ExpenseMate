const { Types } = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const RecurringTransaction = require("../models/RecurringTransaction");

async function getUserFinancialContext(userId) {
  const userObjectId = new Types.ObjectId(String(userId));

  const totalIncomeAgg = await Income.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalExpenseAgg = await Expense.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = totalIncomeAgg[0]?.total || 0;
  const totalExpense = totalExpenseAgg[0]?.total || 0;
  const balance = totalIncome - totalExpense;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentExpenses = await Expense.find({
    userId,
    date: { $gte: thirtyDaysAgo },
  }).sort({ date: -1 });

  const categorySpending = {};
  recentExpenses.forEach((exp) => {
    const cat = exp.category || "Uncategorized";
    categorySpending[cat] = (categorySpending[cat] || 0) + Number(exp.amount || 0);
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const budgets = await Budget.find({ userId });
  const monthlyExpenses = await Expense.find({
    userId,
    date: { $gte: startOfMonth },
  });

  const budgetAnalysis = budgets.map((b) => {
    const spent = monthlyExpenses
      .filter((e) => e.category?.toLowerCase() === b.category?.toLowerCase())
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return {
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      spent,
      remaining: b.monthlyLimit - spent,
      percentUsed: Math.round((spent / (b.monthlyLimit || 1)) * 100),
      isExceeded: spent > b.monthlyLimit,
    };
  });

  const goals = await Goal.find({ userId });
  const goalsAnalysis = goals.map((g) => ({
    title: g.title,
    target: g.targetAmount,
    current: g.currentAmount,
    progress: Math.round((g.currentAmount / (g.targetAmount || 1)) * 100),
    isCompleted: g.isCompleted || g.currentAmount >= g.targetAmount,
  }));

  const recurring = await RecurringTransaction.find({ userId, isActive: true });
  const recurringTotal = recurring.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0] || ["None", 0];

  return {
    overview: {
      totalBalance: balance,
      totalIncome,
      totalExpense,
      savingsRatePercent: savingsRate,
      topSpendingCategory: topCategory[0],
      topSpendingAmount: topCategory[1],
      recurringMonthlyTotal: recurringTotal,
    },
    categorySpending,
    budgets: budgetAnalysis,
    goals: goalsAnalysis,
    recentExpenseCount: recentExpenses.length,
  };
}

const AI_MODEL = "openai/gpt-oss-20b";

async function callAIChat({ apiKey, messages, jsonMode = false }) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const body = {
    model: AI_MODEL,
    messages,
    temperature: 0.4,
    max_tokens: 1500,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.error?.message || `AI service responded with status ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "";
}

exports.generateAudit = async (req, res) => {
  try {
    const userId = req.user.id;
    const financialContext = await getUserFinancialContext(userId);
    const apiKey =
      process.env.GROQ_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      req.headers["x-api-key"] ||
      req.headers["x-groq-api-key"] ||
      req.body?.apiKey;

    const { overview, categorySpending, budgets, goals } = financialContext;

    let baseScore = 60;
    if (overview.savingsRatePercent >= 30) baseScore += 25;
    else if (overview.savingsRatePercent >= 15) baseScore += 15;
    else if (overview.savingsRatePercent < 0) baseScore -= 25;

    const overBudgetCount = budgets.filter((b) => b.isExceeded).length;
    if (overBudgetCount > 0) baseScore -= overBudgetCount * 8;
    else if (budgets.length > 0) baseScore += 10;

    if (goals.some((g) => g.isCompleted)) baseScore += 5;
    const finalCalculatedScore = Math.max(10, Math.min(99, baseScore));

    if (!apiKey || apiKey.trim() === "") {
      return res.json({
        isLiveAI: false,
        healthScore: finalCalculatedScore,
        rating:
          finalCalculatedScore >= 80
            ? "Excellent"
            : finalCalculatedScore >= 65
            ? "Good"
            : finalCalculatedScore >= 45
            ? "Fair"
            : "Needs Attention",
        summary: `You are currently saving ${overview.savingsRatePercent}% of your income with a net balance of $${overview.totalBalance.toLocaleString()}.`,
        strengths: [
          overview.totalBalance >= 0
            ? `Positive cash balance of $${overview.totalBalance.toLocaleString()}`
            : "Active tracking enabled to optimize cash flow",
          goals.length > 0 ? `${goals.length} active savings goals set` : "Ready to set your first savings goal",
          overview.savingsRatePercent > 0 ? `Savings rate is currently ${overview.savingsRatePercent}%` : "Income and expenses actively monitored",
        ],
        alerts: [
          overview.topSpendingCategory !== "None"
            ? `Top spending area is ${overview.topSpendingCategory} ($${overview.topSpendingAmount.toLocaleString()})`
            : "Log more expenses to identify leak patterns",
          overBudgetCount > 0 ? `${overBudgetCount} budget(s) have exceeded monthly thresholds` : "All budgets currently in healthy standing",
        ],
        actionPlan: [
          `Review your top expense category: ${overview.topSpendingCategory}`,
          "Keep monthly expenses aligned with active category budgets",
          "Automate recurring bill checks to prevent surprise subscription creep.",
        ],
        suggestedQuestions: [
          "How can I boost my monthly savings rate?",
          "Analyze my top spending categories",
          "What is a realistic 50/30/20 budget for my income?",
          "How do I reach my savings goals faster?",
        ],
        context: financialContext,
      });
    }

    const systemPrompt = `You are ExpenseMate AI Copilot, an elite personal financial strategist and advisor.
You are evaluating a user's real-time financial portfolio.
Return ONLY a valid JSON object without markdown formatting, following this exact schema:
{
  "healthScore": number (0-100 based on savings rate, budget discipline, net cash flow),
  "rating": "Excellent" | "Good" | "Fair" | "Needs Attention",
  "summary": "2-sentence executive summary of their financial posture with exact numbers",
  "strengths": ["point 1 with specifics", "point 2 with specifics", "point 3"],
  "alerts": ["leak or risk 1", "leak or risk 2"],
  "actionPlan": ["concrete step 1 with dollar targets", "concrete step 2", "concrete step 3"],
  "suggestedQuestions": ["tailored question 1", "tailored question 2", "tailored question 3"]
}`;

    const userPrompt = `Here is the user's current live financial portfolio in ExpenseMate:
${JSON.stringify(financialContext, null, 2)}

Provide an accurate, honest, motivating, and specific financial audit tailored strictly to these numbers.`;

    const aiResponse = await callAIChat({
      apiKey,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      jsonMode: true,
    });

    let auditData;
    try {
      auditData = JSON.parse(aiResponse);
    } catch {
      const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      auditData = JSON.parse(cleanJson);
    }

    return res.json({
      isLiveAI: true,
      ...auditData,
      context: financialContext,
    });
  } catch (error) {
    console.error("AI Copilot Audit Error:", error);
    return res.status(500).json({
      message: "Failed to generate AI Copilot audit",
      error: error.message,
    });
  }
};

exports.chatWithCopilot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messages = [], userQuery } = req.body;
    const apiKey =
      process.env.GROQ_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      req.headers["x-api-key"] ||
      req.headers["x-groq-api-key"] ||
      req.body?.apiKey;

    const financialContext = await getUserFinancialContext(userId);

    if (!apiKey || apiKey.trim() === "") {
      const query = userQuery || (messages.length > 0 ? messages[messages.length - 1].content : "");
      return res.json({
        isLiveAI: false,
        reply: `### 💡 AI Service Key Needed\n\nPlease configure your AI API key in the backend environment to activate live Copilot conversations.\n\n---\n\n### 📊 Quick Snapshot of Your Finances:\n- **Total Balance**: $${financialContext.overview.totalBalance.toLocaleString()}\n- **Monthly Savings Rate**: ${financialContext.overview.savingsRatePercent}%\n- **Top Expense Category**: **${financialContext.overview.topSpendingCategory}** ($${financialContext.overview.topSpendingAmount.toLocaleString()})\n- **Active Budgets**: ${financialContext.budgets.length} (${financialContext.budgets.filter((b) => b.isExceeded).length} exceeded)\n\n*Once configured, I will provide instant answers to: "${query || "optimizing your finances"}"!*`,
      });
    }

    const systemPrompt = `You are ExpenseMate AI Copilot — a world-class, sharp, friendly, and practical personal wealth and finance copilot.
You have immediate access to the user's real financial records in ExpenseMate:

FINANCIAL CONTEXT:
${JSON.stringify(financialContext, null, 2)}

GUIDELINES:
1. Always base your advice on the user's real numbers (balance, category spending, active budgets, and savings goals).
2. When answering, be clear, structured, and concise. Use markdown (bolding, bullet points, headers, small tables if useful).
3. If they ask about saving money, pinpoint specific categories where they spend the most and calculate realistic target reductions.
4. If they ask about budgets, assess their actual monthly limits and recent spending.
5. If they ask general financial questions (e.g. 50/30/20 rule, emergency funds, debt vs investing), tailor the answer specifically to their current income and balance.
6. Maintain an encouraging, financially savvy, proactive tone.`;

    const conversation = [{ role: "system", content: systemPrompt }];

    const recentMsgs = messages.slice(-10);
    recentMsgs.forEach((msg) => {
      if (msg.role === "user" || msg.role === "assistant") {
        conversation.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    if (userQuery && (!messages.length || messages[messages.length - 1]?.content !== userQuery)) {
      conversation.push({ role: "user", content: userQuery });
    }

    const reply = await callAIChat({
      apiKey,
      messages: conversation,
      jsonMode: false,
    });

    return res.json({
      isLiveAI: true,
      reply,
    });
  } catch (error) {
    console.error("AI Copilot Chat Error:", error);
    return res.status(500).json({
      message: "AI Copilot encountered an error communicating with AI service",
      error: error.message,
    });
  }
};
