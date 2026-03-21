"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC();
  const { data: workflows } = useSuspenseQuery(trpc.getWorkflows.queryOptions());

  return <div>client components: {JSON.stringify(workflows)}</div>;
};
