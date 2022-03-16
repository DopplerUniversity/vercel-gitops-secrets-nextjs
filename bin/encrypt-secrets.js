const secrets = require("gitops-secrets");

secrets.build(secrets.providers.doppler.fetch, { path: "lib/secrets.js" });