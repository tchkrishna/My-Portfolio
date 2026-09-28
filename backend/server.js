
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Krishna Portfolio Backend is Running!");
});

app.post("/api/messages", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Check required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const telegramMessage = `
📩 NEW PORTFOLIO MESSAGE

👤 Name: ${name}
📧 Email: ${email}
📌 Subject: ${subject}

💬 Message:
${message}
        `;

        const telegramURL =
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: telegramMessage
            })
        });

        const telegramData = await telegramResponse.json();

        if (!telegramData.ok) {
            console.error("Telegram Error:", telegramData);

            return res.status(500).json({
                success: false,
                message: "Failed to send message."
            });
        }

        console.log("Telegram message sent successfully!");

        res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("Server Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

