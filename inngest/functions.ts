import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@/lib/google-provider";
import { sleep } from "@trpc/server/unstable-core-do-not-import";

export const execute = inngest.createFunction(
  { id: "execute-ai", triggers: [{ event: "execute/ai" }] },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    const result = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "What is 2+2",
        timeout: 60000,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return result;
  },
);
