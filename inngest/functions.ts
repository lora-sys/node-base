import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");

    await step.sleep("wait-a-moment", "5s");
    await step.sleep("send-to-ai", "5s");

    const name = event.data?.name ?? "test-workflow";

    // Wrap DB operation in step.run for idempotency on retries
    return step.run("create-workflow:" + name, async () => {
      return prisma.workflow.create({
        data: {
          name,
        },
      });
    });
  },
);
