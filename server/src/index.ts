import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "../routes/auth";
import { authenticateToken } from "../middleware/auth";
import { accountRoutes } from "../routes/account";
import { budgetsRoutes } from "../routes/budgets";
import { transactionRoutes } from "../routes/transactions";
import { reportRoutes } from "../routes/report";
import { visualizationRoutes } from "../routes/visualization";
import { notificationRoutes } from "../routes/notifications";
import { errorHandler } from "../middleware/error";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", authenticateToken, accountRoutes);
app.use("/api/budgets", authenticateToken, budgetsRoutes);
app.use("/api/transactions", authenticateToken, transactionRoutes);
app.use("/api/reports", authenticateToken, reportRoutes);
app.use("/api/visualization", authenticateToken, visualizationRoutes);
app.use("/api/notification", authenticateToken, notificationRoutes);

//Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
