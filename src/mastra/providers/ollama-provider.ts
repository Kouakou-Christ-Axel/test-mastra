import { createOllama } from "ollama-ai-provider-v2";

export const ollamaProvider = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/api",
});