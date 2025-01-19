import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { loginSchema, registerSchema } from "../types";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    //Check if user exists
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    //Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    //Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    //Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    //Generation token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

export const authRoutes = router;
