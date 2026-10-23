import type {
  DateFormat,
  PaymentMethod,
  TimeFormat,
  VatStatus,
  Weekday,
} from "./common.ts";

export type SoloClientStatus = "active" | "archived";

export type SoloClient = {
  id: string;
  clerkUserId: string;
  displayName: string;
  contactPersonName: string;
  invoiceEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  status: SoloClientStatus;
  unpaidBreakHours: number | null;
  billingAddress: string | null;
  billingStreet: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingPostal: string | null;
  billingCountry: string | null;
  paymentTermsOverride: string | null;
  internalNotes: string | null;
  colorTag: string | null;
  lastUsedAt: string | null;
  useGlobalWeekSchedule: boolean;
  weekStartsOn: Weekday | null;
  workDaysPerWeek: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSoloClientInput = {
  displayName: string;
  contactPersonName: string;
  invoiceEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  unpaidBreakHours?: number | null;
  billingAddress?: string | null;
  billingStreet?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPostal?: string | null;
  billingCountry?: string | null;
  paymentTermsOverride?: string | null;
  internalNotes?: string | null;
  colorTag?: string | null;
  useGlobalWeekSchedule?: boolean;
  weekStartsOn?: Weekday | null;
  workDaysPerWeek?: number | null;
};

export type UpdateSoloClientInput = Partial<CreateSoloClientInput> & {
  status?: SoloClientStatus;
};

export type ListSoloClientsQuery = {
  status?: "active" | "archived" | "all";
};

export type SoloTaxMode = "none" | "vat_12" | "custom";
export type SoloInvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "void"
  | "paid"
  | "overdue";
export type SoloInvoiceShareStatus = "active" | "revoked" | "expired";
export type SoloInvoiceEventAction =
  | "created"
  | "updated"
  | "voided"
  | "status_changed";

export type SoloInvoiceLineItem = {
  id: string;
  invoiceId: string;
  sessionId: string | null;
  description: string;
  quantityHours: number;
  unitRateCents: number;
  amountCents: number;
  sortOrder: number;
  createdAt: string;
};

export type SoloInvoice = {
  id: string;
  clerkUserId: string;
  clientId: string;
  invoicePrefix: string;
  invoiceNumber: number;
  fromAt: string;
  toAt: string;
  currency: string;
  status: SoloInvoiceStatus;
  paymentTerms: string | null;
  taxMode: SoloTaxMode;
  customTaxLabel: string | null;
  customTaxRateBps: number | null;
  notes: string | null;
  businessSnapshot: Record<string, unknown>;
  payoutSnapshot: Record<string, unknown>;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  lineItems: SoloInvoiceLineItem[];
};

export type SoloInvoiceEvent = {
  id: string;
  clerkUserId: string;
  invoiceId: string;
  action: SoloInvoiceEventAction;
  actorLabel: string;
  reason: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: string;
};

export type SoloInvoiceShareView = {
  id: string;
  shareId: string;
  startedAt: string;
  lastSeenAt: string;
  endedAt: string | null;
  durationMs: number;
  createdAt: string;
};

export type SoloInvoiceShare = {
  id: string;
  clerkUserId: string;
  invoiceId: string;
  token: string;
  createdAt: string;
  revokedAt: string | null;
  expiresAt: string | null;
};

export type SoloInvoiceShareListItem = SoloInvoiceShare & {
  status: SoloInvoiceShareStatus;
  viewCount: number;
  lastViewedAt: string | null;
  totalViewDurationMs: number;
  views: SoloInvoiceShareView[];
};

export type CreateSoloInvoiceInput = {
  clientId: string;
  from: string;
  to: string;
  notes?: string;
};

export type UpdateSoloInvoiceInput = {
  notes?: string;
  dueAt?: string | null;
  paymentTerms?: string | null;
  lineItemDescriptions?: Array<{ id: string; description: string }>;
  reason?: string;
  markSent?: boolean;
};

export type CreateInvoiceShareInput = {
  expiresInDays?: number;
};

export type VoidSoloInvoiceInput = {
  reason?: string;
};

export type ReadyToInvoiceClient = {
  clientId: string;
  clientName: string;
  currency: string;
  amountCents: number;
  billableMs: number;
  sessionCount: number;
};

export type ReadyToInvoiceSummary = {
  clients: ReadyToInvoiceClient[];
  sessionCount: number;
  totalBillableMs: number;
  currency: string | null;
  totalCents: number | null;
};

export type SoloTimesheetShareStatus = "active" | "revoked" | "expired";

export type SoloTimesheetShareView = {
  id: string;
  shareId: string;
  startedAt: string;
  lastSeenAt: string;
  endedAt: string | null;
  durationMs: number;
  createdAt: string;
};

export type SoloTimesheetShare = {
  id: string;
  clerkUserId: string;
  clientId: string;
  fromAt: string;
  toAt: string;
  token: string;
  createdAt: string;
  revokedAt: string | null;
  expiresAt: string | null;
};

export type SoloTimesheetShareListItem = SoloTimesheetShare & {
  status: SoloTimesheetShareStatus;
  viewCount: number;
  lastViewedAt: string | null;
  totalViewDurationMs: number;
  views: SoloTimesheetShareView[];
};

export type CreateTimesheetShareInput = {
  clientId: string;
  from: string;
  to: string;
  expiresInDays?: number;
};

export type ListTimesheetSharesQuery = {
  clientId?: string;
};

export type SoloPaymentAttachment = {
  id: string;
  paymentId: string;
  clerkUserId: string;
  storageBucket: string;
  storagePath: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export type SoloPayment = {
  id: string;
  clerkUserId: string;
  invoiceId: string;
  clientId: string;
  currency: string;
  grossCents: number;
  platformFeeCents: number;
  netCents: number;
  method: PaymentMethod;
  notes: string | null;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  attachments: SoloPaymentAttachment[];
};

export type SoloPaymentListItem = SoloPayment & {
  clientName: string;
  invoicePrefix: string;
  invoiceNumber: number;
};

export type CreateSoloPaymentInput = {
  invoiceId: string;
  method: PaymentMethod;
  notes?: string;
  paidAt?: string;
};

export type SoloPaymentAttachmentUrl = {
  url: string;
  expiresInSeconds: number;
};

export type SoloOverview = {
  activeSession: {
    id: string;
    clientId: string;
    clientName: string;
    status: "working" | "break" | "pending";
    startedAt: string;
    startedAtMs: number;
    summary: string | null;
  } | null;
  outstanding: {
    totalCents: number;
    currency: string;
    invoiceCount: number;
  };
  paidThisMonth: {
    totalCents: number;
    currency: string;
    paymentCount: number;
  };
  medianTimeToPayDays: number | null;
  recentInvoices: Array<{
    id: string;
    clientName: string;
    totalCents: number;
    currency: string;
    status: SoloInvoiceStatus;
    invoicePrefix: string;
    invoiceNumber: number;
  }>;
};

export type SoloBillingPlan = "free" | "pro";

export type SoloBillingAccount = {
  clerkUserId: string;
  plan: SoloBillingPlan;
  platformFeeBps: number;
  source: string;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SoloBillingEvent = {
  id: string;
  clerkUserId: string;
  eventType: "synced" | "plan_changed";
  planBefore: SoloBillingPlan | null;
  planAfter: SoloBillingPlan;
  platformFeeBpsAfter: number;
  meta: Record<string, unknown>;
  createdAt: string;
};

export type SoloBillingSnapshot = {
  account: SoloBillingAccount;
  events: SoloBillingEvent[];
  changed: boolean;
};

export type SoloBillingSyncResult = {
  account: SoloBillingAccount;
  changed: boolean;
};

export type SoloBusinessProfile = {
  clerkUserId: string;
  legalName: string;
  tradeName: string | null;
  tin: string | null;
  vatStatus: VatStatus;
  addressLine: string;
  city: string;
  province: string;
  provinceIso: string;
  country: string;
  invoiceEmail: string;
  phone: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSoloBusinessProfileInput = {
  legalName: string;
  tradeName?: string;
  tin?: string;
  vatStatus: VatStatus;
  addressLine: string;
  city: string;
  province: string;
  provinceIso: string;
  country: string;
  invoiceEmail: string;
  phone?: string;
  website?: string;
};

export type SoloInvoiceDefaults = {
  clerkUserId: string;
  invoicePrefix: string;
  nextNumber: number;
  defaultCurrency: string;
  paymentTerms: string | null;
  taxMode: SoloTaxMode;
  customTaxLabel: string | null;
  customTaxRateBps: number | null;
  defaultNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSoloInvoiceDefaultsInput = {
  invoicePrefix: string;
  nextNumber: number;
  defaultCurrency: string;
  paymentTerms?: string | null;
  taxMode: SoloTaxMode;
  customTaxLabel?: string;
  customTaxRateBps?: number | null;
  defaultNotes?: string;
};

export type SoloTheme = "system" | "light" | "dark";
export type SoloIdleReminderMinutes = 15 | 30 | 60 | null;

export type SoloPreferences = {
  clerkUserId: string;
  timezone: string;
  dateFormat: DateFormat;
  weekStartsOn: Weekday;
  workDaysPerWeek: number;
  theme: SoloTheme;
  timeFormat: TimeFormat;
  defaultCurrency: string;
  idleReminderMinutes: SoloIdleReminderMinutes;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSoloPreferencesInput = {
  timezone: string;
  dateFormat: DateFormat;
  weekStartsOn: Weekday;
  workDaysPerWeek: number;
  theme: SoloTheme;
  timeFormat: TimeFormat;
  defaultCurrency: string;
  idleReminderMinutes: SoloIdleReminderMinutes;
};

export type SoloNotificationSettings = {
  clerkUserId: string;
  emailInvoicePaid: boolean;
  emailPaymentFailed: boolean;
  emailPayoutSent: boolean;
  browserTimerReminder: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSoloNotificationSettingsInput = {
  emailInvoicePaid: boolean;
  emailPaymentFailed: boolean;
  emailPayoutSent: boolean;
  browserTimerReminder: boolean;
};

export type SoloPayoutMethod =
  | "bank_transfer"
  | "gcash"
  | "maya"
  | "wise"
  | "other";
export type SoloPayoutProvider = "manual" | "paymongo";
export type SoloPayoutStatus = "not_started" | "pending" | "verified";

export type SoloPayoutSettings = {
  clerkUserId: string;
  method: SoloPayoutMethod;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  ewalletHandle: string | null;
  paymentInstructions: string | null;
  provider: SoloPayoutProvider;
  status: SoloPayoutStatus;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSoloPayoutSettingsInput = {
  method: SoloPayoutMethod;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ewalletHandle?: string;
  paymentInstructions?: string;
  provider: SoloPayoutProvider;
  status: SoloPayoutStatus;
};

export type SoloTimerSessionStatus =
  | "working"
  | "break"
  | "pending"
  | "completed"
  | "discarded";

export type SoloTimerBreak = {
  id: string;
  sessionId: string;
  label: string;
  plannedMinutes: number;
  note: string;
  startedAt: string;
  startedAtMs: number;
  endedAt: string | null;
  endedAtMs: number | null;
};

export type SoloTimerSession = {
  id: string;
  clerkUserId: string;
  clientId: string;
  orgClientId: string | null;
  status: SoloTimerSessionStatus;
  startedAt: string;
  startedAtMs: number;
  endedAt: string | null;
  endedAtMs: number | null;
  summary: string | null;
  tasks: string | null;
  notes: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  breaks: SoloTimerBreak[];
};

export type StartTimerSessionInput = {
  clientId: string;
  orgClientId?: string | null;
};

export type StartTimerBreakInput = {
  label: string;
  plannedMinutes: number;
  note?: string;
};

export type SaveTimerSessionInput = {
  summary: string;
  tasks?: string;
  notes?: string;
};

export type UpdateOpenTimerSessionInput = {
  summary?: string;
  tasks?: string;
  notes?: string;
};

export type ListTimerSessionsQuery = {
  from: string;
  to: string;
  clientId?: string;
  status?: SoloTimerSessionStatus;
  includeDeleted?: boolean;
};

export type CreateManualTimerSessionInput = {
  clientId: string;
  orgClientId?: string | null;
  startedAt: string;
  endedAt: string;
  unpaidBreakMinutes?: number;
  summary: string;
  tasks?: string;
  notes?: string;
  billable?: boolean;
};

export type UpdateCompletedTimerSessionInput = {
  summary?: string;
  tasks?: string;
  notes?: string;
  startedAt?: string;
  endedAt?: string;
  unpaidBreakMinutes?: number;
  reason?: string;
};

export type DeleteCompletedTimerSessionInput = {
  reason: string;
};

export type SoloTimerSessionEventAction = "created" | "updated" | "deleted";

export type SoloTimerSessionSnapshot = {
  startedAt: string;
  endedAt: string | null;
  unpaidBreakMinutes: number;
  summary: string | null;
  tasks: string | null;
  notes: string | null;
  billableMs: number;
};

export type SoloTimerSessionEvent = {
  id: string;
  clerkUserId: string;
  sessionId: string;
  clientId: string;
  action: SoloTimerSessionEventAction;
  actorLabel: string;
  reason: string | null;
  before: SoloTimerSessionSnapshot | null;
  after: SoloTimerSessionSnapshot | null;
  createdAt: string;
};

export type SoloSlackChannel = { id: string; name: string };

export type SoloSlackInstall = {
  id: string;
  clerkUserId: string;
  teamId: string;
  teamName: string | null;
  botUserId: string | null;
  slackUserId: string | null;
  connectedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SoloSlackBinding = {
  id: string;
  installId: string;
  clerkUserId: string;
  channelId: string;
  channelName: string | null;
  defaultClientId: string | null;
  messageCheckIn: string;
  messageCheckOut: string;
  messageBreak: string;
  enabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  teamId?: string | null;
  teamName?: string | null;
  defaultClientName?: string | null;
};

export type SoloSlackConnections = {
  installs: SoloSlackInstall[];
  bindings: SoloSlackBinding[];
};

export type CreateSoloSlackBindingInput = {
  installId: string;
  channelId: string;
  channelName: string | null;
  defaultClientId: string;
  messageCheckIn: string;
  messageCheckOut: string;
  messageBreak: string;
  enabled?: boolean;
};

export type UpdateSoloSlackBindingInput = {
  channelId?: string;
  channelName?: string | null;
  defaultClientId?: string | null;
  messageCheckIn?: string;
  messageCheckOut?: string;
  messageBreak?: string;
  enabled?: boolean;
};

export type SoloSlackBindingTestStatus = "pending" | "received" | "failed";

export type SoloSlackBindingTest = {
  id: string;
  bindingId: string;
  channelId: string;
  status: SoloSlackBindingTestStatus;
  error: string | null;
  createdAt: string | null;
  receivedAt: string | null;
};

export type SoloTeamsChannel = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
};

export type SoloTeamsInstall = {
  id: string;
  clerkUserId: string;
  tenantId: string;
  accountName: string | null;
  microsoftUserId: string | null;
  connectedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SoloTeamsBinding = {
  id: string;
  installId: string;
  clerkUserId: string;
  teamId: string;
  teamName: string | null;
  channelId: string;
  channelName: string | null;
  defaultClientId: string | null;
  messageCheckIn: string;
  messageCheckOut: string;
  messageBreak: string;
  enabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  accountName?: string | null;
  defaultClientName?: string | null;
};

export type SoloTeamsConnections = {
  installs: SoloTeamsInstall[];
  bindings: SoloTeamsBinding[];
};

export type CreateSoloTeamsBindingInput = {
  installId: string;
  teamId: string;
  teamName: string | null;
  channelId: string;
  channelName: string | null;
  defaultClientId: string;
  messageCheckIn: string;
  messageCheckOut: string;
  messageBreak: string;
  enabled?: boolean;
};

export type UpdateSoloTeamsBindingInput = {
  teamId?: string;
  teamName?: string | null;
  channelId?: string;
  channelName?: string | null;
  defaultClientId?: string | null;
  messageCheckIn?: string;
  messageCheckOut?: string;
  messageBreak?: string;
  enabled?: boolean;
};
