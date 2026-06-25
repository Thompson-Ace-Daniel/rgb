import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import "dotenv/config";

import { connectDB } from "./config/connect-db.js";

const app: Application = express();
const PORT: number = Number(process.env["PORT"]) || 3000;
const DATABASE_URL: string =
  String(process.env["DATABASE_URL"]) || String(process.env["OFFLINE_DATABASE_URL"]);

app.use(express.json());

connectDB(DATABASE_URL);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from rgb's backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
