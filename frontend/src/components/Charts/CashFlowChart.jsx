import React, { useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { useTheme } from "../../context/ThemeContext";
import { LuChartColumn, LuChartArea } from "react-icons/lu";

const INCOME_COLOR = "#2563EB";
const EXPENSE_COLOR = "#FA2C37";

const CashFlowChart = ({
  data = [],
  chartType: controlledChartType,
  defaultType = "bar",
  showToggle = false,
}) => {
  const [internalChartType, setInternalChartType] = useState(defaultType);
  const chartType = controlledChartType || internalChartType;
  const { formatAmount } = useCurrency();
  const { isDark } = useTheme();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const incomeVal =
        payload.find((p) => p.dataKey === "income")?.value || 0;
      const expenseVal =
        payload.find((p) => p.dataKey === "expense")?.value || 0;
      const net = incomeVal - expenseVal;

      return (
        <div className="bg-white dark:bg-[#111111] shadow-xl rounded-xl p-3.5 border border-gray-200 dark:border-[#262626] min-w-44 text-xs space-y-1.5 z-50">
          <p className="font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-gray-100 dark:border-[#222222]">
            {label}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#2563EB]">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              Income:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatAmount(incomeVal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#FA2C37]">
              <span className="w-2 h-2 rounded-full bg-[#FA2C37]" />
              Expense:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatAmount(expenseVal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100 dark:border-[#222222] font-semibold">
            <span className="text-slate-500 dark:text-gray-400">Net Flow:</span>
            <span
              className={
                net >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }
            >
              {net >= 0 ? "+" : ""}
              {formatAmount(net)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium mt-3 pt-2 border-t border-gray-100 dark:border-[#222222]">
        {showToggle ? (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181818] p-1 rounded-lg border border-slate-200/60 dark:border-[#262626]">
            <button
              type="button"
              onClick={() => setInternalChartType("bar")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                chartType === "bar"
                  ? "bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
              title="Switch to Bar Chart"
            >
              <LuChartColumn size={13} />
              <span>Bar Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setInternalChartType("line")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                chartType === "line"
                  ? "bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
              title="Switch to Line Chart"
            >
              <LuChartArea size={13} />
              <span>Line Chart</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-zinc-400">
              {chartType === "line" ? "Cash Flow Trend" : "Cash Flow Volume"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block shadow-xs" />
            <span className="text-slate-700 dark:text-gray-300">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FA2C37] inline-block shadow-xs" />
            <span className="text-slate-700 dark:text-gray-300">Expense</span>
          </div>
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
        <p>No cash flow data available yet.</p>
        <p className="text-xs mt-1">
          Add your income or expense to see the comparative breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        {chartType === "bar" ? (
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#222222" : "#f1f5f9"}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: isDark ? "#888888" : "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: isDark ? "#888888" : "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) =>
                val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.03)",
              }}
            />
            <Legend content={renderLegend} />

            <Bar
              dataKey="income"
              name="Income"
              fill={INCOME_COLOR}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />

            <Bar
              dataKey="expense"
              name="Expense"
              fill={EXPENSE_COLOR}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeBlueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={INCOME_COLOR} stopOpacity={0.35} />
                <stop offset="95%" stopColor={INCOME_COLOR} stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="expenseRedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={EXPENSE_COLOR} stopOpacity={0.35} />
                <stop offset="95%" stopColor={EXPENSE_COLOR} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#222222" : "#f1f5f9"}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: isDark ? "#888888" : "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: isDark ? "#888888" : "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) =>
                val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
              }
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={INCOME_COLOR}
              strokeWidth={2.5}
              fill="url(#incomeBlueGrad)"
              activeDot={{
                r: 6,
                fill: INCOME_COLOR,
                stroke: isDark ? "#000" : "#fff",
                strokeWidth: 2,
              }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke={EXPENSE_COLOR}
              strokeWidth={2.5}
              fill="url(#expenseRedGrad)"
              activeDot={{
                r: 6,
                fill: EXPENSE_COLOR,
                stroke: isDark ? "#000" : "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;
