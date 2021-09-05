import * as path from "path";
import * as url from "url";

export const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dirname = path.dirname(url.fileURLToPath(import.meta.url));
