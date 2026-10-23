# klockwork

Client for the [Klockwork](https://klockwork.org) public API. Create an agency API key in the app, then call agency, solo, and company routes from another service.

The client sends the key in `X-Klockwork-Key`. Solo calls also send `X-Klockwork-Talent`. Company calls also send `X-Klockwork-Client`.

Production requests go to `https://klockwork.org`. Local requests go to `http://localhost:3001`.

## Install

```bash
npm install klockwork
```

Requires Node.js 18 or newer. The package uses the global `fetch` API and has no runtime dependencies. Browser pages on other origins are blocked by the API CORS allowlist, so call this client from a server.

## Use

```ts
import { Klockwork } from "klockwork";

const kw = new Klockwork({
  apiKey: process.env.KLOCKWORK_API_KEY!,
});

const { clients } = await kw.agency.clients.list();

const solo = kw.solo.forTalent("user_abc");
await solo.timer.session.start({ clientId: "00000000-0000-4000-8000-000000000001" });

const company = kw.company.forClient("00000000-0000-4000-8000-000000000002");
const { invoices } = await company.invoices.list();
```

Point the same key at a local backend:

```ts
const kw = new Klockwork({
  apiKey: process.env.KLOCKWORK_API_KEY!,
  environment: "local",
});
```

`baseUrl` overrides `environment` when you need another host. You can also set a default `talentId` or `clientId` on the constructor and override either value on a single call.

Failed responses throw `KlockworkError` with `status`, `error`, and `details`.

## Publish

```bash
npm test
npm publish
```

`prepublishOnly` builds `dist` (ESM, CommonJS, and type declarations) before the package is uploaded.
