import type { HttpClient } from "../http.ts";
import { requireTalent, segment, splitTalent, type TalentCall } from "../subject.ts";
import type { OkResult } from "../types/common.ts";
import type {
  CreateInvoiceShareInput,
  CreateManualTimerSessionInput,
  CreateSoloClientInput,
  CreateSoloInvoiceInput,
  CreateSoloPaymentInput,
  CreateSoloSlackBindingInput,
  CreateSoloTeamsBindingInput,
  CreateTimesheetShareInput,
  DeleteCompletedTimerSessionInput,
  ListSoloClientsQuery,
  ListTimerSessionsQuery,
  ListTimesheetSharesQuery,
  ReadyToInvoiceSummary,
  SaveTimerSessionInput,
  SoloBillingSnapshot,
  SoloBillingSyncResult,
  SoloBusinessProfile,
  SoloClient,
  SoloInvoice,
  SoloInvoiceDefaults,
  SoloInvoiceEvent,
  SoloInvoiceShare,
  SoloInvoiceShareListItem,
  SoloNotificationSettings,
  SoloOverview,
  SoloPayment,
  SoloPaymentAttachment,
  SoloPaymentAttachmentUrl,
  SoloPaymentListItem,
  SoloPayoutSettings,
  SoloPreferences,
  SoloSlackBinding,
  SoloSlackBindingTest,
  SoloSlackChannel,
  SoloSlackConnections,
  SoloTeamsBinding,
  SoloTeamsChannel,
  SoloTeamsConnections,
  SoloTimerSession,
  SoloTimerSessionEvent,
  SoloTimesheetShare,
  SoloTimesheetShareListItem,
  StartTimerBreakInput,
  StartTimerSessionInput,
  UpdateCompletedTimerSessionInput,
  UpdateOpenTimerSessionInput,
  UpdateSoloBusinessProfileInput,
  UpdateSoloClientInput,
  UpdateSoloInvoiceDefaultsInput,
  UpdateSoloInvoiceInput,
  UpdateSoloNotificationSettingsInput,
  UpdateSoloPayoutSettingsInput,
  UpdateSoloPreferencesInput,
  UpdateSoloSlackBindingInput,
  UpdateSoloTeamsBindingInput,
  VoidSoloInvoiceInput,
} from "../types/solo.ts";

export type SoloApi = {
  forTalent(talentId: string): SoloApi;
  clients: {
    list(query?: ListSoloClientsQuery & TalentCall): Promise<{ clients: SoloClient[] }>;
    create(input: CreateSoloClientInput & TalentCall): Promise<{ client: SoloClient }>;
    get(id: string, options?: TalentCall): Promise<{ client: SoloClient }>;
    update(
      id: string,
      input: UpdateSoloClientInput & TalentCall,
    ): Promise<{ client: SoloClient }>;
    remove(id: string, options?: TalentCall): Promise<OkResult>;
    touch(id: string, options?: TalentCall): Promise<{ client: SoloClient }>;
  };
  timer: {
    session: {
      get(options?: TalentCall): Promise<{ session: SoloTimerSession | null }>;
      update(
        input: UpdateOpenTimerSessionInput & TalentCall,
      ): Promise<{ session: SoloTimerSession }>;
      start(input: StartTimerSessionInput & TalentCall): Promise<{ session: SoloTimerSession }>;
      save(input: SaveTimerSessionInput & TalentCall): Promise<{ session: SoloTimerSession }>;
      discard(options?: TalentCall): Promise<{ session: SoloTimerSession }>;
      resume(options?: TalentCall): Promise<{ session: SoloTimerSession }>;
      timeout(options?: TalentCall): Promise<{ session: SoloTimerSession }>;
      break: {
        start(input: StartTimerBreakInput & TalentCall): Promise<{ session: SoloTimerSession }>;
        end(options?: TalentCall): Promise<{ session: SoloTimerSession }>;
      };
    };
    sessions: {
      list(
        query: ListTimerSessionsQuery & TalentCall,
      ): Promise<{ sessions: SoloTimerSession[] }>;
      create(
        input: CreateManualTimerSessionInput & TalentCall,
      ): Promise<{ session: SoloTimerSession }>;
      get(id: string, options?: TalentCall): Promise<{ session: SoloTimerSession }>;
      update(
        id: string,
        input: UpdateCompletedTimerSessionInput & TalentCall,
      ): Promise<{ session: SoloTimerSession }>;
      remove(
        id: string,
        input: DeleteCompletedTimerSessionInput & TalentCall,
      ): Promise<OkResult>;
      events(
        id: string,
        options?: TalentCall,
      ): Promise<{ events: SoloTimerSessionEvent[] }>;
    };
  };
  invoices: {
    list(options?: TalentCall): Promise<{ invoices: SoloInvoice[] }>;
    create(input: CreateSoloInvoiceInput & TalentCall): Promise<{ invoice: SoloInvoice }>;
    get(id: string, options?: TalentCall): Promise<{ invoice: SoloInvoice }>;
    update(
      id: string,
      input: UpdateSoloInvoiceInput & TalentCall,
    ): Promise<{ invoice: SoloInvoice }>;
    void(
      id: string,
      input?: VoidSoloInvoiceInput & TalentCall,
    ): Promise<{ invoice: SoloInvoice }>;
    events(id: string, options?: TalentCall): Promise<{ events: SoloInvoiceEvent[] }>;
    shares(
      id: string,
      options?: TalentCall,
    ): Promise<{ shares: SoloInvoiceShareListItem[] }>;
    createShare(
      id: string,
      input?: CreateInvoiceShareInput & TalentCall,
    ): Promise<{ share: SoloInvoiceShare }>;
    revokeShare(id: string, options?: TalentCall): Promise<{ share: SoloInvoiceShare }>;
    unbilled(options?: TalentCall): Promise<{ summary: ReadyToInvoiceSummary }>;
  };
  timesheet: {
    shares: {
      list(
        query?: ListTimesheetSharesQuery & TalentCall,
      ): Promise<{ shares: SoloTimesheetShareListItem[] }>;
      create(
        input: CreateTimesheetShareInput & TalentCall,
      ): Promise<{ share: SoloTimesheetShare }>;
      revoke(id: string, options?: TalentCall): Promise<{ share: SoloTimesheetShare }>;
    };
  };
  payments: {
    list(options?: TalentCall): Promise<{ payments: SoloPaymentListItem[] }>;
    create(input: CreateSoloPaymentInput & TalentCall): Promise<{ payment: SoloPayment }>;
    get(id: string, options?: TalentCall): Promise<{ payment: SoloPayment }>;
    uploadAttachment(
      paymentId: string,
      file: Blob,
      options?: TalentCall & { filename?: string },
    ): Promise<{ attachment: SoloPaymentAttachment }>;
    deleteAttachment(
      paymentId: string,
      attachmentId: string,
      options?: TalentCall,
    ): Promise<OkResult>;
    attachmentUrl(
      paymentId: string,
      attachmentId: string,
      options?: TalentCall,
    ): Promise<SoloPaymentAttachmentUrl>;
  };
  overview: {
    get(options?: TalentCall): Promise<{ overview: SoloOverview }>;
  };
  billing: {
    get(options?: TalentCall): Promise<SoloBillingSnapshot>;
    sync(options?: TalentCall): Promise<SoloBillingSyncResult>;
  };
  businessProfile: {
    get(options?: TalentCall): Promise<{ profile: SoloBusinessProfile }>;
    update(
      input: UpdateSoloBusinessProfileInput & TalentCall,
    ): Promise<{ profile: SoloBusinessProfile }>;
  };
  invoiceDefaults: {
    get(options?: TalentCall): Promise<{ defaults: SoloInvoiceDefaults }>;
    update(
      input: UpdateSoloInvoiceDefaultsInput & TalentCall,
    ): Promise<{ defaults: SoloInvoiceDefaults }>;
  };
  preferences: {
    get(query?: { timezone?: string } & TalentCall): Promise<{ preferences: SoloPreferences }>;
    update(
      input: UpdateSoloPreferencesInput & TalentCall,
    ): Promise<{ preferences: SoloPreferences }>;
  };
  notificationSettings: {
    get(options?: TalentCall): Promise<{ settings: SoloNotificationSettings }>;
    update(
      input: UpdateSoloNotificationSettingsInput & TalentCall,
    ): Promise<{ settings: SoloNotificationSettings }>;
  };
  payoutSettings: {
    get(options?: TalentCall): Promise<{ settings: SoloPayoutSettings }>;
    update(
      input: UpdateSoloPayoutSettingsInput & TalentCall,
    ): Promise<{ settings: SoloPayoutSettings }>;
  };
  integrations: {
    slack: {
      connections(options?: TalentCall): Promise<SoloSlackConnections>;
      channels(query: { installId: string } & TalentCall): Promise<{ channels: SoloSlackChannel[] }>;
      createBinding(
        input: CreateSoloSlackBindingInput & TalentCall,
      ): Promise<{ binding: SoloSlackBinding }>;
      updateBinding(
        id: string,
        input: UpdateSoloSlackBindingInput & TalentCall,
      ): Promise<{ binding: SoloSlackBinding }>;
      removeBinding(id: string, options?: TalentCall): Promise<OkResult>;
      disconnectInstall(id: string, options?: TalentCall): Promise<OkResult>;
      startTest(id: string, options?: TalentCall): Promise<{ test: SoloSlackBindingTest }>;
      getTest(
        bindingId: string,
        testId: string,
        options?: TalentCall,
      ): Promise<{ test: SoloSlackBindingTest }>;
    };
    teams: {
      connections(options?: TalentCall): Promise<SoloTeamsConnections>;
      channels(query: { installId: string } & TalentCall): Promise<{ channels: SoloTeamsChannel[] }>;
      createBinding(
        input: CreateSoloTeamsBindingInput & TalentCall,
      ): Promise<{ binding: SoloTeamsBinding }>;
      updateBinding(
        id: string,
        input: UpdateSoloTeamsBindingInput & TalentCall,
      ): Promise<{ binding: SoloTeamsBinding }>;
      removeBinding(id: string, options?: TalentCall): Promise<OkResult>;
      disconnectInstall(id: string, options?: TalentCall): Promise<OkResult>;
    };
  };
};

export function createSoloApi(http: HttpClient, boundTalentId?: string): SoloApi {
  const root = "/api/public/solo";
  const talentOf = (explicit?: string) => requireTalent(explicit, boundTalentId);

  const call = async <T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    talentId: string | undefined,
    extra?: { query?: Record<string, string | number | boolean | null | undefined>; body?: unknown; form?: FormData },
  ) =>
    http.request<T>({
      method,
      path,
      talentId: talentOf(talentId),
      query: extra?.query,
      body: extra?.body,
      form: extra?.form,
    });

  const api: SoloApi = {
    forTalent: (talentId) => createSoloApi(http, talentId),
    clients: {
      list: (query) => {
        const { talentId, rest } = splitTalent(query);
        return call("GET", `${root}/clients`, talentId, { query: rest });
      },
      create: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("POST", `${root}/clients`, talentId, { body: rest });
      },
      get: (id, options) =>
        call("GET", `${root}/clients/${segment(id)}`, options?.talentId),
      update: (id, input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PATCH", `${root}/clients/${segment(id)}`, talentId, { body: rest });
      },
      remove: (id, options) =>
        call("DELETE", `${root}/clients/${segment(id)}`, options?.talentId),
      touch: (id, options) =>
        call("POST", `${root}/clients/${segment(id)}/touch`, options?.talentId),
    },
    timer: {
      session: {
        get: (options) => call("GET", `${root}/timer/session`, options?.talentId),
        update: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("PATCH", `${root}/timer/session`, talentId, { body: rest });
        },
        start: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/timer/session/start`, talentId, { body: rest });
        },
        save: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/timer/session/save`, talentId, { body: rest });
        },
        discard: (options) =>
          call("POST", `${root}/timer/session/discard`, options?.talentId),
        resume: (options) =>
          call("POST", `${root}/timer/session/resume`, options?.talentId),
        timeout: (options) =>
          call("POST", `${root}/timer/session/timeout`, options?.talentId),
        break: {
          start: (input) => {
            const { talentId, rest } = splitTalent(input);
            return call("POST", `${root}/timer/session/break/start`, talentId, {
              body: rest,
            });
          },
          end: (options) =>
            call("POST", `${root}/timer/session/break/end`, options?.talentId),
        },
      },
      sessions: {
        list: (query) => {
          const { talentId, rest } = splitTalent(query);
          return call("GET", `${root}/timer/sessions`, talentId, { query: rest });
        },
        create: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/timer/sessions`, talentId, { body: rest });
        },
        get: (id, options) =>
          call("GET", `${root}/timer/sessions/${segment(id)}`, options?.talentId),
        update: (id, input) => {
          const { talentId, rest } = splitTalent(input);
          return call("PATCH", `${root}/timer/sessions/${segment(id)}`, talentId, {
            body: rest,
          });
        },
        remove: (id, input) => {
          const { talentId, rest } = splitTalent(input);
          return call("DELETE", `${root}/timer/sessions/${segment(id)}`, talentId, {
            body: rest,
          });
        },
        events: (id, options) =>
          call(
            "GET",
            `${root}/timer/sessions/${segment(id)}/events`,
            options?.talentId,
          ),
      },
    },
    invoices: {
      list: (options) => call("GET", `${root}/invoices`, options?.talentId),
      create: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("POST", `${root}/invoices`, talentId, { body: rest });
      },
      get: (id, options) =>
        call("GET", `${root}/invoices/${segment(id)}`, options?.talentId),
      update: (id, input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PATCH", `${root}/invoices/${segment(id)}`, talentId, { body: rest });
      },
      void: (id, input) => {
        const { talentId, rest } = splitTalent(input);
        return call("POST", `${root}/invoices/${segment(id)}/void`, talentId, {
          body: rest,
        });
      },
      events: (id, options) =>
        call("GET", `${root}/invoices/${segment(id)}/events`, options?.talentId),
      shares: (id, options) =>
        call("GET", `${root}/invoices/${segment(id)}/shares`, options?.talentId),
      createShare: (id, input) => {
        const { talentId, rest } = splitTalent(input);
        return call("POST", `${root}/invoices/${segment(id)}/shares`, talentId, {
          body: rest,
        });
      },
      revokeShare: (id, options) =>
        call("POST", `${root}/invoices/shares/${segment(id)}/revoke`, options?.talentId),
      unbilled: (options) =>
        call("GET", `${root}/invoices/unbilled`, options?.talentId),
    },
    timesheet: {
      shares: {
        list: (query) => {
          const { talentId, rest } = splitTalent(query);
          return call("GET", `${root}/timesheet/shares`, talentId, { query: rest });
        },
        create: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/timesheet/shares`, talentId, { body: rest });
        },
        revoke: (id, options) =>
          call(
            "POST",
            `${root}/timesheet/shares/${segment(id)}/revoke`,
            options?.talentId,
          ),
      },
    },
    payments: {
      list: (options) => call("GET", `${root}/payments`, options?.talentId),
      create: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("POST", `${root}/payments`, talentId, { body: rest });
      },
      get: (id, options) =>
        call("GET", `${root}/payments/${segment(id)}`, options?.talentId),
      uploadAttachment: (paymentId, file, options) => {
        const form = new FormData();
        const filename =
          options?.filename ??
          (typeof File !== "undefined" && file instanceof File ? file.name : "attachment");
        form.append("file", file, filename);
        return call(
          "POST",
          `${root}/payments/${segment(paymentId)}/attachments`,
          options?.talentId,
          { form },
        );
      },
      deleteAttachment: (paymentId, attachmentId, options) =>
        call(
          "DELETE",
          `${root}/payments/${segment(paymentId)}/attachments/${segment(attachmentId)}`,
          options?.talentId,
        ),
      attachmentUrl: (paymentId, attachmentId, options) =>
        call(
          "GET",
          `${root}/payments/${segment(paymentId)}/attachments/${segment(attachmentId)}/url`,
          options?.talentId,
        ),
    },
    overview: {
      get: (options) => call("GET", `${root}/overview`, options?.talentId),
    },
    billing: {
      get: (options) => call("GET", `${root}/billing`, options?.talentId),
      sync: (options) => call("POST", `${root}/billing`, options?.talentId),
    },
    businessProfile: {
      get: (options) => call("GET", `${root}/business-profile`, options?.talentId),
      update: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PUT", `${root}/business-profile`, talentId, { body: rest });
      },
    },
    invoiceDefaults: {
      get: (options) => call("GET", `${root}/invoice-defaults`, options?.talentId),
      update: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PUT", `${root}/invoice-defaults`, talentId, { body: rest });
      },
    },
    preferences: {
      get: (query) => {
        const { talentId, rest } = splitTalent(query);
        return call("GET", `${root}/preferences`, talentId, { query: rest });
      },
      update: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PUT", `${root}/preferences`, talentId, { body: rest });
      },
    },
    notificationSettings: {
      get: (options) =>
        call("GET", `${root}/notification-settings`, options?.talentId),
      update: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PUT", `${root}/notification-settings`, talentId, { body: rest });
      },
    },
    payoutSettings: {
      get: (options) => call("GET", `${root}/payout-settings`, options?.talentId),
      update: (input) => {
        const { talentId, rest } = splitTalent(input);
        return call("PUT", `${root}/payout-settings`, talentId, { body: rest });
      },
    },
    integrations: {
      slack: {
        connections: (options) =>
          call("GET", `${root}/integrations/slack`, options?.talentId),
        channels: (query) => {
          const { talentId, rest } = splitTalent(query);
          return call("GET", `${root}/integrations/slack/channels`, talentId, {
            query: rest,
          });
        },
        createBinding: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/integrations/slack`, talentId, { body: rest });
        },
        updateBinding: (id, input) => {
          const { talentId, rest } = splitTalent(input);
          return call(
            "PATCH",
            `${root}/integrations/slack/bindings/${segment(id)}`,
            talentId,
            { body: rest },
          );
        },
        removeBinding: (id, options) =>
          call(
            "DELETE",
            `${root}/integrations/slack/bindings/${segment(id)}`,
            options?.talentId,
          ),
        disconnectInstall: (id, options) =>
          call(
            "DELETE",
            `${root}/integrations/slack/installs/${segment(id)}`,
            options?.talentId,
          ),
        startTest: (id, options) =>
          call(
            "POST",
            `${root}/integrations/slack/bindings/${segment(id)}/test`,
            options?.talentId,
          ),
        getTest: (bindingId, testId, options) =>
          call(
            "GET",
            `${root}/integrations/slack/bindings/${segment(bindingId)}/test/${segment(testId)}`,
            options?.talentId,
          ),
      },
      teams: {
        connections: (options) =>
          call("GET", `${root}/integrations/teams`, options?.talentId),
        channels: (query) => {
          const { talentId, rest } = splitTalent(query);
          return call("GET", `${root}/integrations/teams/channels`, talentId, {
            query: rest,
          });
        },
        createBinding: (input) => {
          const { talentId, rest } = splitTalent(input);
          return call("POST", `${root}/integrations/teams`, talentId, { body: rest });
        },
        updateBinding: (id, input) => {
          const { talentId, rest } = splitTalent(input);
          return call(
            "PATCH",
            `${root}/integrations/teams/bindings/${segment(id)}`,
            talentId,
            { body: rest },
          );
        },
        removeBinding: (id, options) =>
          call(
            "DELETE",
            `${root}/integrations/teams/bindings/${segment(id)}`,
            options?.talentId,
          ),
        disconnectInstall: (id, options) =>
          call(
            "DELETE",
            `${root}/integrations/teams/installs/${segment(id)}`,
            options?.talentId,
          ),
      },
    },
  };

  return api;
}
