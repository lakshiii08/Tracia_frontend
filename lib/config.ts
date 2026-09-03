/**
 * TRACIA System Configuration
 * Manages environment toggles, API base URLs, and mock data switching.
 */

export const config = {
  /**
   * Whether the app should use client-side mock data.
   * Defaults to true if NEXT_PUBLIC_USE_MOCK_DATA is not explicitly set to 'false'.
   */
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false",

  /**
   * Base URL for the backend API (FastAPI / Node microservices).
   */
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.FASTAPI_BACKEND_URL ||
    "",

  /**
   * GraphRAG LLM service URL.
   */
  graphragLlmUrl:
    process.env.GRAPHRAG_LLM_URL ||
    "http://localhost:8000/api/graphrag",

  /**
   * Blockchain RPC / Node service URL.
   */
  blockchainRpcUrl:
    process.env.BLOCKCHAIN_RPC_URL ||
    "http://localhost:8545",

  /**
   * Terminal / Region identifier.
   */
  terminalId: process.env.NEXT_PUBLIC_TERMINAL_ID || "ALPHA_77",
  regionId: process.env.NEXT_PUBLIC_REGION_ID || "REGION-04",
};

export const isMockEnabled = (): boolean => {
  return config.useMockData;
};

export const getApiBaseUrl = (): string => {
  return config.apiBaseUrl;
};
