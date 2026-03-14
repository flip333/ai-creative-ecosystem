-- Database Schema for Genflow Platform

-- Tables for Leads (Origin OS)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company TEXT,
    industry TEXT,
    status TEXT DEFAULT 'new', -- new, enriched, qualified, converted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables for Video Projects (Vivid Synthesis)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- References Auth.users
    name TEXT NOT NULL,
    type TEXT, -- avatar, synthesis, b-roll
    status TEXT DEFAULT 'draft', -- draft, processing, completed
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables for Synergy AI (Collaboration)
CREATE TABLE IF NOT EXISTS workspace_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name TEXT,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consensus_met BOOLEAN DEFAULT FALSE,
    sync_data JSONB
);

-- Real-time channels are handled by Supabase automatically, 
-- but we can enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_sync ENABLE ROW LEVEL SECURITY;
