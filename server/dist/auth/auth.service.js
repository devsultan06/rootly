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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../email/email.service");
let AuthService = AuthService_1 = class AuthService {
    supabaseService;
    configService;
    emailService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(supabaseService, configService, emailService) {
        this.supabaseService = supabaseService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async signUpUser(dto) {
        this.logger.log(`Initiating public signup workflow for: ${dto.email}`);
        const adminClient = this.supabaseService.getAdminClient();
        const { data: existingProfile, error: profileCheckError } = await adminClient
            .from('profiles')
            .select('id')
            .eq('email', dto.email)
            .maybeSingle();
        if (profileCheckError) {
            this.logger.error(`Error checking existing profile: ${profileCheckError.message}`);
            throw new common_1.InternalServerErrorException(`Signup check failed: ${profileCheckError.message}`);
        }
        if (existingProfile) {
            throw new common_1.BadRequestException('An account with this email already exists.');
        }
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
            type: 'signup',
            email: dto.email,
            password: dto.password,
            options: {
                data: {
                    full_name: dto.fullName,
                    company_name: dto.companyName,
                },
                redirectTo: `${frontendUrl}/verify`,
            },
        });
        if (linkError) {
            this.logger.error(`Supabase generateLink error: ${linkError.message}`);
            throw new common_1.BadRequestException(`Registration failed: ${linkError.message}`);
        }
        const userId = linkData.user.id;
        const { data: profileCheck } = await adminClient
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();
        if (!profileCheck) {
            this.logger.log(`Safety trigger fallback: profile not found for ${userId}, inserting manually.`);
            const { error: insertProfileError } = await adminClient
                .from('profiles')
                .insert({
                id: userId,
                full_name: dto.fullName,
                email: dto.email,
            });
            if (insertProfileError) {
                this.logger.error(`Manual profile creation failed: ${insertProfileError.message}`);
                throw new common_1.InternalServerErrorException(`Profile creation fallback failed: ${insertProfileError.message}`);
            }
        }
        const { data: workspaceData, error: workspaceError } = await adminClient
            .from('workspaces')
            .insert({ name: dto.companyName })
            .select('id')
            .single();
        if (workspaceError) {
            this.logger.error(`Failed to create workspace: ${workspaceError.message}`);
            throw new common_1.InternalServerErrorException(`Workspace creation failed: ${workspaceError.message}`);
        }
        const workspaceId = workspaceData.id;
        const { error: memberError } = await adminClient
            .from('workspace_members')
            .insert({
            workspace_id: workspaceId,
            profile_id: userId,
            role: 'Admin',
            status: 'active',
        });
        if (memberError) {
            this.logger.error(`Failed to link member to workspace: ${memberError.message}`);
            throw new common_1.InternalServerErrorException(`Workspace member linking failed: ${memberError.message}`);
        }
        const tokenHash = linkData.properties.hashed_token;
        const verificationLink = `${frontendUrl}/verify?token_hash=${tokenHash}&type=signup`;
        const emailSent = await this.emailService.sendVerificationEmail(dto.email, dto.fullName, verificationLink);
        return {
            success: true,
            message: 'Verification email sent. Please check your inbox to confirm your account creation.',
            data: {
                userId,
                email: dto.email,
                fullName: dto.fullName,
                companyName: dto.companyName,
                workspaceId,
                emailSent,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map