import createHttpError from "http-errors"
import { NextFunction, RequestHandler, Request, Response } from "express"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { Error } from "mongoose";
import logger from "./config/logger";
import config from "config"

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



cloudinary.config({ 
  cloud_name: config.get("cloudinary.cloud_name") , 
  api_key: config.get("cloudinary.api_key"), 
  api_secret: config.get("cloudinary.api_secret") 
});

const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        if (error instanceof Error) {
            logger.error(error.message)
        }
        return null;
    }
};

const deleteFromCloudinary = async (public_id: string, resource_type: "image" | "video"): Promise<UploadApiResponse | null> => {
    try {
        if (!public_id) {
            return null;
        }

        // Delete from Cloudinary
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = await cloudinary.uploader.destroy(public_id, {
            invalidate: true,
            resource_type
        });



        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message)
        }
        return null;
    }
};

export { 
    uploadOnCloudinary, 
    deleteFromCloudinary 
};
