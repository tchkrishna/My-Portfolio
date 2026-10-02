require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.send("Krishna Portfolio Backend is Running!");
});


// =========================
// CONTACT FORM
// =========================

app.post("/api/messages", async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        // =========================
        // VALIDATE
        // =========================

        if (!name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }


        // =========================
        // TELEGRAM MESSAGE
        // =========================

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


        const telegramResponse = await fetch(
            telegramURL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: telegramMessage
                })
            }
        );


        const telegramData =
            await telegramResponse.json();


        if (!telegramData.ok) {

            console.error(
                "Telegram Error:",
                telegramData
            );

        } else {

            console.log(
                "Telegram message sent successfully!"
            );

        }


        // =========================
        // SEND CONFIRMATION EMAIL
        // USING RESEND
        // =========================

        const resendResponse = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.RESEND_API_KEY}`
                },

                body: JSON.stringify({

                    from:
                        "Krishna Portfolio <noreply@ckrishna.in>",

                    to: [email],

                    subject:
                        "Your message has been received",

                    html: `
                        <div style="
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 30px;
                            background: #0f172a;
                            color: #ffffff;
                            border-radius: 12px;
                        ">

                            <h2 style="color: #a855f7;">
                                Hi ${name} 👋
                            </h2>

                            <p style="font-size: 16px;">
                                Your message has been received successfully.
                            </p>

                            <p style="font-size: 16px;">
                                Thank you for contacting me.
                                I will reply to you as soon as possible.
                            </p>

                            <hr style="
                                border: none;
                                border-top: 1px solid #334155;
                                margin: 25px 0;
                            ">

                            <p style="font-size: 15px;">
                                Regards,<br>
                                <strong>Krishna</strong>
                            </p>

                        </div>
                    `
                })
            }
        );


        const resendData =
            await resendResponse.json();


        // =========================
        // CHECK RESEND
        // =========================

        if (!resendResponse.ok) {

            console.error(
                "Resend Error:",
                resendData
            );

            return res.status(500).json({
                success: false,
                message:
                    "Message received, but confirmation email could not be sent."
            });

        }


        console.log(
            "Confirmation email sent successfully!"
        );


        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.status(200).json({

            success: true,

            message:
                "Message sent successfully and confirmation email sent."

        });


    } catch (error) {

        console.error(
            "Server Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Message received, but confirmation email could not be sent."

        });

    }

});


// =========================
// START SERVER
// =========================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);