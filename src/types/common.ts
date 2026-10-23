export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DateFormat = "DD MMM YYYY" | "MMM DD, YYYY" | "YYYY-MM-DD";

export type TimeFormat = "h12" | "h24";

export type VatStatus = "non_vat" | "vat_registered";

export type OkResult = { ok: true };

export type PaymentMethod =
  | "wise"
  | "bank"
  | "gcash"
  | "maya"
  | "card"
  | "other";
