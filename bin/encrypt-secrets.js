const secrets = require("gitops-secrets");

secrets.encryptToFile(secrets.providers.doppler.fetch(), { path: "lib/secrets.enc.js" });
