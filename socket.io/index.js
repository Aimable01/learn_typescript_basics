import express from "express";
import { createServer } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const server = createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(3000, () => console.log("Server is running on port 3000."));
