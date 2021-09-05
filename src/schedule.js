import ical from "node-ical";
import { scheduleJob } from "node-schedule";
import { calendarUrl } from "./config.js";
import Logger from "./logger.js";

const logger = Logger.get();

/**
 * @param {() => Promise<void>} job
 */
export default function schedule(job) {
  scheduleJob("*/5 7 * * 1-5", async () => {
    logger.info("Checking if today is a school day");
    if (await isSchoolDay()) {
      logger.info("Today is a school day");
      logger.info("Executing job");
      try {
        await job();
        logger.info("Completed job");
      } catch (error) {
        logger.warn("Job failed");
        logger.error(error);
      }
    } else logger.info("Today is not a school day");
  });
}

async function isSchoolDay() {
  const data = await ical.async.fromURL(calendarUrl);
  const today = new Date();

  for (const event of Object.values(data)) {
    if (event.type !== "VEVENT") return;

    const date = event.start;

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
      return true;
  }

  return false;
}
