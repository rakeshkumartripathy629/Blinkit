// const forgotPasswordTemplate = ({ name, otp })=>{
//     return `
// <div>
//     <p>Dear, ${name}</p>
//     <p>You're requested a password reset. Please use following OTP code to reset your password.</p>
//     <div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
//         ${otp}
//     </div>
//     <p>This otp is valid for 1 hour only. Enter this otp in the binkeyit website to proceed with resetting your password.</p>
//     <br/>
//     </br>
//     <p>Thanks</p>
//     <p>Blinkit</p>
// </div>
//     `
// }

// export default forgotPasswordTemplate 


const forgotPasswordTemplate = ({ name, otp, expiryMinutes = 60 }) => {
  const expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000);
  const formattedExpiry = expiryDate.toLocaleString("en-US", {
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <div style="font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; background:#f5f7fa; padding:0; margin:0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg,#6b73ff 0%,#000dff 100%); padding:32px; color:#fff; text-align:center;">
        <h1 style="margin:0; font-size:24px; font-weight:600;">Password Reset Request</h1>
        <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">We got a request to reset your password</p>
      </div>

      <div style="padding:32px 28px; color:#1f2d3a;">
        <p style="margin:0 0 16px; font-size:16px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px; font-size:14px; line-height:1.5;">
          You recently requested to reset your password. Use the One-Time Password (OTP) below to proceed. This code is valid for <strong>${expiryMinutes} minutes</strong> (until ${formattedExpiry}).
        </p>

        <div style="margin:0 auto 24px; max-width:320px; background:#f0f4ff; border:2px dashed #6b73ff; border-radius:8px; padding:18px; text-align:center;">
          <div style="font-size:12px; color:#555; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Your OTP code</div>
          <div style="font-size:32px; font-weight:700; letter-spacing:4px; color:#1a1f45; margin:0;">
            ${otp}
          </div>
        </div>

        <p style="margin:0 0 16px; font-size:14px;">
          If you didn’t request this, you can safely ignore this email. For your security, do not share this code with anyone.
        </p>

        <div style="margin:32px 0; text-align:center;">
          <a href="#" style="display:inline-block; padding:12px 28px; background:#6b73ff; color:#fff; border-radius:999px; text-decoration:none; font-weight:600; font-size:14px;">
            Reset Password
          </a>
        </div>

        <p style="margin:0; font-size:12px; color:#888;">
          This request was generated on ${new Date().toLocaleString("en-US", { hour12: true })}. If the button above doesn’t work, copy and paste the code manually into the website.
        </p>

        <hr style="border:none; border-top:1px solid #e6e9ef; margin:32px 0;" />

        <p style="margin:0; font-size:12px; color:#999;">
          Thanks,<br/>
          <strong>Blinkit Team</strong><br/>
          <span style="opacity:0.8;">If you’re having trouble, reply to this email or visit our help center.</span>
        </p>
      </div>

      <div style="background:#f0f4ff; padding:12px 16px; text-align:center; font-size:11px; color:#888;">
        © ${new Date().getFullYear()} Blinkit. All rights reserved. If you didn’t request a password reset, no further action is required.
      </div>
    </div>
  </div>
  `;
};

export default forgotPasswordTemplate;
