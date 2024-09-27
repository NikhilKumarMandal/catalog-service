import createHttpError from "http-errors"
import { NextFunction, RequestHandler, Request, Response } from "express"

export const DB_NAME = "CATALOG_SERVICE"

export const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                return next(createHttpError(500,err.message))
            }
            return next(createHttpError(500,"Internal Server Error"))
        })
    }
}