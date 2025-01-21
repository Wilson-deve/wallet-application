import { Router } from "express";
import { prisma } from "../lib/prisma";
import type { Request } from "express";
import { json } from "stream/consumers";

const router = Router();

//get monthly summary
router.get("/monthly-summary", async (req: Request, res, next) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const summary = {
      totalIncome: transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount?.toNumber(), 0),
      totalExpenses: transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount?.toNumber(), 0),
      netSavings: 0,
    };

    summary.netSavings = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

//Get category breakdown
router.get("/category-breakdown", async (req: Request, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      include: {
        category: true,
      },
    });

    const categoryBreakdown = transactions.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryName: transaction.category.name,
          totalAmount: 0,
          transactionCount: 0,
        };
      }
      acc[categoryId].totalAmount += transaction.amount.toNumber();
      acc[categoryId].transactionCount++;
      return acc;
    }, {} as Record<string, { categoryName: string; totalAmount: number; transactionCount: number }>);

    res.json(Object.values(categoryBreakdown));
  } catch (error) {
    next(error);
  }
});

//Get cash flow trende
router.get("/cash-flow", async (req: Request, res, next) => {
  try {
    const { months } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Number(months));

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const cashFlow = transactions.reduce((acc, transaction) => {
      const monthYear = transaction.date.toISOString().slice(0, 7);
      if (!acc[monthYear]) {
        acc[monthYear] = {
          income: 0,
          expenses: 0,
          netFlow: 0,
        };
      }

      if (transaction.type === "INCOME") {
        acc[monthYear].income += transaction.amount.toNumber();
      } else {
        acc[monthYear].expenses += transaction.amount.toNumber();
      }

      acc[monthYear].netFlow = acc[monthYear].income - acc[monthYear].expenses;
      return acc;
    }, {} as Record<string, { income: number; expenses: number; netFlow: number }>);

    res.json(
      Object.entries(cashFlow).map(([month, data]) => ({
        month,
        ...data,
      }))
    );
  } catch (error) {
    next(error);
  }
});

export const reportRoutes = router;
