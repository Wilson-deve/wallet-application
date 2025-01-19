import { Router } from "express";
import { prisma } from "../lib/prisma";
import type { Request } from "express";
import { transactionSchema } from "../types";

const router = Router();

//Get all transactiona with filtering
router.get("/", async (req: Request, res, next) => {
  try {
    const { startDate, endDate, accountId, categoryId } = req.query;

    const where = {
      userId: req.user!.id,
      ...(startDate && endDate
        ? {
            date: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          }
        : {}),
      ...(accountId ? { accountId: accountId as string } : {}),
      ...(categoryId ? { categoryId: categoryId as string } : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        category: true,
        subcategory: true,
      },
      orderBy: { date: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

//Create transaction
router.post("/", async (req: Request, res, next) => {
  try {
    const data = transactionSchema.parse(req.body);

    //Start transaction to update account balance
    const transaction = await prisma.$transaction(async (prisma) => {
      //Create transaction
      const newTransaction = await prisma.transaction.create({
        data: {
          ...data,
          userId: req.user!.id,
        },
        include: {
          account: true,
          category: true,
          subcategory: true,
        },
      });

      //Update account balance
      const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
      await prisma.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return newTransaction;
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

//Update transaction
router.put("/:id", async (req: Request, res, next) => {
  try {
    const data = transactionSchema.parse(req.body);
    const oldTransaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!oldTransaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    //Update transaction and adjust account balance
    const transaction = await prisma.$transaction(async (prisma) => {
      //Revert old transaction's effect on balance
      const oldBalanceChange =
        oldTransaction.type === "INCOME"
          ? -oldTransaction.amount
          : oldTransaction.amount;

      await prisma.account.update({
        where: { id: oldTransaction.accountId },
        data: {
          balance: {
            increment: oldBalanceChange,
          },
        },
      });

      //Apply new transaction's effect on balance
      const newBalanceChange =
        data.type === "INCOME" ? data.amount : -data.amount;
      await prisma.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: newBalanceChange,
          },
        },
      });

      //Update transaction
      return await prisma.transaction.update({
        where: { id: req.params.id },
        data,
        include: {
          account: true,
          category: true,
          subcategory: true,
        },
      });
    });

    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

//Delete transaction
router.delete("/:id", async (req: Request, res, next) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!transaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    //Delete transaction and update account bbalance
    await prisma.$transaction(async (prisma) => {
      //Revert transaction's effect on balance
      const balanceChange =
        transaction.type === "INCOME"
          ? -transaction.amount
          : transaction.amount;

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      //Delete transaction
      await prisma.transaction.delete({
        where: { id: req.params.id },
      });
    });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export const transactionRoutes = router;
