/* ==========================================================================
   Wedding invitation — behaviour. Content lives in config.js.
   Sections: helpers · content · envelope · nav · gallery · forms · gifts
   ========================================================================== */
(() => {
  "use strict";
  const C = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IMG = "assets/img/";

  /* ------------------------------ helpers ------------------------------ */
  function el(tag, attrs = {}, kids = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach((c) => c != null && n.append(c.nodeType ? c : document.createTextNode(c)));
    return n;
  }
  function photo(key, { sizes = "100vw", eager = false, cls = "" } = {}) {
    const p = C.photos[key];
    if (!p) return el("span");
    return el("img", {
      class: cls, src: `${IMG}${key}-lg.webp`, srcset: `${IMG}${key}-sm.webp 640w, ${IMG}${key}-lg.webp 1500w`,
      sizes, width: p.w, height: p.h, alt: p.alt || "", loading: eager ? null : "lazy", decoding: "async",
    });
  }
  const toastEl = $("#toast"); let toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2400);
  }

  /* ------------------------------ content ------------------------------ */
  const d = new Date(C.dateISO);
  const part = (o) => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", ...o }).format(d);
  const wd = part({ weekday: "long" }), day = part({ day: "numeric" }), month = part({ month: "long" }), year = part({ year: "numeric" });
  const city = (C.venue.addressLines[C.venue.addressLines.length - 1] || "").split(",")[0];
  const fullDate = `${day} ${month} ${year}`;
  const binds = {
    groom: C.groom, bride: C.bride, hint: C.envelope.hint, tap: C.envelope.tap,
    cardLine1: C.envelope.cardLines[0], cardLine2: C.envelope.cardLines[1],
    cardDate: fullDate, cardVenue: `${C.venue.name} · ${city}`,
    introLine: C.introLine, heroDate: `${wd} · ${fullDate}`, heroWhere: `${C.timeLabel} · ${C.venue.name}, ${city}`,
    storyIntro: C.storyIntro, menuFoot: `${C.groom} & ${C.bride} · ${day}.${part({ month: "2-digit" })}.${year}`,
    footerDate: fullDate,
  };
  $$("[data-bind]").forEach((n) => (n.textContent = binds[n.dataset.bind] ?? ""));
  document.title = `${C.groom} & ${C.bride} · ${fullDate}`;

  // hero
  const heroImg = $("#heroImg");
  const hp = C.photos[C.heroPhoto];
  Object.entries({ src: `${IMG}${C.heroPhoto}-lg.webp`, srcset: `${IMG}${C.heroPhoto}-sm.webp 640w, ${IMG}${C.heroPhoto}-lg.webp 1500w`,
    sizes: "(min-width:900px) 430px, 72vw", width: hp.w, height: hp.h, alt: hp.alt }).forEach(([k, v]) => heroImg.setAttribute(k, v));

  // countdown
  const cd = $("#countdown");
  function tick() {
    const ms = d - Date.now();
    if (ms <= 0) { cd.hidden = true; return; }
    const dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60;
    cd.hidden = false;
    cd.replaceChildren(...[[dd, "days"], [hh, "hours"], [mm, "mins"]].map(([n, l]) => el("div", {}, [el("b", { text: String(n).padStart(2, "0") }), el("span", { text: l })])));
  }
  tick(); setInterval(tick, 30000);

  // story
  const ordinal = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
  const chapters = $("#chapters");
  C.story.forEach((ch, i) => {
    const photos = [].concat(ch.photo || []).filter(Boolean);
    const sizes = "(min-width:900px) 420px, 88vw";
    let visual = null;
    if (photos.length === 1) visual = el("div", { class: "frame" }, photo(photos[0], { sizes }));
    else if (photos.length > 1) visual = el("div", { class: "pair" }, [
      el("div", { class: "frame" }, photo(photos[0], { sizes })),
      el("div", { class: "frame frame-b" }, photo(photos[1], { sizes: "220px" })),
    ]);
    const text = el("div", { class: "ch-text" }, [
      el("span", { class: "eyebrow", text: ch.kicker || `Chapter ${ordinal[i] || i + 1}` }),
      el("h3", { class: "ch-title", text: ch.title }),
      ch.big ? el("p", { class: "ch-big", text: ch.big }) : null,
      ...(ch.text || []).map((t) => el("p", { text: t })),
    ]);
    chapters.append(el("li", { class: "chapter reveal" + (visual ? "" : " no-photo") }, [visual && el("div", { class: "ch-photo" }, visual), text]));
  });
  $("#foreverLine").textContent = C.story[C.story.length - 1].closing || `Our forever begins on ${fullDate}.`;

  // gallery — grouped "plates"; lightbox walks the flat list in display order
  const flat = [];
  const grid = $("#grid");
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  C.gallery.forEach((g, gi) => {
    const plate = el("section", { class: "plate reveal", "aria-label": g.title }, [
      el("header", { class: "plate-head" }, [el("span", { class: "plate-no", text: roman[gi] || String(gi + 1) }), el("h3", { text: g.title }), g.sub ? el("p", { text: g.sub }) : null]),
    ]);
    g.rows.forEach((row) => {
      const r = el("div", { class: "plate-row" });
      row.forEach(({ k, span }) => {
        const idx = flat.push(k) - 1;
        const p = C.photos[k];
        const b = el("button", { class: `tile s${span}`, type: "button", style: `--ar:${p.w}/${p.h}`, "aria-label": `Open photo: ${p.alt}` },
          photo(k, { sizes: span >= 4 ? "(min-width:900px) 52vw, 96vw" : "(min-width:900px) 28vw, 48vw" }));
        b.addEventListener("click", () => openLB(idx));
        r.append(b);
      });
      plate.append(r);
    });
    grid.append(plate);
  });
  C.galleryFlat = flat;

  // details
  $("#dateBlock").append(el("p", { class: "dow", text: wd }), el("p", { class: "day", text: day }), el("p", { class: "my", text: `${month} ${year}` }));
  const v = C.venue, facts = $("#facts");
  const fact = (dt, dd, small) => facts.append(el("div", { class: "fact" }, [el("dt", { text: dt }), el("dd", {}, [dd, small ? el("small", { text: small }) : null])]));
  fact("Ceremony", C.timeLabel, `${wd}, ${fullDate}`);
  fact("Venue", v.name, v.addressLines.join(", "));
  if (v.dressCode) fact("Dress code", v.dressCode);
  if (v.note) fact("Note", v.note);
  const mapsHref = v.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(v.mapsQuery)}`;
  const wrap = el("div", { class: "facts-wrap" });
  facts.replaceWith(wrap); wrap.append(facts, el("a", { class: "btn", href: mapsHref, target: "_blank", rel: "noopener", text: "Get directions" }));
  if (C.rsvp.deadline) $("#rsvpLede").textContent = `Kindly reply by ${C.rsvp.deadline}.`;

  /* ------------------------------ envelope ------------------------------ */
  const intro = $("#intro"), env = $("#env"), app = $("#app");
  let opened = false, finished = false;
  const timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  function fitCard() {
    const w = env.getBoundingClientRect().width || 400;
    const target = Math.min(innerWidth * 0.84, 470), hMax = innerHeight * 0.78;
    const cs = Math.min(target / (w * 0.64), hMax / (w / 1.4 * 0.9));
    intro.style.setProperty("--cs", cs.toFixed(3));
  }
  fitCard(); addEventListener("resize", fitCard);

  function revealSite() {
    if (finished) return; finished = true;
    timers.forEach(clearTimeout);
    intro.classList.add("is-done");
    app.removeAttribute("inert");
    document.body.classList.remove("is-locked");
    scrollTo(0, 0);
    $$(".hero .reveal").forEach((n, i) => (n.style.transitionDelay = `${250 + i * 110}ms`));
    startObservers();
    setTimeout(() => { intro.style.display = "none"; $$(".hero .reveal").forEach((n) => (n.style.transitionDelay = "")); }, 1300);
    if (location.hash && $(location.hash)) setTimeout(() => $(location.hash).scrollIntoView(), 50);
  }
  function openEnvelope() {
    if (opened) return; opened = true;
    if (reduce) { revealSite(); return; }
    intro.classList.add("s-seal");
    later(200, () => intro.classList.add("s-open"));
    later(1000, () => intro.classList.add("s-rise"));
    later(2150, () => intro.classList.add("s-present"));
    later(3700, () => { intro.classList.add("s-leave"); revealSite(); });
  }
  env.addEventListener("click", openEnvelope);
  $("#introSkip").addEventListener("click", () => { opened = true; revealSite(); });
  // gentle pointer tilt (desktop only)
  if (!reduce && matchMedia("(hover:hover)").matches) {
    intro.addEventListener("pointermove", (e) => {
      if (opened) return;
      env.style.setProperty("--ty", ((e.clientX / innerWidth - 0.5) * 8).toFixed(2) + "deg");
      env.style.setProperty("--tx", ((0.5 - e.clientY / innerHeight) * 6).toFixed(2) + "deg");
    });
  }

  /* ------------------------------ nav & reveal ------------------------------ */
  const nav = $("#nav"), menu = $("#menu"), toggle = $("#navToggle");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open")); $("a", menu).focus(); }
    else { menu.classList.remove("is-open"); setTimeout(() => (menu.hidden = true), reduce ? 0 : 450); }
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); } });

  function startObservers() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach((n) => io.observe(n));
    const links = $$(".nav-links a");
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => so.observe(s));
  }

  /* ------------------------------ lightbox ------------------------------ */
  const lb = $("#lb"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
  let li = 0, lastFocus = null, tx = 0;
  function showLB(i, first) {
    const n = C.galleryFlat.length; li = (i + n) % n;
    const k = C.galleryFlat[li];
    const apply = () => { lbImg.onload = () => lbImg.classList.remove("is-swap"); lbImg.src = `${IMG}${k}-lg.webp`; lbImg.alt = C.photos[k].alt || ""; };
    lbCount.textContent = `${li + 1} / ${n}`;
    if (first || reduce) apply(); else { lbImg.classList.add("is-swap"); setTimeout(apply, 220); }
    [li + 1, li - 1].forEach((j) => { new Image().src = `${IMG}${C.galleryFlat[(j + n) % n]}-lg.webp`; });
  }
  function openLB(i) {
    lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lb.classList.add("is-open")); showLB(i, true); $("#lbClose").focus();
  }
  function closeLB() {
    lb.classList.remove("is-open"); document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute("src"); }, reduce ? 0 : 350); lastFocus && lastFocus.focus();
  }
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", () => showLB(li - 1));
  $("#lbNext").addEventListener("click", () => showLB(li + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-fig")) closeLB(); });
  lb.addEventListener("touchstart", (e) => (tx = e.changedTouches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showLB(li + (dx < 0 ? 1 : -1)); }, { passive: true });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB();
    else if (e.key === "ArrowRight") showLB(li + 1);
    else if (e.key === "ArrowLeft") showLB(li - 1);
    else if (e.key === "Tab") {
      const f = $$("button", lb), i = f.indexOf(document.activeElement);
      e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* ------------------------------ backend (Supabase REST) ------------------------------ */
  const SB = C.supabase || {};
  const configured = () => !!(SB.url && SB.anonKey);
  async function sb(path, { method = "GET", body, prefer } = {}) {
    const h = { apikey: SB.anonKey, "Content-Type": "application/json" };
    if (SB.anonKey.startsWith("eyJ")) h.Authorization = `Bearer ${SB.anonKey}`; // legacy JWT keys only
    if (prefer) h.Prefer = prefer;
    const res = await fetch(`${SB.url.replace(/\/$/, "")}/rest/v1/${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return method === "GET" ? res.json() : null;
  }
  const NOT_CONNECTED = "This form isn't connected to our guest list yet, so nothing was saved. Please contact us directly.";
  const FAILED = "Something went wrong and your message wasn't saved. Please try again in a moment.";
  const COOLDOWN = 30000;
  const lastSent = (k) => { try { return +localStorage.getItem("sent:" + k) || 0; } catch { return 0; } };
  const markSent = (k) => { try { localStorage.setItem("sent:" + k, Date.now()); } catch {} };
  const formShown = Date.now();
  function setErr(form, name, msg) {
    const p = $(`[data-err="${name}"]`, form); if (p) p.textContent = msg || "";
    const f = p && p.closest(".field"); if (f) f.classList.toggle("has-err", !!msg);
  }
  function thanks(card, title, text) {
    card.replaceChildren(el("div", { class: "thanks", tabindex: "-1" }, [
      el("img", { src: "assets/monogram-burgundy.png", alt: "", width: 333, height: 450 }), el("h3", { text: title }), el("p", { text }),
    ]));
    $(".thanks", card).focus({ preventScroll: true });
  }
  // guard shared by both forms: honeypot, too-fast submit, cooldown
  function botCheck(form, key, note) {
    if (form.website.value) return "bot";
    if (Date.now() - formShown < 1500) { note.textContent = "Please take a moment, then try again."; return "stop"; }
    if (Date.now() - lastSent(key) < COOLDOWN) { note.textContent = "Thank you — we've just received your message. Please wait a few seconds."; return "stop"; }
    return "ok";
  }

  // RSVP
  const rf = $("#rsvpForm"), rNote = $("#rsvpNote"), guests = $("#r-guests");
  for (let i = 1; i <= C.rsvp.maxGuests; i++) guests.append(el("option", { value: i, text: i === 1 ? "Just me" : `${i} guests` }));
  $$("input[name=attending]", rf).forEach((r) => r.addEventListener("change", () => ($("#guestsField").hidden = r.value !== "yes")));
  rf.addEventListener("submit", async (e) => {
    e.preventDefault(); rNote.textContent = "";
    const name = rf.name.value.trim(), phone = rf.phone.value.trim();
    const att = (rf.querySelector("input[name=attending]:checked") || {}).value;
    setErr(rf, "name", name.length < 2 ? "Please enter your full name." : "");
    setErr(rf, "phone", /^\+?[\d\s\-()]{7,24}$/.test(phone) ? "" : "Please enter a valid phone number.");
    setErr(rf, "attending", att ? "" : "Please let us know if you can come.");
    if (name.length < 2 || !/^\+?[\d\s\-()]{7,24}$/.test(phone) || !att) { const bad = $(".has-err input, .has-err textarea, .choice .err:not(:empty)", rf); bad && bad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); return; }
    const g = botCheck(rf, "rsvp", rNote);
    if (g === "stop") return;
    const first = name.split(/\s+/)[0];
    const okMsg = () => thanks($("#rsvpCard"),
      att === "yes" ? `Thank you, ${first}!` : `We'll miss you, ${first}`,
      att === "yes" ? "Your RSVP is in, and we can't wait to celebrate with you." : "Thank you for letting us know. You will be in our hearts on the day.");
    if (g === "bot") return okMsg();
    if (!configured()) { rNote.textContent = NOT_CONNECTED; return; }
    const btn = $("#rsvpBtn"); btn.disabled = true; btn.textContent = "Sending…";
    try {
      await sb("rsvps", { method: "POST", prefer: "return=minimal", body: { full_name: name, phone, attending: att === "yes", guests: att === "yes" ? +guests.value : 0, message: rf.message.value.trim() || null } });
      markSent("rsvp"); okMsg();
    } catch { rNote.textContent = FAILED; btn.disabled = false; btn.textContent = "Send RSVP"; }
  });

  // Wishes
  const wf = $("#wishForm"), wNote = $("#wishNote"), wList = $("#wishList"), wMore = $("#wishMore");
  const wMsg = $("#w-msg"); wMsg.addEventListener("input", () => ($("#wCount").textContent = wMsg.value.length));
  let wishes = [], shown = 0; const PAGE = 6;
  function renderWishes() {
    if (!wishes.length) {
      wList.replaceChildren(configured() ? el("p", { class: "wish-empty", text: "Be the first to leave us a wish." }) : "");
      wMore.hidden = true; return;
    }
    wishes.slice(shown, shown + PAGE).forEach((w) => wList.append(el("figure", { class: "wish" }, [el("blockquote", { text: w.message }), el("cite", { text: w.name })])));
    shown = Math.min(shown + PAGE, wishes.length); wMore.hidden = shown >= wishes.length;
  }
  wMore.addEventListener("click", renderWishes);
  async function loadWishes() {
    if (!configured()) return renderWishes();
    try { wishes = await sb("wishes?select=name,message&approved=eq.true&order=created_at.desc&limit=120"); } catch { wishes = []; }
    wList.replaceChildren(); shown = 0; renderWishes();
  }
  loadWishes();
  wf.addEventListener("submit", async (e) => {
    e.preventDefault(); wNote.textContent = "";
    const name = wf.name.value.trim(), msg = wf.message.value.trim();
    setErr(wf, "name", name.length < 2 ? "Please tell us your name." : "");
    setErr(wf, "message", msg.length < 5 ? "Please write us a few words." : /(https?:\/\/|www\.)/i.test(msg) ? "Links can't be included in wishes." : "");
    if (name.length < 2 || msg.length < 5 || /(https?:\/\/|www\.)/i.test(msg)) return;
    const g = botCheck(wf, "wish", wNote);
    if (g === "stop") return;
    const okMsg = () => thanks($("#wishCard"), "Thank you ❤", "Your wish means the world to us. It will appear here once we've read it.");
    if (g === "bot") return okMsg();
    if (!configured()) { wNote.textContent = NOT_CONNECTED; return; }
    const btn = $("#wishBtn"); btn.disabled = true; btn.textContent = "Sending…";
    try { await sb("wishes", { method: "POST", prefer: "return=minimal", body: { name, message: msg } }); markSent("wish"); okMsg(); }
    catch { wNote.textContent = FAILED; btn.disabled = false; btn.textContent = "Send my wish"; }
  });

  /* ------------------------------ gifts ------------------------------ */
  $("#giftsIntro").textContent = C.gifts.intro;
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const t = el("textarea", { style: "position:fixed;opacity:0", "aria-hidden": "true" }); t.value = text; document.body.append(t); t.select();
      try { document.execCommand("copy"); } catch {} t.remove();
    }
    toast(msg);
  }
  function giftCard(g, mode) {
    const rows = [["Bank", g.bank], ["Account name", g.accountName], ["Account type", g.accountType], ["Account number", g.accountNumber, "num"], ["Routing number", g.routingNumber], ["SWIFT / BIC", g.swift]].filter((r) => r[1]);
    const block = [`${g.title} account`, ...rows.map(([k, val]) => `${k}: ${val}`)].join("\n");
    const btn = el("button", { class: "btn btn-ghost", type: "button", text: mode === "number" ? "Copy account number" : "Copy account details",
      onclick: () => copy(mode === "number" ? g.accountNumber : block, mode === "number" ? "Account number copied" : "Account details copied") });
    return el("article", { class: "gift reveal" }, [
      el("span", { class: "gift-code", text: g.code }), el("h3", { text: g.title }),
      el("dl", {}, rows.map(([k, val, c]) => el("div", {}, [el("dt", { text: k }), el("dd", { class: c || "", text: val })]))), btn,
    ]);
  }
  const gg = $("#giftGrid");
  if (C.gifts.ngn) gg.append(giftCard(C.gifts.ngn, "number"));
  if (C.gifts.usd) gg.append(giftCard(C.gifts.usd, "details"));

  // when reveal is not running (e.g. reduced motion fallback) make sure nothing stays hidden
  if (reduce) $$(".reveal").forEach((n) => n.classList.add("is-in"));
})();
