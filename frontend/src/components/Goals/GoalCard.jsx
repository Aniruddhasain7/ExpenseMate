import React from "react";
import { LuTrash2, LuPlus, LuCalendar, LuSparkles } from "react-icons/lu";
import { FaCircleCheck } from "react-icons/fa6";
import moment from "moment";
import { useCurrency } from "../../context/CurrencyContext";

const GoalCard = ({ goal, onDeposit, onDelete }) => {
  const { formatAmount } = useCurrency();
  const {
    _id,
    title,
    targetAmount,
    currentAmount,
    remaining,
    percentage,
    deadline,
    daysRemaining,
    category,
    icon,
    isCompleted,
  } = goal;

  return (
    <div
      className={`card p-5 relative overflow-hidden transition-all hover:shadow-xl border ${
        isCompleted
          ? "border-green-300 dark:border-green-800/80 bg-green-50/20 dark:bg-[#0c1f13]/20"
          : "border-slate-200/80 dark:border-[#222222]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#161616] border border-slate-200/60 dark:border-[#262626] flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-xs">
            {icon ? <span>{icon}</span> : <span>🎯</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h4>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-[#0c1f13] text-green-700 dark:text-green-300 border border-green-200 dark:border-[#1b3d26]">
                  <LuSparkles size={11} /> Completed!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5 truncate">
              {category || "Savings Target"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(_id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
          title="Delete Goal"
          aria-label="Delete"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <div className="my-3 space-y-1.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {formatAmount(currentAmount)}
          </span>
          <span className="text-slate-500 dark:text-gray-400 font-medium">
            of <span className="font-semibold text-slate-700 dark:text-gray-200">{formatAmount(targetAmount)}</span>
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-[#242424]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted
                ? "bg-green-500 shadow-sm shadow-green-500/50"
                : "bg-linear-to-r from-green-400 to-green-600"
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-gray-400 pt-0.5">
          <span>{percentage}% reached</span>
          {!isCompleted ? (
            <span>{formatAmount(remaining)} remaining</span>
          ) : (
            <span className="text-green-500 font-semibold flex items-center gap-1">
              <FaCircleCheck size={12} /> Target Achieved
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#1e1e1e] gap-2">
        <div className="text-[11px] text-slate-400 dark:text-gray-400 flex items-center gap-1.5 truncate">
          {deadline ? (
            <>
              <LuCalendar size={13} className="shrink-0" />
              <span>
                {daysRemaining !== null && daysRemaining > 0
                  ? `${daysRemaining} days left (${moment(deadline).format("MMM D, YYYY")})`
                  : daysRemaining === 0
                  ? "Due today"
                  : `Ended ${moment(deadline).format("MMM D, YYYY")}`}
              </span>
            </>
          ) : (
            <span>No deadline</span>
          )}
        </div>

        {!isCompleted && (
          <button
            type="button"
            onClick={() => onDeposit(goal)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <LuPlus size={14} /> Deposit
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
