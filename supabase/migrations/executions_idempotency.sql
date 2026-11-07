-- E3: idempotencia para el webhook de ejecuciones (/api/v1/executions).
-- external_id lo aporta el runtime (n8n/Make/...). UNIQUE admite multiples NULL.
ALTER TABLE public.automation_logs ADD COLUMN IF NOT EXISTS external_id text;

CREATE UNIQUE INDEX IF NOT EXISTS automation_logs_external_id_key
  ON public.automation_logs (external_id);
