import nodemailer from 'nodemailer';

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("EMAIL_USER or EMAIL_PASS not configured in .env file");
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("Nodemailer configuration error:", error);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});