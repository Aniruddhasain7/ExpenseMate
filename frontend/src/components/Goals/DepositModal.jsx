import React, { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const DepositModal = ({ goal, onDeposit }) => {
  const { currency, formatAmount } = useCurrency();
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onDeposit(goal._id, Number(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-green-50/60 dark:bg-[#0c1f13]/40 border border-green-200/80 dark:border-[#1b3d26]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{goal?.icon || "🎯"}</span>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {goal?.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Saved: <span className="font-semibold text-green-600 dark:text-green-400">{formatAmount(goal?.currentAmount || 0)}</span> / {formatAmount(goal?.targetAmount || 0)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500 dark:text-gray-400 font-semibold mb-2 block uppercase tracking-wider">
          Quick Amount
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt.toString())}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#161616] text-slate-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-[#202020] cursor-pointer transition-colors"
            >
              +{currency.symbol}{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 block mb-1">
          Deposit Amount ({currency.symbol})
        </label>
        <div className="input-box">
          <input
            type="number"
            placeholder="Enter amount to add"
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="add-btn add-btn-fill px-5 py-2.5 rounded-xl font-medium cursor-pointer"
        >
          Add to Savings
        </button>
      </div>
    </form>
  );
};

export default DepositModal;
