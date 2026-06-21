-- 1. Create Workspaces Table (Tenants)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- 2. Create Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Workspace Members Table (Many-to-Many with Custom Roles)
CREATE TABLE public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) DEFAULT 'Member' NOT NULL, -- Admin, Member, Viewer, or custom role names
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, invited
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, profile_id)
);

-- Enable RLS on Workspace Members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- ── DUMMY RLS POLICIES FOR DEVELOPMENT ──
CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public read access to workspaces" ON public.workspaces
    FOR SELECT USING (true);

CREATE POLICY "Allow workspace admins to update workspace details" ON public.workspaces
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = id 
              AND workspace_members.profile_id = auth.uid()
              AND workspace_members.role = 'Admin'
        )
    );

CREATE POLICY "Allow users to view their own workspace memberships" ON public.workspace_members
    FOR SELECT USING (auth.uid() = profile_id);


-- ── SUPABASE AUTH TRIGGER ──
-- Automate profile creation on User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'New Developer'),
        new.email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution link
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Create Integrations Table
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'github'
    credentials JSONB NOT NULL,    -- Encrypted tokens/PATs
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow workspace members to view integrations" ON public.integrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = integrations.workspace_id
              AND workspace_members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Allow workspace members to insert/update integrations" ON public.integrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = integrations.workspace_id
              AND workspace_members.profile_id = auth.uid()
              AND workspace_members.role = 'Admin'
        )
    );

-- 5. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'on_track' NOT NULL, -- 'on_track', 'at_risk', 'behind'
    github_repo VARCHAR(255), -- e.g. "facebook/react"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow workspace members to view projects" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
              AND workspace_members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Allow workspace members to insert/update projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
              AND workspace_members.profile_id = auth.uid()
              AND workspace_members.role = 'Admin'
        )
    );

-- 6. Create Commits Table
CREATE TABLE IF NOT EXISTS public.commits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    hash VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, hash)
);

ALTER TABLE public.commits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow workspace members to view commits" ON public.commits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects
            JOIN public.workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = commits.project_id
              AND workspace_members.profile_id = auth.uid()
        )
    );

