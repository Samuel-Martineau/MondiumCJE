import express from 'express';
import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import * as path from 'path';
import * as url from 'url';
import expressReactViews from 'express-react-views';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import schedule from 'node-schedule';
import ical from 'node-ical';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const db = await sqlite.open({
  filename: path.join(__dirname, '..', 'db.sqlite3'),
  driver: sqlite3.Database,
});
await createDBSchema();

const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', expressReactViews.createEngine());

app.use(express.static('./public'));

app.get('/', async (req, res) => {
  res.render('index', {
    articlesByDay: Object.entries(await getAllArticlesByDay()),
  });
});

app.listen(3000);

async function createDBSchema() {
  await db.exec(
    'CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, rank INTEGER, title TEXT, url TEXT, body TEXT, image TEXT, date INTEGER);',
  );
}

schedule.scheduleJob('*/5 7-8 * * 1-5', async function () {
  if (await schoolToday()) {
    console.log('Updating articles…');
    await updateArticles();
    console.log('Updated articles!');
  }
});

/**
 * @returns {Boolean}
 */
async function schoolToday() {
  const data = await ical.async.fromURL(
    'https://node1.istudentapp.com/vcal.php?key=0eeb207feacac51835e76c150bc60291&tzid=America%2FToronto',
  );
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      const event = data[k];
      if (data[k].type == 'VEVENT') {
        const today = new Date();
        const date = event.start;
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          return true;
        }
      }
    }
  }
}

/**
 * @returns {Article}
 */
function parseDbArticle({ id, rank, title, url, body, image, date }) {
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
async function getAllArticles() {
  const rows = await db.all('SELECT * FROM articles ORDER BY rank ASC');
  return rows.map(parseDbArticle);
}

/**
 * @returns {Promise<Object<string,Article[]>>}
 */
async function getAllArticlesByDay() {
  const articles = await getAllArticles();
  /**
   * @type {Object<string,Article[]>}
   */
  const articlesByDay = {};

  for (const article of articles) {
    const day = article.date.toLocaleDateString('fr-ca', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!articlesByDay[day]) articlesByDay[day] = [];
    articlesByDay[day].push(article);
  }

  return articlesByDay;
}

/**
 * @param {number} id
 * @returns {Promise<Article>}
 */
async function getArticleById(id) {
  const row = await db.get('SELECT * FROM articles WHERE id = ?', id);
  return parseDbArticle(row);
}

/**
 * @param {ArticleWithoutId} article
 */
async function saveArticle({ rank, title, url, body, image, date }) {
  const result = await db.run(
    'INSERT INTO articles (rank, title, url, body, image, date) VALUES (?, ?, ?, ?, ?, ?)',
    rank,
    title,
    url,
    body,
    image,
    date.getTime() / 1000,
  );
  return result;
}

async function updateArticles() {
  const rdiUrl = 'https://ici.radio-canada.ca/international';

  const html = await (await fetch(rdiUrl)).text();
  const $ = cheerio.load(html);

  const articles = await Promise.all(
    $('div.main-col article')
      .map(async function (i) {
        const articleUrl = new URL(
          $('a', this).attr('href'),
          rdiUrl,
        ).toString();
        const articleHtml = await (await fetch(articleUrl)).text();
        const $article = cheerio.load(articleHtml);

        return {
          title: $('.container-main-card header', this).contents().text(),
          url: articleUrl,
          image: $('.container-image img', this)
            .attr('src')
            .replace('q_auto,w_100', 'q_auto,w_635')
            .replace('1x1', '16x9'),
          body: $article('main.document-simple-redactional-container').html(),
          date: new Date(),
          rank: i + 1,
        };
      })
      .get()
      .slice(0, 5),
  );

  for (const article of articles) {
    if (
      !(await db.get('SELECT * FROM articles WHERE title = ?', article.title))
    ) {
      console.log('Saving a new article...');
      saveArticle(article);
    }
  }
}
