exports.handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};

  let targetOrigin = "*";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
      if (decoded && decoded.o) targetOrigin = decoded.o;
    } catch (e) {
      // keep "*" fallback
    }
  }

  if (!code) {
    return htmlResponse(renderPopup("error", JSON.stringify({ message: "Missing code from GitHub" }), targetOrigin));
  }

  let tokenData;
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: process.env.URL + "/.netlify/functions/callback",
      }),
    });
    tokenData = await tokenRes.json();
  } catch (e) {
    return htmlResponse(renderPopup("error", JSON.stringify({ message: "Token exchange request failed" }), targetOrigin));
  }

  if (tokenData.error || !tokenData.access_token) {
    const message = tokenData.error_description || tokenData.error || "OAuth exchange failed";
    return htmlResponse(renderPopup("error", JSON.stringify({ message }), targetOrigin));
  }

  const successPayload = JSON.stringify({ token: tokenData.access_token, provider: "github" });
  return htmlResponse(renderPopup("success", successPayload, targetOrigin));
};

function htmlResponse(body) {
  return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8" }, body };
}

function renderPopup(kind, jsonPayload, targetOrigin) {
  return (
    "<!DOCTYPE html><html><body>" +
    "<script>" +
    "(function() {" +
    "  function send(msg) {" +
    "    if (window.opener) window.opener.postMessage(msg, " + JSON.stringify(targetOrigin) + ");" +
    "  }" +
    "  function receiveMessage(e) {" +
    "    if (e.data === 'authorizing:github') {" +
    "      window.removeEventListener('message', receiveMessage, false);" +
    "      send('authorization:github:" + kind + ":' + " + JSON.stringify(jsonPayload) + ");" +
    "    }" +
    "  }" +
    "  window.addEventListener('message', receiveMessage, false);" +
    "  send('authorizing:github');" +
    "})();" +
    "</script>" +
    "<p>Authenticating… this window should close automatically.</p>" +
    "</body></html>"
  );
}
