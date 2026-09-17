import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useCurrency } from "../../context/CurrencyContext";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  LuSparkles,
  LuBot,
  LuSend,
  LuRefreshCw,
  LuTrendingUp,
  LuTriangleAlert,
  LuCircleCheck,
  LuTrash2,
  LuDollarSign,
  LuArrowUpRight,
  LuLightbulb,
} from "react-icons/lu";

const QUICK_PROMPTS = [
  "🔍 Audit my monthly spending",
  "💡 Where can I cut expenses?",
  "🎯 How to reach my savings goals faster?",
  "📊 Suggest a 50/30/20 budget for my income",
  "⚡ Analyze my recurring subscriptions",
];

const AICopilot = () => {
  useUserAuth();
  const { formatAmount } = useCurrency();

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hello! I am your **ExpenseMate AI Copilot**. I have direct visibility into your transactions, active category budgets, and savings goals.\n\nHow can I help optimize your finances today? You can ask me anything or click one of the quick prompts below!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    fetchAudit();
  }, []);

  const fetchAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.COPILOT.AUDIT, {});
      if (res.data) {
        setAuditData(res.data);
      }
    } catch (err) {
      console.error("Audit error:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate financial audit",
      );
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || userQuery).trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserQuery("");
    setIsTyping(true);

    try {
      const res = await axiosInstance.post(API_PATHS.COPILOT.CHAT, {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userQuery: query,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Copilot chat error:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reach AI Copilot.";
      toast.error(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ **Connection issue**: ${errMsg}\n\nPlease check that your backend server is running and AI service is configured.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          "Chat history cleared. How can I assist with your finances now?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    toast.success("Conversation cleared");
  };

  const MarkdownMessage = ({ content }) => {
    return (
      <div className="copilot-markdown leading-relaxed text-xs sm:text-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h3
                className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h3
                className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h4
                className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-2.5 mb-1"
                {...props}
              />
            ),
            h4: ({ node, ...props }) => (
              <h5
                className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider mt-2.5 mb-1"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="text-xs sm:text-sm leading-relaxed my-1.5 text-slate-800 dark:text-gray-200"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pl-5 my-2 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-gray-300"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-5 my-2 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-gray-300"
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed my-0.5" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong
                className="font-semibold text-slate-900 dark:text-white"
                {...props}
              />
            ),
            em: ({ node, ...props }) => (
              <em
                className="italic text-slate-700 dark:text-gray-300"
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="my-2.5 pl-3.5 pr-4 py-2 border-l-4 border-green-500 bg-green-500/10 dark:bg-green-500/15 rounded-r-xl text-xs sm:text-sm text-slate-800 dark:text-gray-200 font-medium leading-relaxed"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-[#262626] bg-white dark:bg-[#111111] shadow-xs">
                <table
                  className="w-full text-xs text-left border-collapse"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead
                className="bg-slate-100/90 dark:bg-[#1c1c1c] text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-[#262626]"
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 border-r last:border-r-0 border-slate-200/70 dark:border-[#262626]"
                {...props}
              />
            ),
            tbody: ({ node, ...props }) => (
              <tbody
                className="divide-y divide-slate-100 dark:divide-[#222222]"
                {...props}
              />
            ),
            tr: ({ node, ...props }) => (
              <tr
                className="hover:bg-slate-50/80 dark:hover:bg-[#171717] transition-colors"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="px-3.5 py-2 text-xs text-slate-700 dark:text-gray-300 border-r last:border-r-0 border-slate-200/70 dark:border-[#262626] whitespace-nowrap"
                {...props}
              />
            ),
            code: ({ node, inline, className, children, ...props }) => (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-[#222222] text-green-600 dark:text-green-400 text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            ),
            hr: ({ node, ...props }) => (
              <hr
                className="my-3 border-slate-200 dark:border-[#262626]"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const healthScore = auditData?.healthScore ?? 75;
  const rating = auditData?.rating || "Good";

  const getHealthBadge = (score) => {
    if (score >= 80) {
      return {
        label: "Excellent Financial Posture",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        circleStroke: "#10b981",
      };
    }
    if (score >= 65) {
      return {
        label: "Good Financial Health",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/30",
        circleStroke: "#3b82f6",
      };
    }
    if (score >= 45) {
      return {
        label: "Fair — Room for Optimization",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        circleStroke: "#f59e0b",
      };
    }
    return {
      label: "Action Needed — Spending Leaks",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      circleStroke: "#f43f5e",
    };
  };

  const badge = getHealthBadge(healthScore);

  return (
    <DashboardLayout activeMenu="AI Copilot">
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-green-500/10 border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <LuSparkles className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                ExpenseMate AI Copilot
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
                Your intelligent financial strategist. Analyzes income,
                expenses, budgets, and savings goals in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchAudit()}
              disabled={auditLoading}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20 cursor-pointer disabled:opacity-50"
            >
              <LuRefreshCw className="text-xs" />
              <span>{auditLoading ? "Analyzing..." : "Refresh Audit"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] flex items-center gap-4 shadow-sm">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${healthScore}, 100`}
                  strokeWidth="3.5"
                  stroke={badge.circleStroke}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {healthScore}
                </span>
                <span className="text-[9px] font-semibold text-slate-400">
                  /100
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-gray-400 uppercase tracking-wider">
                Financial Health
              </p>
              <h3 className={`text-sm font-bold mt-0.5 ${badge.color}`}>
                {rating}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 leading-tight">
                {badge.label}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Monthly Savings Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center text-sm">
                <LuTrendingUp />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {auditData?.context?.overview?.savingsRatePercent ?? 0}%
              </div>
              <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                Target: 20%+ for financial freedom
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Net Cash Position
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">
                <LuDollarSign />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatAmount(auditData?.context?.overview?.totalBalance || 0)}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                Total Income - Total Expenses
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Top Spend Velocity
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#FF6900] flex items-center justify-center text-sm">
                <LuArrowUpRight />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {auditData?.context?.overview?.topSpendingCategory || "None"}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                {formatAmount(
                  auditData?.context?.overview?.topSpendingAmount || 0,
                )}{" "}
                spent in last 30d
              </p>
            </div>
          </div>
        </div>

        {auditData && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <LuBot className="text-green-500 text-lg" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Copilot Diagnostic Audit
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-gray-500">
                Real-time Financial Assessment
              </span>
            </div>

            <p className="mt-3.5 text-sm leading-relaxed text-slate-700 dark:text-gray-300 font-medium">
              {auditData.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wide mb-2.5">
                  <LuCircleCheck /> Key Strengths
                </div>
                <ul className="space-y-1.5">
                  {auditData.strengths?.map((str, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wide mb-2.5">
                  <LuTriangleAlert /> Leaks & Attention Areas
                </div>
                <ul className="space-y-1.5">
                  {auditData.alerts?.map((alt, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {auditData.actionPlan?.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                  Actionable Strategy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {auditData.actionPlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#141414] border border-gray-200/70 dark:border-[#222222] text-xs text-slate-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-white dark:bg-[#0c0c0c] border border-gray-200/80 dark:border-[#222222] shadow-sm flex flex-col h-162.5 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/80 dark:border-[#222222] bg-slate-50/50 dark:bg-[#121212]/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center text-lg shadow-sm">
                  <LuBot />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-black" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chat with Copilot
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                  Ask custom questions about your expenses, budgets, or money
                  strategies
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              title="Clear Conversation"
            >
              <LuTrash2 size={16} />
            </button>
          </div>

          <div className="grow p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 text-sm mt-1">
                      <LuSparkles />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 sm:p-5 shadow-sm ${
                      isUser
                        ? "max-w-[85%] sm:max-w-[75%] bg-green-500 text-white rounded-tr-none ml-auto"
                        : "max-w-[95%] sm:max-w-[88%] bg-slate-50 dark:bg-[#161616] border border-gray-200/70 dark:border-[#222222] text-slate-800 dark:text-gray-200 rounded-tl-none w-full"
                    }`}
                  >
                    <div>
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <MarkdownMessage content={msg.content} />
                      )}
                    </div>

                    <div
                      className={`mt-2.5 pt-1.5 border-t border-black/5 dark:border-white/5 text-[10px] opacity-70 ${isUser ? "text-right" : "text-left"}`}
                    >
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 text-sm mt-1">
                  <LuSparkles />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-[#161616] border border-gray-200/70 dark:border-[#222222] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <span className="text-xs text-slate-400 ml-1">
                    Copilot is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-[#121212]/70 border-t border-gray-200/70 dark:border-[#222222]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 flex items-center gap-1 shrink-0 mr-0.5">
                <LuLightbulb className="text-amber-400" size={13} />{" "}
                Suggestions:
              </span>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200/90 dark:border-[#2a2a2a] hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 text-slate-700 dark:text-gray-300 transition-all cursor-pointer shadow-xs hover:shadow-sm disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white dark:bg-[#0c0c0c] border-t border-gray-200/80 dark:border-[#222222]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask anything about your expenses, budgets, or money strategies ..."
                disabled={isTyping}
                className="grow px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#141414] border border-gray-200 dark:border-[#262626] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!userQuery.trim() || isTyping}
                className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium shadow-md shadow-green-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                <LuSend className="text-base" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AICopilot;
