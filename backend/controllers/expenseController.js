const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const { processUserRecurring } = require("./recurringController");

exports.addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = await Expense.create({
      userId: req.user._id,   
      icon,
      category,
      amount,
      date: new Date(date),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllExpense = async (req, res) => {
  try {
    await processUserRecurring(req.user._id);
    const { search, category, startDate, endDate, minAmount, maxAmount } = req.query;
    const filter = { userId: req.user._id };

    if (category) filter.category = { $regex: category, $options: "i" };
    if (search) filter.category = { $regex: search, $options: "i" };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const expense = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (error) {
    console.error("GET EXPENSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const data = expenses.map((item, index) => ({
      "#": index + 1,
      Date: item.date
        ? new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      Category: item.category || "Uncategorized",
      Amount: Number(item.amount || 0),
    }));

    if (data.length > 0) {
      data.push({
        "#": "",
        Date: "TOTAL",
        Category: "",
        Amount: totalExpense,
      });
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    ws["!cols"] = [{ wch: 6 }, { wch: 16 }, { wch: 25 }, { wch: 16 }];
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `Expense_Report_${new Date().toISOString().split("T")[0]}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Download Expense Excel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
