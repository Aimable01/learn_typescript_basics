import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//The request interface
declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}

//Middle ware
const app = express();
app.use(express.json());

//secrets
const secretKey: string = "mysecret key";

//Database connection
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
    console.log("Connected to database successfully");

    //Create admins table
    pool.query(`
     CREATE TABLE IF NOT EXISTS admins(
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT false
        )
    `);
  })
  .catch((err) => console.log(`Error in connecting to the database: ${err}`));

//Define the admin
interface Admin {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

//Register
app.post(
  "/admins/register",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, isAdmin } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO admins (name, email, password, isAdmin) VALUES ($1,$2,$3,$4)`,
        [name, email, hashedPassword, isAdmin]
      );
      res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
      console.log("Error in registering: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//Login
app.post(
  "/admins/login",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    try {
      const user = await pool.query(`SELECT * FROM admins WHERE email = $1`, [
        email,
      ]);
      if (!user) {
        res.json({ message: "No user found" });
      }
      const user_get = user.rows[0];
      const user_password = user_get.password;
      const passwordMatch = await bcrypt.compare(password, user_password);
      if (!passwordMatch) {
        res.json({ message: "No password match" });
      }

      const id = user_get.id;
      const token = await jwt.sign({ user_id: id }, secretKey, {
        expiresIn: "30m",
      });

      res.status(200).json({ message: "user logged in", Token: token });
    } catch (error) {
      console.log("Error in logging in: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//authenticate middle ware
interface ExtendedRequest extends Request {
  user?: any;
}

function authenticateToken(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) res.status(401).json({ message: "No token found" });

  jwt.verify(token!, secretKey, (err, user) => {
    if (err) {
      //Login again if token is expired
      if (err.name === "TokenExpiredError") {
        res.status(402).json({ message: "Please login again" });
      }
      res.status(401).json({ message: "error in verifying", err });
    }
    req.user = user;
    next();
  });
}

//The protected route
app.get(
  "/pro",
  authenticateToken,
  async (req: ExtendedRequest, res: Response): Promise<void> => {
    const user_id: number = req.user.user_id;
    try {
      const user = await pool.query(
        `SELECT * FROM admins WHERE id = ${user_id}`
      );

      res.status(200).json({
        user: user.rows[0].name,
        message: "This is the protected route.",
      });
    } catch (error) {
      console.log(`An error in getting the user: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.listen(3000, () => console.log(`App running on port 3000`));
