import type { HttpClient } from "../http.ts";
import { segment } from "../subject.ts";
import type { OkResult } from "../types/common.ts";
import type {
  CreateOrgAssignmentInput,
  CreateOrgClientInput,
  CreateOrgInvoiceInput,
  CreateOrgPaymentsInput,
  CreateOrgTalentInput,
  CreateOrgTimeEntryInput,
  ListOrgAssignmentsQuery,
  ListOrgClientsQuery,
  ListOrgTalentsQuery,
  ListOrgTimeQuery,
  OrgAssignment,
  OrgBusinessProfile,
  OrgClient,
  OrgClientCreateResult,
  OrgClientInviteResult,
  OrgClientRevokeInviteResult,
  OrgClientSummary,
  OrgInvoice,
  OrgNotificationSettings,
  OrgPayment,
  OrgPreferences,
  OrgTalent,
  OrgTalentInviteResult,
  OrgTimeEntry,
  OrgTimeResponse,
  UpdateOrgAssignmentInput,
  UpdateOrgBusinessProfileInput,
  UpdateOrgClientInput,
  UpdateOrgNotificationSettingsInput,
  UpdateOrgPreferencesInput,
  UpdateOrgTalentInput,
} from "../types/agency.ts";

export type AgencyApi = {
  clients: {
    list(query?: ListOrgClientsQuery): Promise<{ clients: OrgClient[] }>;
    create(input: CreateOrgClientInput): Promise<OrgClientCreateResult>;
    get(id: string): Promise<{ client: OrgClient; summary: OrgClientSummary }>;
    update(id: string, input: UpdateOrgClientInput): Promise<{ client: OrgClient }>;
    remove(id: string): Promise<OkResult>;
    invite(id: string): Promise<OrgClientInviteResult>;
    revokeInvite(id: string): Promise<OrgClientRevokeInviteResult>;
  };
  talents: {
    list(query?: ListOrgTalentsQuery): Promise<{ talents: OrgTalent[] }>;
    create(input: CreateOrgTalentInput): Promise<OrgTalentInviteResult>;
    get(id: string): Promise<{ talent: OrgTalent }>;
    update(id: string, input: UpdateOrgTalentInput): Promise<{ talent: OrgTalent }>;
    remove(id: string): Promise<OkResult>;
    invite(id: string): Promise<OrgTalentInviteResult>;
  };
  assignments: {
    list(query?: ListOrgAssignmentsQuery): Promise<{ assignments: OrgAssignment[] }>;
    create(input: CreateOrgAssignmentInput): Promise<{ assignment: OrgAssignment }>;
    get(id: string): Promise<{ assignment: OrgAssignment }>;
    update(
      id: string,
      input: UpdateOrgAssignmentInput,
    ): Promise<{ assignment: OrgAssignment }>;
  };
  time: {
    list(query: ListOrgTimeQuery): Promise<OrgTimeResponse>;
    create(input: CreateOrgTimeEntryInput): Promise<{ entry: OrgTimeEntry }>;
  };
  invoices: {
    list(): Promise<{ invoices: OrgInvoice[] }>;
    create(input: CreateOrgInvoiceInput): Promise<{ invoice: OrgInvoice }>;
    get(id: string): Promise<{ invoice: OrgInvoice }>;
    void(id: string): Promise<{ invoice: OrgInvoice }>;
  };
  payments: {
    list(): Promise<{ payments: OrgPayment[] }>;
    create(input: CreateOrgPaymentsInput): Promise<{ payments: OrgPayment[] }>;
  };
  businessProfile: {
    get(): Promise<{ profile: OrgBusinessProfile }>;
    update(input: UpdateOrgBusinessProfileInput): Promise<{ profile: OrgBusinessProfile }>;
  };
  preferences: {
    get(): Promise<{ preferences: OrgPreferences }>;
    update(input: UpdateOrgPreferencesInput): Promise<{ preferences: OrgPreferences }>;
  };
  notificationSettings: {
    get(): Promise<{ settings: OrgNotificationSettings }>;
    update(
      input: UpdateOrgNotificationSettingsInput,
    ): Promise<{ settings: OrgNotificationSettings }>;
  };
};

export function createAgencyApi(http: HttpClient): AgencyApi {
  const root = "/api/public/agency";
  return {
    clients: {
      list: (query) =>
        http.request({ method: "GET", path: `${root}/clients`, query }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/clients`, body: input }),
      get: (id) =>
        http.request({ method: "GET", path: `${root}/clients/${segment(id)}` }),
      update: (id, input) =>
        http.request({
          method: "PATCH",
          path: `${root}/clients/${segment(id)}`,
          body: input,
        }),
      remove: (id) =>
        http.request({ method: "DELETE", path: `${root}/clients/${segment(id)}` }),
      invite: (id) =>
        http.request({
          method: "POST",
          path: `${root}/clients/${segment(id)}/invite`,
        }),
      revokeInvite: (id) =>
        http.request({
          method: "POST",
          path: `${root}/clients/${segment(id)}/invite/revoke`,
        }),
    },
    talents: {
      list: (query) =>
        http.request({ method: "GET", path: `${root}/talents`, query }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/talents`, body: input }),
      get: (id) =>
        http.request({ method: "GET", path: `${root}/talents/${segment(id)}` }),
      update: (id, input) =>
        http.request({
          method: "PATCH",
          path: `${root}/talents/${segment(id)}`,
          body: input,
        }),
      remove: (id) =>
        http.request({ method: "DELETE", path: `${root}/talents/${segment(id)}` }),
      invite: (id) =>
        http.request({
          method: "POST",
          path: `${root}/talents/${segment(id)}/invite`,
        }),
    },
    assignments: {
      list: (query) =>
        http.request({ method: "GET", path: `${root}/assignments`, query }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/assignments`, body: input }),
      get: (id) =>
        http.request({
          method: "GET",
          path: `${root}/assignments/${segment(id)}`,
        }),
      update: (id, input) =>
        http.request({
          method: "PATCH",
          path: `${root}/assignments/${segment(id)}`,
          body: input,
        }),
    },
    time: {
      list: (query) =>
        http.request({ method: "GET", path: `${root}/time`, query }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/time`, body: input }),
    },
    invoices: {
      list: () => http.request({ method: "GET", path: `${root}/invoices` }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/invoices`, body: input }),
      get: (id) =>
        http.request({ method: "GET", path: `${root}/invoices/${segment(id)}` }),
      void: (id) =>
        http.request({
          method: "POST",
          path: `${root}/invoices/${segment(id)}/void`,
        }),
    },
    payments: {
      list: () => http.request({ method: "GET", path: `${root}/payments` }),
      create: (input) =>
        http.request({ method: "POST", path: `${root}/payments`, body: input }),
    },
    businessProfile: {
      get: () =>
        http.request({ method: "GET", path: `${root}/business-profile` }),
      update: (input) =>
        http.request({
          method: "PUT",
          path: `${root}/business-profile`,
          body: input,
        }),
    },
    preferences: {
      get: () => http.request({ method: "GET", path: `${root}/preferences` }),
      update: (input) =>
        http.request({ method: "PUT", path: `${root}/preferences`, body: input }),
    },
    notificationSettings: {
      get: () =>
        http.request({ method: "GET", path: `${root}/notification-settings` }),
      update: (input) =>
        http.request({
          method: "PUT",
          path: `${root}/notification-settings`,
          body: input,
        }),
    },
  };
}
