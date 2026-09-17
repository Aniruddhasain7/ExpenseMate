import React, { useState } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly", "yearly"];

const QUICK_TEMPLATES = [
  { title: "Salary", type: "income", icon: "💰", frequency: "monthly" },
  { title: "Rent", type: "expense", icon: "🏠", frequency: "monthly" },
  { title: "Netflix", type: "expense", icon: "🎬", frequency: "monthly" },
  { title: "EMI", type: "expense", icon: "🏦", frequency: "monthly" },
  { title: "Groceries", type: "expense", icon: "🛒", frequency: "weekly" },
  { title: "Gym", type: "expense", icon: "💪", frequency: "monthly" },
];

const AddRecurringForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    icon: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const applyTemplate = (template) => {
    setForm((prev) => ({
      ...prev,
      type: template.type,
      title: template.title,
      icon: template.icon,
      frequency: template.frequency,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">
          Quick Templates
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => applyTemplate(t)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-[#1b3d26] bg-green-50 dark:bg-[#0c1f13] text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-[#142e1d] transition-colors cursor-pointer"
            >
              <span>{t.icon}</span> {t.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {["income", "expense"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleChange("type", t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-colors cursor-pointer ${
              form.type === t
                ? t === "income"
                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                  : "bg-[#FA2C37] text-white border-[#FA2C37] shadow-sm"
                : "bg-slate-50 dark:bg-[#161616] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#282828] hover:bg-slate-100 dark:hover:bg-[#202020]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <EmojiPickerPopup
        icon={form.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          {form.type === "income" ? "Source / Title" : "Category / Title"}
        </label>
        <div className="input-box">
          <input
            type="text"
            value={form.title}
            onChange={({ target }) => handleChange("title", target.value)}
            placeholder="e.g. Netflix, Salary, EMI"
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Amount (₹)
        </label>
        <div className="input-box">
          <input
            type="number"
            value={form.amount}
            onChange={({ target }) => handleChange("amount", target.value)}
            placeholder="1200"
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-700 dark:text-gray-300 font-medium block mb-2">
          Frequency
        </label>
        <div className="flex gap-2 flex-wrap">
          {FREQUENCY_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleChange("frequency", f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors cursor-pointer ${
                form.frequency === f
                  ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                  : "bg-slate-50 dark:bg-[#161616] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#282828] hover:bg-blue-50 dark:hover:bg-[#202020]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Start Date
        </label>
        <div className="input-box">
          <input
            type="date"
            value={form.startDate}
            onChange={({ target }) => handleChange("startDate", target.value)}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="add-btn add-btn-fill px-5 py-2.5 rounded-xl font-medium cursor-pointer"
          onClick={() => onAdd(form)}
        >
          Add Recurring
        </button>
      </div>
    </div>
  );
};

export default AddRecurringForm;
