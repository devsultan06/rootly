import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly senderEmail;
    private readonly senderName;
    constructor(configService: ConfigService);
    sendVerificationEmail(toEmail: string, toName: string, verificationLink: string): Promise<boolean>;
    sendPasswordResetEmail(toEmail: string, toName: string, resetLink: string): Promise<boolean>;
}
