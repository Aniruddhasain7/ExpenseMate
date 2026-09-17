export const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    REGISTER: `${BASE_URL}/api/v1/auth/register`,
    GET_USER_INFO: `${BASE_URL}/api/v1/auth/getUser`,
  },

  DASHBOARD: {
    GET_DATA: `${BASE_URL}/api/v1/dashboard`,
  },

  INCOME: {
    ADD_INCOME: `${BASE_URL}/api/v1/income/add`,
    GET_ALL_INCOME: `${BASE_URL}/api/v1/income/get`,
    DELETE_INCOME: (id) => `${BASE_URL}/api/v1/income/${id}`,
    DOWNLOAD_INCOME: `${BASE_URL}/api/v1/income/downloadexcel`,
  },

  EXPENSE: {
    ADD_EXPENSE: `${BASE_URL}/api/v1/expense/add`,
    GET_ALL_EXPENSE: `${BASE_URL}/api/v1/expense/get`,
    DELETE_EXPENSE: (id) => `${BASE_URL}/api/v1/expense/${id}`,
    DOWNLOAD_EXPENSE: `${BASE_URL}/api/v1/expense/downloadexcel`,
  },

  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/v1/auth/upload-image`,
  },

  RECURRING: {
    CREATE: `${BASE_URL}/api/v1/recurring/create`,
    GET_ALL: `${BASE_URL}/api/v1/recurring/get`,
    UPDATE: (id) => `${BASE_URL}/api/v1/recurring/${id}`,
    DELETE: (id) => `${BASE_URL}/api/v1/recurring/${id}`,
    PROCESS_DUE: `${BASE_URL}/api/v1/recurring/process-due`,
  },

  RECEIPT: {
    UPLOAD: `${BASE_URL}/api/v1/receipt/upload`,
  },

  BUDGET: {
    SET: `${BASE_URL}/api/v1/budget/set`,
    GET: `${BASE_URL}/api/v1/budget/get`,
    DELETE: (id) => `${BASE_URL}/api/v1/budget/${id}`,
  },

  GOALS: {
    CREATE: `${BASE_URL}/api/v1/goals/create`,
    GET: `${BASE_URL}/api/v1/goals/get`,
    DEPOSIT: (id) => `${BASE_URL}/api/v1/goals/${id}/deposit`,
    UPDATE: (id) => `${BASE_URL}/api/v1/goals/${id}`,
    DELETE: (id) => `${BASE_URL}/api/v1/goals/${id}`,
  },

  COPILOT: {
    AUDIT: `${BASE_URL}/api/v1/copilot/audit`,
    CHAT: `${BASE_URL}/api/v1/copilot/chat`,
  },
};
