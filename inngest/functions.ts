import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@/lib/google-provider";

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
      prompt: "What is dog",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
        functionId: "gemini-generate-text",
      },
    });

    return result;
  },
);
