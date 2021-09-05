import { config } from "dotenv";

config();

export const port = parseInt(process.env.PORT || "3000");
export const calendarUrl = process.env.CALENDAR_URL;
