export declare class MailService {
    private readonly transporter;
    private readonly logger;
    constructor();
    sendOtpEmail(to: string, otp: string): Promise<void>;
    sendLoginAlertEmail(to: string, role: string, ipAddress?: string): Promise<void>;
}
