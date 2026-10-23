export class KlockworkError extends Error {
  readonly status: number;
  readonly error: string;
  readonly details?: unknown;
  readonly body: unknown;

  constructor(
    status: number,
    error: string,
    body: unknown,
    details?: unknown,
  ) {
    super(error);
    this.name = "KlockworkError";
    this.status = status;
    this.error = error;
    this.body = body;
    this.details = details;
  }
}
