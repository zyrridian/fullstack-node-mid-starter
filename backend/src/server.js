import { config } from "./config.js";
import { getDb } from "./db.js";
import { createApp } from "./app.js";

const db = await getDb();
const app = createApp({ db });

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
  console.log(`DB: ${config.dbPath}`);
});
