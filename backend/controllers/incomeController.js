const xlsx = require("xlsx");
const Income = require("../models/Income");
const { processUserRecurring } = require("./recurringController");

exports.addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = await Income.create({
      userId: req.user._id, 
      icon,
      source,
      amount,
      date: new Date(date),
    });

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("ADD INCOME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    await processUserRecurring(req.user._id);
    const { search, startDate, endDate, minAmount, maxAmount } = req.query;
    const filter = { userId: req.user._id };

    if (search) filter.source = { $regex: search, $options: "i" };
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

    const income = await Income.find(filter).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    console.error("GET INCOME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  try {
    const incomes = await Income.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const data = incomes.map((item, index) => ({
      "#": index + 1,
      Date: item.date
        ? new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      Source: item.source || "Other",
      Amount: Number(item.amount || 0),
    }));

    if (data.length > 0) {
      data.push({
        "#": "",
        Date: "TOTAL",
        Source: "",
        Amount: totalIncome,
      });
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    ws["!cols"] = [{ wch: 6 }, { wch: 16 }, { wch: 25 }, { wch: 16 }];
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `Income_Report_${new Date().toISOString().split("T")[0]}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Download Income Excel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
