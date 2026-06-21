import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OnboardingDto } from './dto/onboarding.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signUpDto: SignUpDto): Promise<{
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
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
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
    onboarding(user: any, onboardingDto: OnboardingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            workspaceId: any;
            emailSent: boolean;
        };
    }>;
    welcome(user: any): Promise<{
        success: boolean;
        message: string;
        data: {
            emailSent: boolean;
        };
    }>;
}
