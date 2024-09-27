import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "../common/types/types";

export const canAccess = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as unknown as AuthRequest;
    const roleFromToken = _req.auth.role;

    if (!roles.includes(roleFromToken)) {
      const error = createHttpError(403, "User does not enough permission!");
      next(error);
      return;
    }
    next();
  };
};