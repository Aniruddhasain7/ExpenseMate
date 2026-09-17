import React, { useState, useMemo } from "react";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return (transactions || [])
      .filter((item) => {
        if (filterType !== "all" && item.type !== filterType) {
          return false;
        }
        if (searchQuery.trim()) {
          const title = (
            item.type === "expense" ? item.category : item.source
          ) || "";
          return title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .slice(0, 6);
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#222222]">
          <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h5>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/transactions")}
              className="card-btn text-xs py-1 px-3"
            >
              View All <LuArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-3 mb-2">
          
          <div className="flex items-center bg-gray-100 dark:bg-[#151515] p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === "all"
                  ? "bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType("income")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === "income"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-500 dark:text-gray-400 hover:text-[#2563EB]"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFilterType("expense")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === "expense"
                  ? "bg-[#FA2C37] text-white shadow-xs"
                  : "text-slate-500 dark:text-gray-400 hover:text-[#FA2C37]"
              }`}
            >
              Expenses
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity..."
              className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-[#141414] border border-gray-200/70 dark:border-[#262626] text-slate-800 dark:text-gray-200 outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-500">
                No matching transactions found.
              </p>
            </div>
          ) : (
            filteredTransactions.map((item) => (
              <TransactionInfoCard
                key={item._id}
                title={item.type === "expense" ? item.category : item.source}
                icon={item.icon}
                date={moment(item.date).format("Do MMM YYYY")}
                amount={item.amount}
                type={item.type}
                hideDeleteBtn
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;