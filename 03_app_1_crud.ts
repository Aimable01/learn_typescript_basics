import express, { Request, Response } from "express";
import { Pool } from "pg";
import bodyParser from "body-parser";

// Middlewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// The database setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "typescript",
  password: "2006",
  port: 5432,
});
pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(`An error in connecting to the database: ${err}`);
  });

// Get all users
app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = (await pool.query("SELECT * FROM users")).rows;
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a user
app.post("/users/add", async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);
    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get one user
app.get("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (
      await pool.query(`SELECT * FROM users WHERE id =${req.params.id} `)
    ).rows;
    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error in getting the user: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Updating a user
app.patch("/users/:id", async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  try {
    await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = ${req.params.id}`,
      [name, email]
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(`Error in updating the user: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Deleting a user
app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(`DELETE FROM users WHERE id = ${req.params.id}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(`Error in deleting the user: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => console.log("App running on port 3000."));
