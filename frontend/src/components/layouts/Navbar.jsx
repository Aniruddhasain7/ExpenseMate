import React, { useState, useRef, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuSun, LuMoon, LuChevronDown } from "react-icons/lu";
import SideMenu from "./SideMenu";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openCurrencyMenu, setOpenCurrencyMenu] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { currency, currencies, setCurrency } = useCurrency();
  const currencyMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target)) {
        setOpenCurrencyMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white dark:bg-[#000000] border-b border-gray-200/70 dark:border-[#222222] py-3 px-5 sm:px-7 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        <button
          className="block lg:hidden text-slate-800 dark:text-slate-100 hover:text-green-500 transition-colors cursor-pointer p-1"
          onClick={() => {
            setOpenSideMenu(!openSideMenu);
          }}
          aria-label="Toggle menu"
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <h2 className="text-lg font-medium text-black dark:text-white">
          ExpenseMate
        </h2>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative" ref={currencyMenuRef}>
          <button
            type="button"
            onClick={() => setOpenCurrencyMenu((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-transparent dark:bg-[#141414] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors cursor-pointer text-xs font-semibold"
            title="Change Currency"
          >
            <span>{currency.flag}</span>
            <span>{currency.code} ({currency.symbol})</span>
            <LuChevronDown size={13} className="text-slate-400" />
          </button>

          {openCurrencyMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#121212] rounded-xl shadow-2xl border border-slate-200 dark:border-[#242424] py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-[#202020]">
                Select Currency
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setOpenCurrencyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                      currency.code === c.code
                        ? "bg-green-50 dark:bg-[#0c1f13] text-green-600 dark:text-green-400 font-semibold"
                        : "text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-20">({c.name})</span>
                    </span>
                    <span className="font-bold">{c.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-transparent dark:bg-[#141414] text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors cursor-pointer text-xs font-medium"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <>
              <LuSun size={17} className="text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <LuMoon size={17} className="text-slate-700" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>

      {openSideMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setOpenSideMenu(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-white dark:bg-[#000000] shadow-2xl border-r border-gray-200/80 dark:border-[#222222] z-50 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <SideMenu
              activeMenu={activeMenu}
              onItemClick={() => setOpenSideMenu(false)}
              onClose={() => setOpenSideMenu(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;