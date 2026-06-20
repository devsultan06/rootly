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
var SupabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = SupabaseService_1 = class SupabaseService {
    configService;
    logger = new common_1.Logger(SupabaseService_1.name);
    supabaseClient;
    supabaseAdminClient;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_ANON_KEY');
        const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided!');
            throw new Error('Supabase configuration missing');
        }
        this.supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
        if (serviceRoleKey) {
            this.supabaseAdminClient = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            });
            this.logger.log('Supabase admin client initialized successfully.');
        }
        else {
            this.logger.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fail.');
        }
        this.logger.log('Supabase client initialized successfully.');
    }
    getClient() {
        return this.supabaseClient;
    }
    getAdminClient() {
        if (!this.supabaseAdminClient) {
            this.logger.error('Attempted to access getAdminClient() but SUPABASE_SERVICE_ROLE_KEY is not configured.');
            throw new Error('Supabase admin client configuration missing');
        }
        return this.supabaseAdminClient;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = SupabaseService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map