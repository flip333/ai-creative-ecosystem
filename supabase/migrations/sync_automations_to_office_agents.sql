-- ============================================================
-- SYNC automations -> office_agents (1:1, en tiempo real vía trigger)
-- Idempotente. Cada automatización real tiene un agente en la oficina.
-- Estado: activo->'active', pausa->'idle', error->'error'.
-- Layout determinista por cliente: orden (created_at, id), grilla de 4 columnas.
--   x = (idx % 4 - 1.5) * 3 ; y = 0 ; z = floor(idx / 4) * 3
-- ============================================================

-- 1. Vínculo 1:1 ------------------------------------------------
ALTER TABLE public.office_agents
  ADD COLUMN IF NOT EXISTS automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS office_agents_automation_id_key
  ON public.office_agents (automation_id);

-- 2. Mapeo de estado -------------------------------------------
CREATE OR REPLACE FUNCTION public.automation_status_to_agent_status(s TEXT)
RETURNS TEXT
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE s
    WHEN 'activo' THEN 'active'
    WHEN 'error'  THEN 'error'
    ELSE 'idle'
  END;
$$;

-- 3. Re-layout determinista de un cliente -----------------------
CREATE OR REPLACE FUNCTION public.relayout_office_agents(p_client_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.office_agents oa
  SET position_x = ((r.idx % 4) - 1.5) * 3,
      position_y = 0,
      position_z = floor(r.idx / 4.0) * 3
  FROM (
    SELECT oa2.id AS agent_id,
           (row_number() OVER (ORDER BY a.created_at, a.id) - 1) AS idx
    FROM public.office_agents oa2
    JOIN public.automations a ON a.id = oa2.automation_id
    WHERE oa2.client_id = p_client_id
  ) r
  WHERE oa.id = r.agent_id
    AND (oa.position_x, oa.position_y, oa.position_z)
        IS DISTINCT FROM (((r.idx % 4) - 1.5) * 3, 0::numeric, floor(r.idx / 4.0) * 3);
$$;

-- 4. Función del trigger ---------------------------------------
CREATE OR REPLACE FUNCTION public.sync_automation_to_office_agent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.office_agents WHERE automation_id = OLD.id;
    PERFORM public.relayout_office_agents(OLD.client_id);
    RETURN OLD;
  END IF;

  INSERT INTO public.office_agents (client_id, automation_id, name, status)
  VALUES (NEW.client_id, NEW.id, NEW.name,
          public.automation_status_to_agent_status(NEW.status))
  ON CONFLICT (automation_id) DO UPDATE
    SET client_id = EXCLUDED.client_id,
        name      = EXCLUDED.name,
        status    = EXCLUDED.status;

  PERFORM public.relayout_office_agents(NEW.client_id);
  IF TG_OP = 'UPDATE' AND OLD.client_id IS DISTINCT FROM NEW.client_id THEN
    PERFORM public.relayout_office_agents(OLD.client_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS automations_sync_office_agent ON public.automations;
CREATE TRIGGER automations_sync_office_agent
  AFTER INSERT OR UPDATE OR DELETE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION public.sync_automation_to_office_agent();

-- 5. BACKFILL idempotente --------------------------------------
-- Agentes sembrados a mano (sin automation_id) de clientes que ya tienen
-- automatizaciones: se eliminan para no duplicar.
DELETE FROM public.office_agents
WHERE automation_id IS NULL
  AND client_id IN (SELECT DISTINCT client_id FROM public.automations);

INSERT INTO public.office_agents (client_id, automation_id, name, status)
SELECT a.client_id, a.id, a.name, public.automation_status_to_agent_status(a.status)
FROM public.automations a
ON CONFLICT (automation_id) DO UPDATE
  SET client_id = EXCLUDED.client_id,
      name      = EXCLUDED.name,
      status    = EXCLUDED.status;

DO $$
DECLARE c UUID;
BEGIN
  FOR c IN SELECT DISTINCT client_id FROM public.automations LOOP
    PERFORM public.relayout_office_agents(c);
  END LOOP;
END $$;
