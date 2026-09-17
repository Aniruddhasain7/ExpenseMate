import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuRepeat,
  LuSlidersHorizontal,
  LuTarget,
  LuSparkles,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: "Budgets",
    icon: LuSlidersHorizontal,
    path: "/budgets",
  },
  {
    id: "05",
    label: "Goals",
    icon: LuTarget,
    path: "/goals",
  },
  {
    id: "06",
    label: "AI Copilot",
    icon: LuSparkles,
    path: "/copilot",
  },
  {
    id: "07",
    label: "Recurring",
    icon: LuRepeat,
    path: "/recurring",
  },
  {
    id: "08",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];