import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    this.senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL') || 'noreply@justinch.dev';
    this.senderName = this.configService.get<string>('BREVO_SENDER_NAME') || 'Rootly';

    if (!this.apiKey) {
      this.logger.warn('BREVO_API_KEY is not defined. Email dispatch will fail.');
    }
  }

  async sendVerificationEmail(toEmail: string, toName: string, verificationLink: string): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.error('Cannot send verification email: BREVO_API_KEY is missing.');
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Rootly Account</title>
        <style>
          body {
            background-color: #0A0A0A;
            color: #F1F1F1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background-color: #111111;
            border: 1px solid #222222;
            border-radius: 12px;
            padding: 40px;
          }
          .logo {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            color: #14B8A6;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .logo-icon {
            margin-right: 8px;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
            color: #FFFFFF;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #A1A1AA;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .btn-container {
            margin-top: 32px;
            margin-bottom: 32px;
            text-align: center;
          }
          .btn {
            display: inline-block;
            background-color: #14B8A6;
            color: #000000 !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 12px 32px;
            border-radius: 8px;
            transition: background-color 0.15s ease;
          }
          .btn:hover {
            background-color: #0D9488;
          }
          .link-fallback {
            font-size: 12px;
            color: #52525B;
            word-break: break-all;
            background-color: #161616;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #222222;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            margin-top: 30px;
          }
          .divider {
            height: 1px;
            background-color: #222222;
            margin: 32px 0;
          }
          .footer {
            font-size: 12px;
            color: #52525B;
            line-height: 1.5;
          }
          .footer a {
            color: #14B8A6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" class="logo-icon" style="display: inline-block; vertical-align: middle;">
              <path d="M14 2L14 10M14 10C14 10 8 14 8 18C8 22 11 26 14 26C17 26 20 22 20 18C20 14 14 10 14 10Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span style="vertical-align: middle; margin-left: 6px;">Rootly</span>
          </div>
          <h1>Verify your work email</h1>
          <p>Hello ${toName},</p>
          <p>Welcome to Rootly! Thank you for registering your company. Please verify your work email address to activate your workspace and complete your account setup.</p>
          
          <div class="btn-container">
            <a href="${verificationLink}" class="btn" target="_blank">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, copy and paste the link below into your browser:</p>
          <div class="link-fallback">
            ${verificationLink}
          </div>

          <div class="divider"></div>
          
          <div class="footer">
            <p style="margin-bottom: 8px;">This verification link will expire in 24 hours. If you did not sign up for Rootly, you can safely ignore this email.</p>
            <p style="margin-top: 0;">&copy; ${new Date().getFullYear()} Rootly Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      this.logger.log(`Dispatching verification email to ${toEmail} using Brevo...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: this.senderName,
            email: this.senderEmail,
          },
          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],
          subject: 'Verify your work email for Rootly',
          htmlContent: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Brevo email dispatch failed: Code ${response.status} - ${errorText}`);
        return false;
      }

      const resJson = await response.json();
      this.logger.log(`Verification email sent successfully. Brevo Message ID: ${resJson.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Exception during Brevo email dispatch: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendPasswordResetEmail(toEmail: string, toName: string, resetLink: string): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.error('Cannot send password reset email: BREVO_API_KEY is missing.');
      return false;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your Rootly Password</title>
        <style>
          body {
            background-color: #0A0A0A;
            color: #F1F1F1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 580px;
            margin: 40px auto;
            background-color: #111111;
            border: 1px solid #222222;
            border-radius: 12px;
            padding: 40px;
          }
          .logo {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            color: #14B8A6;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .logo-icon {
            margin-right: 8px;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 16px;
            color: #FFFFFF;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #A1A1AA;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .btn-container {
            margin-top: 32px;
            margin-bottom: 32px;
            text-align: center;
          }
          .btn {
            display: inline-block;
            background-color: #14B8A6;
            color: #000000 !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 12px 32px;
            border-radius: 8px;
            transition: background-color 0.15s ease;
          }
          .btn:hover {
            background-color: #0D9488;
          }
          .link-fallback {
            font-size: 12px;
            color: #52525B;
            word-break: break-all;
            background-color: #161616;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #222222;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            margin-top: 30px;
          }
          .divider {
            height: 1px;
            background-color: #222222;
            margin: 32px 0;
          }
          .footer {
            font-size: 12px;
            color: #52525B;
            line-height: 1.5;
          }
          .footer a {
            color: #14B8A6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" class="logo-icon" style="display: inline-block; vertical-align: middle;">
              <path d="M14 2L14 10M14 10C14 10 8 14 8 18C8 22 11 26 14 26C17 26 20 22 20 18C20 14 14 10 14 10Z" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span style="vertical-align: middle; margin-left: 6px;">Rootly</span>
          </div>
          <h1>Reset your password</h1>
          <p>Hello ${toName},</p>
          <p>We received a request to reset your password for your Rootly account. Click the button below to establish a secure recovery session and set a new password.</p>
          
          <div class="btn-container">
            <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your current password will remain secure.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <div class="link-fallback">
            ${resetLink}
          </div>

          <div class="divider"></div>
          
          <div class="footer">
            <p style="margin-bottom: 8px;">This password recovery link will expire in 2 hours.</p>
            <p style="margin-top: 0;">&copy; ${new Date().getFullYear()} Rootly Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      this.logger.log(`Dispatching password recovery email to ${toEmail} using Brevo...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: this.senderName,
            email: this.senderEmail,
          },
          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],
          subject: 'Reset your Rootly password',
          htmlContent: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Brevo email dispatch failed: Code ${response.status} - ${errorText}`);
        return false;
      }

      const resJson = await response.json();
      this.logger.log(`Password reset email sent successfully. Brevo Message ID: ${resJson.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Exception during Brevo email dispatch: ${error.message}`, error.stack);
      return false;
    }
  }
}
