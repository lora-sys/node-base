
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { sleep } from "@trpc/server/unstable-core-do-not-import";
import {createOpenAI} from "@ai-sdk/openai"
import {createAnthropic} from "@ai-sdk/anthropic"
const google = createGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_GENERATIVE_AI_API_KEY
})
const openai = createOpenAI(
  {
    apiKey : process.env.OPENAI_API_KEY
  }
)
const anthropic = createAnthropic()

export const execute = inngest.createFunction(
  { id: "execute-ai", triggers: [{ event: "execute/ai" }] },
  async ({ event, step }) => {
    await step.sleep("pretend","5s")

   const {steps : geminiSteps } = await step.ai.wrap("gemini-generate-text",
    generateText ,{
      model : google("gemini-2.5-flash"),
      system : "You are a helpful assiant",
      prompt : "What is 2+2",

    }
   )
  //   const {steps : openaiSteps } = await step.ai.wrap("openai-generate-text",
  //   generateText ,{
  //     model : openai("gpt-4.1-mini"),
  //     system : "You are a helpful assiant",
  //     prompt : "What is 2+2",

  //   }
  //  )
  return geminiSteps

  },
);
