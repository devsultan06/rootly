# Supabase Authentication Setup for NestJS

This folder contains a fully initialized NestJS backend server integrated with **Supabase Authentication**.

## How It Works

1. **Token Extraction:** The [SupabaseAuthGuard](file:///Users/devsultan/Desktop/rootly/server/src/supabase/supabase-auth.guard.ts) intercepts requests and extracts the `Authorization: Bearer <JWT_TOKEN>` header sent from the frontend.
2. **Token Verification:** The guard uses the global [SupabaseService](file:///Users/devsultan/Desktop/rootly/server/src/supabase/supabase.service.ts) to verify the token signature directly via Supabase's API using `supabase.auth.getUser(token)`.
3. **User Decoration:** Once verified, the user object is attached to the request context. Controllers can inject the `@CurrentUser()` decorator to access user fields.

---

## Folder Structure

- [src/supabase/supabase.module.ts](file:///Users/devsultan/Desktop/rootly/server/src/supabase/supabase.module.ts) — Global NestJS Module wrapper.
- [src/supabase/supabase.service.ts](file:///Users/devsultan/Desktop/rootly/server/src/supabase/supabase.service.ts) — Initializer service for the Supabase JS Client.
- [src/supabase/supabase-auth.guard.ts](file:///Users/devsultan/Desktop/rootly/server/src/supabase/supabase-auth.guard.ts) — Route guard validating bearer tokens.
- [src/supabase/current-user.decorator.ts](file:///Users/devsultan/Desktop/rootly/server/src/supabase/current-user.decorator.ts) — Custom decorator to extract requesting users.
- [src/app.module.ts](file:///Users/devsultan/Desktop/rootly/server/src/app.module.ts) — Main module loading `.env` variables via `ConfigModule`.
- [src/app.controller.ts](file:///Users/devsultan/Desktop/rootly/server/src/app.controller.ts) — Sample controller featuring a protected route (`/profile`).

---

## Configuration

Add your project settings to the local [.env](file:///Users/devsultan/Desktop/rootly/server/.env) file:

```env
PORT=4000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-project-anon-key
SUPABASE_JWT_SECRET=your-project-jwt-secret
```

---

## Verification & Usage

### 1. Run the Server
```bash
npm run start:dev
```

### 2. Make an Authenticated Request
Include the user access token in request headers:
```bash
curl -H "Authorization: Bearer <SUPABASE_USER_JWT>" http://localhost:4000/profile
```
