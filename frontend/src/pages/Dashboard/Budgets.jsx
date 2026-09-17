import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Modal } from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import BudgetCard from "../../components/Budget/BudgetCard";
import AddBudgetModal from "../../components/Budget/AddBudgetModal";
import { LuPlus, LuSlidersHorizontal, LuWallet } from "react-icons/lu";
import { IoIosAlert } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useCurrency } from "../../context/CurrencyContext";

const Budgets = () => {
  useUserAuth();
  const { formatAmount } = useCurrency();

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    exceededCount: 0,
    warningCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState({ show: false, id: null });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.BUDGET.GET);
      if (res.data) {
        setBudgets(res.data.budgets || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (budgetData) => {
    try {
      await axiosInstance.post(API_PATHS.BUDGET.SET, budgetData);
      toast.success("Budget saved successfully!");
      setOpenAddModal(false);
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save budget");
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.BUDGET.DELETE(id));
      toast.success("Budget deleted successfully!");
      setOpenDeleteModal({ show: false, id: null });
      fetchBudgets();
    } catch (err) {
      toast.error("Failed to delete budget");
    }
  };

  const overallPercentage =
    summary.totalBudget > 0
      ? Math.min(100, Math.round((summary.totalSpent / summary.totalBudget) * 100))
      : 0;

  return (
    <DashboardLayout activeMenu="Budgets">
      <div className="my-5 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LuSlidersHorizontal className="text-green-500" /> Category Budgets
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              Set monthly spending targets and prevent overspending.
            </p>
          </div>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <LuPlus size={16} />
            Set New Budget
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Total Monthly Budget
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatAmount(summary.totalBudget || 0)}
            </p>
            <div className="w-full bg-slate-100 dark:bg-[#1a1a1a] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  summary.exceededCount > 0
                    ? "bg-[#FA2C37]"
                    : overallPercentage > 75
                    ? "bg-[#FF6900]"
                    : "bg-[#22C55E]"
                }`}
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-400 mt-1.5 flex justify-between">
              <span>{overallPercentage}% spent overall</span>
              <span>Spent: {formatAmount(summary.totalSpent || 0)}</span>
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <FaCircleCheck className="text-[#22C55E]" /> Active Budgets
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {budgets.length}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              Categories tracked this month
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <IoIosAlert className="text-[#FA2C37]" size={16} /> Overspent Categories
            </p>
            <p className="text-2xl font-bold text-[#FA2C37] mt-1">
              {summary.exceededCount || 0}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              {summary.warningCount || 0} approaching limit (≥75%)
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="py-16 text-center text-slate-400 dark:text-gray-500 text-sm">
              Loading your category budgets…
            </div>
          ) : budgets.length === 0 ? (
            <div className="card text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-[#0c1f13] text-green-500 mx-auto flex items-center justify-center text-3xl border border-green-100 dark:border-[#1b3d26]">
                <LuWallet />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  No Category Budgets Set
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-400 max-w-md mx-auto mt-1">
                  Create category limits (e.g. ₹10,000 for Food, ₹3,000 for Entertainment) to track and control your monthly spending.
                </p>
              </div>
              <button
                onClick={() => setOpenAddModal(true)}
                className="add-btn add-btn-fill px-5 py-2.5 rounded-xl text-sm font-medium mx-auto cursor-pointer inline-flex items-center gap-2"
              >
                <LuPlus size={16} /> Create First Budget
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((b) => (
                <BudgetCard
                  key={b._id}
                  budget={b}
                  onDelete={(id) => setOpenDeleteModal({ show: true, id })}
                />
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          title="Set Category Budget"
        >
          <AddBudgetModal onSave={handleSaveBudget} />
        </Modal>

        <Modal
          isOpen={openDeleteModal.show}
          onClose={() => setOpenDeleteModal({ show: false, id: null })}
          title="Delete Budget"
        >
          <DeleteAlert
            content="Are you sure you want to remove this category budget?"
            onDelete={() => handleDeleteBudget(openDeleteModal.id)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budgets;
