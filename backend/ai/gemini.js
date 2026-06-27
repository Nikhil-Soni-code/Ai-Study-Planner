import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PRIMARY_MODEL = "gemini-2.5-flash";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Filter retryable exceptions based on status codes and message strings
function isRetryableError(err) {
  const status = Number(err.status || err.statusCode || (err.response && err.response.status));
  
  // Non-retryable statuses
  if ([400, 401, 403, 404].includes(status)) {
    return false;
  }
  
  // Retryable statuses
  if ([429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  const msg = (err.message || "").toLowerCase();
  
  // Non-retryable keywords
  if (
    msg.includes("key") ||
    msg.includes("api key") ||
    msg.includes("auth") ||
    msg.includes("credential") ||
    msg.includes("invalid request") ||
    msg.includes("bad request") ||
    msg.includes("unsupported model") ||
    msg.includes("400") ||
    msg.includes("401") ||
    msg.includes("403") ||
    msg.includes("404")
  ) {
    return false;
  }

  // Retryable keywords
  return (
    msg.includes("429") ||
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("service unavailable") ||
    msg.includes("rate limit")
  );
}

// Resilient API caller incorporating exponential backoffs
export async function generateWithRetry(prompt) {
  const maxAttempts = 4;
  const backoffs = [2000, 4000, 8000];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[AI] Attempt ${attempt}/${maxAttempts} | Model: ${PRIMARY_MODEL}`);

    try {
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      console.log(`[AI] Generation Successful`);
      return text;
    } catch (err) {
      const retryable = isRetryableError(err);
      
      if (attempt === maxAttempts) {
        console.error(`[AI] All Retries Exhausted. Final Error: ${err.message}`);
        throw new Error("AI service is temporarily busy. Please try again in a few minutes.");
      }

      if (!retryable) {
        console.error(`[AI] Non-retryable Error Detected: ${err.message}`);
        throw new Error("AI service is temporarily busy. Please try again in a few minutes.");
      }

      const retryDelay = backoffs[attempt - 1] || 2000;
      console.log(`[AI] Retryable Error Detected`);
      console.log(`[AI] Waiting ${retryDelay}ms before retry`);
      await delay(retryDelay);
    }
  }
}

export async function generateStudyPlan(prompt) {
  return generateWithRetry(prompt);
}
