import { KlockworkError } from "./errors.ts";
import { VERSION } from "./version.ts";

export const PRODUCTION_BASE_URL = "https://klockwork.org";
export const LOCAL_BASE_URL = "http://localhost:3001";
export const API_KEY_HEADER = "X-Klockwork-Key";
export const TALENT_HEADER = "X-Klockwork-Talent";
export const CLIENT_HEADER = "X-Klockwork-Client";

export type KlockworkEnvironment = "production" | "local";

export type KlockworkOptions = {
  apiKey: string;
  environment?: KlockworkEnvironment;
  baseUrl?: string;
  fetch?: typeof fetch;
  talentId?: string;
  clientId?: string;
};

export type QueryValue = string | number | boolean | null | undefined;

export type HttpRequest = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  form?: FormData;
  talentId?: string;
  clientId?: string;
};

export function resolveBaseUrl(options: KlockworkOptions): string {
  const explicit = options.baseUrl?.trim();
  const raw =
    explicit ||
    (options.environment === "local" ? LOCAL_BASE_URL : PRODUCTION_BASE_URL);
  return raw.replace(/\/+$/, "");
}

export function assertApiKey(apiKey: string): string {
  const trimmed = apiKey.trim();
  if (!trimmed.startsWith("kw_")) {
    throw new Error("Klockwork API key must start with kw_");
  }
  return trimmed;
}

function queryString(query: Record<string, QueryValue> | undefined): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}

function errorMessage(status: number, body: unknown, statusText: string): string {
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error?: unknown }).error;
    if (typeof error === "string" && error) return error;
  }
  if (typeof body === "string" && body) return body;
  return statusText || `Request failed with status ${status}`;
}

export class HttpClient {
  readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: KlockworkOptions) {
    this.apiKey = assertApiKey(options.apiKey);
    this.baseUrl = resolveBaseUrl(options);
    this.fetchImpl = options.fetch ?? fetch;
  }

  async request<T>(input: HttpRequest): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      [API_KEY_HEADER]: this.apiKey,
      "User-Agent": `klockwork/${VERSION}`,
    };
    if (input.talentId) headers[TALENT_HEADER] = input.talentId;
    if (input.clientId) headers[CLIENT_HEADER] = input.clientId;

    let body: BodyInit | undefined;
    if (input.form) {
      body = input.form;
    } else if (input.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(input.body);
    }

    const response = await this.fetchImpl(
      `${this.baseUrl}${input.path}${queryString(input.query)}`,
      { method: input.method, headers, body },
    );

    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = text;
      }
    }

    if (!response.ok) {
      const details =
        parsed && typeof parsed === "object" && "details" in parsed
          ? (parsed as { details?: unknown }).details
          : undefined;
      throw new KlockworkError(
        response.status,
        errorMessage(response.status, parsed, response.statusText),
        parsed,
        details,
      );
    }

    if (text && typeof parsed === "string") {
      throw new KlockworkError(response.status, "Invalid JSON response", parsed);
    }

    return parsed as T;
  }
}
