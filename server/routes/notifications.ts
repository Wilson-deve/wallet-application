import { Router } from "express";
import { prisma } from "../lib/prisma";
import type { Request } from "express";

const router = Router();

//Get all notifications for user
router.get("/", async (req: Request, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user!.id,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

//Mark notification as read
router.patch("/:id/read", async (req: Request, res, next) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        read: true,
      },
    });

    if (!notification.count) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.json({ message: "Notification markde as read" });
  } catch (error) {
    next(error);
  }
});

//Delete notification
router.delete("/:id", async (req: Request, res, next) => {
  try {
    await prisma.notification.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
});

export const notificationRoutes = router;
