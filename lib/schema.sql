-- ============================================================
-- GENFLOW CLIENT PORTAL — DATABASE SCHEMA
-- ============================================================
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- 1. PROFILES TABLE
-- Linked to Supabase Auth users. Stores client/admin metadata.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  name         TEXT,
  company      TEXT,
  plan         TEXT NOT NULL DEFAULT 'Genflow Core',
  avatar_initials TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-populate profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. AUTOMATIONS TABLE
CREATE TABLE IF NOT EXISTS public.automations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  stack             TEXT,
  area              TEXT CHECK (area IN ('marketing', 'ventas', 'operaciones', 'soporte')),
  status            TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'pausa', 'error')),
  monthly_cost      NUMERIC(10, 2) DEFAULT 0,
  kpi_result        TEXT,
  documentation_url TEXT,
  spark_points      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 3. AUTOMATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id   UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  status          TEXT NOT NULL CHECK (status IN ('success', 'error')),
  message         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. BILLING RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.billing_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_name    TEXT NOT NULL,
  service_type    TEXT,
  monthly_cost    NUMERIC(10, 2) DEFAULT 0,
  billing_month   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto', 'progreso', 'resuelto')),
  priority    TEXT NOT NULL DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets  ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- AUTOMATIONS
CREATE POLICY "Clients can view own automations"
  ON public.automations FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can manage all automations"
  ON public.automations FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- AUTOMATION LOGS
CREATE POLICY "Clients can view own logs"
  ON public.automation_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.automations WHERE id = automation_id AND client_id = auth.uid()));

CREATE POLICY "Admins can manage all logs"
  ON public.automation_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- BILLING RECORDS
CREATE POLICY "Clients can view own billing"
  ON public.billing_records FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can manage all billing"
  ON public.billing_records FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- SUPPORT TICKETS
CREATE POLICY "Clients can manage own tickets"
  ON public.support_tickets FOR ALL USING (client_id = auth.uid());

CREATE POLICY "Admins can manage all tickets"
  ON public.support_tickets FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- POST-SETUP: Grant your first admin account
-- Run after creating your user in Supabase Auth:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-uuid>';
-- ============================================================
