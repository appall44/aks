
// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // ✅ Existing OTP Email
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const verificationLink = `http://localhost:3000/otp?email=${encodeURIComponent(to)}&otp=${otp}`;
    const year = new Date().getFullYear();

    const mailOptions = {
      from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Akeray Property Management System - Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 3 minutes. You can also click this link: ${verificationLink}`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear User,</p>
          <p>Welcome to <strong>Akeray Property Management System</strong>!</p>
          <p>Please use the OTP below to complete your verification. This OTP is valid for <strong>3 minutes</strong>.</p>

          <div style="text-align: center; font-size: 32px; font-weight: bold; color: #007cf0; margin: 30px 0;">
            ${otp}
          </div>

          <p>Or click the button below to verify directly:</p>
          <div style="text-align: center;">
            <a href="${verificationLink}" style="background: #007cf0; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none;">Verify Email</a>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            If you did not request this OTP, you can ignore this email.
          </p>

          <p style="margin-top: 30px;">Best regards,<br>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error);
      throw error;
    }
  }

  // ✅ New Login Alert Email
  async sendLoginAlertEmail(to: string, role: string, ipAddress?: string): Promise<void> {
    const loginTime = new Date().toLocaleString();
    const year = new Date().getFullYear();

    const mailOptions = {
      from: `"Akeray Property Management System" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Login Alert - ${role} Account`,
      text: `Your ${role} account logged in on ${loginTime}. IP: ${ipAddress || 'Unknown'}`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; padding: 30px; text-align: center;">
          <h2>Akeray Property Management System</h2>
        </div>

        <div style="padding: 30px; background-color: #ffffff;">
          <p>Dear ${role},</p>
          <p>This is a security alert. Your <strong>${role}</strong> account was logged in on:</p>
          <p><strong>${loginTime}</strong></p>
          <p>IP Address: ${ipAddress || 'Unknown'}</p>

          <p>If this was you, no action is needed. If not, please change your password immediately.</p>

          <p style="margin-top: 30px;">Best regards,<br>The Akeray Team</p>
        </div>

        <div style="background: linear-gradient(to right, #007cf0, #00dfd8); color: white; text-align: center; padding: 12px; font-size: 12px;">
          &copy; ${year} Akeray Property Management System
        </div>
      </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Login alert email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send login alert email to ${to}`, error);
      throw error;
    }
  }
}

