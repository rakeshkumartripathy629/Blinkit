// import { Resend } from 'resend';

// // ====== hardcoded config (only for local/dev testing) ======
// const RESEND_API_KEY = 're_CqcrQoN4_Pmb1XP1Wi5rQuNsdTTawugr'; // <-- replace with real key
// // ==========================================================

// if (!RESEND_API_KEY) {
//   console.error('Resend API key is missing. Set RESEND_API_KEY in the code.');
//   throw new Error('Resend API key missing');
// }

// const resend = new Resend(RESEND_API_KEY);

// const sendEmail = async ({ sendTo, subject, html }) => { 
//   try {
//     const data = await resend.emails.send({
//       from: 'Binkeyit <noreply@onresend.com>',

//       to: sendTo,
//       subject,
//       html,
//     });

//     return data;
//   } catch (error) {
//     // better error visibility
//     console.error('sendEmail error:', error);
//     // normalize error shape if needed
//     throw error;
//   }
// };

// export default sendEmail;

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'outlook', etc.
  auth: {
    user: 'rakeshkumartripathy629@gmail.com', // your email
    pass: 'aaxb xmbl hmjl sdhs', // ⚠️ not your Gmail password; use App Password
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: 'Blinkit <april.oconner76@ethereal.email>',
      to: "rakeshkumartripathy075@gmail.com",
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};

export default sendEmail;
