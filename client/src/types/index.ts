export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  subcategories: { name: string }[];
  created_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  subcategory_id?: string;
  amount: number;
  type: "expense" | "income";
  description?: string;
  date: string;
  created_at: string;
  category?: Category;
  account?: Account;
}

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  period: "monthly" | "yearly";
  start_date: string;
  end_date: string;
  created_at: string;
}

export type AccountCreation = Omit<Account, "id" | "created_at">;
export type CategoryCreation = Omit<Category, "id" | "created_at">;
export type TransactionCreation = Omit<Transaction, "id" | "created_at">;
export type BudgetCreation = Omit<Budget, "id" | "created_at">;
