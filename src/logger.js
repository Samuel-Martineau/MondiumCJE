import clc from "cli-color";
import ensureError from "ensure-error";

export default class Logger {
  /**
   * @type {Logger}
   */
  static #instance;

  static get() {
    return Logger.#instance;
  }

  constructor() {
    if (Logger.#instance) throw new Error("Logger already exists!");

    Logger.#instance = this;
  }

  /**
   * @param {clc.Format} formatMessage
   * @param {string} message
   */
  #log(formatMessage, message) {
    const formatDate = clc.whiteBright;
    const date = `[${new Date().toLocaleString("en-us", { hour12: false })}]`;

    console.log(`${formatDate(date)} ${formatMessage(message)}`);
  }

  /**
   * @param {string} message
   */
  info(message) {
    this.#log(clc.blueBright, message);
  }

  /**
   * @param {string} warning
   */
  warn(warning) {
    this.#log(clc.yellow.underline, warning);
  }

  /**
   * @param {Error} rawError
   */
  error(rawError) {
    const error = ensureError(rawError);
    this.#log(clc.red.bold, `${error.name} -> ${error.stack}`);
  }
}

new Logger();
