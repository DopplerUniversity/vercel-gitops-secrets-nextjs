const secrets = require("../../lib/secrets").fetch();

export default function handler(req, res) {
  res.status(200).json(Object.keys(secrets));
}
