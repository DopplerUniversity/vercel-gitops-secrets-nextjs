const secrets = require("../../lib/secrets").loadSecrets();

export default function handler(req, res) {
  res.status(200).json(Object.keys(secrets));
}
