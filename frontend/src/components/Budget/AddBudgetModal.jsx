import React, { useState } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useCurrency } from "../../context/CurrencyContext";

const CATEGORY_PRESETS = [
  { name: "Food", icon: "🍔" },
  { name: "Rent", icon: "🏠" },
  { name: "Transport", icon: "🚗" },
  { name: "Groceries", icon: "🛒" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Health", icon: "💊" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Utilities", icon: "⚡" },
  { name: "Education", icon: "📚" },
  { name: "Travel", icon: "✈️" },
  { name: "Other", icon: "🏷️" },
];

const AddBudgetModal = ({ onSave }) => {
  const { currency } = useCurrency();
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [icon, setIcon] = useState("🏷️");

  const selectPreset = (preset) => {
    setCategory(preset.name);
    setIcon(preset.icon);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim() || !monthlyLimit || Number(monthlyLimit) <= 0) return;
    onSave({
      category: category.trim(),
      monthlyLimit: Number(monthlyLimit),
      icon,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 dark:text-gray-400 font-semibold mb-2 block uppercase tracking-wider">
          Quick Categories
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => selectPreset(p)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                category.toLowerCase() === p.name.toLowerCase()
                  ? "bg-green-500 text-white border-green-500 font-semibold"
                  : "bg-slate-50 dark:bg-[#161616] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#262626] hover:bg-green-50 dark:hover:bg-[#202020]"
              }`}
            >
              <span>{p.icon}</span> {p.name}
            </button>
          ))}
        </div>
      </div>

      <EmojiPickerPopup icon={icon} onSelect={(ic) => setIcon(ic)} />

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Category Name
        </label>
        <div className="input-box">
          <input
            type="text"
            placeholder="e.g. Food, Dining Out, Gym"
            value={category}
            onChange={({ target }) => setCategory(target.value)}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Monthly Budget Limit ({currency.symbol})
        </label>
        <div className="input-box">
          <input
            type="number"
            placeholder="e.g. 10000"
            value={monthlyLimit}
            onChange={({ target }) => setMonthlyLimit(target.value)}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="add-btn add-btn-fill px-5 py-2.5 rounded-xl font-medium cursor-pointer"
        >
          Save Budget
        </button>
      </div>
    </form>
  );
};

export default AddBudgetModal;
