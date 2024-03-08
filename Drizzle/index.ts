import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { owner, pets } from "./schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://postgres:2006@localhost:5432/drizzle",
});
pool
  .connect()
  .then(() => console.log("pool connected"))
  .catch((err) => console.log(`Failed to connect to pool: ${err}`));

const db = drizzle(pool);

app.post("/new", async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  await db.insert(owner).values(req.body);
  res.status(200).json({ message: "Inserted successfully" });
  try {
  } catch (error) {
    console.log(`Error in posting new data: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const info = await db.select().from(owner).orderBy(owner.id);
    res.status(200).json({ message: "success", info: info });
  } catch (error) {
    console.log(`Error in getting all users: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
});

app.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const user = await db.select().from(owner).where(eq(owner.id, id));
    if (!user) res.status(404).json({ message: "No user found" });

    await db.update(owner).set(req.body).where(eq(owner.id, id));

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(`An error in updating user: ${error}`);
    res.status(500).json({ message: "Intenal server error." });
  }
});

app.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const user = await db.select().from(owner).where(eq(owner.id, id));
    if (!user) res.status(404).json({ message: "No user found" });

    await db.delete(owner).where(eq(owner.id, id));

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(`An error in deleting user: ${error}`);
    res.status(500).json({ message: "Intenal server error." });
  }
});

//-----------handling crud for the pets
app.post("/pet/new", async (req: Request, res: Response): Promise<void> => {
  try {
    await db.insert(pets).values(req.body);
    res.status(200).json({ message: "Insert success" });
  } catch (error) {
    console.log("An error in posting: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//--------joins
//-------left join
app.get("/pet/owned", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db
      .select({ name: owner.name, pet: pets.name })
      .from(owner)
      .leftJoin(pets, eq(owner.id, pets.ownerId));
    res.status(200).json({ result });
  } catch (error) {
    console.log("An error in getting: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//------right join
app.get(
  "/pet/owned/rjoin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await db
        .select()
        .from(owner)
        .rightJoin(pets, eq(owner.id, pets.ownerId));
      res.status(200).json({ result });
    } catch (error) {
      console.log("An error in getting: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//-------inner join
app.get(
  "/pet/owned/ijoin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await db
        .select({ name: owner.name, pet: pets.name })
        .from(owner)
        .innerJoin(pets, eq(owner.id, pets.ownerId));
      res.status(200).json({ result });
    } catch (error) {
      console.log("An error in getting: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.listen(3000, () => console.log("App running on port 3000."));
