import React from "react";
import { useCurrency } from "../../context/CurrencyContext";

const InfoCard = ({ icon, label, value, color, isCurrency = true }) => {
  const { formatAmount } = useCurrency();
  let displayVal;
  if (!isCurrency) {
    displayVal = value;
  } else {
    const rawNum =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/[^0-9.-]+/g, ""));
    displayVal =
      !isNaN(rawNum) && rawNum !== null ? formatAmount(rawNum) : `₹${value}`;
  }

  return (
    <div className="flex items-center gap-5 bg-white dark:bg-[#000000] p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/70 dark:border-[#222222] transition-all hover:shadow-md">
      <div
        className={`w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center text-[24px] sm:text-[26px] text-white ${color} rounded-2xl drop-shadow-md shrink-0`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h6 className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-medium mb-1 truncate">
          {label}
        </h6>
        <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {displayVal}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;