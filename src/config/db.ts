import config from "config"
import mongoose from "mongoose"
import logger from "./logger";
import { DB_NAME } from "../utils";


export const db = async () => {
    try {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        await mongoose.connect(`${config.get("database.url")}/${DB_NAME}`);
        logger.info("Database connected successfully");
    } catch (error) {
        logger.error("Error connecting to the database", error);
        throw error;
    }
}