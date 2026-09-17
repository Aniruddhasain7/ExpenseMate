import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}; 

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};
 export const addThousandsSeparator= (num) => {
  if (num == null || isNaN(num)) return "";
  const [integerPart, fractionalPart]=num.toString().split(".");
  const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareCashFlowTimelineData = (incomes = [], expenses = []) => {
  const map = {};

  incomes.forEach((item) => {
    if (!item?.date) return;
    const dateKey = moment(item.date).format("YYYY-MM-DD");
    const displayDate = moment(item.date).format("Do MMM");
    if (!map[dateKey]) {
      map[dateKey] = {
        rawDate: dateKey,
        date: displayDate,
        income: 0,
        expense: 0,
      };
    }
    map[dateKey].income += Number(item.amount || 0);
  });

  expenses.forEach((item) => {
    if (!item?.date) return;
    const dateKey = moment(item.date).format("YYYY-MM-DD");
    const displayDate = moment(item.date).format("Do MMM");
    if (!map[dateKey]) {
      map[dateKey] = {
        rawDate: dateKey,
        date: displayDate,
        income: 0,
        expense: 0,
      };
    }
    map[dateKey].expense += Number(item.amount || 0);
  });

  const sorted = Object.values(map).sort(
    (a, b) => new Date(a.rawDate) - new Date(b.rawDate)
  );

  return sorted.map((item) => ({
    ...item,
    net: item.income - item.expense,
  }));
};

export const CATEGORY_ICONS = {
  entertainment: "🎬",
  movie: "🎬",
  movies: "🎬",
  cinema: "🎬",
  food: "🍔",
  dining: "🍽️",
  restaurant: "🍽️",
  cafe: "☕",
  coffee: "☕",
  rent: "🏠",
  housing: "🏠",
  home: "🏠",
  transport: "🚗",
  transportation: "🚗",
  travel: "✈️",
  vehicle: "🚗",
  fuel: "⛽",
  gas: "⛽",
  cab: "🚕",
  uber: "🚕",
  groceries: "🛒",
  grocery: "🛒",
  supermarket: "🛒",
  shopping: "🛍️",
  clothes: "👗",
  clothing: "👗",
  health: "💊",
  healthcare: "💊",
  medical: "🩺",
  doctor: "🩺",
  medicine: "💊",
  utilities: "⚡",
  electricity: "⚡",
  water: "💧",
  wifi: "📶",
  internet: "🌐",
  bills: "🧾",
  bill: "🧾",
  education: "📚",
  books: "📖",
  course: "🎓",
  tuition: "🎓",
  gym: "🏋️",
  fitness: "🏋️",
  workout: "🏋️",
  personal: "✨",
  insurance: "🛡️",
  gift: "🎁",
  gifts: "🎁",

  salary: "💰",
  wages: "💰",
  freelance: "💻",
  consulting: "💼",
  investment: "📈",
  investments: "📈",
  stocks: "📈",
  dividend: "📈",
  dividends: "📈",
  crypto: "🪙",
  bonus: "🎉",
  business: "🏢",
  interest: "🏦",
  sidehustle: "🚀",
};

export const getDefaultCategoryIcon = (categoryOrSource = "", type = "expense") => {
  if (!categoryOrSource || typeof categoryOrSource !== "string") {
    return type === "income" ? "💰" : "💳";
  }

  const raw = categoryOrSource.trim().toLowerCase();
  
  if (CATEGORY_ICONS[raw]) {
    return CATEGORY_ICONS[raw];
  }

  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (raw.includes(key) || key.includes(raw)) {
      return icon;
    }
  }

  return type === "income" ? "💰" : "💳";
};