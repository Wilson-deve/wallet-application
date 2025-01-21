import {
  AccountCreation,
  BudgetCreation,
  CategoryCreation,
  TransactionCreation,
  Category,
  Account,
} from "../types";

export const API_URL = "http://localhost:5000/api";

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchConfig } = config;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchConfig.headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }
    const url = new URL(endpoint, API_URL).toString();
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    if (!response.ok) {
      if (response.status == 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired");
      }
      throw new Error("Request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
}

//Accounts
export async function fetchAccounts(): Promise<Account[]> {
  return request("/accounts");
}

export async function createAccount(data: AccountCreation) {
  return request("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Transactions
export async function fetchTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  return request(`/transactions?${params.toString()}`);
}

export async function createTransaction(data: TransactionCreation) {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  return request("/categories");
}

export async function createCategory(data: CategoryCreation) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Budgets
export async function fetchBudgets() {
  return request("/budgets");
}

export async function createBudget(data: BudgetCreation) {
  return request("/budgets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchBudgetStatus() {
  return request("/budgets/status");
}

// Reports
export async function fetchMonthlySummary(year: number, month: number) {
  return request(`/reports/monthly-summary?year=${year}&month=${month}`);
}

export async function fetchCategoryBreakdown(
  startDate: string,
  endDate: string
) {
  return request(
    `/reports/category-breakdown?startDate=${startDate}&endDate=${endDate}`
  );
}

export async function fetchCashFlow(months: number) {
  return request(`/reports/cash-flow?months=${months}`);
}

// Notifications
export async function fetchNotifications() {
  return request("/notification");
}

export async function markNotificationAsRead(id: string) {
  return request(`/notification/:${id}/read`, {
    method: "PATCH",
  });
}

// Visualization
export async function fetchExpenseDistribution(
  startDate: string,
  endDate: string
) {
  return request(
    `/visualization/expense-distribution?startDate=${startDate}&endDate=${endDate}`
  );
}

export async function fetchMonthlyTrends(months: number = 12) {
  return request(`/visualization/monthly-trends?months=${months}`);
}

export async function fetchBudgetComparison() {
  return request("/visualization/budget-comparison");
}

export async function fetchSpendingHeatmap(year: number) {
  return request(`/visualization/spending-heatmap?year=${year}`);
}
