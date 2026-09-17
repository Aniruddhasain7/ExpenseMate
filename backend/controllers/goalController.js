const Goal = require("../models/Goal");

exports.createGoal = async (req, res) => {
  const userId = req.user.id;
  const { title, targetAmount, currentAmount, deadline, category, icon } = req.body;

  if (!title || !targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
    return res.status(400).json({ message: "Valid title and target amount are required" });
  }

  try {
    const goal = new Goal({
      userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline ? new Date(deadline) : null,
      category: category || "General",
      icon: icon || "🎯",
      isCompleted: Number(currentAmount) >= Number(targetAmount),
    });

    await goal.save();
    res.status(201).json({ message: "Savings goal created successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const goals = await Goal.find({ userId }).sort({ isCompleted: 1, createdAt: -1 });

    const enrichedGoals = goals.map((g) => {
      const target = g.targetAmount || 0;
      const current = g.currentAmount || 0;
      const remaining = Math.max(0, target - current);
      const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      const isCompleted = current >= target;

      let daysRemaining = null;
      if (g.deadline) {
        const diffTime = new Date(g.deadline) - new Date();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        _id: g._id,
        title: g.title,
        targetAmount: target,
        currentAmount: current,
        remaining,
        percentage,
        deadline: g.deadline,
        daysRemaining,
        category: g.category,
        icon: g.icon,
        isCompleted,
        createdAt: g.createdAt,
      };
    });

    const totalTarget = enrichedGoals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = enrichedGoals.reduce((s, g) => s + g.currentAmount, 0);
    const completedCount = enrichedGoals.filter((g) => g.isCompleted).length;

    res.status(200).json({
      goals: enrichedGoals,
      summary: {
        totalTarget,
        totalSaved,
        completedCount,
        activeCount: enrichedGoals.length - completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.depositToGoal = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Valid deposit amount is required" });
  }

  try {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    goal.currentAmount = (goal.currentAmount || 0) + Number(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }
    await goal.save();

    res.status(200).json({ message: "Deposit added successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, targetAmount, currentAmount, deadline, category, icon } = req.body;

  try {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    if (title) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (deadline !== undefined) goal.deadline = deadline ? new Date(deadline) : null;
    if (category) goal.category = category;
    if (icon) goal.icon = icon;
    goal.isCompleted = (goal.currentAmount || 0) >= (goal.targetAmount || 0);

    await goal.save();
    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const deleted = await Goal.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
