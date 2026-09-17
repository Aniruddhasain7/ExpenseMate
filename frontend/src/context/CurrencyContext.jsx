import React, { createContext, useContext, useState, useEffect } from "react";

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", defaultRate: 1.0 },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", defaultRate: 0.0116 },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", defaultRate: 0.0108 },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", defaultRate: 0.0092 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", defaultRate: 0.0426 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", defaultRate: 0.0160 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", defaultRate: 0.0178 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵", defaultRate: 1.7800 },
];

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState(() => {
    return localStorage.getItem("expense_tracker_currency") || "INR";
  });

  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem("expense_tracker_rates");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
          localStorage.setItem("expense_tracker_rates", JSON.stringify(data.rates));
        }
      } catch (err) {
        console.warn("Could not fetch live currency rates, using fallback defaults.", err);
      }
    };
    fetchRates();
  }, []);

  const activeCurrency =
    CURRENCIES.find((c) => c.code === selectedCode) || CURRENCIES[0];

  const getRate = (code) => {
    if (code === "INR") return 1.0;
    if (rates && rates[code]) return rates[code];
    const curr = CURRENCIES.find((c) => c.code === code);
    return curr?.defaultRate || 1.0;
  };

  const currentRate = getRate(activeCurrency.code);

  const convertAmount = (inrAmount) => {
    const num = Number(inrAmount) || 0;
    return num * currentRate;
  };

  const formatAmount = (inrAmount, showDecimals = false) => {
    const converted = convertAmount(inrAmount);
    const formatted = showDecimals || (activeCurrency.code !== "INR" && activeCurrency.code !== "JPY")
      ? converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(converted).toLocaleString("en-IN");
    return `${activeCurrency.symbol}${formatted}`;
  };

  const setCurrency = (code) => {
    setSelectedCode(code);
    localStorage.setItem("expense_tracker_currency", code);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: activeCurrency,
        currencies: CURRENCIES,
        setCurrency,
        convertAmount,
        formatAmount,
        rates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export default CurrencyProvider;
