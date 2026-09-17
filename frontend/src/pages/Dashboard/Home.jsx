import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import toast from "react-hot-toast";

import {
  LuHandCoins,
  LuWalletMinimal,
  LuSlidersHorizontal,
  LuTarget,
  LuSparkles,
  LuBadgePercent,
} from "react-icons/lu";
import { IoMdCard, IoIosAlert } from "react-icons/io";

import CashFlowOverview from "../../components/Dashboard/CashFlowOverview";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import BudgetGoals from "../../components/Dashboard/BudgetGoals";
import SmartInsights from "../../components/Dashboard/SmartInsights";

import { Modal } from "../../components/Modal";
import AddIncomeForm from "../../components/Transactions/AddIncomeForm";
import AddExpenseForm from "../../components/Transactions/AddExpenseForm";

const Home = () => {
  useUserAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [dashRes, budgetRes, goalsRes] = await Promise.allSettled([
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
        axiosInstance.get(API_PATHS.BUDGET.GET),
        axiosInstance.get(API_PATHS.GOALS.GET),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.data) {
        setDashboardData(dashRes.value.data);
      }
      if (budgetRes.status === "fulfilled" && budgetRes.value?.data) {
        setBudgetSummary(budgetRes.value.data.summary);
      }
      if (goalsRes.status === "fulfilled" && goalsRes.value?.data) {
        setGoals(goalsRes.value.data.goals || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      toast.success("Income recorded successfully!");
      fetchDashboardData();
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
      toast.success("Expense recorded successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  const topCategory = useMemo(() => {
    const txns = dashboardData?.last30DaysExpenses?.transactions || [];
    if (!txns.length) return null;
    const catMap = {};
    txns.forEach((t) => {
      const c = t.category || "General";
      catMap[c] = (catMap[c] || 0) + Number(t.amount || 0);
    });
    return Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [dashboardData]);

  const savingsRateVal = useMemo(() => {
    const income = dashboardData?.totalIncome || 0;
    const expense = dashboardData?.totalExpenses || 0;
    if (income <= 0) return "0%";
    const rate = Math.round(((income - expense) / income) * 100);
    return `${rate}%`;
  }, [dashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-2 sm:my-4 mx-auto space-y-6">
        
        {budgetSummary?.exceededCount > 0 && (
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-[#250c0f] border border-red-200 dark:border-[#42161b] rounded-2xl animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-[#381216] text-red-600 dark:text-red-400 flex items-center justify-center text-xl shrink-0">
                <IoIosAlert size={24} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-red-700 dark:text-red-300">
                  Budget Overspending Alert!
                </h5>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                  {budgetSummary.exceededCount}{" "}
                  {budgetSummary.exceededCount === 1
                    ? "category has"
                    : "categories have"}{" "}
                  exceeded their monthly spending limit.
                </p>
              </div>
            </div>
            <Link
              to="/budgets"
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
            >
              Review Budgets
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={dashboardData?.totalBalance || 0}
            color="bg-[#22C55E]"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={dashboardData?.totalIncome || 0}
            color="bg-[#2563EB]"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={dashboardData?.totalExpenses || 0}
            color="bg-[#FA2C37]"
          />
          <InfoCard
            icon={<LuBadgePercent />}
            label="Savings Rate"
            value={savingsRateVal}
            isCurrency={false}
            color="bg-[#2DD4BF]"
          />
        </div>

        <SmartInsights
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpenses || 0}
          topCategory={topCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/budgets"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#000000] border border-gray-200/70 dark:border-[#222222] hover:border-green-400 dark:hover:border-green-600 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-[#0c1f13] text-green-600 dark:text-green-400 flex items-center justify-center text-lg">
                <LuSlidersHorizontal />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  Category Budgets
                </p>
                <p className="text-[11px] text-slate-400 dark:text-gray-400">
                  Control spending limits
                </p>
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>

          <Link
            to="/goals"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#000000] border border-gray-200/70 dark:border-[#222222] hover:border-orange-400 dark:hover:border-orange-600 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-[#261608] text-[#FF6900] flex items-center justify-center text-lg">
                <LuTarget />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  Savings Goals
                </p>
                <p className="text-[11px] text-slate-400 dark:text-gray-400">
                  Fund your targets
                </p>
              </div>
            </div>
            <span className="text-xs text-[#FF6900] font-semibold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>

          <Link
            to="/copilot"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#000000] border border-gray-200/70 dark:border-[#222222] hover:border-green-400 dark:hover:border-green-600 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-[#092211] text-green-500 flex items-center justify-center text-lg">
                <LuSparkles />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  AI Copilot
                </p>
                <p className="text-[11px] text-slate-400 dark:text-gray-400">
                  Smart financial advisor & audits
                </p>
              </div>
            </div>
            <span className="text-xs text-green-500 font-semibold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div>
          <CashFlowOverview
            incomes={dashboardData?.last60DaysIncome?.transactions || []}
            expenses={dashboardData?.last30DaysExpenses?.transactions || []}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
            onAddIncome={() => setOpenAddIncomeModal(true)}
            onAddExpense={() => setOpenAddExpenseModal(true)}
            chartType="line"
            showToggle={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
          />
          <BudgetGoals
            budgetSummary={budgetSummary}
            goals={goals}
          />
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
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Home;