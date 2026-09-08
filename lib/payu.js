import crypto from "crypto";

export function isPayuEnabled() {
  return Boolean(process.env.PAYU_MERCHANT_KEY && process.env.PAYU_MERCHANT_SALT);
}

export function getPayuActionUrl() {
  return process.env.PAYU_MODE === "live" ? "https://secure.payu.in/_payment" : "https://test.payu.in/_payment";
}

export function generatePayuHash(fields, salt) {
  const { key, txnid, amount, productinfo, firstname, email, udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "" } = fields;
  const hashString = [key, txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5, "", "", "", "", "", salt].join("|");
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

export function verifyPayuResponseHash(fields, salt) {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    hash,
  } = fields;

  if (!hash) return false;

  const hashString = [salt, status, "", "", "", "", "", udf5, udf4, udf3, udf2, udf1, email, firstname, productinfo, amount, txnid, key].join("|");
  const expectedHash = crypto.createHash("sha512").update(hashString).digest("hex");

  const expectedBuffer = Buffer.from(expectedHash.toLowerCase(), "utf8");
  const givenBuffer = Buffer.from(String(hash).toLowerCase(), "utf8");
  if (expectedBuffer.length !== givenBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, givenBuffer);
}
