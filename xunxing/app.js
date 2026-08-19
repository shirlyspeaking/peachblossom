(function () {
  const D = window.XunxingData;
  const STEPS = ["eight", "origin", "baijia", "hao", "crest"];
  const ORIGIN_ICON = {
    fief: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M8 38V22l8-10 8 10v16M24 22l8-10 8 10v16M8 38h32M16 38v-8h8v8"/></svg>',
    totem: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M24 42V20M24 22 12 10M24 18 36 8M24 28 16 20M24 28l10 6"/><circle cx="24" cy="12" r="3.2" fill="currentColor"/></svg>',
    place: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M10 42V20c0-10 28-10 28 0v22M24 20v22M10 42h28"/></svg>',
    office: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="M12 20h24l-4 12H16L12 20Zm6-8 6-6 6 6M18 32v8M30 32v8"/></svg>',
    craft: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M18 10h12M20 10c-8 8-10 16-6 26h20c4-10 2-18-6-26M16 36h16"/></svg>',
  };

  const PALETTES = {
    cinnabar: { paper: "#f3e4cc", ink: "#6f1d1b", ring: "#8a2e24", soft: "#c4a574", stamp: "#9b2b24" },
    bronze: { paper: "#e2d2ae", ink: "#2f3b32", ring: "#6a5a32", soft: "#8d9a74", stamp: "#3f5a48" },
    ink: { paper: "#efe6d6", ink: "#1c1915", ring: "#3d3428", soft: "#8a7b66", stamp: "#2a241c" },
    celadon: { paper: "#e4ebe3", ink: "#24423b", ring: "#5f7d70", soft: "#8aa396", stamp: "#2c5a4e" },
  };

  const MOTIF_RING = ["forest", "tree", "horse", "ox", "dragon", "bear", "sheep", "wall", "gate", "ding", "pottery", "stone", "shaman", "blade", "music", "woman", "sun", "river", "bow", "axe"];

  const state = {
    surname: "",
    info: null,
    step: "eight",
    guess: "",
    baijia: 0,
    revealed: false,
    prefix: "桃源",
    suffix: "居士",
    shape: "round",
    palette: "cinnabar",
    motif: "forest",
    nvShown: false,
  };

  const $ = (id) => document.getElementById(id);
  const intro = $("screen-intro");
  const workshop = $("screen-workshop");
  const canvas = $("crest-canvas");

  function normalizeChar(raw) {
    const t = String(raw || "").trim();
    return D.SIMPLIFIED[t] || t;
  }

  function parseSurname(raw) {
    const t = String(raw || "").replace(/\s+/g, "");
    if (!t) return "";
    for (const c of D.COMPOUNDS) {
      if (t.startsWith(c) || t.startsWith(normalizeChar(c))) return c;
    }
    const two = normalizeChar(t.slice(0, 2));
    if (D.SURNAMES[two] || D.COMPOUNDS.includes(two)) return two;
    const one = normalizeChar(t.slice(0, 1));
    return one;
  }

  function lookup(surname) {
    const key = normalizeChar(surname);
    const hit = D.SURNAMES[key];
    if (hit) return { surname: key, known: true, ...hit };
    return {
      surname: key,
      known: false,
      origin: "",
      story: "這本課堂族譜還沒記下這個姓。請選一個你覺得最接近的來源，我們就照你的選擇來鑄徽。",
      motif: "ding",
      badges: [],
    };
  }

  function originOf(info) {
    return D.ORIGINS[info.origin] || null;
  }

  function go(step) {
    state.step = step;
    STEPS.forEach((id) => {
      const node = $("step-" + id);
      const on = id === step;
      node.hidden = !on;
      node.classList.toggle("is-on", on);
    });
    document.querySelectorAll(".station").forEach((btn) => {
      const id = btn.dataset.go;
      btn.classList.toggle("is-on", id === step);
      btn.classList.toggle("is-done", STEPS.indexOf(id) < STEPS.indexOf(step));
    });
    $("btn-prev").disabled = step === "eight";
    $("btn-next").textContent = step === "crest" ? "回到八姓" : "下一站";
    if (step === "crest") drawCrest();
    $("stage").focus({ preventScroll: true });
    $("stage").scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextStep() {
    const i = STEPS.indexOf(state.step);
    go(STEPS[i === STEPS.length - 1 ? 0 : i + 1]);
  }

  function prevStep() {
    const i = STEPS.indexOf(state.step);
    if (i > 0) go(STEPS[i - 1]);
  }

  function start(surname) {
    state.surname = surname;
    state.info = lookup(surname);
    state.guess = "";
    state.baijia = 0;
    state.revealed = false;
    state.nvShown = false;
    state.motif = state.info.motif || "ding";
    state.prefix = defaultPrefix(state.info);
    $("you-surname").textContent = state.surname;
    $("you-hao").hidden = true;
    intro.hidden = true;
    workshop.hidden = false;
    renderEight();
    renderOrigin();
    renderBaijia();
    renderHao();
    renderMotifs();
    fillReason();
    go("eight");
  }

  function defaultPrefix(info) {
    if (info.motif === "forest" || info.motif === "tree") return "松風";
    if (info.motif === "river") return "秋水";
    if (info.motif === "sun") return "明月";
    if (info.motif === "horse") return "雲間";
    if (info.motif === "dragon") return "星河";
    return "桃源";
  }

  function renderEight() {
    const grid = $("eight-grid");
    grid.innerHTML = "";
    const live = $("eight-live");
    if (live) live.remove();
    D.EIGHT.forEach((item) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = `<span class="ch">${item.ch}</span><span class="py">${item.py}</span>`;
      btn.addEventListener("click", () => {
        grid.querySelectorAll("button").forEach((b) => b.classList.remove("is-open"));
        btn.classList.add("is-open");
        let note = $("eight-live");
        if (!note) {
          note = document.createElement("p");
          note.id = "eight-live";
          note.className = "eight-note";
          grid.after(note);
        }
        note.textContent = `${item.ch}　${item.note}`;
      });
      li.appendChild(btn);
      grid.appendChild(li);
    });
    $("nv-reveal").hidden = true;
    $("btn-reveal-nv").textContent = "找出共同點";
  }

  function revealNv() {
    state.nvShown = true;
    $("nv-reveal").hidden = false;
    $("eight-grid").querySelectorAll("button").forEach((btn, i) => {
      btn.style.animationDelay = `${i * 70}ms`;
      btn.classList.add("is-marked");
    });
    $("btn-reveal-nv").textContent = "已揭曉";
  }

  function renderOrigin() {
    const info = state.info;
    const prompt = $("origin-prompt");
    if (info.known) {
      prompt.innerHTML = `戰國以後，人們以氏為姓。你的「<b>${info.surname}</b>」比較像哪一類？`;
    } else {
      prompt.innerHTML = `族譜裡還沒有「<b>${info.surname}</b>」。請選一個你覺得最接近的來源。`;
    }
    const box = $("origin-choices");
    box.innerHTML = "";
    D.GUESSABLE.forEach((id) => {
      const o = D.ORIGINS[id];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "origin-choice";
      btn.dataset.id = id;
      btn.innerHTML = `<span class="mark">${ORIGIN_ICON[id]}</span><span><strong>${o.verb}</strong><small>${o.hint}　如${o.examples}</small></span>`;
      btn.addEventListener("click", () => chooseOrigin(id));
      box.appendChild(btn);
    });
    $("origin-result").hidden = true;
  }

  function chooseOrigin(id) {
    state.guess = id;
    const info = state.info;
    if (!info.known) {
      info.origin = id;
      info.motif = defaultMotif(id);
      state.motif = info.motif;
      info.story = `你為「${info.surname}」選了${D.ORIGINS[id].verb}。課堂上許多姓都能歸進這五類。`;
    }
    document.querySelectorAll(".origin-choice").forEach((btn) => {
      btn.disabled = true;
      const bid = btn.dataset.id;
      btn.classList.toggle("is-picked", bid === id);
      if (info.known && info.origin === bid && D.GUESSABLE.includes(info.origin)) btn.classList.add("is-right");
      else if (bid === id && info.known && info.origin !== id && D.GUESSABLE.includes(info.origin)) btn.classList.add("is-close");
    });
    const result = $("origin-result");
    const actual = originOf(info);
    const badges = (info.badges || [])
      .map((b) => `<span>${b === "皇" ? "皇姓" : b === "五姓" ? "五姓七家" : b}</span>`)
      .join("");
    let verdict = "";
    if (!info.known) verdict = "就用你選的這條路來鑄徽。";
    else if (!D.GUESSABLE.includes(info.origin)) verdict = `這個姓更接近「${actual.label}」，不完全落在五張卡片裡。`;
    else if (id === info.origin) verdict = "選對了。";
    else verdict = `很多人會先想到這個。課堂上更常把「${info.surname}」歸在${actual.verb}。`;
    result.hidden = false;
    result.innerHTML = `
      <h3>${info.surname} · ${actual ? actual.verb : D.ORIGINS[id].verb}</h3>
      <p>${verdict}</p>
      <p>${info.story}</p>
      ${badges ? `<p class="origin-badges">${badges}</p>` : ""}
    `;
    renderMotifs();
    fillReason();
    drawCrest();
  }

  function defaultMotif(origin) {
    return { fief: "wall", totem: "tree", place: "gate", office: "ding", craft: "pottery" }[origin] || "ding";
  }

  function renderBaijia() {
    const grid = $("baijia-grid");
    grid.innerHTML = "";
    D.BAIJIA16.forEach((ch, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = ch;
      btn.addEventListener("click", () => tapBaijia(i, btn));
      li.appendChild(btn);
      grid.appendChild(li);
    });
    paintBaijia();
  }

  function tapBaijia(i, btn) {
    if (state.revealed) return;
    if (i === state.baijia) {
      state.baijia += 1;
      paintBaijia();
      return;
    }
    btn.classList.remove("is-miss");
    void btn.offsetWidth;
    btn.classList.add("is-miss");
  }

  function paintBaijia() {
    const buttons = [...$("baijia-grid").querySelectorAll("button")];
    buttons.forEach((btn, i) => {
      btn.classList.toggle("is-done", state.revealed || i < state.baijia);
      btn.classList.toggle("is-next", !state.revealed && i === state.baijia);
    });
    if (state.revealed) $("baijia-status").textContent = "全表已揭示，可一起背。";
    else if (state.baijia >= 16) $("baijia-status").textContent = "十六姓都點齊了。";
    else $("baijia-status").textContent = "下一個：" + D.BAIJIA16[state.baijia];
  }

  function renderHao() {
    const examples = $("hao-examples");
    examples.innerHTML = "";
    D.HAO_EXAMPLES.forEach((ex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${ex.name}　${ex.hao}`;
      btn.addEventListener("click", () => {
        const kind = D.HAO_SUFFIX.includes(ex.kind) ? ex.kind : "居士";
        const head = ex.hao.replace(kind, "").replace(/野老$/, "");
        state.suffix = ex.hao.endsWith("野老") ? "野人" : kind;
        state.prefix = head || ex.hao.slice(0, 2);
        $("hao-prefix").value = state.prefix;
        $("hao-suffix").value = state.suffix;
        updateHao();
      });
      examples.appendChild(btn);
    });
    const select = $("hao-suffix");
    select.innerHTML = D.HAO_SUFFIX.map((s) => `<option value="${s}">${s}</option>`).join("");
    select.value = state.suffix;
    $("hao-prefix").value = state.prefix;
    const chips = $("hao-prefix-chips");
    chips.innerHTML = "";
    D.HAO_PREFIX.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = p;
      btn.addEventListener("click", () => {
        state.prefix = p;
        $("hao-prefix").value = p;
        updateHao();
      });
      chips.appendChild(btn);
    });
    updateHao();
  }

  function currentHao() {
    const prefix = (state.prefix || "").trim() || "桃源";
    return prefix + state.suffix;
  }

  function updateHao() {
    const hao = currentHao();
    $("hao-preview").textContent = hao;
    $("you-hao").hidden = false;
    $("you-hao").textContent = hao;
    fillReason();
    if (state.step === "crest") drawCrest();
  }

  function renderMotifs() {
    const box = $("motif-choices");
    const preferred = state.info ? [state.info.motif, ...MOTIF_RING] : MOTIF_RING;
    const seen = [];
    preferred.forEach((id) => {
      if (!D.MOTIF_LABEL[id] || seen.includes(id)) return;
      seen.push(id);
    });
    const show = seen.slice(0, 8);
    if (!show.includes(state.motif)) state.motif = show[0];
    box.innerHTML = "";
    show.forEach((id) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = D.MOTIF_LABEL[id];
      btn.classList.toggle("is-on", id === state.motif);
      btn.addEventListener("click", () => {
        state.motif = id;
        renderMotifs();
        fillReason();
        drawCrest();
      });
      box.appendChild(btn);
    });
  }

  function fillReason() {
    const info = state.info;
    if (!info) return;
    const origin = originOf(info);
    const motif = D.MOTIF_LABEL[state.motif] || "紋樣";
    const hao = currentHao();
    $("crest-reason").value = `${info.surname}，${origin ? origin.verb : "來源自擇"}。族徽以${motif}為象，古字寫姓，號「${hao}」。`;
  }

  function palette() {
    return PALETTES[state.palette] || PALETTES.cinnabar;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function strokeStyle(ctx, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function drawMotif(ctx, id, cx, cy, s, color) {
    strokeStyle(ctx, color, Math.max(2.2, s * 0.07));
    ctx.beginPath();
    switch (id) {
      case "forest":
        ctx.moveTo(cx - s * 0.55, cy + s * 0.5);
        ctx.lineTo(cx - s * 0.2, cy - s * 0.55);
        ctx.lineTo(cx + s * 0.05, cy + s * 0.5);
        ctx.moveTo(cx - s * 0.05, cy + s * 0.5);
        ctx.lineTo(cx + s * 0.28, cy - s * 0.45);
        ctx.lineTo(cx + s * 0.55, cy + s * 0.5);
        break;
      case "tree":
        ctx.moveTo(cx, cy + s * 0.55);
        ctx.lineTo(cx, cy - s * 0.2);
        ctx.moveTo(cx, cy - s * 0.05);
        ctx.lineTo(cx - s * 0.42, cy - s * 0.45);
        ctx.moveTo(cx, cy - s * 0.15);
        ctx.lineTo(cx + s * 0.4, cy - s * 0.5);
        ctx.moveTo(cx, cy + s * 0.15);
        ctx.lineTo(cx - s * 0.28, cy - s * 0.05);
        break;
      case "horse":
        ctx.moveTo(cx - s * 0.5, cy + s * 0.2);
        ctx.quadraticCurveTo(cx - s * 0.1, cy - s * 0.55, cx + s * 0.35, cy - s * 0.15);
        ctx.quadraticCurveTo(cx + s * 0.55, cy, cx + s * 0.35, cy + s * 0.1);
        ctx.moveTo(cx - s * 0.25, cy);
        ctx.lineTo(cx - s * 0.35, cy + s * 0.5);
        ctx.moveTo(cx + s * 0.1, cy + s * 0.05);
        ctx.lineTo(cx + s * 0.18, cy + s * 0.5);
        break;
      case "ox":
        ctx.ellipse(cx, cy + s * 0.08, s * 0.38, s * 0.28, 0, 0, Math.PI * 2);
        ctx.moveTo(cx - s * 0.32, cy - s * 0.1);
        ctx.quadraticCurveTo(cx - s * 0.55, cy - s * 0.5, cx - s * 0.15, cy - s * 0.25);
        ctx.moveTo(cx + s * 0.32, cy - s * 0.1);
        ctx.quadraticCurveTo(cx + s * 0.55, cy - s * 0.5, cx + s * 0.15, cy - s * 0.25);
        break;
      case "dragon":
        ctx.moveTo(cx - s * 0.5, cy + s * 0.25);
        ctx.bezierCurveTo(cx - s * 0.1, cy - s * 0.6, cx + s * 0.15, cy + s * 0.55, cx + s * 0.55, cy - s * 0.2);
        ctx.moveTo(cx + s * 0.35, cy - s * 0.25);
        ctx.lineTo(cx + s * 0.55, cy - s * 0.45);
        ctx.moveTo(cx + s * 0.35, cy - s * 0.1);
        ctx.lineTo(cx + s * 0.58, cy);
        break;
      case "bear":
        ctx.ellipse(cx, cy + s * 0.08, s * 0.36, s * 0.32, 0, 0, Math.PI * 2);
        ctx.moveTo(cx - s * 0.28, cy - s * 0.28);
        ctx.arc(cx - s * 0.22, cy - s * 0.22, s * 0.12, 0, Math.PI * 2);
        ctx.moveTo(cx + s * 0.28, cy - s * 0.28);
        ctx.arc(cx + s * 0.22, cy - s * 0.22, s * 0.12, 0, Math.PI * 2);
        break;
      case "sheep":
        ctx.moveTo(cx - s * 0.1, cy - s * 0.1);
        ctx.quadraticCurveTo(cx - s * 0.55, cy - s * 0.55, cx - s * 0.15, cy + s * 0.05);
        ctx.moveTo(cx + s * 0.1, cy - s * 0.1);
        ctx.quadraticCurveTo(cx + s * 0.55, cy - s * 0.55, cx + s * 0.15, cy + s * 0.05);
        ctx.ellipse(cx, cy + s * 0.18, s * 0.28, s * 0.24, 0, 0, Math.PI * 2);
        break;
      case "wall":
        ctx.rect(cx - s * 0.5, cy - s * 0.1, s, s * 0.55);
        ctx.moveTo(cx - s * 0.5, cy - s * 0.1);
        ctx.lineTo(cx - s * 0.35, cy - s * 0.4);
        ctx.lineTo(cx - s * 0.05, cy - s * 0.1);
        ctx.moveTo(cx + s * 0.05, cy - s * 0.1);
        ctx.lineTo(cx + s * 0.28, cy - s * 0.42);
        ctx.lineTo(cx + s * 0.5, cy - s * 0.1);
        break;
      case "gate":
        ctx.moveTo(cx - s * 0.42, cy + s * 0.5);
        ctx.lineTo(cx - s * 0.42, cy - s * 0.1);
        ctx.quadraticCurveTo(cx, cy - s * 0.7, cx + s * 0.42, cy - s * 0.1);
        ctx.lineTo(cx + s * 0.42, cy + s * 0.5);
        ctx.moveTo(cx, cy - s * 0.05);
        ctx.lineTo(cx, cy + s * 0.5);
        break;
      case "ding":
        ctx.moveTo(cx - s * 0.38, cy - s * 0.05);
        ctx.lineTo(cx + s * 0.38, cy - s * 0.05);
        ctx.lineTo(cx + s * 0.26, cy + s * 0.28);
        ctx.lineTo(cx - s * 0.26, cy + s * 0.28);
        ctx.closePath();
        ctx.moveTo(cx - s * 0.16, cy + s * 0.28);
        ctx.lineTo(cx - s * 0.2, cy + s * 0.5);
        ctx.moveTo(cx + s * 0.16, cy + s * 0.28);
        ctx.lineTo(cx + s * 0.2, cy + s * 0.5);
        ctx.moveTo(cx - s * 0.28, cy - s * 0.05);
        ctx.lineTo(cx - s * 0.34, cy - s * 0.35);
        ctx.moveTo(cx + s * 0.28, cy - s * 0.05);
        ctx.lineTo(cx + s * 0.34, cy - s * 0.35);
        break;
      case "pottery":
        ctx.moveTo(cx - s * 0.18, cy - s * 0.45);
        ctx.lineTo(cx + s * 0.18, cy - s * 0.45);
        ctx.moveTo(cx - s * 0.12, cy - s * 0.45);
        ctx.bezierCurveTo(cx - s * 0.55, cy, cx - s * 0.2, cy + s * 0.5, cx, cy + s * 0.5);
        ctx.bezierCurveTo(cx + s * 0.2, cy + s * 0.5, cx + s * 0.55, cy, cx + s * 0.12, cy - s * 0.45);
        break;
      case "stone":
        ctx.moveTo(cx - s * 0.45, cy + s * 0.2);
        ctx.lineTo(cx - s * 0.2, cy - s * 0.35);
        ctx.lineTo(cx + s * 0.4, cy - s * 0.15);
        ctx.lineTo(cx + s * 0.3, cy + s * 0.4);
        ctx.closePath();
        break;
      case "shaman":
        ctx.moveTo(cx, cy + s * 0.5);
        ctx.lineTo(cx, cy - s * 0.05);
        ctx.moveTo(cx - s * 0.38, cy + s * 0.1);
        ctx.lineTo(cx + s * 0.38, cy + s * 0.1);
        ctx.moveTo(cx, cy - s * 0.05);
        ctx.quadraticCurveTo(cx - s * 0.25, cy - s * 0.55, cx - s * 0.05, cy - s * 0.15);
        ctx.moveTo(cx, cy - s * 0.05);
        ctx.quadraticCurveTo(cx + s * 0.25, cy - s * 0.55, cx + s * 0.05, cy - s * 0.15);
        break;
      case "blade":
        ctx.moveTo(cx - s * 0.15, cy + s * 0.5);
        ctx.lineTo(cx - s * 0.05, cy + s * 0.12);
        ctx.lineTo(cx + s * 0.4, cy - s * 0.5);
        ctx.lineTo(cx + s * 0.18, cy + s * 0.08);
        ctx.closePath();
        break;
      case "music":
        for (let i = 0; i < 4; i += 1) {
          const x = cx - s * 0.36 + i * s * 0.24;
          const h = s * (0.22 + (i % 2) * 0.18);
          ctx.moveTo(x, cy + s * 0.2);
          ctx.lineTo(x, cy - h);
          ctx.lineTo(x + s * 0.16, cy - h);
          ctx.lineTo(x + s * 0.16, cy + s * 0.2);
        }
        break;
      case "woman":
        ctx.moveTo(cx, cy - s * 0.5);
        ctx.quadraticCurveTo(cx - s * 0.45, cy, cx - s * 0.1, cy + s * 0.5);
        ctx.moveTo(cx, cy - s * 0.5);
        ctx.quadraticCurveTo(cx + s * 0.45, cy, cx + s * 0.1, cy + s * 0.5);
        ctx.moveTo(cx - s * 0.38, cy - s * 0.02);
        ctx.lineTo(cx + s * 0.38, cy - s * 0.02);
        break;
      case "sun":
        ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
        for (let i = 0; i < 8; i += 1) {
          const a = (Math.PI / 4) * i;
          ctx.moveTo(cx + Math.cos(a) * s * 0.32, cy + Math.sin(a) * s * 0.32);
          ctx.lineTo(cx + Math.cos(a) * s * 0.5, cy + Math.sin(a) * s * 0.5);
        }
        break;
      case "river":
        ctx.moveTo(cx - s * 0.5, cy - s * 0.2);
        ctx.bezierCurveTo(cx - s * 0.1, cy - s * 0.5, cx + s * 0.1, cy + s * 0.1, cx + s * 0.5, cy - s * 0.15);
        ctx.moveTo(cx - s * 0.5, cy + s * 0.15);
        ctx.bezierCurveTo(cx - s * 0.1, cy - s * 0.1, cx + s * 0.1, cy + s * 0.45, cx + s * 0.5, cy + s * 0.2);
        break;
      case "bow":
        ctx.moveTo(cx - s * 0.15, cy - s * 0.5);
        ctx.quadraticCurveTo(cx + s * 0.55, cy, cx - s * 0.15, cy + s * 0.5);
        ctx.moveTo(cx - s * 0.12, cy - s * 0.48);
        ctx.lineTo(cx - s * 0.12, cy + s * 0.48);
        ctx.moveTo(cx - s * 0.12, cy);
        ctx.lineTo(cx + s * 0.5, cy);
        break;
      default:
        ctx.moveTo(cx - s * 0.2, cy - s * 0.45);
        ctx.lineTo(cx + s * 0.2, cy - s * 0.45);
        ctx.moveTo(cx, cy - s * 0.45);
        ctx.lineTo(cx, cy + s * 0.2);
        ctx.moveTo(cx - s * 0.35, cy + s * 0.2);
        ctx.lineTo(cx + s * 0.35, cy + s * 0.2);
        ctx.lineTo(cx + s * 0.22, cy + s * 0.5);
        ctx.lineTo(cx - s * 0.22, cy + s * 0.5);
        ctx.closePath();
    }
    ctx.stroke();
  }

  function drawSealShape(ctx, cx, cy, size, shape, colors) {
    const r = size / 2;
    strokeStyle(ctx, colors.ring, 10);
    ctx.beginPath();
    if (shape === "square") {
      roundRect(ctx, cx - r, cy - r, size, size, 18);
      ctx.stroke();
      strokeStyle(ctx, colors.ring, 3);
      roundRect(ctx, cx - r + 16, cy - r + 16, size - 32, size - 32, 8);
      ctx.stroke();
    } else if (shape === "bi") {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      strokeStyle(ctx, colors.ring, 4);
      ctx.beginPath();
      ctx.arc(cx, cy, r - 18, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      strokeStyle(ctx, colors.ring, 3.5);
      ctx.beginPath();
      ctx.arc(cx, cy, r - 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = [...text];
    let line = "";
    let yy = y;
    chars.forEach((ch, i) => {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, yy);
        line = ch;
        yy += lineHeight;
      } else {
        line = test;
      }
      if (i === chars.length - 1) ctx.fillText(line, x, yy);
    });
    return yy;
  }

  function paintCrest(ctx, w, h, withCard) {
    const colors = palette();
    const info = state.info;
    const surname = info ? info.surname : "";
    const hao = currentHao();
    const reason = ($("crest-reason") && $("crest-reason").value) || "";

    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, (h / 18) * i + 8);
      ctx.bezierCurveTo(w * 0.3, (h / 18) * i, w * 0.7, (h / 18) * i + 16, w, (h / 18) * i + 4);
      ctx.stroke();
    }
    ctx.restore();

    const crestW = withCard ? 500 : 520;
    const cx = w / 2;
    const cy = withCard ? 292 : 340;
    const size = crestW * 0.82;
    const r = size / 2;
    drawSealShape(ctx, cx, cy, size, state.shape, colors);

    const ring = r * 0.72;
    for (let i = 0; i < 4; i += 1) {
      const a = -Math.PI / 2 + Math.PI / 4 + (Math.PI / 2) * i;
      drawMotif(ctx, state.motif, cx + Math.cos(a) * ring, cy + Math.sin(a) * ring, r * 0.18, colors.soft);
    }

    ctx.fillStyle = colors.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const sealSize = surname.length > 1 ? 84 : 136;
    ctx.font = `700 ${sealSize}px "LXGW WenKai", "ZCOOL QingKe HuangYou", serif`;
    ctx.fillText(surname, cx, cy + 4);

    ctx.font = `400 40px "ZCOOL QingKe HuangYou", "Huninn", sans-serif`;
    ctx.fillStyle = colors.stamp;
    ctx.fillText(hao, cx, cy + r + 48);

    ctx.font = `400 18px "Huninn", sans-serif`;
    ctx.fillStyle = colors.soft;
    const origin = info ? originOf(info) : null;
    ctx.fillText(origin ? origin.verb : "自擇來源", cx, cy + r + 78);

    if (withCard) {
      ctx.textAlign = "left";
      ctx.fillStyle = colors.ink;
      ctx.font = `400 42px "ZCOOL QingKe HuangYou", sans-serif`;
      ctx.fillText(surname + "　" + hao, 72, 640);
      ctx.font = `400 20px "Huninn", sans-serif`;
      ctx.fillStyle = colors.ink;
      wrapText(ctx, reason, 72, 690, w - 144, 32);
      ctx.font = `400 16px "Huninn", sans-serif`;
      ctx.fillStyle = colors.soft;
      ctx.fillText("尋姓・鑄徽  ·  好學中華文化學會", 72, h - 56);
    } else {
      ctx.font = `400 16px "Huninn", sans-serif`;
      ctx.fillStyle = colors.soft;
      ctx.fillText("尋姓・鑄徽", cx, h - 42);
    }
  }

  function sizeCanvas(target, w, h) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    target.width = Math.round(w * dpr);
    target.height = Math.round(h * dpr);
    const ctx = target.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawCrest() {
    if (!state.info) return;
    const ctx = sizeCanvas(canvas, 720, 900);
    paintCrest(ctx, 720, 900, false);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function exportImage(withCard) {
    await document.fonts.ready;
    drawCrest();
    const off = document.createElement("canvas");
    const w = withCard ? 720 : 720;
    const h = withCard ? 960 : 900;
    const ctx = sizeCanvas(off, w, h);
    paintCrest(ctx, w, h, withCard);
    const hao = currentHao();
    const name = `${state.surname}-${hao}-${withCard ? "名片" : "族徽"}.png`;
    off.toBlob((blob) => {
      if (blob) downloadBlob(blob, name);
    }, "image/png");
  }

  function resetBaijia() {
    state.baijia = 0;
    state.revealed = false;
    paintBaijia();
  }

  $("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const surname = parseSurname($("surname-input").value);
    if (!surname) {
      $("surname-input").focus();
      return;
    }
    start(surname);
  });

  $("btn-restart").addEventListener("click", () => {
    workshop.hidden = true;
    intro.hidden = false;
    $("surname-input").focus();
  });

  $("btn-reveal-nv").addEventListener("click", revealNv);
  $("btn-prev").addEventListener("click", prevStep);
  $("btn-next").addEventListener("click", nextStep);
  $("btn-baijia-reset").addEventListener("click", resetBaijia);
  $("btn-baijia-reveal").addEventListener("click", () => {
    state.revealed = true;
    state.baijia = 16;
    paintBaijia();
  });
  $("hao-prefix").addEventListener("input", (e) => {
    state.prefix = e.target.value;
    updateHao();
  });
  $("hao-suffix").addEventListener("change", (e) => {
    state.suffix = e.target.value;
    updateHao();
  });
  $("crest-form").addEventListener("change", (e) => {
    if (e.target.name === "shape") state.shape = e.target.value;
    if (e.target.name === "palette") state.palette = e.target.value;
    drawCrest();
  });
  $("crest-reason").addEventListener("input", () => {
    if (state.step === "crest") drawCrest();
  });
  $("btn-download").addEventListener("click", () => exportImage(false));
  $("btn-download-card").addEventListener("click", () => exportImage(true));

  document.querySelectorAll(".station").forEach((btn) => {
    btn.addEventListener("click", () => go(btn.dataset.go));
  });

  window.addEventListener("resize", () => {
    if (!workshop.hidden) drawCrest();
  });
})();
