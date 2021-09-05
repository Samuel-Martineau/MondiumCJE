import React from "react";
import truncate from "truncate-html";

/**
 * @param {Object} data
 * @param {[string, Article[]][]} data.articlesByDay
 * @returns
 */
function Index({ articlesByDay }) {
  /**
   * @param {string} body
   */
  function formatBody(body) {
    const randomSequence = Math.random();

    return truncate(body, 60, {
      byWords: true,
      reserveLastWord: true,
      ellipsis: randomSequence.toString(),
    })
      .trim()
      .replace(new RegExp(`[.,]?\s*${randomSequence}`), "…");
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Montserrat:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <title>MondiumCJE</title>
      </head>
      <body>
        <h1 id="logo">MondiumCJE</h1>
        <hr />
        <h1>&#128478; Articles</h1>
        <section>
          {articlesByDay.map(([day, articles], i) => (
            <div key={i}>
              <h2>{day}</h2>
              <div id="article-container">
                {articles.map(({ title, url, body, image, date }, j) => (
                  <div className="article" key={j}>
                    <h3>
                      <a href={url} target="_blank">
                        {title}
                      </a>
                    </h3>
                    <br />
                    <img src={image} alt="article-image" />
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatBody(body),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </body>
    </html>
  );
}

export default Index;
