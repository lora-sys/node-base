import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActivateSubscription = () => {
  const { data: custemerState, isLoading, ...rest } = useSubscription();
  const hasActivateSubscription =
    custemerState?.activeSubscriptions &&
    custemerState.activeSubscriptions.length > 0;

  return {
    hasActivateSubscription,
    subscription: custemerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
