import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { user } from "./schema";

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://postgres:2006@localhost:5432/drizzle",
});

const db = drizzle(pool);

app.post("/new", async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  await db.insert(user).values(req.body);
  res.status(200).json({ message: "Inserted successfully" });
  try {
  } catch (error) {
    console.log(`Error in posting new data: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(3000, () => console.log("App running on port 3000."));
