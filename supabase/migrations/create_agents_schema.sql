-- ============================================================
-- OFFICE AGENTS — agentes posicionados de la oficina multicliente
-- Idempotente. Ejecutar en Supabase (SQL Editor) o vía CLI.
-- ============================================================
-- Nota de adaptación: el spec original proponía la política
--   USING (auth.jwt() ->> 'client_id' = client_id::text)
-- pero esta app NO usa un claim 'client_id' en el JWT. La tenencia es por
-- usuario autenticado: client_id = auth.uid() (= public.profiles.id). Se
-- adapta la RLS a ese modelo para ser consistente con el resto del esquema.
-- ============================================================

-- Trigger reutilizable de updated_at ---------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabla --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.office_agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'error')),
  position_x  NUMERIC NOT NULL DEFAULT 0,
  position_y  NUMERIC NOT NULL DEFAULT 0,
  position_z  NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS office_agents_client_id_idx ON public.office_agents (client_id);

-- Trigger de updated_at automático
DROP TRIGGER IF EXISTS office_agents_set_updated_at ON public.office_agents;
CREATE TRIGGER office_agents_set_updated_at
  BEFORE UPDATE ON public.office_agents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Realtime necesita la fila anterior completa en UPDATE/DELETE para filtrar
ALTER TABLE public.office_agents REPLICA IDENTITY FULL;

-- ============================================================
-- ROW LEVEL SECURITY — cada cliente solo ve y edita sus agentes
-- ============================================================
ALTER TABLE public.office_agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "office_agents_select_own" ON public.office_agents;
DROP POLICY IF EXISTS "office_agents_insert_own" ON public.office_agents;
DROP POLICY IF EXISTS "office_agents_update_own" ON public.office_agents;
DROP POLICY IF EXISTS "office_agents_delete_own" ON public.office_agents;
DROP POLICY IF EXISTS "office_agents_admin_all"  ON public.office_agents;

CREATE POLICY "office_agents_select_own" ON public.office_agents
  FOR SELECT TO authenticated USING (client_id = auth.uid());

CREATE POLICY "office_agents_insert_own" ON public.office_agents
  FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());

CREATE POLICY "office_agents_update_own" ON public.office_agents
  FOR UPDATE TO authenticated USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());

CREATE POLICY "office_agents_delete_own" ON public.office_agents
  FOR DELETE TO authenticated USING (client_id = auth.uid());

-- El admin (consultor Genflow) puede gestionar los agentes de cualquier cliente,
-- consistente con el resto de tablas (usa public.is_admin()).
CREATE POLICY "office_agents_admin_all" ON public.office_agents
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- REALTIME — publicar la tabla (idempotente)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'office_agents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.office_agents;
  END IF;
END $$;
