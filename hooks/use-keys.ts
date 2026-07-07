"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createKey, fetchKeys, updateKey } from "@/lib/api";
import type { CreateKeyInput, UpdateKeyInput } from "@/lib/types";

const KEYS_QUERY = ["keys"];

export function useKeys() {
  return useQuery({
    queryKey: KEYS_QUERY,
    queryFn: fetchKeys,
    refetchInterval: 5000, // live spend updates
  });
}

export function useCreateKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateKeyInput) => createKey(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY }),
  });
}

export function useUpdateKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateKeyInput }) =>
      updateKey(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY }),
  });
}
