-- ============================================================
-- GENFLOW CLIENT PORTAL — DATABASE SCHEMA
-- ============================================================
-- Idempotente: se puede re-ejecutar sin romper nada.
-- Ejecutar en Supabase → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- Vinculada a auth.users. Guarda metadata de cliente/admin.
-- `email` se duplica aquí porque el cliente JS no puede leer
-- auth.users; el CRM de admin necesita listar correos.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  role            TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  name            TEXT,
  company         TEXT,
  plan            TEXT NOT NULL DEFAULT 'Genflow Core',
  status          TEXT NOT NULL DEFAULT 'onboarding' CHECK (status IN ('activo', 'onboarding', 'pausado')),
  avatar_initials TEXT,
  -- KPIs mostrados en /portal/home, editables por el admin
  kpi_roi         TEXT DEFAULT 'En proceso',
  kpi_leads       INTEGER DEFAULT 0,
  kpi_hours       INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Columnas añadidas después de la primera versión del esquema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status    TEXT NOT NULL DEFAULT 'onboarding';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kpi_roi   TEXT DEFAULT 'En proceso';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kpi_leads INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kpi_hours INTEGER DEFAULT 0;


-- Iniciales del avatar a partir del nombre ("Camila Arango" → "CA")
CREATE OR REPLACE FUNCTION public.compute_initials(full_name TEXT)
RETURNS TEXT AS $$
  SELECT UPPER(
    COALESCE(
      SUBSTRING(SPLIT_PART(full_name, ' ', 1) FROM 1 FOR 1) ||
      SUBSTRING(SPLIT_PART(full_name, ' ', 2) FROM 1 FOR 1),
      SUBSTRING(full_name FROM 1 FOR 2)
    )
  );
$$ LANGUAGE sql IMMUTABLE;


-- Crea el perfil automáticamente al registrar un usuario en Auth.
-- Lee name/company/role de raw_user_meta_data (lo que envía inviteUserByEmail).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);

  INSERT INTO public.profiles (id, email, name, company, role, plan, status, avatar_initials)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    NEW.raw_user_meta_data->>'company',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'plan', 'Genflow Core'),
    'onboarding',
    public.compute_initials(v_name)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- 2. AUTOMATIONS
-- ============================================================
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
  -- Pipeline del drawer: [{"icon":"UserPlus","label":"Trigger: Nuevo Lead"}, ...]
  -- `icon` es el nombre de un icono de lucide-react, resuelto en el cliente.
  nodes             JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.automations ADD COLUMN IF NOT EXISTS nodes JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS automations_client_id_idx ON public.automations (client_id);


-- ============================================================
-- 3. AUTOMATION LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  status        TEXT NOT NULL CHECK (status IN ('success', 'error')),
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS automation_logs_automation_id_idx
  ON public.automation_logs (automation_id, created_at DESC);


-- ============================================================
-- 4. BILLING RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.billing_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_name  TEXT NOT NULL,
  service_type  TEXT,
  monthly_cost  NUMERIC(10, 2) DEFAULT 0,
  billing_month TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS billing_records_client_id_idx ON public.billing_records (client_id);


-- ============================================================
-- 5. SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto', 'progreso', 'resuelto')),
  priority    TEXT NOT NULL DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
  admin_reply TEXT,
  replied_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS replied_at  TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS support_tickets_client_id_idx ON public.support_tickets (client_id);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- IMPORTANTE: is_admin() es SECURITY DEFINER a propósito.
-- Una política sobre `profiles` que hiciera SELECT sobre `profiles`
-- se evalúa a sí misma → Postgres aborta con
-- "42P17: infinite recursion detected in policy for relation profiles".
-- SECURITY DEFINER corre como el dueño de la función y salta RLS,
-- rompiendo el ciclo. `search_path` fijo evita secuestro por schema.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas para que el script sea re-ejecutable
DROP POLICY IF EXISTS "Users can view own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"      ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"      ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own"               ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"               ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"                ON public.profiles;

DROP POLICY IF EXISTS "Clients can view own automations"  ON public.automations;
DROP POLICY IF EXISTS "Admins can manage all automations" ON public.automations;
DROP POLICY IF EXISTS "automations_select_own"            ON public.automations;
DROP POLICY IF EXISTS "automations_admin_all"             ON public.automations;

DROP POLICY IF EXISTS "Clients can view own logs"         ON public.automation_logs;
DROP POLICY IF EXISTS "Admins can manage all logs"        ON public.automation_logs;
DROP POLICY IF EXISTS "logs_select_own"                   ON public.automation_logs;
DROP POLICY IF EXISTS "logs_admin_all"                    ON public.automation_logs;

DROP POLICY IF EXISTS "Clients can view own billing"      ON public.billing_records;
DROP POLICY IF EXISTS "Admins can manage all billing"     ON public.billing_records;
DROP POLICY IF EXISTS "billing_select_own"                ON public.billing_records;
DROP POLICY IF EXISTS "billing_admin_all"                 ON public.billing_records;

DROP POLICY IF EXISTS "Clients can manage own tickets"    ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can manage all tickets"     ON public.support_tickets;
DROP POLICY IF EXISTS "tickets_select_own"                ON public.support_tickets;
DROP POLICY IF EXISTS "tickets_insert_own"                ON public.support_tickets;
DROP POLICY IF EXISTS "tickets_admin_all"                 ON public.support_tickets;


-- PROFILES ---------------------------------------------------
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- AUTOMATIONS ------------------------------------------------
CREATE POLICY "automations_select_own" ON public.automations
  FOR SELECT TO authenticated USING (client_id = auth.uid());

CREATE POLICY "automations_admin_all" ON public.automations
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- AUTOMATION LOGS --------------------------------------------
CREATE POLICY "logs_select_own" ON public.automation_logs
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.automations a
      WHERE a.id = automation_id AND a.client_id = auth.uid()
    )
  );

CREATE POLICY "logs_admin_all" ON public.automation_logs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BILLING ----------------------------------------------------
CREATE POLICY "billing_select_own" ON public.billing_records
  FOR SELECT TO authenticated USING (client_id = auth.uid());

CREATE POLICY "billing_admin_all" ON public.billing_records
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SUPPORT TICKETS --------------------------------------------
-- El cliente puede leer y crear los suyos, pero NO cambiar el estado
-- ni escribir admin_reply: no hay política UPDATE para el cliente.
CREATE POLICY "tickets_select_own" ON public.support_tickets
  FOR SELECT TO authenticated USING (client_id = auth.uid());

CREATE POLICY "tickets_insert_own" ON public.support_tickets
  FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());

CREATE POLICY "tickets_admin_all" ON public.support_tickets
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ============================================================
-- POST-SETUP
-- ============================================================
-- 1) Crea tu usuario en Authentication → Users (o vía la app).
-- 2) Conviértelo en admin:
--      UPDATE public.profiles SET role = 'admin' WHERE email = 'tu@correo.com';
-- 3) Rellena el email de perfiles creados antes de añadir la columna:
--      UPDATE public.profiles p SET email = u.email
--      FROM auth.users u WHERE u.id = p.id AND p.email IS NULL;
-- ============================================================
