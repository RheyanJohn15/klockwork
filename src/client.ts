import { HttpClient, type KlockworkOptions } from "./http.ts";
import { createAgencyApi, type AgencyApi } from "./resources/agency.ts";
import { createCompanyApi, type CompanyApi } from "./resources/company.ts";
import { createSoloApi, type SoloApi } from "./resources/solo.ts";

export type { KlockworkEnvironment, KlockworkOptions } from "./http.ts";
export { LOCAL_BASE_URL, PRODUCTION_BASE_URL } from "./http.ts";

export class Klockwork {
  readonly agency: AgencyApi;
  readonly solo: SoloApi;
  readonly company: CompanyApi;

  constructor(options: KlockworkOptions) {
    const http = new HttpClient(options);
    this.agency = createAgencyApi(http);
    this.solo = createSoloApi(http, options.talentId);
    this.company = createCompanyApi(http, options.clientId);
  }
}
