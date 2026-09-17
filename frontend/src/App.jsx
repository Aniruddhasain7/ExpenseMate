import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Transactions from "./pages/Dashboard/Transactions";
import Recurring from "./pages/Dashboard/Recurring";
import Budgets from "./pages/Dashboard/Budgets";
import Goals from "./pages/Dashboard/Goals";
import AICopilot from "./pages/Dashboard/AICopilot";

import UserProvider from "./context/UserContext";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import CurrencyProvider from "./context/CurrencyContext";
import { Toaster } from "react-hot-toast";

import { setNavigate } from "./utils/axiosInstance";

const ThemedToaster = () => {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "",
        style: {
          fontSize: "13px",
          background: isDark ? "#121212" : "#ffffff",
          color: isDark ? "#ffffff" : "#0f172a",
          border: isDark ? "1px solid #262626" : "1px solid #e2e8f0",
        },
      }}
    />
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
          <ThemedToaster />
        </UserProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/income-expense" element={<Transactions />} />
      <Route path="/income" element={<Transactions defaultTab="income" />} />
      <Route path="/expense" element={<Transactions defaultTab="expense" />} />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/copilot" element={<AICopilot />} />
      <Route path="/recurring" element={<Recurring />} />
    </Routes>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};