import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ scope: Scope.DEFAULT })
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided!');
      throw new Error('Supabase configuration missing');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (serviceRoleKey) {
      this.supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      this.logger.log('Supabase admin client initialized successfully.');
    } else {
      this.logger.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fail.');
    }

    this.logger.log('Supabase client initialized successfully.');
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  getAdminClient(): SupabaseClient {
    if (!this.supabaseAdminClient) {
      this.logger.error('Attempted to access getAdminClient() but SUPABASE_SERVICE_ROLE_KEY is not configured.');
      throw new Error('Supabase admin client configuration missing');
    }
    return this.supabaseAdminClient;
  }
}

