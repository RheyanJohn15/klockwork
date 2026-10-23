import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Klockwork, KlockworkError } from "../src/index.ts";

const KEY = "kw_test_secret";
const TALENT = "user_abc";
const CLIENT = "00000000-0000-4000-8000-000000000002";
const ID = "00000000-0000-4000-8000-000000000001";

type Call = {
  url: string;
  method: string;
  headers: Headers;
  body: unknown;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function installFetch(response: Response | ((call: Call) => Response)) {
  const calls: Call[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    let body: unknown = init?.body;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      headers,
      body,
    };
    calls.push(call);
    return typeof response === "function" ? response(call) : response.clone();
  };
  return { fetchImpl, calls };
}

function client(
  fetchImpl: typeof fetch,
  options: ConstructorParameters<typeof Klockwork>[0] = { apiKey: KEY },
) {
  return new Klockwork({ ...options, apiKey: options.apiKey ?? KEY, fetch: fetchImpl });
}

describe("Klockwork initializer", () => {
  it("rejects a missing or non-kw_ key", () => {
    assert.throws(() => new Klockwork({ apiKey: "" }), /kw_/);
    assert.throws(() => new Klockwork({ apiKey: "sk_live" }), /kw_/);
  });

  it("uses production by default, localhost:3001 for local, and baseUrl when set", async () => {
    const prod = installFetch(jsonResponse({ clients: [] }));
    await client(prod.fetchImpl).agency.clients.list();
    assert.equal(
      prod.calls[0]?.url,
      "https://klockwork.org/api/public/agency/clients",
    );

    const local = installFetch(jsonResponse({ clients: [] }));
    await client(local.fetchImpl, {
      apiKey: KEY,
      environment: "local",
    }).agency.clients.list();
    assert.equal(
      local.calls[0]?.url,
      "http://localhost:3001/api/public/agency/clients",
    );

    const custom = installFetch(jsonResponse({ clients: [] }));
    await client(custom.fetchImpl, {
      apiKey: KEY,
      environment: "local",
      baseUrl: "https://preview.example/",
    }).agency.clients.list();
    assert.equal(
      custom.calls[0]?.url,
      "https://preview.example/api/public/agency/clients",
    );
  });
});

describe("request headers and errors", () => {
  it("sends X-Klockwork-Key and JSON headers on agency calls", async () => {
    const mock = installFetch(jsonResponse({ client: { id: ID } }, 201));
    await client(mock.fetchImpl).agency.clients.create({
      displayName: "Acme",
      contactPersonName: "Ada",
      invoiceEmail: "ada@acme.test",
      hourlyRate: 100,
      currency: "PHP",
      hoursPerDay: 8,
      shiftStart: "09:00",
      shiftEnd: "18:00",
      timezone: "Asia/Manila",
    });
    const call = mock.calls[0];
    assert.ok(call);
    assert.equal(call.method, "POST");
    assert.equal(call.headers.get("x-klockwork-key"), KEY);
    assert.equal(call.headers.get("accept"), "application/json");
    assert.equal(call.headers.get("content-type"), "application/json");
    assert.equal(call.headers.get("user-agent"), "klockwork/0.1.0");
    assert.equal(call.headers.get("x-klockwork-talent"), null);
    assert.equal(call.headers.get("x-klockwork-client"), null);
    assert.equal((call.body as { displayName: string }).displayName, "Acme");
  });

  it("sends the talent header from forTalent, the constructor, or the call", async () => {
    const mock = installFetch(jsonResponse({ clients: [] }));
    const kw = client(mock.fetchImpl, { apiKey: KEY, talentId: "user_default" });
    await kw.solo.clients.list();
    await kw.solo.forTalent(TALENT).clients.list({ status: "all" });
    await kw.solo.clients.list({ talentId: "user_call", status: "archived" });

    assert.equal(mock.calls[0]?.headers.get("x-klockwork-talent"), "user_default");
    assert.equal(mock.calls[1]?.headers.get("x-klockwork-talent"), TALENT);
    assert.equal(
      mock.calls[1]?.url,
      "https://klockwork.org/api/public/solo/clients?status=all",
    );
    assert.equal(mock.calls[2]?.headers.get("x-klockwork-talent"), "user_call");
    assert.equal(mock.calls[2]?.headers.get("x-klockwork-key"), KEY);
  });

  it("requires a talent id before calling solo", async () => {
    const mock = installFetch(jsonResponse({}));
    await assert.rejects(
      () => client(mock.fetchImpl).solo.clients.list(),
      /talent/i,
    );
    assert.equal(mock.calls.length, 0);
  });

  it("sends the client header and time query for company calls", async () => {
    const mock = installFetch(jsonResponse({ summary: {}, byTalent: [], entries: [] }));
    await client(mock.fetchImpl)
      .company.forClient(CLIENT)
      .time.list({ from: "2026-01-01", to: "2026-02-01" });
    const call = mock.calls[0];
    assert.ok(call);
    assert.equal(call.headers.get("x-klockwork-client"), CLIENT);
    assert.equal(call.headers.get("x-klockwork-key"), KEY);
    assert.equal(
      call.url,
      `https://klockwork.org/api/public/company/time?from=2026-01-01&to=2026-02-01`,
    );
  });

  it("uploads payment proof as multipart without a JSON content type", async () => {
    const mock = installFetch(jsonResponse({ attachment: { id: ID } }, 201));
    const file = new Blob(["proof"], { type: "application/pdf" });
    await client(mock.fetchImpl, { apiKey: KEY, talentId: TALENT }).solo.payments.uploadAttachment(
      ID,
      file,
      { filename: "proof.pdf" },
    );
    const call = mock.calls[0];
    assert.ok(call);
    assert.equal(call.method, "POST");
    assert.equal(
      call.url,
      `https://klockwork.org/api/public/solo/payments/${ID}/attachments`,
    );
    assert.equal(call.headers.get("content-type"), null);
    assert.ok(call.body instanceof FormData);
    assert.ok(call.body.get("file") instanceof Blob);
  });

  it("throws KlockworkError with status, error, and details", async () => {
    const mock = installFetch(
      jsonResponse(
        { error: "Choose an organization", details: { code: "choose_org" } },
        409,
      ),
    );
    await assert.rejects(
      () => client(mock.fetchImpl).agency.clients.list(),
      (err: unknown) => {
        assert.ok(err instanceof KlockworkError);
        assert.equal(err.status, 409);
        assert.equal(err.error, "Choose an organization");
        assert.deepEqual(err.details, { code: "choose_org" });
        return true;
      },
    );
  });

  it("throws KlockworkError when the error body is not JSON", async () => {
    const mock = installFetch(new Response("nope", { status: 502 }));
    await assert.rejects(
      () => client(mock.fetchImpl).agency.clients.list(),
      (err: unknown) => {
        assert.ok(err instanceof KlockworkError);
        assert.equal(err.status, 502);
        assert.match(err.error, /nope|502/);
        return true;
      },
    );
  });
});

describe("public routes", () => {
  const cases: Array<{
    name: string;
    method: string;
    path: string;
    run: (kw: Klockwork) => Promise<unknown>;
  }> = [
    {
      name: "agency clients",
      method: "GET",
      path: "/api/public/agency/clients/id-1",
      run: (kw) => kw.agency.clients.get("id-1"),
    },
    {
      name: "agency talents invite",
      method: "POST",
      path: "/api/public/agency/talents/id-1/invite",
      run: (kw) => kw.agency.talents.invite("id-1"),
    },
    {
      name: "agency assignments",
      method: "PATCH",
      path: "/api/public/agency/assignments/id-1",
      run: (kw) => kw.agency.assignments.update("id-1", { status: "ended" }),
    },
    {
      name: "agency time",
      method: "GET",
      path: "/api/public/agency/time?from=a&to=b",
      run: (kw) => kw.agency.time.list({ from: "a", to: "b" }),
    },
    {
      name: "agency invoice void",
      method: "POST",
      path: "/api/public/agency/invoices/id-1/void",
      run: (kw) => kw.agency.invoices.void("id-1"),
    },
    {
      name: "agency payments",
      method: "POST",
      path: "/api/public/agency/payments",
      run: (kw) =>
        kw.agency.payments.create({ invoiceIds: [ID], method: "bank" }),
    },
    {
      name: "agency settings",
      method: "PUT",
      path: "/api/public/agency/notification-settings",
      run: (kw) =>
        kw.agency.notificationSettings.update({
          emailInvoicePaid: true,
          emailInviteAccepted: true,
          emailPayoutSent: false,
        }),
    },
    {
      name: "solo timer break",
      method: "POST",
      path: "/api/public/solo/timer/session/break/start",
      run: (kw) =>
        kw.solo.timer.session.break.start({ label: "Lunch", plannedMinutes: 30 }),
    },
    {
      name: "solo sessions",
      method: "DELETE",
      path: `/api/public/solo/timer/sessions/${ID}`,
      run: (kw) => kw.solo.timer.sessions.remove(ID, { reason: "duplicate" }),
    },
    {
      name: "solo invoice share revoke",
      method: "POST",
      path: `/api/public/solo/invoices/shares/${ID}/revoke`,
      run: (kw) => kw.solo.invoices.revokeShare(ID),
    },
    {
      name: "solo unbilled",
      method: "GET",
      path: "/api/public/solo/invoices/unbilled",
      run: (kw) => kw.solo.invoices.unbilled(),
    },
    {
      name: "solo timesheet",
      method: "GET",
      path: `/api/public/solo/timesheet/shares?clientId=${ID}`,
      run: (kw) => kw.solo.timesheet.shares.list({ clientId: ID }),
    },
    {
      name: "solo billing sync",
      method: "POST",
      path: "/api/public/solo/billing",
      run: (kw) => kw.solo.billing.sync(),
    },
    {
      name: "solo slack test",
      method: "GET",
      path: `/api/public/solo/integrations/slack/bindings/${ID}/test/${ID}`,
      run: (kw) => kw.solo.integrations.slack.getTest(ID, ID),
    },
    {
      name: "solo teams disconnect",
      method: "DELETE",
      path: `/api/public/solo/integrations/teams/installs/${ID}`,
      run: (kw) => kw.solo.integrations.teams.disconnectInstall(ID),
    },
    {
      name: "company invoices",
      method: "GET",
      path: `/api/public/company/invoices/${ID}`,
      run: (kw) => kw.company.invoices.get(ID),
    },
    {
      name: "company talents",
      method: "GET",
      path: "/api/public/company/talents",
      run: (kw) => kw.company.talents.list(),
    },
  ];

  for (const item of cases) {
    it(`calls ${item.name}`, async () => {
      const mock = installFetch(jsonResponse({}));
      const kw = client(mock.fetchImpl, {
        apiKey: KEY,
        talentId: TALENT,
        clientId: CLIENT,
      });
      await item.run(kw);
      const call = mock.calls[0];
      assert.ok(call);
      assert.equal(call.method, item.method);
      assert.equal(call.url, `https://klockwork.org${item.path}`);
      if (item.path.startsWith("/api/public/solo")) {
        assert.equal(call.headers.get("x-klockwork-talent"), TALENT);
      }
      if (item.path.startsWith("/api/public/company")) {
        assert.equal(call.headers.get("x-klockwork-client"), CLIENT);
      }
    });
  }
});
