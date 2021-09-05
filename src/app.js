import Logger from "./logger.js";
import Database from "./database.js";
import schedule from "./schedule.js";
import { timezone } from "./utils.js";
import * as server from "./server.js";

const logger = Logger.get();
const database = Database.get();

async function main() {
  logger.info(`Running in timezone "${timezone}"`);

  await database.init();

  server.run();

  schedule(async function () {
    logger.info("Updating articles");
    await database.saveArticles();
    logger.info("Successfully updated articles");
  });

  await database.saveArticles();
}

main().catch(logger.error.bind(logger));
