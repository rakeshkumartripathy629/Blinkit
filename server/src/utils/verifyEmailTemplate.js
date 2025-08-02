// // utils/verifyEmailTemplate.js
// export function verifyEmailTemplate({ name, url }) {
//   return `
//     <div style="font-family: sans-serif; line-height:1.4;">
//       <h2>Hello ${name},</h2>
//       <p>Thank you for registering. Please verify your email by clicking the link below:</p>
//       <p><a href="${url}" target="_blank" style="color: #1a73e8;">Verify Email</a></p>
//       <p>If you didn't request this, you can ignore this email.</p>
//     </div>
//   `;
// }


export function verifyEmailTemplate({ name, url }) {
  const formattedDate = new Date().toLocaleString("en-US", {
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <div style="background:#f5f7fa; padding:0; margin:0; font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; color:#1f2d3a;">
    <div style="max-width:600px; margin:0 auto; border-radius:12px; overflow:hidden; box-shadow:0 24px 80px rgba(0,0,0,0.08); background:#fff;">
      
      <div style="background: linear-gradient(135deg,#4f5bd5 0%,#667eea 100%); padding:32px; text-align:center; color:#fff;">
        <h1 style="margin:0; font-size:22px; font-weight:600;">Verify Your Email</h1>
        <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Almost there, just one more step.</p>
      </div>

      <div style="padding:32px 28px;">
        <p style="margin:0 0 16px; font-size:16px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px; font-size:14px; line-height:1.5;">
          Thanks for signing up! Please verify your email address to activate your account. Click the button below to proceed:
        </p>

        <div style="text-align:center; margin:24px 0;">
          <a href="${url}" target="_blank"
             style="display:inline-block; padding:14px 32px; background:#4f5bd5; color:#fff; border-radius:999px; text-decoration:none; font-weight:600; font-size:15px;">
            Verify Email
          </a>
        </div>

        <p style="margin:0 0 16px; font-size:14px;">
          If the button doesn’t work, copy and paste the following link into your browser:
        </p>
        <p style="word-break:break-all; font-size:12px; background:#f0f4ff; padding:12px; border-radius:6px;">
          <a href="${url}" target="_blank" style="color:#1a73e8; text-decoration:none;">${url}</a>
        </p>

        <p style="margin:24px 0 0; font-size:12px; color:#666;">
          This verification request was initiated on ${formattedDate}. If you didn’t create an account with us, you can safely ignore this email.
        </p>

        <hr style="border:none; border-top:1px solid #e6e9ef; margin:32px 0;" />

        <p style="margin:0; font-size:12px; color:#999;">
          Cheers,<br/>
          <strong>Blinkit Team</strong><br/>
          <span style="opacity:0.8;">Need help? Reply to this email or visit our support center.</span>
        </p>
      </div>

      <div style="background:#f0f4ff; padding:12px 16px; text-align:center; font-size:11px; color:#888;">
        © ${new Date().getFullYear()} Blinkit. All rights reserved.
      </div>
    </div>
  </div>
  `;
}
