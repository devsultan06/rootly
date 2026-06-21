import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CurrentUser } from '../supabase/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUpUser(signUpDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('onboarding')
  @UseGuards(SupabaseAuthGuard)
  async onboarding(@CurrentUser() user: any, @Body() onboardingDto: OnboardingDto) {
    return this.authService.completeOnboarding(user, onboardingDto);
  }

  @Post('welcome')
  @UseGuards(SupabaseAuthGuard)
  async welcome(@CurrentUser() user: any) {
    return this.authService.sendWelcomeEmail(user);
  }
}




