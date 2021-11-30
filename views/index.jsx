import React from "react";
import truncate from "truncate-html";
import DefaultLayout from "./layouts/default";

/**
 * @param {Object} props
 * @param {[string, Article[]][]} props.articlesByDay
 */
export default function Index({ articlesByDay }) {
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
    <DefaultLayout>
      <h1 id="logo">MondiumCJE</h1>
      <div className="right-aligned">
        <h3>
          Source:{" "}
          <a href="https://ici.radio-canada.ca/international">
            RDI International
          </a>
        </h3>
        <h4>
          Site créé par{" "}
          <a href="https://github.com/Doudou8">Vu Dang Khoa Chiem</a>
          <br />
          <a href="https://github.com/Guimauve48">Mathieu Guimond</a>
          <br />
          <a href="https://github.com/Samuel-Martineau">Samuel Martineau</a>
        </h4>
      </div>
      <hr />
      <h1>&#128478; Articles</h1>
      <section>
        {articlesByDay.map(([day, articles], i) => (
          <div key={i}>
            <h2>{day}</h2>
            <div id="article-container">
              {articles.map(
                ({ title, url, body, image, imageAlt, description }, j) => (
                  <div className="article" key={j}>
                    <h3>
                      <a href={url} target="_blank">
                        {title}
                      </a>
                    </h3>
                    <p>{description}</p>
                    <figure>
                      <img src={image} alt={imageAlt} loading="lazy" />
                      <figcaption>
                        <small>
                          <i>{imageAlt}</i>
                        </small>
                      </figcaption>
                    </figure>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatBody(body),
                      }}
                    />
                  </div>
                )
              )}
            </div>
            <br />
          </div>
        ))}
      </section>
    </DefaultLayout>
  );
}
