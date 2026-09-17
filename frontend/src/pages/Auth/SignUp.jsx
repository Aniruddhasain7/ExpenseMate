import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import {
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuCircleAlert,
  LuLoader,
} from "react-icons/lu";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.customMessage) {
        setError(err.customMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-6">
          <span className="inline-block text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-100/80 dark:bg-green-950/60 px-2.5 py-0.5 rounded-full mb-2.5 border border-green-200 dark:border-green-800/50">
            Quick &amp; Easy Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Join ExpenseMate to track, budget, and build smart habits
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3 mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <LuCircleAlert className="shrink-0 text-base" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
              Full Name
            </label>
            <div className="relative flex items-center bg-slate-50/70 dark:bg-[#121814] border border-slate-200/90 dark:border-[#263329] rounded-2xl px-4 py-3 focus-within:bg-white dark:focus-within:bg-[#16201a] focus-within:border-green-500 dark:focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all shadow-xs">
              <LuUser className="text-slate-400 dark:text-zinc-500 mr-3 shrink-0 text-lg" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="John Doe"
                disabled={loading}
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center bg-slate-50/70 dark:bg-[#121814] border border-slate-200/90 dark:border-[#263329] rounded-2xl px-4 py-3 focus-within:bg-white dark:focus-within:bg-[#16201a] focus-within:border-green-500 dark:focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all shadow-xs">
              <LuMail className="text-slate-400 dark:text-zinc-500 mr-3 shrink-0 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  if (error) setError("");
                }}
                placeholder="name@example.com"
                disabled={loading}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Password
              </label>
            </div>
            <div className="relative flex items-center bg-slate-50/70 dark:bg-[#121814] border border-slate-200/90 dark:border-[#263329] rounded-2xl px-4 py-3 focus-within:bg-white dark:focus-within:bg-[#16201a] focus-within:border-green-500 dark:focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all shadow-xs">
              <LuLock className="text-slate-400 dark:text-zinc-500 mr-3 shrink-0 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Minimum 6 characters"
                disabled={loading}
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 ml-2 cursor-pointer transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <LuEye size={18} /> : <LuEyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LuLoader className="animate-spin text-base" />
                <span>Creating Account…</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <LuArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-zinc-400 pt-2.5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-0.5"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
