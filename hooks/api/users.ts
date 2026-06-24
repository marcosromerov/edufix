import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listTeam,
  listUsers,
  listPendingOperarios,
  approveOperario,
  rejectOperario,
  updateMe,
} from "../../lib/api/endpoints";
import type { Role } from "../../data/types";
import { session } from "../useSession";

export function useTeam() {
  return useQuery({
    queryKey: ["users", "team"],
    queryFn: listTeam,
  });
}

export function useUsers(role?: Role) {
  return useQuery({
    queryKey: ["users", "list", role],
    queryFn: () => listUsers(role),
  });
}

export function usePendingOperarios() {
  return useQuery({
    queryKey: ["users", "pending"],
    queryFn: listPendingOperarios,
  });
}

export function useApproveOperario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveOperario(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRejectOperario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectOperario(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      session.updateLocalUser(user);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
