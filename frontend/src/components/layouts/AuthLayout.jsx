import React from "react";
import Image1 from "../../assets/images/image.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex bg-white dark:bg-[#000000] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black dark:text-white">
          ExpenseMate
        </h2>
        {children}
      </div>
      <div className="hidden md:block w-[40vw] h-screen bg-green-50 dark:bg-[#080808] bg-auth-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative border-l border-transparent dark:border-[#1c1c1c]">
        <div className="w-48 h-48 rounded-[40px] bg-green-500 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-20 border-teal-600 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-green-400 absolute -bottom-7 -left-5" />
        <div className="grid grid-cols-1 z-20 ">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Smart Financial Management"
            value="Track, Budget & Save"
            color="bg-green-600 shadow-green-500/40"
          />
        </div>
        <img
          src={Image1}
          alt="ExpenseMate Preview"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 "
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-md shadow-green-400/10 border border-gray-200/50 dark:border-[#222222] z-10 transition-colors">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[24px] text-white ${color} rounded-xl drop-shadow-xl shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
          {label}
        </h6>
        <span className="text-base font-bold text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
};
