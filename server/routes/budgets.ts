import { Router } from "express";
import { prisma } from "../lib/prisma";
import { budgetSchema } from "../types";
import type { Request } from "express";

const router = Router();

//Get all budgets
router.get("/", async (req: Request, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user!.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    //Calculate current spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spending = await prisma.transaction.aggregate({
          where: {
            userId: req.user!.id,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          ...budget,
          currentSpending: spending._sum.amount || 0,
        };
      })
    );

    res.json(budgetsWithSpending);
  } catch (error) {
    next(error);
  }
});

//Create budget
router.post("/", async (req: Request, res, next) => {
  try {
    const data = budgetSchema.parse(req.body);

    const budget = await prisma.budget.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
});

// Update budget
router.put("/:id", async (req: Request, res, next) => {
  try {
    const data = budgetSchema.parse(req.body);

    const budget = await prisma.budget.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data,
    });

    if (!budget.count) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
});

// Delete budget
router.delete("/:id", async (req: Request, res, next) => {
  try {
    await prisma.budget.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
});

//heck budget status
router.get("/status", async (req: Request, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user!.id,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        category: true,
      },
    });

    const budgetStatus = await Promise.all(
      budgets.map(async (budget) => {
        const spending = await prisma.transaction.aggregate({
          where: {
            userId: req.user!.id,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const currentSpending = spending._sum.amount?.toNumber() || 0;
        const percentageUsed =
          (currentSpending / budget.amount?.toNumber()) * 100;

        return {
          ...budget,
          currentSpending,
          percentageUsed,
          status:
            percentageUsed >= 100
              ? "EXCEEDED"
              : percentageUsed >= 80
              ? "WARNING"
              : "OK",
        };
      })
    );

    res.json(budgetStatus);
  } catch (error) {
    next(error);
  }
});

export const budgetsRoutes = router;
