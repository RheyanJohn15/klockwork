export type TalentCall = { talentId?: string };
export type ClientCall = { clientId?: string };

export function requireTalent(
  explicit: string | undefined,
  bound: string | undefined,
): string {
  const id = (explicit ?? bound)?.trim();
  if (!id) {
    throw new Error(
      "A talent id is required for Solo API calls. Pass talentId or call solo.forTalent().",
    );
  }
  return id;
}

export function requireClient(
  explicit: string | undefined,
  bound: string | undefined,
): string {
  const id = (explicit ?? bound)?.trim();
  if (!id) {
    throw new Error(
      "A client id is required for company API calls. Pass clientId or call company.forClient().",
    );
  }
  return id;
}

export function splitTalent<T extends TalentCall>(
  input: T | undefined,
): { talentId?: string; rest: Omit<T, "talentId"> } {
  if (!input) return { rest: {} as Omit<T, "talentId"> };
  const { talentId, ...rest } = input;
  return { talentId, rest: rest as Omit<T, "talentId"> };
}

export function splitClient<T extends ClientCall>(
  input: T | undefined,
): { clientId?: string; rest: Omit<T, "clientId"> } {
  if (!input) return { rest: {} as Omit<T, "clientId"> };
  const { clientId, ...rest } = input;
  return { clientId, rest: rest as Omit<T, "clientId"> };
}

export function segment(id: string): string {
  return encodeURIComponent(id);
}
