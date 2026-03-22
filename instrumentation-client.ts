// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// 动态 tracesSampleRate: 生产环境降低采样，开发环境 100%
const tracesSampleRate = process.env.NODE_ENV === "production"
  ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1")
  : 1;

// 确保采样率在 0-1 之间
const validatedSampleRate = Math.min(1, Math.max(0, tracesSampleRate));

Sentry.init({
  dsn: "https://8b7ab290eb65ca499dafeea27d8b0ed7@o4511088185573376.ingest.us.sentry.io/4511088189046784",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled.
  tracesSampleRate: validatedSampleRate,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: process.env.SEND_DEFAULT_PII !== 'false',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
