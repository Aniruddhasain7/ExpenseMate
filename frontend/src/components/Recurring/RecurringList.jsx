import React from "react";
import moment from "moment";
import { LuTrash2, LuPause, LuPlay, LuRepeat } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";

const FREQ_COLORS = {
  daily: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-[#261608] dark:text-orange-400 dark:border-[#40240d]",
  weekly: "bg-green-50 text-green-600 border-green-200 dark:bg-[#0c1f13] dark:text-green-400 dark:border-[#1b3d26]",
  monthly: "bg-teal-50 text-teal-600 border-teal-200 dark:bg-[#081f1d] dark:text-teal-400 dark:border-[#103834]",
  yearly: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-[#0c2419] dark:text-emerald-400 dark:border-[#17422e]",
};

const RecurringList = ({ items, onDelete, onToggle }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-[#0c1f13] flex items-center justify-center mb-4 border border-green-100 dark:border-[#1b3d26]">
          <LuRepeat className="text-2xl text-green-500" />
        </div>
        <p className="text-slate-700 dark:text-gray-200 font-medium text-sm">No recurring transactions yet.</p>
        <p className="text-slate-400 dark:text-gray-400 text-xs mt-1">
          Add salary, rent, subscriptions, EMI and more.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      {items.map((item) => (
        <div
          key={item._id}
          className={`relative flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
            item.isActive
              ? "bg-white dark:bg-[#101010] border-slate-200/80 dark:border-[#242424] shadow-sm"
              : "bg-slate-50 dark:bg-[#080808] border-slate-200/50 dark:border-[#1c1c1c] opacity-60"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center text-xl bg-slate-100 dark:bg-[#181818] rounded-xl shrink-0 overflow-hidden border border-slate-200/50 dark:border-[#282828]">
            {item.icon ? (
              (typeof item.icon === "string" && (item.icon.startsWith("http") || item.icon.includes("cdn.jsdelivr.net") || item.icon.includes("://"))) ? (
                <img
                  src={item.icon}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="truncate max-w-full px-1">{item.icon}</span>
              )
            ) : (
              <span>{item.type === "income" ? "💰" : "💳"}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {item.title}
              </p>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${FREQ_COLORS[item.frequency] || FREQ_COLORS.monthly}`}
              >
                {item.frequency}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                  item.type === "income"
                    ? "bg-blue-50 text-[#2563EB] border-blue-200 dark:bg-[#0c192c] dark:text-[#60A5FA] dark:border-[#1e3a66]"
                    : "bg-red-50 text-[#FA2C37] border-red-200 dark:bg-[#200c0f] dark:text-[#FA2C37] dark:border-[#3d1b20]"
                }`}
              >
                {item.type}
              </span>
            </div>

            <p className="text-base font-bold mt-1 text-slate-900 dark:text-white">
              <span className={item.type === "income" ? "text-[#2563EB]" : "text-[#FA2C37]"}>
                {item.type === "income" ? "+" : "-"}₹{addThousandsSeparator(item.amount)}
              </span>
            </p>

            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              Next due:{" "}
              <span className="text-slate-700 dark:text-gray-300 font-medium">
                {moment(item.nextDueDate).format("Do MMM YYYY")}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => onToggle(item._id, !item.isActive)}
              title={item.isActive ? "Pause" : "Resume"}
              className="p-1 text-slate-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400 transition-colors cursor-pointer"
            >
              {item.isActive ? <LuPause size={16} /> : <LuPlay size={16} />}
            </button>
            <button
              onClick={() => onDelete(item._id)}
              title="Delete"
              className="p-1 text-slate-400 hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LuTrash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecurringList;
