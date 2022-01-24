import helmet from "helmet";
import path from "path";
import expressReactViews from "express-react-views";
import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import ms from "ms";
import { dirname } from "./utils.js";
import { cookieSecret, port } from "./config.js";
import Logger from "./logger.js";
import Database from "./database.js";

const logger = Logger.get();
const database = Database.get();

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser(cookieSecret));
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

server.use("*", async (req, res, next) => {
  try {
    // if (!req.signedCookies["identifiant"]) {
    //   const identifier = uuidv4();

    //   await database.saveDeviceIdentifier(identifier);

    //   res.cookie("identifiant", identifier, {
    //     signed: true,
    //     maxAge: ms("1 year"),
    //   });
    //   res.redirect(req.originalUrl);
    // } else next();
    next();
  } catch (error) {
    next(error);
  }
});

// server.get("/paiement", async (req, res, next) => {
//   try {
//     if ((await getDeviceRole(req)) !== "none") res.redirect("/");
//     else
//       res.render("paiement", {
//         deviceIdentifier: req.signedCookies["identifiant"],
//       });
//   } catch (error) {
//     next(error);
//   }
// });

server.get("*", async (req, res, next) => {
  try {
    // if (!["user", "admin"].includes(await getDeviceRole(req)))
    //   res.redirect("/paiement");
    // else next();
    next();
  } catch (error) {
    next(error);
  }
});

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

server.use("/admin", async (req, res, next) => {
  try {
    if ((await getDeviceRole(req)) !== "admin") res.redirect("/");
    else next();
  } catch (error) {
    next(error);
  }
});

server.get("/admin", (req, res) => {
  res.render("admin");
});

server.post("/admin", async (req, res, next) => {
  try {
    const deviceIdentifier = req.body.deviceIdentifier;
    await database.promoteDeviceIdentifier(deviceIdentifier, "user");
    res.redirect("/admin");
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

/**
 * @returns {Promise<Device['role']>}
 */
async function getDeviceRole(req) {
  const deviceIdentifier = req.signedCookies["identifiant"];
  const device = await database.getDeviceByIdentifier(deviceIdentifier);
  return device?.role;
}

export const run = () =>
  server.listen(port, () =>
    logger.info(`Server listening at http://127.1:${port}`)
  );
