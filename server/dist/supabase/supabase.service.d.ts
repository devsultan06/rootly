import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private readonly logger;
    private supabaseClient;
    private supabaseAdminClient;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getAdminClient(): SupabaseClient;
}
