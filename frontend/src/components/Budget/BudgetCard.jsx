import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { IoIosAlert } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useCurrency } from "../../context/CurrencyContext";

const BudgetCard = ({ budget, onDelete }) => {
  const { formatAmount } = useCurrency();
  const { category, monthlyLimit, spent, remaining, percentage, status, icon } = budget;

  const getStatusBadge = () => {
    if (status === "exceeded") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-[#250c0f] text-red-600 dark:text-red-400 border border-red-200 dark:border-[#42161b]">
          <IoIosAlert size={14} /> Exceeded by {formatAmount(Math.abs(remaining))}
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-[#281c09] text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-[#422d0e]">
          <IoIosAlert size={14} /> {percentage}% Used
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 dark:bg-[#0c1f13] text-green-600 dark:text-green-400 border border-green-200 dark:border-[#1b3d26]">
        <FaCircleCheck size={12} /> On Track
      </span>
    );
  };

  const getProgressBarColor = () => {
    if (status === "exceeded") return "bg-[#FA2C37]";
    if (status === "warning") return "bg-[#FF6900]";
    return "bg-[#22C55E]";
  };

  return (
    <div className="card p-5 relative overflow-hidden transition-all hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#161616] border border-slate-200/60 dark:border-[#262626] flex items-center justify-center text-xl shrink-0">
            {icon ? (
              typeof icon === "string" && (icon.startsWith("http") || icon.includes("://")) ? (
                <img src={icon} alt="" className="w-6 h-6 object-contain" />
              ) : (
                <span>{icon}</span>
              )
            ) : (
              <span>🏷️</span>
            )}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {category}
            </h4>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
              Budget: <span className="font-semibold text-slate-700 dark:text-gray-200">{formatAmount(monthlyLimit)}</span>/mo
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(budget._id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          title="Delete Budget"
          aria-label="Delete"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-gray-300">
            Spent: {formatAmount(spent)}
          </span>
          <span className={status === "exceeded" ? "text-red-500 font-bold" : "text-slate-500 dark:text-gray-400"}>
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1e1e1e] text-xs">
        <div>
          {remaining >= 0 ? (
            <span className="text-slate-500 dark:text-gray-400">
              Remaining: <span className="font-bold text-green-600 dark:text-green-400">{formatAmount(remaining)}</span>
            </span>
          ) : (
            <span className="text-red-500 font-medium">
              Over by {formatAmount(Math.abs(remaining))}
            </span>
          )}
        </div>
        <div>{getStatusBadge()}</div>
      </div>
    </div>
  );
};

export default BudgetCard;
