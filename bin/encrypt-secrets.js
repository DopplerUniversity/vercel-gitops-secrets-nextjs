const secrets = require("gitops-secrets");

async function main() {
  const payload = await secrets.providers.doppler.fetch();
  secrets.build(payload, { path: "lib/secrets.js" });
}

main();
