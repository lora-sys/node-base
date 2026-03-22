// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// 动态 tracesSampleRate: 生产环境降低采样，开发环境 100%
const tracesSampleRate = process.env.NODE_ENV === "production"
  ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1")
  : 1;

// 确保采样率在 0-1 之间
const validatedSampleRate = Math.min(1, Math.max(0, tracesSampleRate));

Sentry.init({
  dsn: "https://5576d797295b8e7f063e0945114774c1@o4511086872494080.ingest.de.sentry.io/4511086891827280",

  // Define how likely traces are sampled.
  tracesSampleRate: validatedSampleRate,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: process.env.SEND_DEFAULT_PII !== 'false',

  // Add Vercel AI SDK integration to capture LLM telemetry
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
  ],
  debug : true,
});
