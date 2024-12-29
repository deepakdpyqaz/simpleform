import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: MailOptions): Promise<void> {
  // Configure the SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP details of your provider
    auth: {
      user: "deepakdpyqaz@gmail.com", // Email address
      pass: "cvku axso divl mxqx", // App password or email password
    },
  });

  // Email details
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
