import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthService {
    private readonly supabaseService;
    private readonly configService;
    private readonly emailService;
    private readonly logger;
    constructor(supabaseService: SupabaseService, configService: ConfigService, emailService: EmailService);
    signUpUser(dto: SignUpDto): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            email: string;
            fullName: string;
            companyName: string;
            workspaceId: any;
            emailSent: boolean;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            emailSent: boolean;
        };
    }>;
}
