"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    transporter;
    logger = new common_1.Logger(MailService_1.name);
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    async sendOtpEmail(to, otp) {
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
        }
        catch (error) {
            this.logger.error(`Failed to send OTP email to ${to}`, error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map