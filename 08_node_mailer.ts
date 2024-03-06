import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

const app = express();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "tierra.walker@ethereal.email",
    pass: "P3neMth37Ef3wjSSdR",
  },
});

app.get("/send", async (req: Request, res: Response) => {
  try {
    const info = await transporter.sendMail({
      from: "tierra.walker@ethereal.email",
      to: "kwizaima14@gmail.com",
      subject: "Node mailer",
      text: "This is a test email sent using Nodemailer with Ethereal",
      html: "<b>This is a test email sent using Nodemailer with Ethereal</b>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.send("Email sent successfully!");
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send("Error sending email");
  }
});

app.listen(3000, () => console.log("App running on port 3000."));
