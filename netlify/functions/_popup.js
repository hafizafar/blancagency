// Shared by auth.js and callback.js: the small page that hands a token back to
// the CMS window (Decap's popup protocol).
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

module.exports = { renderPopup };
