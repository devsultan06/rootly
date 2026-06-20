import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
export declare class SupabaseAuthGuard implements CanActivate {
    private supabaseService;
    private configService;
    private jwtSecret;
    constructor(supabaseService: SupabaseService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
