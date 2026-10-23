export { KlockworkError } from "./errors.ts";
export { Klockwork } from "./client.ts";
export type { KlockworkEnvironment, KlockworkOptions } from "./client.ts";
export { LOCAL_BASE_URL, PRODUCTION_BASE_URL } from "./client.ts";

export type { DateFormat, OkResult, PaymentMethod, TimeFormat, VatStatus, Weekday } from "./types/common.ts";
export type * from "./types/agency.ts";
export type * from "./types/solo.ts";
export type { AgencyApi } from "./resources/agency.ts";
export type { SoloApi } from "./resources/solo.ts";
export type { CompanyApi } from "./resources/company.ts";
