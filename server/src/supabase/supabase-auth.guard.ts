import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private jwtSecret: string | undefined;

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    // 1. Try local verification (Fast Path, < 1ms)
    if (this.jwtSecret && this.jwtSecret !== 'your-jwt-secret-from-api-settings') {
      try {
        const decodedUser = jwt.verify(token, this.jwtSecret);
        request.user = decodedUser;
        return true;
      } catch (err) {
        // Fall through to remote check if verification fails
      }
    }

    // 2. Fallback to Supabase API check (Slow Path, 50-200ms)
    try {
      const supabase = this.supabaseService.getClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired authentication token');
      }

      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
