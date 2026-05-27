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
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Portfolio backend is running ✅");
});

// Create transporter ONCE
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter Error:", error);
  } else {
    console.log("Email server is ready ✅");
  }
});

// Contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    // Send mail
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Email sent:", info.response);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {
    console.error("FULL EMAIL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});