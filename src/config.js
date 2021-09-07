import { config } from "dotenv";
import path from "path";
import Logger from "./logger.js";
import { dirname } from "./utils.js";

config();

const logger = Logger.get();

export const port = parseInt(process.env.PORT || "3000");
export const calendarUrl = (process.env.CALENDAR_URL || "").trim();
export const nodeEnv = process.env.NODE_ENV;
export const dbPath =
  process.env.DB_PATH || path.join(dirname, "..", "db.sqlite3");

if (calendarUrl === "") logger.warn("Calendar URL not set");
if (isNaN(port)) logger.warn("Invalid port");
if (nodeEnv !== "production") logger.warn("Running in development mode");
if (!path.isAbsolute(dbPath)) logger.warn("DB Path is not absolute");
