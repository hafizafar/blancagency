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

function showImg(id, src) {
  var el = document.getElementById(id);
  if (el && src) {
    el.src = src;
    el.hidden = false;
  }
}

function checklistItemHTML(item) {
  return (
    "<li><span class=\"tick\">✓</span><div class=\"body\"><strong>" + escHtml(item.title) + "</strong>" +
    (item.desc ? "<span>" + escHtml(item.desc) + "</span>" : "") +
    "</div></li>"
  );
}

function composeWaMessage(name, phone, model) {
  return (
    "Hi, saya " + name + " (" + phone + "). " +
    "Saya berminat dengan Perodua " + model + ", boleh bantu saya semak harga & monthly?"
  );
}

function submitLeadAndOpenWhatsApp(waNumber, payload) {
  var waLink = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(composeWaMessage(payload.name, payload.phone, payload.model));

  var body = new URLSearchParams({ "form-name": "sam-lead-form" });
  Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    keepalive: true,
  }).catch(function () {});

  window.open(waLink, "_blank");
}

function wireCtaModal(waNumber, models) {
  var modal = document.getElementById("cta-modal");
  var form = document.getElementById("cta-modal-form");
  if (!modal || !form) return;

  var modelSelect = document.getElementById("cta-modal-model");
  var ctaInput = document.getElementById("cta-modal-cta");

  var modelOptions = '<option value="">Pilih model</option>' +
    (models || []).map(function (m) { return '<option value="' + escHtml(m) + '">' + escHtml(m) + "</option>"; }).join("") +
    '<option value="Lain-lain / Belum Pasti">Lain-lain / Belum Pasti</option>';

  function openModal(ctaLabel) {
    ctaInput.value = ctaLabel || "";
    modelSelect.innerHTML = modelOptions;
    modal.classList.add("cta-modal-active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("cta-modal-active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".js-wa-link").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(a.getAttribute("data-cta") || "");
    });
  });

  document.getElementById("cta-modal-close").addEventListener("click", closeModal);
  document.getElementById("cta-modal-overlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("cta-modal-active")) closeModal();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.querySelector('[name="name"]').value.trim();
    var phone = form.querySelector('[name="phone"]').value.trim();
    var model = form.querySelector('[name="model"]').value.trim();

    submitLeadAndOpenWhatsApp(waNumber, { name: name, phone: phone, model: model, cta: ctaInput.value });
    form.reset();
    closeModal();
  });
}

fetch("/content/perodua.json")
  .then(function (res) { return res.json(); })
  .then(function (data) {
    var name = data.name || "Sam";
    var waNumber = data.whatsapp || "";

    setText("wordmark-name", name.toUpperCase());
    document.title = name + " — Perodua Sales Broker | Cari Kereta, Cari " + name + "!";

    var heroPhotoEl = document.getElementById("hero-photo");
    var heroBannerWrapEl = document.getElementById("hero-banner-wrap");
    if (heroPhotoEl && heroBannerWrapEl && data.photo) {
      heroPhotoEl.src = data.photo;
      heroPhotoEl.alt = name;
      heroBannerWrapEl.hidden = false;
    }
    setText("banner-name", name.toUpperCase());
    var bannerRoleEl = document.getElementById("banner-role");
    if (bannerRoleEl && data.footer && data.footer.role) bannerRoleEl.textContent = data.footer.role;

    wireCtaModal(waNumber, data.models);
    setText("cta-modal-sub", "Lengkapkan maklumat ni, terus disambungkan ke WhatsApp " + name + ".");

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
    setText("njs-eyebrow", njs.eyebrow);
    setText("njs-title", njs.title);
    setText("njs-desc", njs.desc);
    var njsList = document.getElementById("njs-list");
    if (njsList && njs.items) njsList.innerHTML = njs.items.map(checklistItemHTML).join("");
    setText("njs-closing", njs.closing);

    var finalCta = data.finalCta || {};
    setText("final-cta-title", finalCta.title);
    setText("final-cta-sub", "Chat terus dengan " + name + " di WhatsApp — survey dulu pun boleh.");

    var stickers = data.stickers || {};
    showImg("why-sticker", stickers.whyChoose);
    showImg("final-cta-sticker", stickers.finalCta);
    showImg("footer-sticker", stickers.footer);

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
