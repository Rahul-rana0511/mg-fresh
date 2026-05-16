import transporter from "./mailer.js";

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"MG Fresh" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your MG Fresh Verification Code",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td bgcolor="#1a7a4a" style="padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;">MG Fresh</h1>
              <p style="margin:8px 0 0;color:#a7f3d0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a2e;">Verify Your Email</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                Use the one-time password below to complete your verification. This code is valid for <strong style="color:#1a7a4a;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background:#f0fdf4;border:2px dashed #25a868;border-radius:10px;padding:28px 20px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;">Your OTP Code</p>
                    <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:10px;color:#1a7a4a;font-family:'Courier New',monospace;">${otp}</p>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#fff8f0;border-left:4px solid #f59e0b;border-radius:0 6px 6px 0;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#92400e;">
                      &#9888; <strong>Never share this code</strong> with anyone. MG Fresh will never ask for your OTP.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#9ca3af;">
                Didn't request this? You can safely ignore this email. No action is needed.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} MG Fresh. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">This is an automated message — please do not reply.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email OTP error:", error);
    return false;
  }
};

export default sendEmailOtp;
