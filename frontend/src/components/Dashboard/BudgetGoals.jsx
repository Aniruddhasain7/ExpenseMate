import React from "react";
import { Link } from "react-router-dom";
import { LuSlidersHorizontal, LuTarget, LuArrowRight } from "react-icons/lu";
import { useCurrency } from "../../context/CurrencyContext";

const BudgetGoals = ({ budgetSummary, goals = [] }) => {
  const { formatAmount } = useCurrency();

  const totalBudget = budgetSummary?.totalBudget || 0;
  const totalSpent = budgetSummary?.totalSpent || 0;
  const budgetPercentage =
    totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const activeGoals = (goals || []).filter((g) => !g.isCompleted).slice(0, 3);

  return (
    <div className="card h-full flex flex-col justify-between space-y-5">
      
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 dark:bg-[#0c1f13] text-green-600 dark:text-green-400 flex items-center justify-center text-sm">
              <LuSlidersHorizontal />
            </div>
            <h6 className="text-sm font-bold text-slate-900 dark:text-white">
              Budget Consumption
            </h6>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
          >
            Manage <LuArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-500 dark:text-gray-400">
              Spent:{" "}
              <strong className="text-slate-800 dark:text-gray-200">
                {formatAmount(totalSpent)}
              </strong>
            </span>
            <span className="text-slate-500 dark:text-gray-400">
              Limit:{" "}
              <strong className="text-slate-800 dark:text-gray-200">
                {totalBudget > 0 ? formatAmount(totalBudget) : "Not Set"}
              </strong>
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-[#181818] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentage >= 100
                  ? "bg-red-500"
                  : budgetPercentage >= 80
                  ? "bg-orange-400"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span
              className={`font-semibold ${
                budgetPercentage >= 100
                  ? "text-red-500"
                  : budgetPercentage >= 80
                  ? "text-orange-500"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {budgetPercentage}% consumed
            </span>
            <span className="text-slate-400 dark:text-gray-500">
              {totalBudget > totalSpent
                ? `${formatAmount(totalBudget - totalSpent)} left`
                : "Limit reached"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-[#222222]">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-[#261608] text-[#FF6900] flex items-center justify-center text-sm">
              <LuTarget />
            </div>
            <h6 className="text-sm font-bold text-slate-900 dark:text-white">
              Savings Targets
            </h6>
          </div>
          <Link
            to="/goals"
            className="text-xs font-semibold text-[#FF6900] hover:underline flex items-center gap-1"
          >
            All Goals <LuArrowRight className="text-xs" />
          </Link>
        </div>

        {activeGoals.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-gray-500 py-3 text-center">
            No active savings goals. Create one in Goals!
          </p>
        ) : (
          <div className="space-y-2.5 mt-2">
            {activeGoals.map((goal) => (
              <div
                key={goal._id}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#121212] border border-gray-200/60 dark:border-[#222222]"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                    <span>{goal.icon || "🎯"}</span>
                    {goal.title}
                  </span>
                  <span className="text-[11px] font-bold text-green-600 dark:text-green-400">
                    {goal.percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/80 dark:bg-[#202020] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, goal.percentage || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-gray-500 mt-1">
                  <span>{formatAmount(goal.currentAmount || 0)}</span>
                  <span>Target: {formatAmount(goal.targetAmount || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetGoals;
