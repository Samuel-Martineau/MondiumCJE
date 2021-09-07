import helmet from "helmet";
import path from "path";
import expressReactViews from "express-react-views";
import express from "express";
import { dirname } from "./utils.js";
import { port } from "./config.js";
import Logger from "./logger.js";
import Database from "./database.js";

const logger = Logger.get();
const database = Database.get();

const server = express();

server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "images.radio-canada.ca"],
      },
    },
  })
);
server.use(express.static("./public"));

server.set("views", path.join(dirname, "..", "views"));
server.set("view engine", "jsx");
server.engine("jsx", expressReactViews.createEngine());

server.disable("x-powered-by");

server.get("/", async (req, res, next) => {
  try {
    res.render("index", {
      articlesByDay: Object.entries(
        await database.getAllArticlesByDay()
      ).reverse(),
    });
  } catch (error) {
    next(error);
  }
});

server.use(function (err, req, res, next) {
  logger.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.send("Internal Server Error");
});

export const run = () =>
  server.listen(port, () =>
    logger.info(`Server listening at http://127.1:${port}`)
  );
