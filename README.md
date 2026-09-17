# 💸 ExpenseMate

A modern full-stack **MERN** web application to track your income and expenses, set monthly category budgets, achieve savings goals, consult an intelligent AI Copilot, and manage all your finances — in one place.

---

<p align="center">
  <a href="https://expense-tracker-27.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-VISIT_EXPENSEMATE-22c55e?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0f172a" alt="Live Demo" height="38" />
  </a>
</p>

---

## 🚀 Features

- 🔐 **User Authentication** — Secure signup & login with JWT-based auth and cold-start loading resilience
- 💰 **Income Management** — Add, view, and categorize income sources with custom emojis
- 🧾 **Expense Management** — Track and categorize your expenses effortlessly
- 🎯 **Category Budgeting** — Set monthly spending limits per category with dynamic progress bars and overspending alerts
- 🏆 **Savings Goals Tracker** — Create savings goals, deposit funds, and track target deadlines
- 🤖 **AI Copilot** — Intelligent financial intelligence, dynamic financial health score (0-100), one-click automated audits, and personalized interactive conversational advisor
- 💱 **Multi-Currency Support** — Real-time exchange rate switcher (₹ INR, $ USD, € EUR, £ GBP, AED, CAD, AUD, JPY)
- 🔄 **Recurring Transactions** — Automate salary, rent, and subscriptions (Daily/Weekly/Monthly/Yearly)
- 🔍 **Advanced Search & Filters** — Find transactions instantly by text, category, date range, or amount
- 📷 **Receipt Scanner (OCR)** — Upload receipt images to auto-extract amount, date, and category via Tesseract OCR
- 🌙 **Dark & Light Theme** — Pure pitch-black AMOLED dark mode and clean light mode
- 📊 **Interactive Charts** — Visual breakdowns with custom tooltips via Recharts
- 📥 **Export to Excel** — Download income/expense reports as `.xlsx` files
- 🖼️ **Profile Management** — Upload and manage user avatars via Multer

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| React 19            | UI framework                |
| Vite                | Build tool & dev server     |
| Tailwind CSS v4     | Styling                     |
| React Router DOM v7 | Client-side routing         |
| Recharts            | Data visualization          |
| Tesseract.js        | OCR engine for receipt scan |
| Axios               | HTTP client                 |
| React Hot Toast     | Toast notifications         |
| React Icons         | Icon library                |
| Moment.js           | Date formatting             |
| Emoji Picker React  | Emoji selection for entries |

### ⚙️ Backend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Node.js + Express 5  | REST API server         |
| MongoDB + Mongoose   | Database & ODM          |
| JSON Web Token (JWT) | Authentication          |
| bcryptjs             | Password hashing        |
| Multer               | File/image uploads      |
| xlsx                 | Excel report generation |
| dotenv               | Environment config      |
| CORS                 | Cross-origin requests   |

---

## 📁 Project Structure

```
Expense Tracker/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Schemas (User, Income, Expense, Recurring, Budget, Goal)
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── recurringRoutes.js
│   │   ├── receiptRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/         # Uploaded images
│   ├── server.js        # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Budget/      # Category Budget components
    │   │   ├── Goals/       # Savings Goal components
    │   │   ├── Cards/       # InfoCards & transaction cards
    │   │   ├── Charts/      # Recharts visualizations
    │   │   ├── Dashboard/   # Dashboard widgets
    │   │   ├── Expense/     # Expense forms & lists
    │   │   ├── Income/      # Income forms & lists
    │   │   ├── Recurring/   # Recurring transaction lists & forms
    │   │   ├── Receipt/     # Receipt scanner OCR
    │   │   ├── Inputs/      # Search filters & form inputs
    │   │   └── layouts/     # Navbar, SideMenu, AuthLayout
    │   ├── context/         # Auth, Theme, & Currency contexts
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/
    │   │   ├── Auth/        # Login & Signup pages
    │   │   └── Dashboard/   # Home, Income, Expense, Budgets, Goals, AI Copilot, Recurring
    │   ├── utils/           # API paths & helper functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aniruddhasain7/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run server
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
