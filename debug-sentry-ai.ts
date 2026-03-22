import { generateText } from "ai";
import { google } from "@/lib/google-provider";
import * as Sentry from "@sentry/nextjs";

// 手动创建一个 Sentry span
async function testAISentry() {
  // 确保 Sentry 已初始化
  console.log("Sentry DSN:", Sentry.getCurrentHub().getClient()?.getDsn());

  const result = await Sentry.startSpan(
    {
      name: "test-gemini-call",
      op: "ai.gemini",
    },
    async (span) => {
      console.log("Span started:", span.spanId);

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "What is dog",
        timeout: 60000,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      });

      console.log("GenerateText completed");
      return result;
    }
  );

  console.log("Span finished");
  return result;
}

testAISentry()
  .then((res) => {
    console.log("Result:", JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    Sentry.captureException(err);
    process.exit(1);
  });
