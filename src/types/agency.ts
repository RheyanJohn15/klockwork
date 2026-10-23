import type { DateFormat, PaymentMethod, TimeFormat, VatStatus, Weekday } from "./common.ts";

export type OrgClientStatus = "active" | "archived";
export type OrgClientInvitationStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked";

export type OrgClient = {
  id: string;
  clerkOrgId: string;
  displayName: string;
  contactPersonName: string;
  invoiceEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  status: OrgClientStatus;
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
  clientClerkOrgId: string | null;
  clerkInvitationId: string | null;
  invitationStatus: OrgClientInvitationStatus | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrgClientInput = {
  displayName: string;
  contactPersonName: string;
  invoiceEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  status?: OrgClientStatus;
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
  linkOrgId?: string;
};

export type UpdateOrgClientInput = Partial<CreateOrgClientInput>;

export type ListOrgClientsQuery = {
  status?: "active" | "archived" | "all";
};

export type OrgClientSummary = {
  assignedTalentCount: number;
  unbilledHours: number;
  outstandingCents: number;
  outstandingCurrency: string;
};

export type OrgClientCreateResult = {
  client: OrgClient;
  invitationSent: boolean;
  linkedImmediately: boolean;
};

export type OrgClientInviteResult = OrgClientCreateResult;

export type OrgClientRevokeInviteResult = {
  client: OrgClient;
  invitationSent: boolean;
};

export type OrgTalentStatus = "active" | "archived" | "pending";

export type OrgTalent = {
  id: string;
  clerkOrgId: string;
  displayName: string;
  contactName: string;
  contactEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  status: OrgTalentStatus;
  unpaidBreakHours: number | null;
  payoutHints: string | null;
  paymentTermsOverride: string | null;
  internalNotes: string | null;
  colorTag: string | null;
  clerkUserId: string | null;
  clerkInvitationId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrgTalentInput = {
  displayName: string;
  contactName: string;
  contactEmail: string;
  hourlyRate: number;
  currency: string;
  hoursPerDay: number;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  status?: OrgTalentStatus;
  unpaidBreakHours?: number | null;
  payoutHints?: string | null;
  paymentTermsOverride?: string | null;
  internalNotes?: string | null;
  colorTag?: string | null;
};

export type UpdateOrgTalentInput = Partial<CreateOrgTalentInput>;

export type ListOrgTalentsQuery = {
  status?: "active" | "archived" | "pending" | "all";
};

export type OrgTalentInviteResult = {
  talent: OrgTalent;
  invitationSent?: boolean;
  linkedImmediately?: boolean;
  warning?: string;
};

export type OrgAssignmentStatus = "active" | "pending" | "ended";

export type OrgAssignment = {
  id: string;
  clerkOrgId: string;
  talentId: string;
  clientId: string;
  status: OrgAssignmentStatus;
  talentDisplayName?: string | null;
  clientDisplayName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrgAssignmentInput =
  | { clientId: string; talentId: string }
  | { clientId: string; talent: CreateOrgTalentInput };

export type UpdateOrgAssignmentInput = {
  status: OrgAssignmentStatus;
};

export type ListOrgAssignmentsQuery = {
  clientId?: string;
  talentId?: string;
  status?: "active" | "pending" | "ended" | "open" | "all";
};

export type OrgTimeSource = "timer" | "manual";
export type OrgOpenStatus = "working" | "break" | "pending";

export type OrgTimeBreakSpan = {
  startedAt: string;
  endedAt: string | null;
  label: string;
};

export type OrgTimeEntry = {
  id: string;
  source: OrgTimeSource;
  talentId: string;
  talentDisplayName: string;
  clientId: string | null;
  clientDisplayName: string | null;
  startedAt: string;
  endedAt: string | null;
  billableHours: number;
  notes: string | null;
  breaks: OrgTimeBreakSpan[];
  openStatus: OrgOpenStatus | null;
};

export type OrgTimeByTalent = {
  talentId: string;
  talentDisplayName: string;
  hourlyRate: number;
  currency: string;
  finishedHours: number;
  estimatedPay: number;
  openStatus: OrgOpenStatus | null;
  entryCount: number;
};

export type OrgTimeSummary = {
  finishedHours: number;
  openTimerCount: number;
  estimatedPay: number;
  currency: string;
};

export type OrgTimeResponse = {
  summary: OrgTimeSummary;
  byTalent: OrgTimeByTalent[];
  entries: OrgTimeEntry[];
};

export type ListOrgTimeQuery = {
  from: string;
  to: string;
};

export type CreateOrgTimeEntryInput = {
  talentId: string;
  clientId?: string | null;
  startedAt: string;
  endedAt: string;
  notes?: string | null;
};

export type OrgInvoiceKind = "studio_talent" | "agency_client";
export type OrgInvoiceStatus = "draft" | "paid" | "void";
export type OrgInvoiceSourceKind = "timer" | "manual";

export type OrgInvoiceLineItem = {
  id: string;
  sourceKind: OrgInvoiceSourceKind;
  sourceId: string | null;
  description: string;
  talentId: string | null;
  talentDisplayName: string | null;
  quantityHours: number;
  unitRateCents: number;
  amountCents: number;
  sortOrder: number;
};

export type OrgInvoice = {
  id: string;
  kind: OrgInvoiceKind;
  talentId: string | null;
  talentDisplayName: string | null;
  clientId: string | null;
  clientDisplayName: string | null;
  fromAt: string;
  toAt: string;
  currency: string;
  status: OrgInvoiceStatus;
  invoicePrefix: string;
  invoiceNumber: number;
  displayNumber: string;
  subtotalCents: number;
  totalCents: number;
  notes: string | null;
  createdAt: string;
  lineItems?: OrgInvoiceLineItem[];
};

export type CreateOrgInvoiceInput = {
  talentId?: string | null;
  clientId?: string | null;
  from: string;
  to: string;
  notes?: string | null;
};

export type OrgPayment = {
  id: string;
  invoiceId: string;
  invoiceDisplayNumber: string;
  talentId: string;
  talentDisplayName: string;
  currency: string;
  amountCents: number;
  method: PaymentMethod;
  paidAt: string;
  createdAt: string;
};

export type CreateOrgPaymentsInput = {
  invoiceIds: string[];
  method: PaymentMethod;
  paidAt?: string;
};

export type OrgBusinessProfile = {
  clerkOrgId: string;
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

export type UpdateOrgBusinessProfileInput = {
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

export type OrgPreferences = {
  clerkOrgId: string;
  timezone: string;
  dateFormat: DateFormat;
  weekStartsOn: Weekday;
  workDaysPerWeek: number;
  timeFormat: TimeFormat;
  defaultCurrency: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOrgPreferencesInput = {
  timezone: string;
  dateFormat: DateFormat;
  weekStartsOn: Weekday;
  workDaysPerWeek: number;
  timeFormat: TimeFormat;
  defaultCurrency: string;
  locale: string;
};

export type OrgNotificationSettings = {
  clerkOrgId: string;
  emailInvoicePaid: boolean;
  emailInviteAccepted: boolean;
  emailPayoutSent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOrgNotificationSettingsInput = {
  emailInvoicePaid: boolean;
  emailInviteAccepted: boolean;
  emailPayoutSent: boolean;
};

export type OrgPortalTalent = {
  assignmentId: string;
  talentId: string;
  displayName: string;
  status: "active" | "pending";
  clientDisplayName: string;
};
