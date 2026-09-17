import React, { useMemo } from "react";
import { LuPlus, LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import CashFlowChart from "../Charts/CashFlowChart";
import { prepareCashFlowTimelineData } from "../../utils/helper";
import { useCurrency } from "../../context/CurrencyContext";

const CashFlowOverview = ({
  incomes = [],
  expenses = [],
  totalIncome = 0,
  totalExpense = 0,
  onAddIncome,
  onAddExpense,
  chartType = "bar",
  showToggle = false,
}) => {
  const { formatAmount } = useCurrency();

  const chartData = useMemo(() => {
    return prepareCashFlowTimelineData(incomes, expenses);
  }, [incomes, expenses]);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="card w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#222222]">
        <div>
          <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Cash Flow Overview
          </h5>
          <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
            {chartType === "line"
              ? "Timeline cash flow trends for your Income and Expenses"
              : "Comparative breakdown of your Income and Expenses in a single unified chart"}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onAddIncome}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 dark:bg-[#0c192c] hover:bg-blue-100 dark:hover:bg-[#132540] border border-blue-200 dark:border-[#1e3a66] rounded-xl px-3.5 py-2 transition-colors cursor-pointer shadow-2xs"
          >
            <LuPlus className="text-sm" />
            Add Income
          </button>

          <button
            type="button"
            onClick={onAddExpense}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FA2C37] bg-red-50 dark:bg-[#250c0f] hover:bg-red-100 dark:hover:bg-[#381216] border border-red-200 dark:border-[#4d161b] rounded-xl px-3.5 py-2 transition-colors cursor-pointer shadow-2xs"
          >
            <LuPlus className="text-sm" />
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-[#0c192c] border border-blue-100 dark:border-[#162d52]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-sm shrink-0">
              <LuTrendingUp />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Income
              </p>
              <p className="text-sm font-bold text-[#2563EB]">
                {formatAmount(totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 dark:bg-[#1f0d10] border border-red-100 dark:border-[#331419]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FA2C37] text-white flex items-center justify-center text-sm shrink-0">
              <LuTrendingDown />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Expense
              </p>
              <p className="text-sm font-bold text-[#FA2C37]">
                {formatAmount(totalExpense)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/70 dark:border-[#262626]">
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">
              Net Balance
            </p>
            <p
              className={`text-sm font-bold ${
                netBalance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {formatAmount(netBalance)}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              netBalance >= 0
                ? "bg-green-100 dark:bg-[#0c1f13] text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-[#2e1014] text-red-600 dark:text-red-400"
            }`}
          >
            {totalIncome > 0
              ? `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% saved`
              : "0%"}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <CashFlowChart
          data={chartData}
          chartType={chartType}
          showToggle={showToggle}
        />
      </div>
    </div>
  );
};

export default CashFlowOverview;
