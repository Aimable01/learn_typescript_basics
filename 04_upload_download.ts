import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const app = express();

//Uploading the file
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(404).json({ message: "No file found" });
  } else {
    res.status(200).json({ message: "File uploaded successfully" });
  }
});

//downloading the file
app.get("/download/:fileName", (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "uploads", fileName);

  res.setHeader("Content-Disposition", `attachment; fileName = ${fileName}`);
  res.setHeader("Content-Type", "application/octet-stream");

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error downloading file");
    } else {
      res.status(200).json({ message: "File downloaded successfully" });
    }
  });
});
app.listen(3000, () => console.log("App running on port 3000"));
