import React from "react";
import {
  LuWallet,
  LuSparkles,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#000000] text-slate-900 dark:text-white transition-colors overflow-hidden">
      <div className="w-full lg:w-[48%] xl:w-[45%] h-full flex flex-col justify-between px-6 sm:px-10 lg:px-12 xl:px-14 py-4 sm:py-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-500/25">
              <LuWallet className="text-lg" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ExpenseMate
              </span>
            </div>
          </div>
        </div>

        <div className="my-auto py-2 w-full flex items-center justify-center">
          {children}
        </div>

        <div className="h-1 shrink-0" />
      </div>

      <div className="hidden lg:flex flex-1 h-full relative bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f7fee7] dark:from-[#07140b] dark:via-[#050f08] dark:to-black p-6 xl:p-10 flex-col justify-between overflow-hidden border-l border-green-200/50 dark:border-[#18261d]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-20 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold mb-2.5">
            <LuSparkles size={13} className="text-green-600 dark:text-green-400" />
            <span>Next-Gen Personal Finance</span>
          </div>
          <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Track, Budget &amp; Build Wealth Effortlessly.
          </h2>
          <p className="text-xs xl:text-sm text-slate-600 dark:text-zinc-400 mt-1.5 max-w-md leading-relaxed">
            Real-time cash flow, automated category budgeting, and intelligent financial insights all in one place.
          </p>
        </div>

        <div className="relative z-10 my-auto py-2 max-w-md xl:max-w-lg w-full">
          <div className="relative z-20 -mb-3.5 ml-6 sm:ml-10 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-[#151e18]/95 backdrop-blur-xl border border-green-200 dark:border-green-800/60 shadow-lg shadow-green-950/10">
            <div className="w-5 h-5 rounded-lg bg-green-500 flex items-center justify-center text-white text-[10px] shadow-xs">
              <LuSparkles size={11} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">
                AI Copilot Recommendation
              </p>
              <p className="text-[9px] text-green-600 dark:text-green-400 font-semibold">
                Saved ₹4,800 this month!
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white/85 dark:bg-[#111914]/85 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-xl shadow-green-950/10 dark:shadow-black/70">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-green-50 dark:bg-[#1b2b20] flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                  <LuWallet size={14} />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Cash Flow Overview</h6>
                  <span className="text-[10px] text-slate-400">September 2026</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                +28.4% Net
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-[#0c192c]/70 border border-blue-100 dark:border-[#1e3a66]/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">Income</span>
                  <LuTrendingUp className="text-[#2563EB] text-xs" />
                </div>
                <p className="text-sm xl:text-base font-extrabold text-[#2563EB] mt-0.5">₹68,500</p>
              </div>

              <div className="p-2.5 rounded-xl bg-red-50/70 dark:bg-[#250c0f]/70 border border-red-100 dark:border-[#4d161b]/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">Expense</span>
                  <LuTrendingDown className="text-[#FA2C37] text-xs" />
                </div>
                <p className="text-sm xl:text-base font-extrabold text-[#FA2C37] mt-0.5">₹24,100</p>
              </div>
            </div>

            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-gray-400">
                <span>Weekly Cash Flow Comparison</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">On Track</span>
              </div>
              <div className="h-16 flex items-end justify-between gap-2.5 px-3 pt-1.5 bg-slate-50/80 dark:bg-[#0c140f]/70 rounded-xl">
                {[
                  { day: "W1", inc: 80, exp: 35 },
                  { day: "W2", inc: 60, exp: 45 },
                  { day: "W3", inc: 95, exp: 28 },
                  { day: "W4", inc: 70, exp: 32 },
                  { day: "W5", inc: 88, exp: 40 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-11">
                      <div
                        style={{ height: `${bar.inc}%` }}
                        className="w-2 bg-[#2563EB] rounded-t-sm"
                        title="Income"
                      />
                      <div
                        style={{ height: `${bar.exp}%` }}
                        className="w-2 bg-[#FA2C37] rounded-t-sm"
                        title="Expense"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-20 -mt-3.5 mr-6 sm:mr-8 ml-auto max-w-[250px] p-2.5 rounded-2xl bg-white/95 dark:bg-[#151e18]/95 backdrop-blur-xl border border-green-200 dark:border-green-800/60 shadow-lg shadow-green-950/10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-white">Emergency Fund</span>
              </div>
              <span className="text-[9px] font-bold text-green-600 dark:text-green-400">76%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#202d24] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-[76%]" />
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 mt-0.5">
              <span>₹76,000 saved</span>
              <span>Goal: ₹1,00,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
