# 💸 ExpenseMate

<b>Smart, Full-Stack Financial Tracking & Intelligent AI Advisory Platform</b>
<br />
Track income and expenses, establish category budgets, hit savings milestones, scan receipts via OCR, and consult an intelligent Groq-powered AI Copilot — all in one modern interface.

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
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)

---

## 🌟 Overview

**ExpenseMate** is a production-ready, full-stack personal finance application built on the modern MERN stack. Designed with precision typography, responsive AMOLED dark mode, and sleek micro-interactions, ExpenseMate empowers users to gain complete clarity over their money:

- **AI-Powered Audits**: Real-time 0–100 Financial Health Score and customized recommendations powered by Groq LLMs.
- **Goal & Budget Discipline**: Category-level spending limits with progress indicators and savings goal milestone tracking.
- **Frictionless Entry**: OCR receipt scanning via Tesseract.js, multi-currency conversion, and recurring transaction automation.
- **Actionable Insights**: Recharts visualizations, instant multi-filter search, and Excel export for spreadsheet workflows.

---

## 🚀 Key Features

### 🤖 1. AI Financial Copilot (Powered by Groq)

- **Dynamic Health Score (0–100)**: Evaluates cash balance, savings rate, budget adherence, and goal progress in real time.
- **One-Click Comprehensive Audit**: Delivers instant strengths, vulnerabilities, and high-impact action steps tailored to your actual numbers.
- **Context-Aware Advisory Chat**: Ask financial questions ("How can I cut expenses by 15%?", "Can I afford a $500 trip next month?") with the AI referencing your actual ledger.
- **Custom API Key Support**: Use the built-in system key or seamlessly bring your own Groq API key directly in the UI.
- **Rich Markdown Formatting**: Clean responses with styled tables, bullet points, and highlight badges via `react-markdown` and `remark-gfm`.

### 🎯 2. Category Budgeting & Overspending Alerts

- Set monthly budget ceilings per category (e.g., Food & Dining, Rent, Utilities, Shopping).
- Dynamic, color-coded progress bars (Normal, Approaching Limit, Over Budget).
- Automated tracking against current month's actual expenses.

### 🏆 3. Savings Goals & Milestone Tracker

- Define savings goals with target amounts and target completion dates.
- Dedicated deposit modal with instant progress and remaining balance recalculation.
- Visual milestone celebration badges upon 100% completion.

### 💱 4. Multi-Currency Engine

- Switch seamlessly between 8 global currencies:
  - **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **AED (د.إ)**, **CAD ($)**, **AUD ($)**, **JPY (¥)**
- Real-time exchange rate normalization across all cards, charts, and tables.

### 🔄 5. Recurring Transactions Automation

- Automate repeating income and expenses across flexible frequencies:
  - **Daily**, **Weekly**, **Monthly**, **Yearly**
- Tracks last processed dates and automatically calculates the next due date.
- One-click "Process Due" sync to convert scheduled entries into active ledger records.

### 📷 6. Smart Receipt Scanner (OCR)

- Upload receipt images (`.png`, `.jpg`, `.jpeg`) directly from your device.
- In-browser OCR parsing with Tesseract.js extracts total amount, date, and category automatically into the expense creation modal.

### 📊 7. Visual Analytics & Recharts

- Interactive monthly income vs. expense breakdown charts.
- Category spending distribution with clean tooltips and formatted monetary units.
- Summary metrics: **Total Income**, **Total Expenses**, **Net Balance**, and **Savings Rate %**.

### 📥 8. Excel Data Export

- Download comprehensive `.xlsx` spreadsheets for both income and expense ledgers with one click.
- Cleanly formatted columns ready for tax preparation and offline analysis.

### 🔍 9. Advanced Search & Filtering

- Instant client-side search across transaction titles and sources.
- Filter by category and date ranges.

### 🌓 10. AMOLED Dark & Clean Light Modes

- Pitch-black AMOLED dark mode tailored for OLED displays and late-night budgeting.
- Smooth transition toggle persisted to `localStorage`.

### 🔐 11. Security & Profile Management

- JWT (JSON Web Token) authentication with bcrypt password hashing.
- User profile management with custom avatar upload via Multer.
- Cold-start resilience with informative loading feedback during server wakeups.

---

## 🛠️ Architecture & Tech Stack

### 🎨 Frontend

| Technology               | Version | Purpose                                               |
| :----------------------- | :------ | :---------------------------------------------------- |
| **React**                | `v19.2` | Core UI library & reactive state management           |
| **Vite**                 | `v7.2`  | Ultra-fast HMR build tool and dev server              |
| **Tailwind CSS**         | `v4.1`  | Next-generation utility-first styling engine          |
| **React Router DOM**     | `v7.11` | Client-side routing and protected routes              |
| **Recharts**             | `v3.6`  | Interactive charts and financial visualization        |
| **Tesseract.js**         | `v7.0`  | In-browser OCR receipt parsing                        |
| **Axios**                | `v1.13` | HTTP client with JWT interceptors                     |
| **React Hot Toast**      | `v2.6`  | Accessible toast notifications                        |
| **React Icons**          | `v5.5`  | Icon library                                          |
| **React Markdown + GFM** | `v10.1` | Markdown parser for AI Copilot responses              |
| **Moment.js**            | `v2.30` | Date manipulation and display formatting              |
| **Emoji Picker React**   | `v4.16` | Custom emoji selector for income & expense categories |

### ⚙️ Backend

| Technology               | Version | Purpose                                                   |
| :----------------------- | :------ | :-------------------------------------------------------- |
| **Node.js**              | `>= 18` | JavaScript runtime environment                            |
| **Express**              | `v5.2`  | Modern RESTful API framework                              |
| **MongoDB & Mongoose**   | `v9.1`  | NoSQL document database & ODM schema modeling             |
| **Groq Cloud API**       | REST    | High-speed LLM inference for AI Copilot                   |
| **JSON Web Token (JWT)** | `v9.0`  | Stateless authorization & user session management         |
| **bcryptjs**             | `v3.0`  | Cryptographic password hashing                            |
| **Multer**               | `v2.0`  | Multipart file/avatar uploads                             |
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
│   │   ├── authController.js      # Register, login, get user, avatar upload
│   │   ├── budgetController.js    # Budget set, get, and delete operations
│   │   ├── copilotController.js   # Groq AI audit & context-aware chat
│   │   ├── dashboardController.js # Aggregated analytics & recent activity
│   │   ├── expenseController.js   # Expense CRUD & Excel export
│   │   ├── goalController.js      # Savings goal CRUD & deposits
│   │   ├── incomeController.js    # Income CRUD & Excel export
│   │   ├── receiptController.js   # Receipt upload handler
│   │   └── recurringController.js # Recurring transactions & due processor
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & route protection
│   │   └── uploadMiddleware.js    # Multer file storage configuration
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, avatar)
│   │   ├── Income.js              # Income record schema
│   │   ├── Expense.js             # Expense record schema
│   │   ├── Budget.js              # Category monthly budget schema
│   │   ├── Goal.js                # Savings goal schema
│   │   └── RecurringTransaction.js# Recurring schedule schema
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
│   ├── uploads/                   # Local directory for uploaded user avatars
│   ├── server.js                  # Express application entry point
│   └── package.json
│
└── frontend/
    ├── public/                    # Static assets & icons
    ├── src/
    │   ├── components/
    │   │   ├── Budget/            # Category budget cards, modals & progress bars
    │   │   ├── Cards/             # InfoCards, transaction items & metrics
    │   │   ├── Charts/            # Custom BarChart & Recharts wrappers
    │   │   ├── Dashboard/         # Finance overview & recent transaction lists
    │   │   ├── Expense/           # Add/Edit expense modal & expense lists
    │   │   ├── Goals/             # Goal cards, deposit dialogs & progress meters
    │   │   ├── Income/            # Add/Edit income modal & income lists
    │   │   ├── Inputs/            # Input fields, search bars & date pickers
    │   │   ├── layouts/           # Navbar, SideMenu, and AuthLayout wrappers
    │   │   ├── Receipt/           # Tesseract.js OCR scanner modal
    │   │   └── Recurring/         # Recurring schedule lists & frequency forms
    │   ├── context/
    │   │   ├── AuthContext.jsx    # User session, login, and logout state
    │   │   ├── CurrencyContext.jsx# Selected currency, symbols & exchange rates
    │   │   └── ThemeContext.jsx   # AMOLED dark & light mode switcher
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx      # Login page
    │   │   │   └── SignUp.jsx     # Registration page
    │   │   └── Dashboard/
    │   │       ├── Home.jsx       # Analytics dashboard
    │   │       ├── Income.jsx     # Income management & Excel export
    │   │       ├── Expense.jsx    # Expense management & Excel export
    │   │       ├── Budgets.jsx    # Category budgeting
    │   │       ├── Goals.jsx      # Savings goals & milestones
    │   │       ├── AICopilot.jsx  # Groq AI financial advisor & audit
    │   │       └── Recurring.jsx  # Recurring transaction scheduler
    │   ├── utils/
    │   │   ├── apiPaths.js        # Centralized endpoint definitions
    │   │   ├── axiosInstance.js   # Configured Axios client with auth tokens
    │   │   └── helper.js          # Currency, date, and validation helpers
    │   ├── App.jsx                # Application routes & provider wrappers
    │   └── main.jsx               # React DOM root
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
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create and configure .env file
# Then start development server
npm run server
```

The backend server will start on `http://localhost:8000`.

---

### 3. Configure and Run Frontend

In a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser and navigate to the local Vite URL (typically `http://localhost:5173`).

---

### 4. Build for Production

```bash
# Frontend build
cd frontend
npm run build
```
