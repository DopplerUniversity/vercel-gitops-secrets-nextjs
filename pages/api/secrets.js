const { loadSecrets } = require("../../lib/secrets");
const secrets = loadSecrets();

export default function handler(req, res) {
  res.status(200).json(secrets);
}
