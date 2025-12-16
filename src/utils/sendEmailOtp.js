import transporter from "./mailer.js";

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your MG Fresh OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>MG Fresh</h2>
          <p>Hi user, Your One Time Password is:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email OTP error:", error);
    return false;
  }
};

export default sendEmailOtp
