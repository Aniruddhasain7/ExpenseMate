const Income=require("../models/Income");
const Expense=require("../models/Expense");
const { isValidObjectId, Types }=require("mongoose");
const { processUserRecurring } = require("./recurringController");
const xlsx = require("xlsx");

exports.getDashboardData=async (req, res)=> {
    try {
        const userId=req.user.id;
        await processUserRecurring(userId);
        const userObjectId=new Types.ObjectId(String(userId)); 
        const totalIncome=await Income.aggregate([
            { $match: { userId: userObjectId }},
            { $group: {_id: null, total: { $sum: "$amount" }}},
        ]);
        console.log("totalIncome",{totalIncome,userId: isValidObjectId(userId)});

        const totalExpense=await Expense.aggregate([
            { $match: {userId: userObjectId}},
            { $group: {_id: null, total: { $sum:"$amount"}}},
        ]);

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now()-60*24*60*60*1000)},
        }).sort({date: -1});
        
        const incomeLast60Days=last60DaysIncomeTransactions.reduce(
            (sum,transaction) => sum+transaction.amount,
            0
        );

        const last30DaysExpenseTransactions= await Expense.find({
            userId,
            date: { $gte: new Date(Date.now()-30*24*60*60*1000)},
        }).sort({date: -1});

        const expenseLast30Days=last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum+transaction.amount,
            0
        );

        const lastTransactions=[
            ...(await Income.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({userId}).sort({date: -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
            
        ].sort((a,b)=>b.date-a.date);
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0)-(totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
};

exports.downloadFullFinancialReport = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const [incomes, expenses] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
    ]);

    const totalIncome = incomes.reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );
    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    const netBalance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0
        ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
        : 0;

    const wb = xlsx.utils.book_new();

    const summaryData = [
      { Metric: "ExpenseMate - Financial Statement", Value: "" },
      { Metric: "Generated Date", Value: new Date().toLocaleString("en-GB") },
      { Metric: "Account Holder", Value: req.user.fullName || "User" },
      { Metric: "Email", Value: req.user.email || "N/A" },
      { Metric: "", Value: "" },
      { Metric: "Total Income (Inflow)", Value: totalIncome },
      { Metric: "Total Expense (Outflow)", Value: totalExpense },
      { Metric: "Net Balance", Value: netBalance },
      { Metric: "Savings Rate", Value: `${savingsRate}%` },
      { Metric: "", Value: "" },
      { Metric: "Total Income Records", Value: incomes.length },
      { Metric: "Total Expense Records", Value: expenses.length },
      { Metric: "Total All Transactions", Value: incomes.length + expenses.length },
    ];
    const wsSummary = xlsx.utils.json_to_sheet(summaryData);
    wsSummary["!cols"] = [{ wch: 32 }, { wch: 28 }];
    xlsx.utils.book_append_sheet(wb, wsSummary, "Overview");

    const allList = [
      ...incomes.map((t) => ({
        rawDate: new Date(t.date || 0),
        Date: t.date
          ? new Date(t.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        Type: "Income",
        "Category / Source": t.source || "Income",
        "Inflow (+)": Number(t.amount || 0),
        "Outflow (-)": "",
        "Net Flow": Number(t.amount || 0),
      })),
      ...expenses.map((t) => ({
        rawDate: new Date(t.date || 0),
        Date: t.date
          ? new Date(t.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        Type: "Expense",
        "Category / Source": t.category || "Expense",
        "Inflow (+)": "",
        "Outflow (-)": Number(t.amount || 0),
        "Net Flow": -Number(t.amount || 0),
      })),
    ].sort((a, b) => b.rawDate - a.rawDate);

    const formattedAllTransactions = allList.map(
      ({ rawDate, ...rest }, index) => ({
        "#": index + 1,
        ...rest,
      })
    );

    if (formattedAllTransactions.length > 0) {
      formattedAllTransactions.push({
        "#": "",
        Date: "TOTAL",
        Type: "",
        "Category / Source": "",
        "Inflow (+)": totalIncome,
        "Outflow (-)": totalExpense,
        "Net Flow": netBalance,
      });
    }

    const wsAll = xlsx.utils.json_to_sheet(formattedAllTransactions);
    wsAll["!cols"] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    xlsx.utils.book_append_sheet(wb, wsAll, "All Transactions");

    const incomeRows = incomes.map((item, index) => ({
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
    if (incomeRows.length > 0) {
      incomeRows.push({
        "#": "",
        Date: "TOTAL",
        Source: "",
        Amount: totalIncome,
      });
    }
    const wsIncome = xlsx.utils.json_to_sheet(incomeRows);
    wsIncome["!cols"] = [{ wch: 6 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
    xlsx.utils.book_append_sheet(wb, wsIncome, "Income Details");

    const expenseRows = expenses.map((item, index) => ({
      "#": index + 1,
      Date: item.date
        ? new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      Category: item.category || "Other",
      Amount: Number(item.amount || 0),
    }));
    if (expenseRows.length > 0) {
      expenseRows.push({
        "#": "",
        Date: "TOTAL",
        Category: "",
        Amount: totalExpense,
      });
    }
    const wsExpense = xlsx.utils.json_to_sheet(expenseRows);
    wsExpense["!cols"] = [{ wch: 6 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
    xlsx.utils.book_append_sheet(wb, wsExpense, "Expense Details");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `ExpenseMate_Financial_Statement_${new Date().toISOString().split("T")[0]}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Full Financial Excel Error:", error);
    res.status(500).json({ message: "Failed to generate financial report" });
  }
};