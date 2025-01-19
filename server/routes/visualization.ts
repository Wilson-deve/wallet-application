import { Router } from "express";
import { prisma } from "../lib/prisma";
import type { Request } from "express";

const router = Router();

//Get data for expense distribution pie chart
router.get("/expense-distribution", async (req: Request, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const expenses = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: req.user!.id,
        type: "EXPENSE",
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: expenses.map((e) => e.categoryId),
        },
      },
    });

    const pieChartData = expenses.map((expense) => ({
      id: expense.categoryId,
      label:
        categories.find((c) => c.id === expense.categoryId)?.name || "Unknown",
      value: expense._sum.amount || 0,
    }));

    res.json(pieChartData);
  } catch (error) {
    next(error);
  }
});

//Get data for monthly trends line chart
router.get("/monthly-trends", async (req: Request, res, next) => {
  try {
    const { months = 12 } = req.query;
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

    const monthlyData = transactions.reduce((acc, transaction) => {
      const monthYear = transaction.date.toISOString().slice(0, 7);
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          income: 0,
          expenses: 0,
          savings: 0,
        };
      }

      if (transaction.type === "INCOME") {
        acc[monthYear].income += transaction.amount.toNumber();
      } else {
        acc[monthYear].expenses += transaction.amount.toNumber();
      }

      acc[monthYear].savings = acc[monthYear].income - acc[monthYear].expenses;
      return acc;
    }, {} as Record<string, { month: string; income: number; expenses: number; savings: number }>);
  } catch (error) {}
});

//Get data for budget vs actual bar chart
router.get("/budget-comparison", async (req: Request, res, next) => {
  try {
    const currentDate = new Date();
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user!.id,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      include: {
        category: true,
      },
    });

    const budgetComparison = await Promise.all(
      budgets.map(async (budget) => {
        const spending = await prisma.transaction.aggregate({
          where: {
            userId: req.user!.id,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: currentDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          category: budget.category.name,
          budgeted: budget.amount,
          actual: spending._sum.amount || 0,
        };
      })
    );

    res.json(budgetComparison);
  } catch (error) {
    next(error);
  }
});

//Get data for spending heatmap
router.get("/spending-hearmap", async (req: Request, res, next) => {
  try {
    const { year } = req.query;
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year), 11, 31);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        type: "EXPENSE",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const heatmapData = transactions.reduce((acc, transaction) => {
      const date = transaction.date.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + transaction.amount.toNumber();
      return acc;
    }, {} as Record<string, number>);

    res.json(
      Object.entries(heatmapData).map(([date, value]) => ({
        date,
        value,
      }))
    );
  } catch (error) {
    next(error);
  }
});

export const visualizationRoutes = router;
