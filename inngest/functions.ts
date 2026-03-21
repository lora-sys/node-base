import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");

    await step.sleep("wait-a-moment", "5s");
    await step.sleep("send-to-ai", "5s");

    const name = event.data?.name ?? "test-workflow";
    const userId = event.data?.userId;

    // Wrap DB operation in step.run for idempotency on retries
    return step.run("create-workflow:" + name, async () => {
      // Note: Workflow model doesn't have userId field yet.
      // When ownership tracking is needed, add userId to Workflow model
      // and include it in the create call: { data: { name, userId } }
      console.log(`Creating workflow for user ${userId ?? "unknown"}`);
      return prisma.workflow.create({
        data: {
          name,
        },
      });
    });
  },
);
