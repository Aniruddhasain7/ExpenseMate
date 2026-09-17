# 💸 ExpenseMate

<b>Smart, Full-Stack Financial Tracking & Intelligent AI Advisory Platform</b>
<br />
Track income and expenses, establish category budgets, hit savings milestones, scan receipts via OCR, and consult an intelligent Groq-powered AI Copilot — all in one unified modern interface.

---

<p align="center">
  <a href="https://expense-tracker-27.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-VISIT_EXPENSEMATE-22c55e?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0f172a" alt="Live Demo" height="38" />
  </a>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#️-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Configure and Run Backend](#2-configure-and-run-backend)
  - [3. Configure and Run Frontend](#3-configure-and-run-frontend)
  - [4. Build for Production](#4-build-for-production)

---

## 🌟 Overview

**ExpenseMate** is a production-grade, full-stack personal finance and wealth management platform built on the modern MERN stack. Designed with precision typography, responsive AMOLED dark mode, and sleek micro-interactions, ExpenseMate empowers users with complete visibility and control over their finances:

- **🤖 AI-Powered Copilot**: Real-time 0–100 Financial Health Score, automated deep audits, and personalized advisory powered by Groq LLMs.
- **💳 Unified Transactions Hub**: Centralized management of income and expenses with multi-criteria search, tab filters, and instant Excel export.
- **📈 Cash Flow Analytics & Insights**: Interactive dual-line cash flow visualizations, spending trends, and real-time smart financial insights.
- **🎯 Budgets & Savings Goals**: Category-level spending limits with dynamic thresholds and milestone savings trackers.
- **⚡ Automation & Convenience**: In-browser OCR receipt scanning via Tesseract.js, automated recurring transactions, and 8-currency multi-conversion.

---

## 🚀 Key Features

### 🤖 1. AI Financial Copilot (Powered by Groq)

- **Dynamic Health Score (0–100)**: Real-time algorithm assessing cash balance, savings rate, budget adherence, and goal completion.
- **One-Click Financial Audit**: Delivers customized breakdowns of financial strengths, vulnerabilities, and high-impact action steps tailored to your actual numbers.
- **Context-Aware Advisory Chat**: Ask complex financial questions (*"How can I cut expenses by 15%?"*, *"Can I afford a $600 vacation next month?"*) while the AI references your active ledger.
- **Custom API Key Support**: Use the built-in system key or securely bring your own Groq API key directly in the UI.
- **Rich Markdown Output**: Rendered tables, structured checklists, bullet points, and highlighted recommendation tags using `react-markdown` and `remark-gfm`.

### 💳 2. Unified Transactions Hub & Excel Export

- **All-in-One Ledger**: Unified management view for both Income and Expenses with intuitive tabs (**All**, **Income**, **Expense**).
- **Fast Filter & Search**: Instant client-side search across transaction titles, sources, and categories with custom date-range filtering.
- **One-Click Excel (.xlsx) Export**: Download comprehensive spreadsheet ledgers ready for tax preparation and offline accounting.
- **Custom Categorization**: Tag entries with titles, custom amounts, dates, and expressive emoji icons via an integrated picker.

### 📊 3. Interactive Cash Flow Analytics & Smart Insights

- **Dual-Line Cash Flow Chart**: Visualizes monthly income vs. expense curves with custom gradients, tooltips, and net cash flow trends via Recharts.
- **Smart Financial Insights**: Real-time analytical cards displaying burn rate, top expense categories, savings rate percentages, and net balance trajectory.
- **Recent Transactions Pulse**: Quick-access stream of recent activities with instant category icons, amount indicators, and deletion controls.

### 🎯 4. Category Budgeting & Overspending Alerts

- Set monthly budget ceilings per spending category (Food & Dining, Rent, Utilities, Shopping, Entertainment, etc.).
- Color-coded progress meters with automated threshold triggers: **Normal**, **Approaching Limit**, and **Over Budget**.
- Real-time expense deduction calculated dynamically against the active calendar month.

### 🏆 5. Savings Goals & Milestone Tracker

- Set targeted savings milestones with custom target amounts and target dates.
- Dedicated deposit modal with instant recalculation of total accumulated funds and remaining balances.
- Visual milestone celebration badges and percentage progress meters upon 100% completion.

### 💱 6. Multi-Currency Conversion Engine

- Seamlessly switch between 8 global currencies at any moment:
  - **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **AED (د.إ)**, **CAD ($)**, **AUD ($)**, **JPY (¥)**
- Real-time exchange rate normalization across all cards, charts, transaction items, and summary metrics.

### 🔄 7. Recurring Transactions Automation

- Automate repeating income streams and bills across flexible intervals:
  - **Daily**, **Weekly**, **Monthly**, **Yearly**
- Tracks execution history and automatically projects next scheduled payment dates.
- One-click **"Process Due"** synchronization to convert due scheduled items into active ledger records.

### 📷 8. Smart Receipt Scanner (OCR)

- Upload receipt images (`.png`, `.jpg`, `.jpeg`) directly from your device.
- In-browser OCR parsing with Tesseract.js automatically extracts total amount, transaction date, and predicted category into the expense entry modal.

### 🌓 9. AMOLED Dark & Clean Light Modes

- Pitch-black AMOLED dark mode optimized for OLED screens and late-night budgeting sessions.
- Clean, high-contrast light theme with smooth transitions, persisted across sessions via `localStorage`.

### 🔐 10. Security & Session Management

- Secure stateless authentication using JSON Web Tokens (JWT) and salted bcrypt password hashing.
- Route protection with centralized navigation handling and automated token expiry redirects.
- Informative loading states and backend cold-start resiliency.

---

## 🛠️ Architecture & Tech Stack

### 🎨 Frontend

| Technology               | Version | Purpose                                               |
| :----------------------- | :------ | :---------------------------------------------------- |
| **React**                | `v19.2` | Core UI library & declarative component structure     |
| **Vite**                 | `v7.2`  | Lightning-fast HMR build tool and dev server          |
| **Tailwind CSS**         | `v4.1`  | Utility-first styling engine with AMOLED dark mode    |
| **React Router DOM**     | `v7.11` | Client-side routing and authenticated route guards    |
| **Recharts**             | `v3.6`  | Interactive dual-line cash flow charts & visualizers  |
| **Tesseract.js**         | `v7.0`  | In-browser client-side OCR receipt parsing            |
| **Axios**                | `v1.13` | HTTP client configured with JWT interceptors          |
| **React Hot Toast**      | `v2.6`  | Toast notifications                                   |
| **React Icons**          | `v5.5`  | Iconography system                                    |
| **React Markdown + GFM** | `v10.1` | Markdown parser for AI Copilot responses              |
| **Moment.js**            | `v2.30` | Date manipulation and formatting                      |
| **Emoji Picker React**   | `v4.16` | Emoji selector for categories                         |

### ⚙️ Backend

| Technology               | Version | Purpose                                                   |
| :----------------------- | :------ | :-------------------------------------------------------- |
| **Node.js**              | `>= 18` | JavaScript runtime environment                            |
| **Express**              | `v5.2`  | RESTful API framework and middleware handler              |
| **MongoDB & Mongoose**   | `v9.1`  | Document database and schema modeling                     |
| **Groq Cloud API**       | REST    | High-speed LLM inference for AI Copilot                   |
| **JSON Web Token (JWT)** | `v9.0`  | Stateless authorization & token-based session management  |
| **bcryptjs**             | `v3.0`  | Cryptographic password hashing                            |
| **Multer**               | `v2.0`  | Multipart/form-data upload handling                       |
| **xlsx**                 | `v0.18` | Excel spreadsheet parsing & generation                    |
| **CORS & Dotenv**        | —       | Cross-origin resource sharing & environment configuration |

---

## 📁 Project Structure

```
ExpenseMate/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # User register, login & get info
│   │   ├── budgetController.js    # Budget CRUD & category limit tracking
│   │   ├── copilotController.js   # Groq AI audit & contextual financial chat
│   │   ├── dashboardController.js # Cash flow overview, stats & smart insights
│   │   ├── expenseController.js   # Expense CRUD & Excel spreadsheet export
│   │   ├── goalController.js      # Savings goals & deposit progress
│   │   ├── incomeController.js    # Income CRUD & Excel spreadsheet export
│   │   ├── receiptController.js   # Receipt upload processing
│   │   └── recurringController.js # Recurring schedules & batch processor
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & route protection
│   │   └── uploadMiddleware.js    # Multer file storage configuration
│   ├── models/
│   │   ├── Budget.js              # Category monthly budget schema
│   │   ├── Expense.js             # Expense record schema
│   │   ├── Goal.js                # Savings goal schema
│   │   ├── Income.js              # Income record schema
│   │   ├── RecurringTransaction.js# Recurring schedule schema
│   │   └── User.js                # User profile & credential schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/v1/auth
│   │   ├── budgetRoutes.js        # /api/v1/budget
│   │   ├── copilotRoutes.js       # /api/v1/copilot
│   │   ├── dashboardRoutes.js     # /api/v1/dashboard
│   │   ├── expenseRoutes.js       # /api/v1/expense
│   │   ├── goalRoutes.js          # /api/v1/goals
│   │   ├── incomeRoutes.js        # /api/v1/income
│   │   ├── receiptRoutes.js       # /api/v1/receipt
│   │   └── recurringRoutes.js     # /api/v1/recurring
│   ├── uploads/                   # Uploaded receipt files and media
│   ├── server.js                  # Express server entry point & route mapping
│   └── package.json
│
└── frontend/
    ├── public/                    # Static assets & icons
    ├── src/
    │   ├── components/
    │   │   ├── Budget/            # Budget cards, progress bars & AddBudgetModal
    │   │   ├── Cards/             # InfoCard & TransactionInfoCard metrics
    │   │   ├── Charts/            # CashFlowChart (dual-line cash flow visualization)
    │   │   ├── Dashboard/         # CashFlowOverview, RecentTransactions, BudgetGoals, SmartInsights
    │   │   ├── Goals/             # Goal cards, AddGoalModal & DepositModal
    │   │   ├── layouts/           # Navbar, SideMenu & AuthLayout wrappers
    │   │   ├── Receipt/           # Tesseract.js OCR scanner modal
    │   │   ├── Recurring/         # Recurring transaction list & AddRecurringForm
    │   │   ├── Transactions/      # AddExpenseForm & AddIncomeForm modals
    │   │   ├── DeleteAlert.jsx    # Reusable confirmation modal
    │   │   ├── EmojiPickerPopup.jsx# Category emoji selector
    │   │   └── Modal.jsx          # Reusable modal wrapper
    │   ├── context/
    │   │   ├── CurrencyContext.jsx# Currency state, symbols & live conversion
    │   │   ├── ThemeContext.jsx   # AMOLED dark & light mode switcher
    │   │   └── UserContext.jsx    # User authentication & session state
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx      # Authentication login view
    │   │   │   └── SignUp.jsx     # User registration view
    │   │   └── Dashboard/
    │   │       ├── Home.jsx       # Analytics dashboard & financial pulse
    │   │       ├── Transactions.jsx # Unified Income & Expense ledger management
    │   │       ├── Budgets.jsx    # Category budgeting & threshold tracking
    │   │       ├── Goals.jsx      # Savings goals & milestone progress
    │   │       ├── AICopilot.jsx  # Groq AI financial advisor & audit
    │   │       └── Recurring.jsx  # Scheduled transaction manager
    │   ├── utils/
    │   │   ├── apiPaths.js        # Centralized REST API endpoints
    │   │   ├── axiosInstance.js   # Axios instance with interceptors & redirect handling
    │   │   ├── data.js            # Navigation links & static options
    │   │   └── helper.js          # Currency formatting, date helpers & validators
    │   ├── App.jsx                # Application router & theme providers
    │   ├── main.jsx               # React DOM entry point
    │   └── index.css              # Tailwind CSS styles & AMOLED theme tokens
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

Follow these steps to run ExpenseMate locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (`v18.0.0` or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
- [Groq Cloud](https://console.groq.com) API key (free tier available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Aniruddhasain7/ExpenseMate.git
cd ExpenseMate
```

---

### 2. Configure and Run Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create and configure .env file

# Start development server
npm run server
```

The backend server will start on `http://localhost:8000`.

---

### 3. Configure and Run Frontend

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create your .env file (if pointing to custom backend URL)
# VITE_BACKEND_URL=http://localhost:8000

# Start the Vite development server
npm run dev
```

Open your browser and navigate to the local Vite URL (typically `http://localhost:5173`).

---

### 4. Build for Production

```bash
# Build frontend
cd frontend
npm run build
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
