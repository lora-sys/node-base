"use client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { SignOutButton } from "./components/sign-out-button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data } = useQuery(trpc.workflows.getMany.queryOptions({ page: 1, pageSize: 10, search: "" }));
	const create = useMutation(
		trpc.workflows.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.workflows.getMany.queryOptions({ page: 1, pageSize: 10, search: "" }).queryKey,
				});
				toast.success("Workflow created");
			},
		}),
	);
	return (
		<div className="container mx-auto p-8 ">
			<div className="mb-8">
				<h1 className="text-2xl font-bold mb-4">Protected Server Components</h1>
				<pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto">
					{JSON.stringify(data, null, 2)}
				</pre>
			</div>
			<div className="flex flex-col justify-between items-center">
				<Button disabled={create.isPending} onClick={() => create.mutate()}>
					Create Workflow
				</Button>
				<SignOutButton />
			</div>
		</div>
	);
};

export default Page;
