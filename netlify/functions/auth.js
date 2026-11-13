const crypto = require("crypto");

exports.handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: "OAUTH_CLIENT_ID is not configured on this site." };
  }

  const siteId = (event.queryStringParameters || {}).site_id || "";
  const origin = /^[a-zA-Z0-9.-]+(:\d+)?$/.test(siteId) ? "https://" + siteId : "";

  const state = Buffer.from(
    JSON.stringify({ n: crypto.randomBytes(8).toString("hex"), o: origin })
  ).toString("base64url");

  const redirectUri = process.env.URL + "/.netlify/functions/callback";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state,
  });

  return {
    statusCode: 302,
    headers: { Location: "https://github.com/login/oauth/authorize?" + params.toString() },
  };
};
