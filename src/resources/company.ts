import type { HttpClient } from "../http.ts";
import { requireClient, segment, splitClient, type ClientCall } from "../subject.ts";
import type {
  ListOrgTimeQuery,
  OrgInvoice,
  OrgPortalTalent,
  OrgTimeResponse,
} from "../types/agency.ts";

export type CompanyApi = {
  forClient(clientId: string): CompanyApi;
  invoices: {
    list(options?: ClientCall): Promise<{ invoices: OrgInvoice[] }>;
    get(id: string, options?: ClientCall): Promise<{ invoice: OrgInvoice }>;
  };
  talents: {
    list(options?: ClientCall): Promise<{ talents: OrgPortalTalent[] }>;
  };
  time: {
    list(query: ListOrgTimeQuery & ClientCall): Promise<OrgTimeResponse>;
  };
};

export function createCompanyApi(http: HttpClient, boundClientId?: string): CompanyApi {
  const root = "/api/public/company";
  const clientOf = (explicit?: string) => requireClient(explicit, boundClientId);

  return {
    forClient: (clientId) => createCompanyApi(http, clientId),
    invoices: {
      list: async (options) =>
        http.request({
          method: "GET",
          path: `${root}/invoices`,
          clientId: clientOf(options?.clientId),
        }),
      get: async (id, options) =>
        http.request({
          method: "GET",
          path: `${root}/invoices/${segment(id)}`,
          clientId: clientOf(options?.clientId),
        }),
    },
    talents: {
      list: async (options) =>
        http.request({
          method: "GET",
          path: `${root}/talents`,
          clientId: clientOf(options?.clientId),
        }),
    },
    time: {
      list: async (query) => {
        const { clientId, rest } = splitClient(query);
        return http.request({
          method: "GET",
          path: `${root}/time`,
          query: rest,
          clientId: clientOf(clientId),
        });
      },
    },
  };
}
