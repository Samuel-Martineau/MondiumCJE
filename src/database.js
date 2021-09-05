import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import path from "path";
import sql from "sql-template-strings";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { dirname } from "./utils.js";
import Logger from "./logger.js";

const logger = Logger.get();

export default class Database {
  /**
   * @type {Database}
   */
  static #instance;

  static get() {
    return Database.#instance;
  }

  /**
   * @type {sqlite.Database}
   */
  #db;

  constructor() {
    if (Database.#instance) throw new Error("Database already exists!");

    Database.#instance = this;
  }

  async init() {
    const dbPath = path.join(dirname, "..", "db.sqlite3");
    logger.info(`Initializing SQLite3 DB at ${dbPath}`);

    this.#db = await sqlite.open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await this.#db.exec(
      sql`CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, rank INTEGER, title TEXT, url TEXT, body TEXT, image TEXT, date INTEGER);`
    );

    logger.info("Successfully initialized DB");
  }

  /**
   * @returns {Promise<Object<string,Article[]>>}
   */
  async getAllArticlesByDay() {
    const articles = await this.#getAllArticles();

    /**
     * @type {Object<string,Article[]>}
     */
    const articlesByDay = {};

    for (const article of articles) {
      const day = article.date.toLocaleDateString("fr-ca", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!articlesByDay[day]) articlesByDay[day] = [];
      articlesByDay[day].push(article);
    }

    return articlesByDay;
  }

  async saveArticles() {
    logger.info("Saving articles");

    const rdiUrl = "https://ici.radio-canada.ca/international";

    const html = await (await fetch(rdiUrl)).text();
    const $ = cheerio.load(html);

    const articles = await Promise.all(
      $("div.main-col article")
        .map(async function (i) {
          const articleUrl = new URL(
            $("a", this).attr("href"),
            rdiUrl
          ).toString();
          const articleHtml = await (await fetch(articleUrl)).text();
          const $article = cheerio.load(articleHtml);
          $article(".signature-container-top").remove();

          return {
            title: $(".container-main-card header", this).contents().text(),
            url: articleUrl,
            image: $(".container-image img", this)
              .attr("src")
              .replace("q_auto,w_100", "q_auto,w_635")
              .replace("1x1", "16x9"),
            body: $article("main.document-simple-redactional-container").html(),
            date: new Date(),
            rank: i + 1,
          };
        })
        .get()
        .slice(0, 5)
    );

    await Promise.all(articles.map(this.#saveArticle.bind(this)));

    logger.info("Successfully saved articles");
  }

  /**
   * @param {string} title
   */
  async #isArticleSaved(title) {
    logger.info(`Checking if article "${title}" is already saved`);

    const result =
      (await this.#db.get(
        sql`SELECT 1 FROM articles WHERE title = ${title}`
      )) !== undefined;

    if (result) logger.info(`Article "${title}" is already saved`);
    else logger.info(`Article "${title}" isn't already saved`);

    return result;
  }

  /**
   * @param {ArticleWithoutId} article
   */
  async #saveArticle({ rank, title, url, body, image, date }) {
    if (!(await this.#isArticleSaved(title))) {
      logger.info(`Saving article "${title}"`);

      await this.#db.run(
        sql`INSERT INTO articles (rank, title, url, body, image, date) VALUES (${rank}, ${title}, ${url}, ${body}, ${image}, ${
          date.getTime() / 1000
        })`
      );

      logger.info(`Successfully saved article "${title}"`);
    }
  }

  /**
   * @returns {Article}
   */
  #parseArticle({ id, rank, title, url, body, image, date }) {
    return {
      id,
      rank,
      title,
      url,
      body,
      image,
      date: new Date(date * 1000),
    };
  }

  /**
   * @returns {Promise<Article[]>}
   */
  async #getAllArticles() {
    const rows = await this.#db.all(
      sql`SELECT * FROM articles ORDER BY rank ASC`
    );
    return rows.map(this.#parseArticle);
  }
}

new Database();