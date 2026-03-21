"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";



export const AiTestClient = () => {

    const trpc = useTRPC();
    const testAi = useMutation(trpc.testAi.mutationOptions({
        onSuccess: (data) => {
            toast.success(data.message ?? "AI task completed");
        },
        onError: (err) => {
            toast.error("Failed to test AI: " + (err?.message ?? "unknown error"));
            console.error("testAi error", err);
        }
    }));


    return (
        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
            {testAi.isPending ? "Running..." : "Test Ai"}
        </Button>
    )
}