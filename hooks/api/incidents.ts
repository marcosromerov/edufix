import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  type IncidentsQuery,
  type CreateIncidentPayload,
  type UpdateIncidentPayload,
} from "../../lib/api/endpoints";

export const incidentsKeys = {
  all: ["incidents"] as const,
  list: (q: IncidentsQuery) => ["incidents", "list", q] as const,
  detail: (id: string) => ["incidents", "detail", id] as const,
};

export function useIncidents(q: IncidentsQuery = {}) {
  return useQuery({
    queryKey: incidentsKeys.list(q),
    queryFn: () => listIncidents(q),
    // Mantener las listas al día: recargar al entrar a la pantalla y
    // refrescar cada pocos segundos para que las incidencias nuevas aparezcan
    // apenas se crean (útil en el panel del jefe).
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: 5000,
  });
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: incidentsKeys.detail(id ?? ""),
    queryFn: () => getIncident(id!),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIncidentPayload) => createIncident(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: incidentsKeys.all });
    },
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateIncidentPayload }) =>
      updateIncident(vars.id, vars.payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: incidentsKeys.all });
      qc.setQueryData(incidentsKeys.detail(data.id), data);
    },
  });
}

export function useDeleteIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIncident(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: incidentsKeys.all });
      qc.removeQueries({ queryKey: incidentsKeys.detail(id) });
    },
  });
}
