import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OnboardingDto } from './dto/onboarding.dto';

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
    const { data: existingProfile, error: profileCheckError } =
      await adminClient
        .from('profiles')
        .select('id')
        .eq('email', dto.email)
        .maybeSingle();

    if (profileCheckError) {
      this.logger.error(
        `Error checking existing profile: ${profileCheckError.message}`,
      );
      throw new InternalServerErrorException(
        `Signup check failed: ${profileCheckError.message}`,
      );
    }

    if (existingProfile) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    // 2. Generate Supabase sign up link (which creates user in auth.users database)
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
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
      throw new BadRequestException(
        `Registration failed: ${linkError.message}`,
      );
    }

    const userId = linkData.user.id;

    // 3. Fallback: manual profile verification / insertion
    const { data: profileCheck } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!profileCheck) {
      this.logger.log(
        `Safety trigger fallback: profile not found for ${userId}, inserting manually.`,
      );
      const { error: insertProfileError } = await adminClient
        .from('profiles')
        .insert({
          id: userId,
          full_name: dto.fullName,
          email: dto.email,
        });

      if (insertProfileError) {
        this.logger.error(
          `Manual profile creation failed: ${insertProfileError.message}`,
        );
        throw new InternalServerErrorException(
          `Profile creation fallback failed: ${insertProfileError.message}`,
        );
      }
    }

    // 4. Insert workspace record
    const { data: workspaceData, error: workspaceError } = await adminClient
      .from('workspaces')
      .insert({ name: dto.companyName })
      .select('id')
      .single();

    if (workspaceError) {
      this.logger.error(
        `Failed to create workspace: ${workspaceError.message}`,
      );
      throw new InternalServerErrorException(
        `Workspace creation failed: ${workspaceError.message}`,
      );
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
      this.logger.error(
        `Failed to link member to workspace: ${memberError.message}`,
      );
      throw new InternalServerErrorException(
        `Workspace member linking failed: ${memberError.message}`,
      );
    }

    // 6. Formulate custom verification link & dispatch email via Brevo
    const tokenHash = linkData.properties.hashed_token;
    const verificationLink = `${frontendUrl}/verify?token_hash=${tokenHash}&type=signup`;

    const emailSent = await this.emailService.sendVerificationEmail(
      dto.email,
      dto.fullName,
      verificationLink,
    );

    return {
      success: true,
      message:
        'Verification email sent. Please check your inbox to confirm your account creation.',
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

  async forgotPassword(dto: ForgotPasswordDto) {
    this.logger.log(`Received forgot password request for: ${dto.email}`);
    const adminClient = this.supabaseService.getAdminClient();

    // 1. Check if user profile exists
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id, full_name')
      .eq('email', dto.email)
      .maybeSingle();

    if (profileError) {
      this.logger.error(`Error querying user profile for reset: ${profileError.message}`);
      throw new InternalServerErrorException(`Password reset failed: ${profileError.message}`);
    }

    // For security, don't reveal if user doesn't exist
    if (!profile) {
      this.logger.warn(`User with email ${dto.email} not found. Returning fake success.`);
      return {
        success: true,
        message: 'If the email matches a registered account, you will receive a password reset link shortly.',
      };
    }

    // 2. Generate Supabase password recovery link
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'recovery',
      email: dto.email,
      options: {
        redirectTo: `${frontendUrl}/reset-password`,
      },
    });

    if (linkError) {
      this.logger.error(`Supabase generateLink recovery error: ${linkError.message}`);
      throw new BadRequestException(`Failed to generate recovery link: ${linkError.message}`);
    }

    // 3. Formulate custom link & send reset email via Brevo
    const tokenHash = linkData.properties.hashed_token;
    const resetLink = `${frontendUrl}/reset-password?token_hash=${tokenHash}&type=recovery`;

    this.logger.log(`Generated recovery link for ${dto.email}: ${resetLink}`);

    const emailSent = await this.emailService.sendPasswordResetEmail(
      dto.email,
      profile.full_name,
      resetLink,
    );

    return {
      success: true,
      message: 'If the email matches a registered account, you will receive a password reset link shortly.',
      data: {
        emailSent,
      },
    };
  }

  async sendWelcomeEmail(supabaseUser: any) {
    this.logger.log(`Sending welcome email to: ${supabaseUser.email}`);
    const fullName = supabaseUser.user_metadata?.full_name || 'Developer';
    
    const emailSent = await this.emailService.sendWelcomeEmail(supabaseUser.email, fullName);
    
    return {
      success: true,
      message: 'Welcome email sent successfully.',
      data: {
        emailSent,
      },
    };
  }

  async completeOnboarding(user: any, dto: OnboardingDto) {
    const userId = user.sub || user.id;
    const email = user.email;
    const fullName = dto.fullName || user.user_metadata?.full_name || 'New Developer';
    
    this.logger.log(`Completing onboarding for user ${userId} (${email}) with company ${dto.companyName}`);
    
    const adminClient = this.supabaseService.getAdminClient();

    // 1. Update profile full name if specified
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', userId);

    if (profileError) {
      this.logger.error(`Failed to update profile for onboarding: ${profileError.message}`);
      throw new InternalServerErrorException(`Profile update failed: ${profileError.message}`);
    }

    // 2. Create the workspace
    const { data: workspaceData, error: workspaceError } = await adminClient
      .from('workspaces')
      .insert({ name: dto.companyName })
      .select('id')
      .single();

    if (workspaceError) {
      this.logger.error(`Failed to create workspace in onboarding: ${workspaceError.message}`);
      throw new InternalServerErrorException(`Workspace creation failed: ${workspaceError.message}`);
    }

    const workspaceId = workspaceData.id;

    // 3. Link user as Admin to the workspace
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

    // 4. Send welcome onboarding email
    let emailSent = false;
    try {
      emailSent = await this.emailService.sendWelcomeEmail(email, fullName);
    } catch (err: any) {
      this.logger.error(`Failed to send onboarding welcome email: ${err.message}`);
    }

    return {
      success: true,
      message: 'Onboarding completed successfully.',
      data: {
        workspaceId,
        emailSent,
      },
    };
  }
}
