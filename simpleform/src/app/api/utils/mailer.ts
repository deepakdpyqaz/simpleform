import nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
}: MailOptions): Promise<void> {
  // Configure the SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP details of your provider
    auth: {
      user: process.env.EMAIL_USERNAME, // Email address
      pass: process.env.EMAIL_PASSWORD, // App password or email password
    },
  });

  // Email details
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
    attachments, // Attachments are now included here
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
