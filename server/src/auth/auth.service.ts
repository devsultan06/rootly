import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async signUpUser(dto: SignUpDto) {
    this.logger.log(`Initiating public signup workflow for: ${dto.email}`);
    const adminClient = this.supabaseService.getAdminClient();

    // 1. Check if user profile already exists to prevent duplicates
    const { data: existingProfile, error: profileCheckError } = await adminClient
      .from('profiles')
      .select('id')
      .eq('email', dto.email)
      .maybeSingle();

    if (profileCheckError) {
      this.logger.error(`Error checking existing profile: ${profileCheckError.message}`);
      throw new InternalServerErrorException(`Signup check failed: ${profileCheckError.message}`);
    }

    if (existingProfile) {
      throw new BadRequestException('An account with this email already exists.');
    }

    // 2. Generate Supabase sign up link (which creates user in auth.users database)
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
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
      throw new BadRequestException(`Registration failed: ${linkError.message}`);
    }

    const userId = linkData.user.id;

    // 3. Fallback: manual profile verification / insertion
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
        throw new InternalServerErrorException(`Profile creation fallback failed: ${insertProfileError.message}`);
      }
    }

    // 4. Insert workspace record
    const { data: workspaceData, error: workspaceError } = await adminClient
      .from('workspaces')
      .insert({ name: dto.companyName })
      .select('id')
      .single();

    if (workspaceError) {
      this.logger.error(`Failed to create workspace: ${workspaceError.message}`);
      throw new InternalServerErrorException(`Workspace creation failed: ${workspaceError.message}`);
    }

    const workspaceId = workspaceData.id;

    // 5. Add current user as Admin member of the new workspace
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
      throw new InternalServerErrorException(`Workspace member linking failed: ${memberError.message}`);
    }

    // 6. Formulate custom verification link & dispatch email via Brevo
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
}

