const crypto = require("crypto");
const { renderPopup } = require("./_popup");

// Sites allowed to open the CMS login popup with the shared password.
const PASSWORD_LOGIN_ORIGINS = ["https://blanc.my", "https://sam.blanc.my"];

function passwordLoginEnabled() {
  return Boolean(process.env.SAM_PASSWORD && process.env.SAM_GITHUB_TOKEN);
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function html(body, status) {
  return { statusCode: status || 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }, body };
}

function loginPage(siteId, error) {
  const githubHref = "?provider=github&via=github&site_id=" + encodeURIComponent(siteId);
  return html(
    '<!DOCTYPE html><html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    "<title>Log Masuk CMS</title>" +
    "<style>body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;background:#f6f6f8;color:#14161c;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px}" +
    ".card{background:#fff;border-radius:18px;box-shadow:0 8px 24px rgba(20,22,28,.1);padding:28px;width:100%;max-width:340px}" +
    "h1{font-size:1.1rem;margin:0 0 18px}label{display:block;font-size:.8rem;font-weight:700;margin-bottom:6px}" +
    "input{width:100%;box-sizing:border-box;padding:12px;border:1.5px solid #e7e8ec;border-radius:10px;font-size:1rem}" +
    "button,.alt{display:block;width:100%;box-sizing:border-box;margin-top:12px;padding:12px;border-radius:999px;border:0;font-size:.95rem;font-weight:700;text-align:center;text-decoration:none;cursor:pointer}" +
    "button{background:#d81324;color:#fff}.alt{background:#f6f6f8;color:#3a3f4a;font-weight:600;font-size:.85rem}" +
    ".err{color:#a80f1c;font-size:.85rem;margin:10px 0 0}.or{text-align:center;color:#6b7180;font-size:.75rem;margin:16px 0 0}</style></head><body><div class=\"card\">" +
    "<h1>Log masuk untuk edit laman</h1>" +
    (passwordLoginEnabled()
      ? '<form method="POST"><input type="hidden" name="site_id" value="' + esc(siteId) + '">' +
        '<label for="pw">Kata laluan</label><input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>' +
        (error ? '<p class="err">' + esc(error) + "</p>" : "") +
        '<button type="submit">Masuk</button></form><p class="or">atau</p>'
      : "") +
    '<a class="alt" href="' + githubHref + '">Log masuk dengan GitHub</a>' +
    "</div></body></html>"
  );
}

function githubRedirect(event, siteId) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: "OAUTH_CLIENT_ID is not configured on this site." };
  }

  const origin = /^[a-zA-Z0-9.-]+(:\d+)?$/.test(siteId) ? "https://" + siteId : "";
  const state = Buffer.from(
    JSON.stringify({ n: crypto.randomBytes(8).toString("hex"), o: origin })
  ).toString("base64url");

  // Build the callback from the host this request arrived on, so the login
  // popup stays on the same origin as admin/config.yml's base_url.
  const host = (event.headers || {})["x-forwarded-host"] || (event.headers || {}).host;
  const redirectUri = (host ? "https://" + host : process.env.URL) + "/.netlify/functions/callback";

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
}

exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};

  if (event.httpMethod === "POST") {
    if (!passwordLoginEnabled()) return html("Password login is not configured.", 404);
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
    const form = new URLSearchParams(raw);
    const siteId = form.get("site_id") || "";
    const origin = "https://" + siteId;
    if (!PASSWORD_LOGIN_ORIGINS.includes(origin)) return html("Bad request.", 400);

    if (!safeEqual(form.get("password") || "", process.env.SAM_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 1500)); // slow down guessing
      return loginPage(siteId, "Kata laluan salah. Cuba lagi.");
    }
    return html(
      renderPopup("success", JSON.stringify({ token: process.env.SAM_GITHUB_TOKEN, provider: "github" }), origin)
    );
  }

  const siteId = qs.site_id || "";
  if (qs.via === "github") return githubRedirect(event, siteId);
  // Opened by the CMS: let the editor choose password or GitHub.
  return loginPage(siteId, "");
};
