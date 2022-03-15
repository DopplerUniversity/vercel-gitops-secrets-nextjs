import secrets from "gitops-secrets";

const payload = await secrets.providers.doppler.fetch();
secrets.build(payload, { path: "lib/secrets.js" });
