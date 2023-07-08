import { UnknownError } from '../../custom-errors';
import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (
  email: string,
  resetPasswordToken: string,
): Promise<void> => {
  try {
    // Create a Nodemailer transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'comuniprode@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Define the email content
    const mailOptions = {
      from: 'comuniprode@gmail.com',
      to: email,
      subject: 'Reset Your Password - Comuniprode',
      text: `Click the following link to reset your password: http://example.com/reset-password?token=${resetPasswordToken}`,
      html: `<p>Click the following link to reset your password: <a href="http://example.com/reset-password?token=${resetPasswordToken}">Reset Password</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log('Reset password email sent successfully!');
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new UnknownError('Unable to send reset password email.');
  }
};