const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.setBudget = async (req, res) => {
  const userId = req.user.id;
  const { category, monthlyLimit, icon, month } = req.body;

  if (!category || !monthlyLimit || isNaN(monthlyLimit) || Number(monthlyLimit) <= 0) {
    return res.status(400).json({ message: "Valid category and monthly limit are required" });
  }

  try {
    const existing = await Budget.findOne({
      userId,
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });

    if (existing) {
      existing.monthlyLimit = Number(monthlyLimit);
      if (icon) existing.icon = icon;
      if (month) existing.month = month;
      await existing.save();
      return res.status(200).json({ message: "Budget updated successfully", budget: existing });
    }

    const newBudget = new Budget({
      userId,
      category,
      monthlyLimit: Number(monthlyLimit),
      icon: icon || "",
      month: month || "all",
    });

    await newBudget.save();
    res.status(201).json({ message: "Budget created successfully", budget: newBudget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const spentMap = {};
    expenses.forEach((e) => {
      const catKey = (e.category || "Other").trim().toLowerCase();
      spentMap[catKey] = (spentMap[catKey] || 0) + Number(e.amount || 0);
    });

    const enrichedBudgets = budgets.map((b) => {
      const catKey = (b.category || "").trim().toLowerCase();
      const spent = spentMap[catKey] || 0;
      const limit = b.monthlyLimit;
      const remaining = limit - spent;
      const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

      let status = "safe";
      if (percentage >= 100) {
        status = "exceeded";
      } else if (percentage >= 75) {
        status = "warning";
      }

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: limit,
        icon: b.icon,
        month: b.month,
        spent,
        remaining,
        percentage,
        status,
      };
    });

    const totalBudget = enrichedBudgets.reduce((acc, curr) => acc + curr.monthlyLimit, 0);
    const totalSpent = enrichedBudgets.reduce((acc, curr) => acc + curr.spent, 0);
    const exceededCount = enrichedBudgets.filter((b) => b.status === "exceeded").length;
    const warningCount = enrichedBudgets.filter((b) => b.status === "warning").length;

    res.status(200).json({
      budgets: enrichedBudgets,
      summary: {
        totalBudget,
        totalSpent,
        exceededCount,
        warningCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const deleted = await Budget.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
