/* ============================================================
   Decap CMS live preview templates — mirrors the real pages'
   markup/classes so editors see an accurate WYSIWYG preview.
   Reuses the exact same stylesheets as the live site.
   ============================================================ */

function esc(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------------- Blanc Agency (content/blanc.json) ---------------- */

function serviceCardHTML(s) {
  return (
    '<article class="service-card">' +
      '<div class="service-icon" aria-hidden="true">' + esc(s.icon) + "</div>" +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.desc) + "</p>" +
      '<ul class="service-list">' +
        (s.list || []).map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") +
      "</ul>" +
    "</article>"
  );
}
function pillarHTML(p) {
  return (
    '<div class="pillar">' +
      '<span class="pillar-icon" aria-hidden="true">' + esc(p.icon) + "</span>" +
      "<strong>" + esc(p.title) + "</strong>" +
      "<p>" + esc(p.desc) + "</p>" +
    "</div>"
  );
}
function statHTML(s) {
  return (
    '<div class="stat">' +
      '<span class="stat-number">' + esc(s.number) + "</span>" +
      '<span class="stat-label">' + esc(s.label) + "</span>" +
    "</div>"
  );
}
function processStepHTML(step, i) {
  var num = String(i + 1).padStart(2, "0");
  return (
    '<li class="process-step">' +
      '<span class="step-num" aria-hidden="true">' + num + "</span>" +
      '<div class="step-body"><h3>' + esc(step.title) + "</h3><p>" + esc(step.desc) + "</p></div>" +
    "</li>"
  );
}
function faqItemHTML(item) {
  return '<div class="faq-item"><dt>' + esc(item.question) + "</dt><dd>" + esc(item.answer) + "</dd></div>";
}

function buildBlancPreviewHTML(data) {
  var hero = data.hero || {};
  var about = data.about || {};
  var contact = data.contact || {};

  return (
    '<nav class="nav scrolled" style="position:relative;">' +
      '<div class="nav-inner"><span class="logo" style="font-weight:800;">BLANC AGENCY</span></div>' +
    "</nav>" +
    '<section class="hero" style="min-height:auto;padding:48px 0;">' +
      '<div class="hero-content">' +
        '<div class="hero-badge"><span class="badge-dot"></span>' + esc(hero.badge) + "</div>" +
        '<h1 class="hero-title">' +
          '<span class="line">' + esc(hero.titleLine1) + "</span> " +
          '<em class="gradient-text">' + esc(hero.titleAccent) + "</em> " +
          '<span class="line">' + esc(hero.titleLine2) + "</span>" +
        "</h1>" +
        '<p class="hero-sub">' + esc(hero.sub) + "</p>" +
      "</div>" +
    "</section>" +
    '<section class="services section" style="padding-top:0;">' +
      '<div class="container">' +
        '<div class="section-label">What We Do</div>' +
        '<div class="services-grid">' + (data.services || []).map(serviceCardHTML).join("") + "</div>" +
      "</div>" +
    "</section>" +
    '<section class="about section">' +
      '<div class="container">' +
        '<div class="about-inner">' +
          '<div class="about-text">' +
            '<div class="section-label">Why Blanc</div>' +
            "<p>" + esc(about.text1) + "</p>" +
            "<p>" + esc(about.text2) + "</p>" +
            '<div class="about-stats">' + (about.stats || []).map(statHTML).join("") + "</div>" +
          "</div>" +
          '<div class="about-pillars">' + (about.pillars || []).map(pillarHTML).join("") + "</div>" +
        "</div>" +
      "</div>" +
    "</section>" +
    '<section class="process section">' +
      '<div class="container">' +
        '<div class="section-label">How We Work</div>' +
        '<ol class="process-steps">' + (data.process || []).map(processStepHTML).join("") + "</ol>" +
      "</div>" +
    "</section>" +
    '<section class="faq section">' +
      '<div class="container">' +
        '<div class="section-label">Common Questions</div>' +
        '<dl class="faq-list">' + (data.faq || []).map(faqItemHTML).join("") + "</dl>" +
      "</div>" +
    "</section>" +
    '<section class="contact section">' +
      '<div class="container">' +
        '<div class="contact-inner" style="position:relative;">' +
          '<div class="section-label">Get In Touch</div>' +
          "<p class=\"contact-desc\">" + esc(contact.desc) + "</p>" +
        "</div>" +
      "</div>" +
    "</section>"
  );
}

/* ---------------- Sam / Perodua page (content/perodua.json) ---------------- */

function checklistItemHTML(item) {
  return (
    "<li><span class=\"tick\">✓</span><div class=\"body\"><strong>" + esc(item.title) + "</strong>" +
    (item.desc ? "<span>" + esc(item.desc) + "</span>" : "") +
    "</div></li>"
  );
}

function monthlyCardHTML(item) {
  return (
    '<button type="button" class="price-scroll-card">' +
      "<h4>" + esc(item.model) + "</h4>" +
      '<span class="price-scroll-label">Anggaran</span>' +
      '<span class="price-scroll-amount">RM ' + esc(item.monthly) + "<small>/bulan*</small></span>" +
      (item.detail ? '<span class="price-scroll-deposit">' + esc(item.detail) + "</span>" : "") +
      '<span class="price-scroll-ask">Tanya model ni &rarr;</span>' +
    "</button>"
  );
}

function timelineItemHTML(item, i) {
  return (
    '<li><span class="step-num">' + (i + 1) + '</span><div class="body"><strong>' + esc(item.title) + "</strong>" +
    (item.desc ? "<span>" + esc(item.desc) + "</span>" : "") + "</div></li>"
  );
}

function buildSamPreviewHTML(data) {
  var name = data.name || "Sam";
  var hero = data.hero || {};
  var monthly = data.monthly || {};
  var why = data.whyChoose || {};
  var njs = data.notJustSelling || {};
  var faq = data.faq || {};
  var footer = data.footer || {};
  var finalCta = data.finalCta || {};
  var stickers = data.stickers || {};
  var points = (hero.points || []).map(function (t) { return '<li><span class="tick">✓</span>' + esc(t) + "</li>"; }).join("");
  var faqItems = (faq.items || []).map(function (it) {
    return '<details class="faq-item"><summary>' + esc(it.question) + "</summary><p>" + esc(it.answer) + "</p></details>";
  }).join("");

  return (
    '<header class="site-header" style="position:relative;">' +
      '<div class="wrap">' +
        '<span class="wordmark">' + esc(name.toUpperCase()) + '<span class="accent">.</span></span>' +
        '<a class="btn btn-whatsapp btn-sm">WhatsApp ' + esc(name) + "</a>" +
      "</div>" +
    "</header>" +
    '<section class="hero">' +
      (data.photo
        ? '<div class="hero-photo-wrap"><img class="hero-photo" src="' + esc(data.photo) + '" alt="">' +
          '<div class="hero-photo-fade"></div>' +
          '<div class="hero-badge"><span class="hero-badge-dot"></span><span class="hero-badge-name">' + esc(name.toUpperCase()) + '</span>' +
          '<span class="hero-badge-role">' + esc(footer.role || "") + "</span></div></div>"
        : "") +
      '<div class="wrap hero-content">' +
        '<span class="hero-eyebrow">' + esc(hero.eyebrow) + "</span>" +
        "<h1>Cari Kereta, <span class=\"accent\">Cari " + esc(name) + "!</span></h1>" +
        '<p class="lead">' + esc(hero.lead) + "</p>" +
        '<div class="hero-cta"><a class="btn btn-whatsapp btn-lg">WhatsApp ' + esc(name) + " Sekarang</a>" +
          (hero.secondaryButton ? '<a class="btn btn-ghost btn-lg">' + esc(hero.secondaryButton) + " ↓</a>" : "") + "</div>" +
        (hero.note ? '<p class="hero-note">' + esc(hero.note) + "</p>" : "") +
        (points ? '<ul class="hero-points">' + points + "</ul>" : "") +
      "</div>" +
    "</section>" +
    '<section class="section section-surface kira-monthly-section">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          '<span class="eyebrow">' + esc(monthly.eyebrow) + "</span>" +
          '<h2 class="section-title">' + esc(monthly.title) + "</h2>" +
          '<p class="section-desc">' + esc(monthly.desc) + "</p>" +
        "</div>" +
        '<div class="price-scroll"><div class="price-scroll-track">' + (monthly.items || []).map(monthlyCardHTML).join("") + "</div></div>" +
        (monthly.disclaimer ? '<p class="monthly-disclaimer">' + esc(monthly.disclaimer) + "</p>" : "") +
        (monthly.note ? '<p class="monthly-note">' + esc(monthly.note) + "</p>" : "") +
        '<p class="monthly-cta"><a class="btn btn-brand btn-stack"><span class="btn-stack-main">' + esc(monthly.buttonMain) + '</span><span class="btn-stack-sub">' + esc(monthly.buttonSub) + "</span></a></p>" +
      "</div>" +
    "</section>" +
    '<section class="section">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          (stickers.whyChoose ? '<img class="section-sticker" src="' + esc(stickers.whyChoose) + '" alt="">' : "") +
          '<span class="eyebrow">Kenapa Pilih ' + esc(name) + "</span>" +
          '<h2 class="section-title">Why Choose ' + esc(name) + "?</h2>" +
          '<p class="section-desc">' + esc(why.desc) + "</p>" +
        "</div>" +
        '<ul class="checklist-grid">' + (why.items || []).map(checklistItemHTML).join("") + "</ul>" +
      "</div>" +
    "</section>" +
    '<section class="section section-surface">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          '<span class="eyebrow">' + esc(njs.eyebrow) + "</span>" +
          '<h2 class="section-title">' + esc(njs.title) + "</h2>" +
          '<p class="section-desc">' + esc(njs.desc) + "</p>" +
        "</div>" +
        '<ol class="timeline">' + (njs.items || []).map(timelineItemHTML).join("") + "</ol>" +
        '<div class="promise-box"><p>' + esc(njs.closing) + "</p></div>" +
      "</div>" +
    "</section>" +
    (faqItems
      ? '<section class="section"><div class="wrap"><div class="section-head"><span class="eyebrow">' + esc(faq.eyebrow) + '</span><h2 class="section-title">' + esc(faq.title) + '</h2></div><div class="faq-list">' + faqItems + "</div></div></section>"
      : "") +
    '<section class="final-cta">' +
      '<div class="wrap">' +
        (stickers.finalCta ? '<img class="final-cta-sticker" src="' + esc(stickers.finalCta) + '" alt="">' : "") +
        "<h2>" + esc(finalCta.title) + "</h2>" +
        "<p>Chat terus dengan " + esc(name) + " di WhatsApp — survey dulu pun boleh.</p>" +
        '<a class="btn btn-whatsapp btn-lg">WhatsApp ' + esc(name) + " Sekarang</a>" +
      "</div>" +
    "</section>" +
    '<footer class="site-footer">' +
      '<div class="wrap">' +
        (stickers.footer ? '<img class="footer-sticker" src="' + esc(stickers.footer) + '" alt="">' : "") +
        '<div class="footer-name">' + esc(name) + "</div>" +
        '<div class="footer-role">' + esc(footer.role) + "</div>" +
        '<a class="btn btn-whatsapp btn-sm">' + esc(data.whatsapp || "") + "</a>" +
        '<p class="footer-disclaimer">' + esc(footer.disclaimer) + "</p>" +
      "</div>" +
    "</footer>"
  );
}

/* ---------------- Registration ---------------- */

var BlancPreview = createClass({
  render: function () {
    var data = this.props.entry.get("data").toJS();
    return h("div", { dangerouslySetInnerHTML: { __html: buildBlancPreviewHTML(data) } });
  },
});

var SamPreview = createClass({
  render: function () {
    var data = this.props.entry.get("data").toJS();
    return h("div", { dangerouslySetInnerHTML: { __html: buildSamPreviewHTML(data) } });
  },
});

CMS.registerPreviewStyle("/styles_v2.css");
CMS.registerPreviewTemplate("blanc", BlancPreview);

CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");
CMS.registerPreviewStyle("/perodua/style.css");
CMS.registerPreviewTemplate("sam", SamPreview);
