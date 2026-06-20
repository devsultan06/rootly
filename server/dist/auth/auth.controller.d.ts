import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
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
}
