import React from "react";
import { LuSparkles, LuTrendingUp, LuShieldCheck, LuCircleAlert } from "react-icons/lu";

const SmartInsights = ({ totalIncome = 0, totalExpense = 0, topCategory }) => {
  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  let insight = {
    title: "Financial Health Status",
    desc: "Start adding your regular earnings and expenses to unlock deep financial insights.",
    icon: <LuSparkles />,
    badgeColor: "bg-blue-50 text-blue-600 dark:bg-[#0c192c] dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  };

  if (totalIncome > 0 && totalExpense > 0) {
    if (savingsRate >= 30) {
      insight = {
        title: "Strong Savings Momentum!",
        desc: `You are currently saving ${savingsRate}% of your total earnings. You are well above the recommended 20% savings benchmark.`,
        icon: <LuShieldCheck />,
        badgeColor: "bg-green-50 text-green-600 dark:bg-[#0c1f13] dark:text-green-400 border-green-200 dark:border-green-900/50",
      };
    } else if (savingsRate > 0) {
      insight = {
        title: "Positive Cash Flow",
        desc: `You have saved ${savingsRate}% of your income. ${
          topCategory ? `Notice that ${topCategory} is your largest spending category.` : "Keep tracking daily to optimize savings."
        }`,
        icon: <LuTrendingUp />,
        badgeColor: "bg-blue-50 text-[#2563EB] dark:bg-[#0c192c] dark:text-[#60A5FA] border-blue-200 dark:border-blue-900/50",
      };
    } else {
      insight = {
        title: "Expenses Exceed Income",
        desc: "Your spending has outpaced your earnings for this period. Review discretionary categories to avoid debt accumulation.",
        icon: <LuCircleAlert />,
        badgeColor: "bg-red-50 text-red-600 dark:bg-[#260e12] dark:text-red-400 border-red-200 dark:border-red-900/50",
      };
    }
  }

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#000000] border border-gray-200/70 dark:border-[#222222] shadow-xs">
      <div className="flex items-center gap-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${insight.badgeColor}`}
        >
          {insight.icon}
        </div>
        <div>
          <h6 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
            {insight.title}
          </h6>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            {insight.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
