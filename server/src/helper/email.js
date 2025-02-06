const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 587 for TLS
  secure: false, // Use false for TLS (STARTTLS)
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    if (!emailData.email || !emailData.subject || !emailData.html) {
      throw new Error(
        "Email data is incomplete. Provide email, subject, and HTML content."
      );
    }

    const mailOptions = {
      from: `"Sanuar Khan" <${smtpUsername}>`, // Sender name and email
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${emailData.email}: ${info.response}`);
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = emailWithNodeMailer;
