// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendAssignmentEmail = async (userEmail, issueTitle, workerName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Worker Assigned to Your Issue",
      html: `
        <h1>Issue Update</h1>
        <p>Your issue "${issueTitle}" has been assigned to worker ${workerName}.</p>
        <p>They will begin working on resolving your issue soon.</p>
        <p>Thank you for using our service!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendAssignmentEmail };
