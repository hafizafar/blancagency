/* ============================================================
   BLANC AGENCY — Content Renderer (reads content/blanc.json)
   ============================================================ */

function escHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function serviceCardHTML(s, i) {
  return (
    '<article class="service-card reveal-up delay-' + (i + 1) + '">' +
      '<div class="service-icon" aria-hidden="true">' + escHtml(s.icon) + "</div>" +
      "<h3>" + escHtml(s.title) + "</h3>" +
      "<p>" + escHtml(s.desc) + "</p>" +
      '<ul class="service-list" aria-label="' + escHtml(s.title) + ' deliverables">' +
        (s.list || []).map(function (li) { return "<li>" + escHtml(li) + "</li>"; }).join("") +
      "</ul>" +
    "</article>"
  );
}

function pillarHTML(p) {
  return (
    '<div class="pillar">' +
      '<span class="pillar-icon" aria-hidden="true">' + escHtml(p.icon) + "</span>" +
      "<strong>" + escHtml(p.title) + "</strong>" +
      "<p>" + escHtml(p.desc) + "</p>" +
    "</div>"
  );
}

function statHTML(s) {
  return (
    '<div class="stat">' +
      '<span class="stat-number">' + escHtml(s.number) + "</span>" +
      '<span class="stat-label">' + escHtml(s.label) + "</span>" +
    "</div>"
  );
}

function processStepHTML(step, i) {
  var num = String(i + 1).padStart(2, "0");
  return (
    '<li class="process-step reveal-up delay-' + (i + 1) + '">' +
      '<span class="step-num" aria-hidden="true">' + num + "</span>" +
      '<div class="step-body">' +
        "<h3>" + escHtml(step.title) + "</h3>" +
        "<p>" + escHtml(step.desc) + "</p>" +
      "</div>" +
    "</li>"
  );
}

function faqItemHTML(item) {
  return (
    '<div class="faq-item">' +
      "<dt>" + escHtml(item.question) + "</dt>" +
      "<dd>" + escHtml(item.answer) + "</dd>" +
    "</div>"
  );
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el && val != null) el.textContent = val;
}

fetch("/content/blanc.json")
  .then(function (res) { return res.json(); })
  .then(function (data) {
    var hero = data.hero || {};
    setText("hero-badge", hero.badge);
    setText("hero-line1", hero.titleLine1);
    setText("hero-accent", hero.titleAccent);
    setText("hero-line2", hero.titleLine2);
    setText("hero-sub", hero.sub);

    var servicesEl = document.getElementById("services-grid");
    if (servicesEl && data.services) servicesEl.innerHTML = data.services.map(serviceCardHTML).join("");

    var about = data.about || {};
    setText("about-text1", about.text1);
    setText("about-text2", about.text2);
    var statsEl = document.getElementById("about-stats");
    if (statsEl && about.stats) statsEl.innerHTML = about.stats.map(statHTML).join("");
    var pillarsEl = document.getElementById("about-pillars");
    if (pillarsEl && about.pillars) pillarsEl.innerHTML = about.pillars.map(pillarHTML).join("");

    var processEl = document.getElementById("process-steps");
    if (processEl && data.process) processEl.innerHTML = data.process.map(processStepHTML).join("");

    var faqEl = document.getElementById("faq-list");
    if (faqEl && data.faq) faqEl.innerHTML = data.faq.map(faqItemHTML).join("");

    setText("contact-desc", (data.contact || {}).desc);

    document.dispatchEvent(new CustomEvent("content:rendered"));
  })
  .catch(function (err) {
    console.error("Failed to load content/blanc.json", err);
    document.dispatchEvent(new CustomEvent("content:rendered"));
  });
