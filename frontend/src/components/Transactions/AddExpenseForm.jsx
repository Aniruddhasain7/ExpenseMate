import React, { useState, useEffect } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useCurrency } from "../../context/CurrencyContext";
import { getDefaultCategoryIcon } from "../../utils/helper";

const QUICK_EXPENSE_PRESETS = [
  { name: "Food", icon: "🍔" },
  { name: "Rent", icon: "🏠" },
  { name: "Transport", icon: "🚗" },
  { name: "Groceries", icon: "🛒" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Health", icon: "💊" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Utilities", icon: "⚡" },
];

const AddExpenseForm = ({ onAddExpense, prefill }) => {
  const { currency } = useCurrency();
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "",
  });
  const [userPickedCustomIcon, setUserPickedCustomIcon] = useState(false);

  useEffect(() => {
    if (prefill) {
      setExpense((prev) => ({
        ...prev,
        category: prefill.category || prev.category,
        amount: prefill.amount || prev.amount,
        date: prefill.date || prev.date,
        icon: prefill.icon || prev.icon || getDefaultCategoryIcon(prefill.category || "", "expense"),
      }));
      if (prefill.icon) setUserPickedCustomIcon(true);
    }
  }, [prefill]);

  const handleCategoryChange = (val) => {
    const nextCategory = val;
    setExpense((prev) => ({
      ...prev,
      category: nextCategory,
      icon: userPickedCustomIcon ? prev.icon : (getDefaultCategoryIcon(nextCategory, "expense") || prev.icon),
    }));
  };

  const selectPreset = (preset) => {
    setExpense((prev) => ({
      ...prev,
      category: preset.name,
      icon: preset.icon,
    }));
    setUserPickedCustomIcon(false);
  };

  const handleSubmit = () => {
    const finalIcon = expense.icon || getDefaultCategoryIcon(expense.category, "expense");
    onAddExpense({
      ...expense,
      icon: finalIcon,
    });
  };

  return (
    <div className="space-y-4">
      <EmojiPickerPopup
        icon={expense.icon || (expense.category ? getDefaultCategoryIcon(expense.category, "expense") : "")}
        type="expense"
        onSelect={(selectedIcon) => {
          setExpense((prev) => ({ ...prev, icon: selectedIcon }));
          setUserPickedCustomIcon(true);
        }}
      />

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Expense Category
        </label>
        <div className="input-box mb-2">
          <input
            type="text"
            value={expense.category}
            onChange={({ target }) => handleCategoryChange(target.value)}
            placeholder="Rent, Groceries, Food, Entertainment, etc"
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_EXPENSE_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => selectPreset(p)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                expense.category.toLowerCase() === p.name.toLowerCase()
                  ? "bg-[#FA2C37] text-white border-[#FA2C37] font-semibold shadow-xs"
                  : "bg-slate-50 dark:bg-[#161616] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#262626] hover:bg-red-50 dark:hover:bg-[#250c0f]"
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
            value={expense.amount}
            onChange={({ target }) => handleChange("amount", target.value)}
            placeholder="e.g. 1500"
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
            value={expense.date}
            onChange={({ target }) => handleChange("date", target.value)}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-[#FA2C37] hover:bg-red-600 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          onClick={handleSubmit}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
