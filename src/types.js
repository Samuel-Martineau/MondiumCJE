/**
 * @typedef {Object} ArticleWithoutId
 * @property {number} rank
 * @property {string} url
 * @property {string} title
 * @property {string} description
 * @property {string} body
 * @property {string} image
 * @property {string} imageAlt
 * @property {Date} date
 *
 * @typedef {Object} ArticleId
 * @property {number} id
 *
 * @typedef {ArticleWithoutId & ArticleId} Article
 */

/**
 * @typedef {Object} Device
 * @property {number} id
 * @property {string} identifier
 * @property {'none' | 'user' | 'admin'} role
 */
