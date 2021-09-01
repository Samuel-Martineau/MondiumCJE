import React from "react";

/**
 * @param {Object} param0
 * @param {[string, Article[]][]} param0.articlesByDay
 * @returns
 */
function Index({ articlesByDay }) {
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
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Montserrat:wght@400;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <title>MondiumCJE</title>
      </head>
      <body>
        <h1 id="logo">MondiumCJE</h1>
        <hr />
        <h1>&#128478; Articles</h1>
        <div id="article-container">
          {articlesByDay.map(([day, articles], i) => (
            <div key={i}>
              <h2>{day}</h2>
              {articles.map(({ title, body, image, date }, j) => (
                <div className="article" key={j}>
                  <h3>{title}</h3>
                  <hr />
                  <img src={image} alt="article-image" />
                  <p dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </body>
    </html>
  );
}

export default Index;
