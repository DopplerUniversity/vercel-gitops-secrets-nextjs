const secrets = require("gitops-secrets");

module.exports = {
  fetch: () => secrets.fetch(require("./secrets.enc"), { populateEnv: true }),
};
