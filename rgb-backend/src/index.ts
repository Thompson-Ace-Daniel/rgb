import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/connect-db.js";

const app: Application = express();
const PORT: number = Number(process.env["PORT"]) || 5000;
const DATABASE_URL: string =
  String(process.env["DATABASE_URL"]) ||
  String(process.env["OFFLINE_DATABASE_URL"]);

app.use(express.json());
app.use(cors());

connectDB(DATABASE_URL);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from rgb's backend" });
});

app.listen(PORT, () => {
  console.log(`Server is running on successfully on Port: ${PORT}`);
});
