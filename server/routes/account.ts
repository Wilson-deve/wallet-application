import { Router } from "express";
import { prisma } from "../lib/prisma";
import { accountSchema } from "../types";
import type { Request } from "express";

const router = Router();

//Get all accounts for user
router.get("/", async (req: Request, res, next) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

// Create accounts
router.post("/", async (req: Request, res, next) => {
  try {
    const data = accountSchema.parse(req.body);

    const account = await prisma.account.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });

    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
});

//Update account
router.put("/:id", async (req: Request, res) => {
  try {
    const data = accountSchema.parse(req.body);

    const account = await prisma.account.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data,
    });

    if (!account.count) {
      res.status(404).json({ error: "Account not found" });
      return;
    }

    res.json(account);
  } catch (error) {}
});

//Delete account
router.delete("/:id", async (req: Request, res, next) => {
  try {
    //Check for existing transactions
    const transactions = await prisma.transaction.count({
      where: { accountId: req.params.id },
    });

    if (transactions > 0) {
      res
        .status(400)
        .json({ error: "Cannot delete account with existing transactions" });
      return;
    }

    await prisma.account.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export const accountRoutes = router;
