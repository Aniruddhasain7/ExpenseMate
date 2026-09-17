import React, { useState } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useCurrency } from "../../context/CurrencyContext";
import { getDefaultCategoryIcon } from "../../utils/helper";

const QUICK_INCOME_PRESETS = [
  { name: "Salary", icon: "💰" },
  { name: "Freelance", icon: "💻" },
  { name: "Investments", icon: "📈" },
  { name: "Business", icon: "🏢" },
  { name: "Bonus", icon: "🎉" },
  { name: "Side Hustle", icon: "🚀" },
];

const AddIncomeForm = ({ onAddIncome }) => {
  const { currency } = useCurrency();
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "",
  });
  const [userPickedCustomIcon, setUserPickedCustomIcon] = useState(false);

  const handleSourceChange = (val) => {
    const nextSource = val;
    setIncome((prev) => ({
      ...prev,
      source: nextSource,
      icon: userPickedCustomIcon ? prev.icon : (getDefaultCategoryIcon(nextSource, "income") || prev.icon),
    }));
  };

  const selectPreset = (preset) => {
    setIncome((prev) => ({
      ...prev,
      source: preset.name,
      icon: preset.icon,
    }));
    setUserPickedCustomIcon(false);
  };

  const handleSubmit = () => {
    const finalIcon = income.icon || getDefaultCategoryIcon(income.source, "income");
    onAddIncome({
      ...income,
      icon: finalIcon,
    });
  };

  return (
    <div className="space-y-4">
      <EmojiPickerPopup
        icon={income.icon || (income.source ? getDefaultCategoryIcon(income.source, "income") : "")}
        type="income"
        onSelect={(selectedIcon) => {
          setIncome((prev) => ({ ...prev, icon: selectedIcon }));
          setUserPickedCustomIcon(true);
        }}
      />

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Income Source
        </label>
        <div className="input-box mb-2">
          <input
            type="text"
            value={income.source}
            onChange={({ target }) => handleSourceChange(target.value)}
            placeholder="Freelance, Salary, Investments, etc"
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_INCOME_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => selectPreset(p)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                income.source.toLowerCase() === p.name.toLowerCase()
                  ? "bg-[#2563EB] text-white border-[#2563EB] font-semibold shadow-xs"
                  : "bg-slate-50 dark:bg-[#161616] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#262626] hover:bg-blue-50 dark:hover:bg-[#0c192c]"
              }`}
            >
              <span>{p.icon}</span> {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Amount ({currency.symbol})
        </label>
        <div className="input-box">
          <input
            type="number"
            value={income.amount}
            onChange={({ target }) => setIncome((prev) => ({ ...prev, amount: target.value }))}
            placeholder="e.g. 5000"
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Date
        </label>
        <div className="input-box">
          <input
            type="date"
            value={income.date}
            onChange={({ target }) => setIncome((prev) => ({ ...prev, date: target.value }))}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-[#2563EB] hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          onClick={handleSubmit}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
