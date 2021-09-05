import { config } from "dotenv";
import Logger from "./logger";

config();

const logger = Logger.get();

export const port = parseInt(process.env.PORT || "3000");
export const calendarUrl = process.env.CALENDAR_URL.trim();
export const nodeEnv = process.env.NODE_ENV;

if (calendarUrl === "") logger.warn("Calendar URL not set");
if (isNaN(port)) logger.warn("Invalid port");
if (nodeEnv !== "production") logger.warn("Running in development mode");
