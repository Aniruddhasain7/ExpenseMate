import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Modal } from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import GoalCard from "../../components/Goals/GoalCard";
import AddGoalModal from "../../components/Goals/AddGoalModal";
import DepositModal from "../../components/Goals/DepositModal";
import { LuPlus, LuTarget, LuSparkles, LuTrendingUp } from "react-icons/lu";
import { FaCircleCheck } from "react-icons/fa6";
import { useCurrency } from "../../context/CurrencyContext";

const Goals = () => {
  useUserAuth();
  const { formatAmount } = useCurrency();

  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    totalTarget: 0,
    totalSaved: 0,
    completedCount: 0,
    activeCount: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [depositGoal, setDepositGoal] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState({ show: false, id: null });

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.GOALS.GET);
      if (res.data) {
        setGoals(res.data.goals || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData) => {
    try {
      await axiosInstance.post(API_PATHS.GOALS.CREATE, goalData);
      toast.success("🎯 Savings goal created!");
      setOpenAddModal(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create goal");
    }
  };

  const handleDeposit = async (id, amount) => {
    try {
      const res = await axiosInstance.put(API_PATHS.GOALS.DEPOSIT(id), { amount });
      if (res.data?.goal?.isCompleted) {
        toast.success("🎉 Congratulations! Goal Completed!");
      } else {
        toast.success("Deposit added to savings!");
      }
      setDepositGoal(null);
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deposit");
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.GOALS.DELETE(id));
      toast.success("Savings goal removed");
      setOpenDeleteModal({ show: false, id: null });
      fetchGoals();
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === "active") return !g.isCompleted;
    if (filter === "completed") return g.isCompleted;
    return true;
  });

  const overallProgress =
    summary.totalTarget > 0
      ? Math.min(100, Math.round((summary.totalSaved / summary.totalTarget) * 100))
      : 0;

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="my-5 mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LuTarget className="text-green-500" /> Savings Goals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              Plan, track, and accomplish your personal financial targets.
            </p>
          </div>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <LuPlus size={16} />
            Create Goal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Total Target
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatAmount(summary.totalTarget || 0)}
            </p>
            <div className="w-full bg-slate-100 dark:bg-[#1a1a1a] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-400 mt-1.5 flex justify-between">
              <span>{overallProgress}% funded</span>
              <span>Saved: {formatAmount(summary.totalSaved || 0)}</span>
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <LuTrendingUp className="text-[#FF6900]" /> Total Saved So Far
            </p>
            <p className="text-2xl font-bold text-[#FF6900] mt-1">
              {formatAmount(summary.totalSaved || 0)}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              Across all savings targets
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <FaCircleCheck className="text-[#22C55E]" /> Completed Goals
            </p>
            <p className="text-2xl font-bold text-[#22C55E] mt-1">
              {summary.completedCount || 0}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              {summary.activeCount || 0} active goals in progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-[#222222] pb-3">
          {["all", "active", "completed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab} ({tab === "all" ? goals.length : tab === "active" ? (summary.activeCount || 0) : (summary.completedCount || 0)})
            </button>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="py-16 text-center text-slate-400 dark:text-gray-500 text-sm">
              Loading savings goals…
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="card text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-[#0c1f13] text-green-500 mx-auto flex items-center justify-center text-3xl border border-green-100 dark:border-[#1b3d26]">
                <LuSparkles />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {filter === "all"
                    ? "No Savings Goals Yet"
                    : `No ${filter} goals found`}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-400 max-w-md mx-auto mt-1">
                  Start saving for your dreams — whether it's an emergency fund, a new device, or a dream vacation.
                </p>
              </div>
              {filter === "all" && (
                <button
                  onClick={() => setOpenAddModal(true)}
                  className="add-btn add-btn-fill px-5 py-2.5 rounded-xl text-sm font-medium mx-auto cursor-pointer inline-flex items-center gap-2"
                >
                  <LuPlus size={16} /> Create First Goal
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGoals.map((g) => (
                <GoalCard
                  key={g._id}
                  goal={g}
                  onDeposit={(selectedGoal) => setDepositGoal(selectedGoal)}
                  onDelete={(id) => setOpenDeleteModal({ show: true, id })}
                />
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          title="Create Savings Goal"
        >
          <AddGoalModal onSave={handleCreateGoal} />
        </Modal>

        <Modal
          isOpen={!!depositGoal}
          onClose={() => setDepositGoal(null)}
          title="Deposit to Goal"
        >
          {depositGoal && (
            <DepositModal goal={depositGoal} onDeposit={handleDeposit} />
          )}
        </Modal>

        <Modal
          isOpen={openDeleteModal.show}
          onClose={() => setOpenDeleteModal({ show: false, id: null })}
          title="Delete Savings Goal"
        >
          <DeleteAlert
            content="Are you sure you want to delete this savings goal?"
            onDelete={() => handleDeleteGoal(openDeleteModal.id)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
