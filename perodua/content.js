/* ============================================================
   SAM — PERODUA PAGE — Content Renderer (reads content/perodua.json)
   ============================================================ */

function escHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el && val != null) el.textContent = val;
}

function modelChipHTML(name) {
  return '<span class="model-chip">' + escHtml(name) + "</span>";
}

function checklistItemHTML(item) {
  return (
    "<li><span class=\"tick\">✓</span><div class=\"body\"><strong>" + escHtml(item.title) + "</strong>" +
    (item.desc ? "<span>" + escHtml(item.desc) + "</span>" : "") +
    "</div></li>"
  );
}

fetch("/content/perodua.json")
  .then(function (res) { return res.json(); })
  .then(function (data) {
    var name = data.name || "Sam";
    var waNumber = data.whatsapp || "";
    var greetingMsg = encodeURIComponent("Hi " + name + ", saya berminat nak tahu lanjut pasal kereta Perodua");
    var greetingHref = "https://wa.me/" + waNumber + "?text=" + greetingMsg;
    var plainHref = "https://wa.me/" + waNumber;

    setText("wordmark-name", name.toUpperCase());
    document.title = name + " — Perodua Sales Broker | Cari Kereta, Cari " + name + "!";

    document.querySelectorAll(".js-wa-link").forEach(function (a) {
      a.href = a.dataset.waText === "plain" ? plainHref : greetingHref;
    });

    setText("wa-label-1", "WhatsApp " + name);
    ["wa-label-2", "wa-label-3", "wa-label-4"].forEach(function (id) { setText(id, "WhatsApp " + name + " Sekarang"); });

    var hero = data.hero || {};
    setText("hero-eyebrow", hero.eyebrow);
    setText("hero-name-accent", "Cari " + name + "!");
    setText("hero-lead", hero.lead);
    setText("hero-note", hero.note);

    var modelStrip = document.getElementById("model-strip");
    if (modelStrip && data.models) modelStrip.innerHTML = data.models.map(modelChipHTML).join("");

    var why = data.whyChoose || {};
    setText("why-eyebrow", "Kenapa Pilih " + name);
    setText("why-title", "Why Choose " + name + "?");
    setText("why-desc", why.desc);
    var whyList = document.getElementById("why-list");
    if (whyList && why.items) whyList.innerHTML = why.items.map(checklistItemHTML).join("");

    var njs = data.notJustSelling || {};
    setText("njs-desc", njs.desc);
    var njsList = document.getElementById("njs-list");
    if (njsList && njs.items) njsList.innerHTML = njs.items.map(checklistItemHTML).join("");
    setText("njs-closing", njs.closing);

    setText("final-cta-sub", "Chat terus dengan " + name + " di WhatsApp — survey dulu pun boleh.");

    var footer = data.footer || {};
    setText("footer-name", name);
    setText("footer-role", footer.role);
    setText("footer-disclaimer", footer.disclaimer);
    var footerWaEl = document.getElementById("footer-wa-number");
    if (footerWaEl) footerWaEl.textContent = "+" + waNumber.replace(/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "$1 $2-$3 $4");
  })
  .catch(function (err) {
    console.error("Failed to load content/perodua.json", err);
  });
