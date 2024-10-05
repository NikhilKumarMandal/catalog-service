import config from "config"
import mongoose from "mongoose"
import logger from "./logger";
import { DB_NAME } from "../utils";


export const db = async () => {
    try {
    const dbUrl = `${config.get("database.url")}/${DB_NAME}`;

    if (!dbUrl) {
      throw new Error("Database URL not provided in configuration.");
    }

    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 50000,  
    });
        logger.info("Database connected successfully");
    } catch (error) {
        logger.error("Error connecting to the database", error);
        throw error;
    }
}