require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// EMAIL SETUP
// =========================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("Krishna Portfolio Backend is Running!");
});


// =========================
// CONTACT FORM
// =========================

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


        // =========================
        // GENERATE UNIQUE CODE
        // =========================

        const submissionCode =
            "KRS-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        // =========================
        // SEND EMAIL TO VISITOR
        // =========================

        await transporter.sendMail({

            from: `"Krishna Portfolio" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Your message has been received - Krishna Portfolio",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    background:#020617;
                    color:#ffffff;
                    padding:30px;
                    max-width:600px;
                    margin:auto;
                    border-radius:15px;
                ">

                    <h2 style="color:#a855f7;">
                        Krishna Portfolio
                    </h2>

                    <p>Hello <strong>${name}</strong>,</p>

                    <p>
                        Thank you for contacting me.
                        Your message has been successfully received.
                    </p>

                    <div style="
                        background:#0f172a;
                        padding:20px;
                        border-radius:12px;
                        margin:20px 0;
                        border:1px solid #a855f7;
                    ">

                        <p>
                            <strong>Submission Code:</strong>
                        </p>

                        <h2 style="
                            color:#c084fc;
                            letter-spacing:3px;
                        ">
                            ${submissionCode}
                        </h2>

                    </div>

                    <p>
                        <strong>Subject:</strong> ${subject}
                    </p>

                    <p>
                        I will review your message and reply as soon as possible.
                    </p>

                    <p style="color:#94a3b8;">
                        Please keep your submission code for reference.
                    </p>

                    <hr style="border-color:#334155;">

                    <p style="color:#94a3b8;">
                        © Krishna Portfolio
                    </p>

                </div>
            `

        });


        console.log("Confirmation email sent successfully!");



        // =========================
        // TELEGRAM NOTIFICATION
        // =========================

        const telegramMessage = `
📩 NEW PORTFOLIO MESSAGE

👤 Name: ${name}
📧 Email: ${email}
📌 Subject: ${subject}

🔑 Submission Code:
${submissionCode}

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

            console.error(
                "Telegram Error:",
                telegramData
            );

            // Don't fail the whole submission
            // because the visitor's email was already sent.

        } else {

            console.log(
                "Telegram message sent successfully!"
            );

        }


        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.status(200).json({

            success: true,

            message: "Message sent successfully!",

            code: submissionCode

        });


    } catch (error) {

        console.error(
            "Server Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error. Please try again."

        });

    }

});


// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});