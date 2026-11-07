-- ============================================================
-- CREW_STATE — estado en vivo del Crew IA para la oficina animada.
-- El motor de la oficina (public/oficina-crew) lee /api/crew-estado, que deriva
-- de esta tabla. El "puente" del kit = upsert en esta tabla (POST del API, admin).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crew_state (
  agent       TEXT PRIMARY KEY,
  estado      TEXT NOT NULL DEFAULT 'libre' CHECK (estado IN ('trabajando', 'listo', 'libre')),
  tarea       TEXT,
  accion      TEXT,
  dice        TEXT,
  dice_t      TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS crew_state_set_updated_at ON public.crew_state;
CREATE TRIGGER crew_state_set_updated_at
  BEFORE UPDATE ON public.crew_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.crew_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crew_state_read_public ON public.crew_state;
DROP POLICY IF EXISTS crew_state_admin_write ON public.crew_state;

-- Estado interno del Crew, no es data de cliente: lectura pública (para que la
-- oficina estática la lea sin sesión). Escritura solo admin.
CREATE POLICY crew_state_read_public ON public.crew_state
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY crew_state_admin_write ON public.crew_state
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed inicial (los 11 agentes del Crew; Santiago es humano, no lleva estado).
INSERT INTO public.crew_state (agent, estado, tarea, accion, dice, dice_t) VALUES
  ('Product Owner',   'trabajando', 'Priorizar el backlog',      'ordenando las historias del Sprint 2', NULL, NULL),
  ('Scrum Master',    'libre',      NULL,                        'disponible',                           NULL, NULL),
  ('Arquitecto',      'trabajando', 'Contrato de ejecuciones',   'escribiendo el ADR del webhook',       NULL, NULL),
  ('Seguridad',       'trabajando', 'Prueba negativa de RLS',    'revisando el aislamiento multi-tenant', NULL, NULL),
  ('DevOps',          'libre',      NULL,                        'disponible',                           NULL, NULL),
  ('AI & Automation', 'trabajando', 'Agente de Ventas IA',       'ajustando el prompt maestro',          NULL, NULL),
  ('Backend & APIs',  'listo',      NULL,                        'listo',       'Sync automations→office_agents aplicado ✅', NOW()),
  ('Frontend',        'trabajando', 'Oficina pixel del cliente', 'animando los sprites',                 NULL, NULL),
  ('UX/UI',           'libre',      NULL,                        'disponible',                           NULL, NULL),
  ('QA',              'trabajando', 'Suite E2E',                 'corriendo las pruebas críticas',       NULL, NULL),
  ('Delivery/CRM',    'trabajando', 'Onboarding de cliente',     'preparando el playbook',               NULL, NULL)
ON CONFLICT (agent) DO NOTHING;
