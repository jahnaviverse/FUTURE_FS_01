/**
 * server.js — tiny Node + Express backend for the portfolio contact form.
 *
 * What this file does:
 *   1. Starts an Express web server on a port (default 5000).
 *   2. Accepts POST requests at /contact with { name, email, message }.
 *   3. Uses Nodemailer + your Gmail App Password to email you the message.
 *
 * Why each piece exists:
 *   - express        → web framework, makes it easy to define routes (URLs).
 *   - cors           → lets your frontend (different port / file) call this API.
 *   - dotenv         → loads secrets from a .env file into process.env.
 *   - nodemailer     → sends real emails via SMTP (here, Gmail).
 */

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // loads .env into process.env
console.log('EMAIL:', process.env.EMAIL_USER);
console.log('PASSWORD:', process.env.EMAIL_PASS);
console.log('RECEIVER:', process.env.EMAIL_USER);

const app = express();

// ---- Middleware ----
app.use(cors({origin: "*"}));                       // allow requests from your frontend
app.use(express.json());               // parse JSON bodies sent by fetch()

// ---- Health check (optional) ----
app.get("/", (req, res) => {
  res.send("Portfolio backend is running ✅");
});

// ---- Contact route ----
// Frontend calls:  fetch("http://localhost:5000/contact", { method: "POST", ... })
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // 1. Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // 2. Create a transporter using your Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your 16-char App Password (NOT your normal password)
      },
    });

    // 3. Send the email to yourself
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // where you receive it
      replyTo: email,                                     // hitting "Reply" mails the sender
      subject: `Portfolio inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New portfolio message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p style="white-space:pre-line">${message}</p>
      `,
    });

    return res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

// ---- Start the server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
