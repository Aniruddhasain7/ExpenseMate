import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import {
  LuScanLine,
  LuDownload,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";

import CashFlowOverview from "../../components/Dashboard/CashFlowOverview";
import { Modal } from "../../components/Modal";
import AddIncomeForm from "../../components/Transactions/AddIncomeForm";
import AddExpenseForm from "../../components/Transactions/AddExpenseForm";
import ReceiptScanner from "../../components/Receipt/ReceiptScanner";
import DeleteAlert from "../../components/DeleteAlert";
import { useCurrency } from "../../context/CurrencyContext";
import { getDefaultCategoryIcon } from "../../utils/helper";

const Transactions = ({ defaultTab = "all" }) => {
  useUserAuth();
  const { formatAmount } = useCurrency();

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState(defaultTab); 
  const [searchQuery, setSearchQuery] = useState("");

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    id: null,
    type: null,
  });

  const [prefillData, setPrefillData] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [incRes, expRes] = await Promise.allSettled([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
      ]);

      if (incRes.status === "fulfilled" && incRes.value?.data) {
        setIncomeData(incRes.value.data);
      }
      if (expRes.status === "fulfilled" && expRes.value?.data) {
        setExpenseData(expRes.value.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    if (!source?.trim()) {
      toast.error("Source is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error(error.response?.data?.message || "Failed to add income");
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category?.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      setPrefillData(null);
      toast.success("Expense added successfully!");
      fetchAllData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleReceiptData = (data) => {
    setPrefillData({
      category: data.category || "",
      amount: data.amount || "",
      date: data.date || "",
      icon: "",
    });
    setOpenReceiptModal(false);
    setOpenAddExpenseModal(true);
  };

  const handleDeleteTransaction = async () => {
    const { id, type } = openDeleteAlert;
    if (!id || !type) return;

    try {
      if (type === "income") {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
        toast.success("Income deleted successfully");
      } else {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
        toast.success("Expense deleted successfully");
      }
      setOpenDeleteAlert({ show: false, id: null, type: null });
      fetchAllData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete record");
    }
  };

  const handleDownloadExcel = async (type = activeTab) => {
    try {
      let endpoint = API_PATHS.DASHBOARD.DOWNLOAD_ALL;
      let fileName = `ExpenseMate_Financial_Report_${moment().format("YYYY-MM-DD")}.xlsx`;

      if (type === "income") {
        endpoint = API_PATHS.INCOME.DOWNLOAD_INCOME;
        fileName = `Income_Report_${moment().format("YYYY-MM-DD")}.xlsx`;
      } else if (type === "expense") {
        endpoint = API_PATHS.EXPENSE.DOWNLOAD_EXPENSE;
        fileName = `Expense_Report_${moment().format("YYYY-MM-DD")}.xlsx`;
      }

      toast.loading("Generating Excel report…", { id: "excel-download" });

      const response = await axiosInstance.get(endpoint, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Excel report downloaded!", { id: "excel-download" });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to download Excel report.", { id: "excel-download" });
    }
  };

  const combinedTransactions = useMemo(() => {
    const incomes = (incomeData || []).map((t) => ({ ...t, type: "income" }));
    const expenses = (expenseData || []).map((t) => ({ ...t, type: "expense" }));

    let list = [];
    if (activeTab === "income") {
      list = incomes;
    } else if (activeTab === "expense") {
      list = expenses;
    } else {
      list = [...incomes, ...expenses];
    }

    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        const title = (
          item.type === "expense" ? item.category : item.source
        ) || "";
        return title.toLowerCase().includes(q);
      });
    }

    return list;
  }, [incomeData, expenseData, activeTab, searchQuery]);

  const totalIncome = useMemo(
    () => incomeData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [incomeData]
  );
  const totalExpense = useMemo(
    () => expenseData.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenseData]
  );

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="my-2 sm:my-4 mx-auto space-y-6">
        
        <div>
          <CashFlowOverview
            incomes={incomeData}
            expenses={expenseData}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            onAddIncome={() => setOpenAddIncomeModal(true)}
            onAddExpense={() => setOpenAddExpenseModal(true)}
            chartType="bar"
            showToggle={false}
          />
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#222222]">
            <div>
              <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                All Transactions
              </h5>
              <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
                Manage, filter, and review both Income and Expense entries
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setOpenReceiptModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-[#0c1f13] hover:bg-green-100 dark:hover:bg-[#132c1c] border border-green-200 dark:border-[#1b3d26] px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <LuScanLine size={14} /> Scan Receipt
              </button>

              <button
                type="button"
                onClick={() => handleDownloadExcel(activeTab)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-gray-200 bg-gray-50 dark:bg-[#151515] hover:bg-gray-100 dark:hover:bg-[#222222] border border-gray-200/70 dark:border-[#262626] px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title={`Download ${activeTab === "all" ? "Complete Financial Statement" : activeTab === "income" ? "Income Report" : "Expense Report"}`}
              >
                <LuDownload size={14} /> Export Excel
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
            <div className="flex items-center bg-gray-100 dark:bg-[#151515] p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All ({incomeData.length + expenseData.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("income")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "income"
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-slate-500 dark:text-gray-400 hover:text-[#2563EB]"
                }`}
              >
                Income ({incomeData.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("expense")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "expense"
                    ? "bg-[#FA2C37] text-white shadow-xs"
                    : "text-slate-500 dark:text-gray-400 hover:text-[#FA2C37]"
                }`}
              >
                Expenses ({expenseData.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category or source..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/70 dark:border-[#262626] text-slate-800 dark:text-gray-200 outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {combinedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-400 dark:text-gray-500">
                  No transactions found matching your criteria.
                </p>
              </div>
            ) : (
              combinedTransactions.map((item) => (
                <div
                  key={`${item.type}-${item._id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/60 dark:bg-[#121212] hover:bg-gray-100/70 dark:hover:bg-[#181818] border border-gray-200/50 dark:border-[#202020] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c1c1c] border border-gray-200/70 dark:border-[#282828] flex items-center justify-center text-lg shrink-0 shadow-2xs overflow-hidden">
                      {(() => {
                        const itemTitle = item.type === "expense" ? item.category : item.source;
                        const displayIcon = item.icon || getDefaultCategoryIcon(itemTitle, item.type);
                        
                        if (
                          typeof displayIcon === "string" &&
                          (displayIcon.startsWith("http") ||
                            displayIcon.includes("cdn.jsdelivr.net") ||
                            displayIcon.endsWith(".png"))
                        ) {
                          return (
                            <img
                              src={
                                displayIcon.startsWith("http")
                                  ? displayIcon
                                  : `https://${displayIcon.replace(/^\/\//, "")}`
                              }
                              alt="icon"
                              className="w-6 h-6 object-contain"
                            />
                          );
                        }
                        return <span>{displayIcon || (item.type === "income" ? "💰" : "💳")}</span>;
                      })()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h6 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.type === "expense" ? item.category : item.source}
                        </h6>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.type === "income"
                              ? "bg-blue-50 dark:bg-[#0c192c] text-[#2563EB] border border-blue-200/60 dark:border-blue-900/40"
                              : "bg-red-50 dark:bg-[#280c10] text-[#FA2C37] border border-red-200/60 dark:border-red-800/40"
                          }`}
                        >
                          {item.type === "income" ? "Income" : "Expense"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                        {moment(item.date).format("Do MMM YYYY")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        item.type === "income"
                          ? "text-[#2563EB]"
                          : "text-[#FA2C37]"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatAmount(item.amount)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenDeleteAlert({
                          show: true,
                          id: item._id,
                          type: item.type,
                        })
                      }
                      className="text-slate-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title="Delete record"
                    >
                      <LuTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => {
            setOpenAddExpenseModal(false);
            setPrefillData(null);
          }}
          title="Add Expense"
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            prefill={prefillData}
          />
        </Modal>

        <Modal
          isOpen={openReceiptModal}
          onClose={() => setOpenReceiptModal(false)}
          title="📷 Scan Receipt"
        >
          <ReceiptScanner onDataExtracted={handleReceiptData} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() =>
            setOpenDeleteAlert({ show: false, id: null, type: null })
          }
          title={`Delete ${openDeleteAlert.type === "income" ? "Income" : "Expense"}`}
        >
          <DeleteAlert
            content={`Are you sure you want to delete this ${
              openDeleteAlert.type === "income" ? "income" : "expense"
            } entry? This action cannot be undone.`}
            onDelete={handleDeleteTransaction}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
