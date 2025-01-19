import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = registerSchema;

export const accountSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  balance: z.number().default(0),
});

export const transactionSchema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().optional(),
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.number().positive(),
  period: z.enum(["MONTHLY", "YEARLY"]),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
