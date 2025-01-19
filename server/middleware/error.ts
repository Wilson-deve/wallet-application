import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({
          error: "A record with this value already exists",
        });
        return;
      case "P2025":
        res.status(404).json({
          error: "Record not found",
        });
        return;
      default:
        res.status(500).json({
          error: "Database error",
        });
        return;
    }
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: error.errors,
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
};
