-- ============================================================
-- GENFLOW — DATOS DEMO
-- ============================================================
-- Opcional. Rellena un cliente con flujos, logs, costos y tickets
-- para poder ver el portal con contenido real.
--
-- Requisito: el cliente ya debe existir en Authentication → Users
-- (invítalo desde /admin/clients o desde el dashboard de Supabase).
--
-- Cambia este correo por el del cliente a poblar:
-- ============================================================

DO $$
DECLARE
  v_client   UUID;
  v_flow_1   UUID;
  v_flow_2   UUID;
  v_flow_3   UUID;
  v_email    TEXT := 'demo@genflow.ai';   -- ← EDITA ESTO
BEGIN
  SELECT id INTO v_client FROM public.profiles WHERE email = v_email;

  IF v_client IS NULL THEN
    RAISE EXCEPTION 'No existe un perfil con email %. Invita al cliente primero.', v_email;
  END IF;

  -- Idempotencia: limpiar datos demo previos de este cliente
  DELETE FROM public.automations    WHERE client_id = v_client;
  DELETE FROM public.billing_records WHERE client_id = v_client;
  DELETE FROM public.support_tickets WHERE client_id = v_client;

  UPDATE public.profiles
  SET status = 'activo', kpi_roi = '+320%', kpi_leads = 214, kpi_hours = 86
  WHERE id = v_client;

  -- ── Automatizaciones ─────────────────────────────────────
  INSERT INTO public.automations
    (client_id, name, stack, area, status, monthly_cost, kpi_result, documentation_url, spark_points, nodes)
  VALUES (
    v_client, 'Secuencia Onboarding Clientes', 'N8N + GoHighLevel', 'ventas', 'activo',
    15.00, '+45 Leads', 'https://docs.genflow.ai/onboarding-clientes',
    '0,18 10,14 20,15 30,9 40,10 50,4 60,3',
    '[{"icon":"UserPlus","label":"Trigger: Nuevo Lead"},
      {"icon":"Database","label":"CRM Sync"},
      {"icon":"Bot","label":"Enriquecimiento IA"},
      {"icon":"Mail","label":"Secuencia Email"}]'::jsonb
  ) RETURNING id INTO v_flow_1;

  INSERT INTO public.automations
    (client_id, name, stack, area, status, monthly_cost, kpi_result, documentation_url, spark_points, nodes)
  VALUES (
    v_client, 'Generador de Contenido IA', 'Vivid Synthesis + OpenAI', 'marketing', 'activo',
    42.30, '128 piezas', 'https://docs.genflow.ai/vivid-synthesis',
    '0,10 10,12 20,8 30,11 40,6 50,7 60,3',
    '[{"icon":"Calendar","label":"Trigger: Calendario"},
      {"icon":"Brain","label":"Generación GPT-4"},
      {"icon":"ImageIcon","label":"Render Visual"},
      {"icon":"CheckCircle","label":"Revisión Humana"}]'::jsonb
  ) RETURNING id INTO v_flow_2;

  INSERT INTO public.automations
    (client_id, name, stack, area, status, monthly_cost, kpi_result, documentation_url, spark_points, nodes)
  VALUES (
    v_client, 'Recuperación de Carritos', 'Shopify + Klaviyo', 'marketing', 'error',
    22.00, '-3 fallos', 'https://docs.genflow.ai/cart-recovery',
    '0,4 10,6 20,5 30,10 40,14 50,18 60,20',
    '[{"icon":"ShoppingCart","label":"Trigger: Carrito"},
      {"icon":"Clock","label":"Espera 1h"},
      {"icon":"Mail","label":"Envío Klaviyo"},
      {"icon":"AlertTriangle","label":"Webhook (Error)"}]'::jsonb
  ) RETURNING id INTO v_flow_3;

  INSERT INTO public.automations
    (client_id, name, stack, area, status, monthly_cost, kpi_result, documentation_url, spark_points, nodes)
  VALUES
    (v_client, 'Calificación de Leads (Scoring)', 'N8N + HubSpot', 'ventas', 'pausa',
     8.00, '12h ahorradas', 'https://docs.genflow.ai/lead-scoring',
     '0,6 10,7 20,9 30,9 40,9 50,9 60,9',
     '[{"icon":"Database","label":"Trigger: HubSpot"},
       {"icon":"Layers","label":"Reglas de Scoring"},
       {"icon":"Tag","label":"Etiquetado Auto."}]'::jsonb),
    (v_client, 'Reporte Semanal Ejecutivo', 'Synergy AI + Slack', 'operaciones', 'activo',
     5.50, '6h ahorradas', 'https://docs.genflow.ai/reporte-ejecutivo',
     '0,12 10,10 20,11 30,7 40,8 50,5 60,4',
     '[{"icon":"Calendar","label":"Trigger: Lunes 8am"},
       {"icon":"BarChart2","label":"Consolidación Datos"},
       {"icon":"Send","label":"Envío a Slack"}]'::jsonb);

  -- ── Logs de ejecución (relativos a NOW para que las fechas se vean vivas)
  INSERT INTO public.automation_logs (automation_id, status, message, created_at) VALUES
    (v_flow_1, 'success', 'Ejecución completada — 12 contactos procesados', NOW() - INTERVAL '3 hours'),
    (v_flow_1, 'success', 'Ejecución completada — 8 contactos procesados',  NOW() - INTERVAL '9 hours'),
    (v_flow_1, 'success', 'Ejecución completada — 15 contactos procesados', NOW() - INTERVAL '1 day'),
    (v_flow_1, 'error',   'Error de timeout en API de GoHighLevel',         NOW() - INTERVAL '2 days'),

    (v_flow_2, 'success', '12 piezas generadas para Instagram', NOW() - INTERVAL '8 hours'),
    (v_flow_2, 'success', '6 piezas generadas para LinkedIn',   NOW() - INTERVAL '1 day'),
    (v_flow_2, 'error',   'Fallo de cuota en API de OpenAI',    NOW() - INTERVAL '5 days'),

    (v_flow_3, 'error',   'Error de autenticación con Klaviyo',     NOW() - INTERVAL '30 minutes'),
    (v_flow_3, 'error',   'Error de autenticación con Klaviyo',     NOW() - INTERVAL '2 hours'),
    (v_flow_3, 'success', 'Ejecución completada — 22 carritos',     NOW() - INTERVAL '1 day');

  -- ── Facturación ──────────────────────────────────────────
  INSERT INTO public.billing_records (client_id, service_name, service_type, monthly_cost, billing_month) VALUES
    (v_client, 'GoHighLevel API & Usage',        'API / Herramienta', 15.00,  TO_CHAR(NOW(), 'YYYY-MM')),
    (v_client, 'OpenAI Token Usage (GPT-4o)',    'Consumo Token',     42.30,  TO_CHAR(NOW(), 'YYYY-MM')),
    (v_client, 'HubSpot Integration Token',      'API / Herramienta', 8.00,   TO_CHAR(NOW(), 'YYYY-MM')),
    (v_client, 'Klaviyo Email API',              'API / Herramienta', 22.00,  TO_CHAR(NOW(), 'YYYY-MM')),
    (v_client, 'Slack Bot Webhooks',             'API / Herramienta', 5.50,   TO_CHAR(NOW(), 'YYYY-MM')),
    (v_client, 'Gestión y Soporte Genflow 1:1',  'Servicio Genflow',  120.00, TO_CHAR(NOW(), 'YYYY-MM'));

  -- ── Tickets ──────────────────────────────────────────────
  INSERT INTO public.support_tickets (client_id, subject, message, status, priority, created_at) VALUES
    (v_client, 'Error recurrente en Recuperación de Carritos',
     'El webhook de Klaviyo está fallando con código 401. Adjunto logs del sistema.',
     'abierto', 'Alta', NOW() - INTERVAL '2 days'),
    (v_client, 'Ajustar horario de la Secuencia Onboarding',
     'Necesito que el flujo se ejecute a las 10am en lugar de las 8am por zona horaria del equipo.',
     'progreso', 'Media', NOW() - INTERVAL '4 days'),
    (v_client, 'Duda sobre facturación de OpenAI',
     'Quiero entender cómo se calculan los costos de tokens en el reporte mensual.',
     'resuelto', 'Media', NOW() - INTERVAL '11 days');

  RAISE NOTICE 'Datos demo cargados para % (%)', v_email, v_client;
END $$;
