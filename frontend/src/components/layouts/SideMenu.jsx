import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import { HiOutlineX } from "react-icons/hi";

const SideMenu = ({ activeMenu, onItemClick, onClose, isMobile = false }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (onItemClick) onItemClick();
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <aside
      className={`w-full bg-white dark:bg-[#000000] transition-colors flex flex-col justify-between ${
        isMobile
          ? "h-full p-5 overflow-y-auto"
          : "w-64 h-[calc(100vh-61px)] border-r border-gray-200/70 dark:border-[#222222] p-5 sticky top-[61px] z-20"
      }`}
    >
      <div>
        {isMobile && (
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-[#222222]">
            <h2 className="text-lg font-medium text-black dark:text-white">
              ExpenseMate
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-800 dark:text-slate-100 hover:text-green-500 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <HiOutlineX className="text-2xl" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 mt-2 mb-6 pb-4 border-b border-gray-100 dark:border-[#222222]">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full border-2 border-green-500/30 shadow-sm"
            />
          ) : (
            <CharAvatar
              fullName={user?.fullName}
              width="w-16"
              height="h-16"
              style="text-lg font-bold bg-green-100 dark:bg-[#0c1f13] text-green-700 dark:text-green-300"
            />
          )}
          <div className="text-center">
            <h5 className="text-slate-900 dark:text-white font-semibold text-sm leading-5">
              {user?.fullName || "User"}
            </h5>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 max-w-45 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {SIDE_MENU_DATA.map((item, index) => {
            const isActive = activeMenu === item.label;
            return (
              <button
                key={`menu_${index}`}
                className={`w-full flex items-center gap-3.5 text-sm font-medium transition-all py-2.5 px-4 rounded-xl cursor-pointer ${
                  isActive
                    ? "text-white bg-green-500 shadow-md shadow-green-500/20"
                    : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#181818] hover:text-slate-900 dark:hover:text-white"
                }`}
                onClick={() => handleClick(item.path)}
              >
                <item.icon className={`text-lg ${isActive ? "text-white" : "text-slate-400 dark:text-gray-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;