'use client';

import { useEffect, useState } from 'react';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { OfficeAgent } from '@/lib/types';

export type AgentsConnection = 'loading' | 'connected' | 'error';

/**
 * Suscripción en tiempo real a los agentes de la oficina del cliente actual.
 *
 * - La tenencia es por usuario autenticado: filtra estrictamente por
 *   `client_id = auth.uid()` (RLS en Postgres hace de última barrera).
 * - Hace un fetch inicial y luego escucha INSERT/UPDATE/DELETE vía
 *   `supabase.channel()` con filtro de postgres_changes.
 * - Devuelve la lista de agentes y el estado de la conexión de red.
 */
export function useSupabaseAgents() {
  const [agents, setAgents] = useState<OfficeAgent[]>([]);
  const [connection, setConnection] = useState<AgentsConnection>('loading');

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let active = true;

    const applyChange = (payload: RealtimePostgresChangesPayload<OfficeAgent>) => {
      setAgents((prev) => {
        if (payload.eventType === 'INSERT') {
          const row = payload.new as OfficeAgent;
          return prev.some((a) => a.id === row.id) ? prev : [...prev, row];
        }
        if (payload.eventType === 'UPDATE') {
          const row = payload.new as OfficeAgent;
          return prev.map((a) => (a.id === row.id ? row : a));
        }
        if (payload.eventType === 'DELETE') {
          const oldRow = payload.old as Partial<OfficeAgent>;
          return prev.filter((a) => a.id !== oldRow.id);
        }
        return prev;
      });
    };

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const clientId = auth.user?.id;
      if (!active) return;
      if (!clientId) { setConnection('error'); return; }

      // Fetch inicial
      const { data, error } = await supabase
        .from('office_agents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (!active) return;
      if (error) { setConnection('error'); return; }
      setAgents((data ?? []) as OfficeAgent[]);

      // Suscripción en tiempo real, filtrada por el cliente de la sesión
      channel = supabase
        .channel(`office_agents:${clientId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'office_agents', filter: `client_id=eq.${clientId}` },
          (payload) => applyChange(payload as RealtimePostgresChangesPayload<OfficeAgent>),
        )
        .subscribe((status) => {
          if (!active) return;
          if (status === 'SUBSCRIBED') setConnection('connected');
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setConnection('error');
        });
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { agents, connection };
}
