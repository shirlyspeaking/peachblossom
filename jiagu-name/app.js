(function () {
  if (!window.JiaguChars || !window.JiaguGlyphs) return;

  const STORAGE_KEY = "peachblossom-jiagu-roster";
  const SAMPLE = ["陳小雨", "林安", "張樂", "王山", "李木", "黃日", "吳泉", "趙鹿"];
  const FONTS = { oracle: "Oracular", bronze: "Jingfeng_ZSKSS", seal: "EBAS" };
  const SCRIPT_LABELS = { oracle: "甲骨文", bronze: "金文", seal: "小篆" };
  const GAME_POOL = Array.from(
    "日月山水火木人口目耳手田雨魚鳥馬牛羊犬虎龜車舟門弓刀女子大小禾竹石玉心川雲星"
  );
  const GAME_ROUNDS = 10;
  const FACTS = [
    { q: "甲骨文刻在哪裡？", a: "刻在烏龜的肚甲和牛的骨頭上，所以叫「甲骨文」。", ch: "龜" },
    { q: "甲骨文有多老？", a: "大約三千多年前，商朝的人就在用了。", ch: "日" },
    { q: "古人刻字做什麼？", a: "商王用它來占卜：把甲骨燒熱，看裂開的紋路猜答案。", ch: "卜" },
    { q: "字是怎麼造出來的？", a: "很多字就是一幅小畫：太陽圓圓的，山有三座峰。", ch: "山" },
    { q: "誰最先發現它？", a: "1899 年，王懿榮在中藥「龍骨」上看見了刻字。", ch: "龍" },
    { q: "現在認得多少個？", a: "找到四千多個字，大約一千多個已經認出來了。", ch: "目" },
  ];

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coverCache = new Map();
  let lastFocus = null;

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function cjkChars(raw, max) {
    return Array.from((raw || "").trim())
      .filter(JiaguChars.isCjk)
      .map(JiaguChars.normalize)
      .slice(0, max);
  }

  function shortStory(entry) {
    const first = (entry.story || "").split("。")[0];
    return first ? first + "。" : "";
  }

  async function covers(script, ch) {
    const key = script + ch;
    if (coverCache.has(key)) return coverCache.get(key);
    const family = FONTS[script];
    let ok = false;
    try {
      await document.fonts.load('72px "' + family + '"', ch);
      ok = document.fonts.check('72px "' + family + '"', ch);
    } catch (err) {}
    coverCache.set(key, ok);
    return ok;
  }

  async function glyphFor(ch, script) {
    if (await covers(script, ch)) {
      return { html: `<span class="font-glyph is-${script}" aria-hidden="true">${ch}</span>`, kind: "font" };
    }
    const svg = JiaguGlyphs.getGlyph(ch);
    if (svg) return { html: `<span class="svg-glyph" aria-hidden="true">${svg}</span>`, kind: "svg" };
    return { html: `<span class="no-glyph" aria-hidden="true">？</span>`, kind: "none" };
  }

  function burst(target) {
    if (reduceMotion || !target) return;
    const box = document.createElement("span");
    box.className = "burst";
    for (let i = 0; i < 12; i += 1) {
      const dot = document.createElement("i");
      const angle = (Math.PI * 2 * i) / 12;
      dot.style.setProperty("--x", Math.cos(angle) * 70 + "px");
      dot.style.setProperty("--y", Math.sin(angle) * 70 + "px");
      dot.style.setProperty("--c", ["var(--peach)", "var(--mint)", "var(--sun)"][i % 3]);
      box.appendChild(dot);
    }
    target.appendChild(box);
    window.setTimeout(() => box.remove(), 800);
  }

  /* ---------- sheet ---------- */

  const sheet = $("sheet");
  const main = $("main");

  function openSheet(entry, glyph, script) {
    $("sheetGlyph").innerHTML = glyph.html;
    $("sheetScript").textContent = glyph.kind === "svg" ? "簡筆圖" : SCRIPT_LABELS[script];
    $("sheetChar").textContent = entry.char;
    $("sheetPinyin").textContent = entry.pinyin || "";
    $("sheetMeaning").textContent = entry.meaning;
    $("sheetStory").textContent = shortStory(entry);
    lastFocus = document.activeElement;
    sheet.hidden = false;
    main.inert = true;
    requestAnimationFrame(() => sheet.classList.add("is-on"));
    $("sheetClose").focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove("is-on");
    main.inert = false;
    window.setTimeout(() => {
      sheet.hidden = true;
      if (lastFocus) lastFocus.focus();
    }, reduceMotion ? 0 : 180);
  }

  $("sheetClose").addEventListener("click", closeSheet);
  $("sheetBackdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSheet();
  });

  /* ---------- tabs ---------- */

  const tabs = Array.from(document.querySelectorAll(".tab"));
  const started = {};

  function showTab(name) {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === name;
      tab.setAttribute("aria-selected", String(on));
      tab.classList.toggle("is-on", on);
      $("panel-" + tab.dataset.tab).hidden = !on;
    });
    document.body.dataset.tab = name;
    if (!started[name]) {
      started[name] = true;
      if (name === "game") startGame();
      if (name === "learn") renderFacts();
    }
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));

  /* ---------- name wall ---------- */

  const nameWall = $("nameWall");
  const wallHint = $("wallHint");
  const roster = $("roster");
  const rosterInput = $("rosterInput");
  let wallScript = "oracle";
  let slabs = [];

  function loadRoster() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const names = parseRoster(saved);
      if (names.length) return names;
    } catch (err) {}
    return SAMPLE;
  }

  function parseRoster(raw) {
    const seen = new Set();
    return (raw || "")
      .split(/[\n,，、;；]+/)
      .map((line) => cjkChars(line, 4).join(""))
      .filter((name) => name && !seen.has(name) && seen.add(name));
  }

  function buildSlabs(names) {
    slabs = names.map((name) => ({
      name,
      decoded: false,
      chars: Array.from(name).map((ch) => ({ entry: JiaguChars.lookup(ch), flipped: false, glyph: null })),
    }));
  }

  async function renderWall() {
    const script = wallScript;
    for (const slab of slabs) {
      for (const item of slab.chars) item.glyph = await glyphFor(item.entry.char, script);
    }
    if (script !== wallScript) return;
    nameWall.innerHTML = slabs
      .map(
        (slab, s) => `
        <article class="slab${slab.decoded ? " is-decoded" : ""}" data-slab="${s}" style="--tilt:${((s * 37) % 7) - 3}deg">
          <div class="slab-tiles">
            ${slab.chars
              .map(
                (item, c) => `
              <button type="button" class="tile${item.flipped ? " is-flipped" : ""}" data-slab="${s}" data-char="${c}"
                aria-label="${item.flipped ? item.entry.char + "，再點一下看故事" : "古文字，點一下翻開"}">
                <span class="tile-old">${item.glyph.html}</span>
                <span class="tile-new">${item.entry.char}</span>
              </button>`
              )
              .join("")}
          </div>
          <p class="slab-name">${slab.decoded ? slab.name : "？".repeat(slab.chars.length)}</p>
        </article>`
      )
      .join("");
    updateWallHint();
  }

  function updateWallHint() {
    const done = slabs.filter((slab) => slab.decoded).length;
    if (done && done === slabs.length) wallHint.textContent = "全班都現身了！點任何一個字，看看它的故事。";
    else if (done) wallHint.textContent = "已經認出 " + done + "／" + slabs.length + " 位同學。翻開的字再點一下，看它的故事。";
    else wallHint.textContent = "點一塊翻開。一整排翻完，就知道是誰！";
  }

  nameWall.addEventListener("click", (event) => {
    const tile = event.target.closest(".tile");
    if (!tile) return;
    const slab = slabs[Number(tile.dataset.slab)];
    const item = slab && slab.chars[Number(tile.dataset.char)];
    if (!item) return;
    if (item.flipped) {
      openSheet(item.entry, item.glyph, wallScript);
      return;
    }
    item.flipped = true;
    tile.classList.add("is-flipped");
    tile.setAttribute("aria-label", item.entry.char + "，再點一下看故事");
    if (!slab.decoded && slab.chars.every((ch) => ch.flipped)) {
      slab.decoded = true;
      const card = tile.closest(".slab");
      card.classList.add("is-decoded");
      card.querySelector(".slab-name").textContent = slab.name;
      burst(card);
    }
    updateWallHint();
  });

  document.querySelectorAll("[data-wall-script]").forEach((btn) => {
    btn.addEventListener("click", () => {
      wallScript = btn.dataset.wallScript;
      document.querySelectorAll("[data-wall-script]").forEach((b) => b.classList.toggle("is-on", b === btn));
      renderWall();
    });
  });

  $("flipAll").addEventListener("click", () => {
    slabs.forEach((slab) => {
      slab.decoded = true;
      slab.chars.forEach((ch) => (ch.flipped = true));
    });
    renderWall();
  });

  $("resetWall").addEventListener("click", () => {
    buildSlabs(slabs.map((slab) => slab.name));
    renderWall();
  });

  $("editRoster").addEventListener("click", () => {
    roster.hidden = !roster.hidden;
    if (!roster.hidden) {
      rosterInput.value = slabs.map((slab) => slab.name).join("\n");
      rosterInput.focus();
    }
  });

  $("saveRoster").addEventListener("click", () => {
    const names = parseRoster(rosterInput.value);
    if (!names.length) {
      rosterInput.focus();
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, names.join("\n"));
    } catch (err) {}
    roster.hidden = true;
    buildSlabs(names);
    renderWall();
  });

  $("sampleRoster").addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {}
    rosterInput.value = SAMPLE.join("\n");
  });

  /* ---------- lookup ---------- */

  const lookupResult = $("lookupResult");
  const lookupInput = $("lookupInput");

  async function lookupCard(ch, script) {
    const entry = JiaguChars.lookup(ch);
    const glyph = await glyphFor(entry.char, script);
    const note =
      glyph.kind === "font"
        ? ""
        : glyph.kind === "svg"
          ? "字型裡沒有，先看簡筆圖"
          : SCRIPT_LABELS[script] + "裡還找不到，換個字體試試";
    return `
      <article class="look-card" data-char="${entry.char}">
        <div class="look-pair">
          <div class="look-old">${glyph.html}</div>
          <span class="look-arrow" aria-hidden="true">→</span>
          <div class="look-new">
            <p class="look-char">${entry.char}</p>
            <p class="look-pinyin">${entry.pinyin || ""}</p>
          </div>
        </div>
        <div class="script-toggle" role="group" aria-label="換字體">
          ${Object.keys(SCRIPT_LABELS)
            .map((key) => `<button type="button" data-script="${key}" class="${key === script ? "is-on" : ""}">${SCRIPT_LABELS[key]}</button>`)
            .join("")}
        </div>
        ${note ? `<p class="look-note">${note}</p>` : ""}
        <p class="look-meaning">${entry.meaning}</p>
        <p class="look-story">${shortStory(entry)}</p>
      </article>`;
  }

  async function runLookup(raw) {
    const chars = cjkChars(raw, 4);
    if (!chars.length) {
      lookupResult.innerHTML = `<p class="hint">寫一個中文字，例如「日」。</p>`;
      return;
    }
    const cards = [];
    for (const ch of chars) cards.push(await lookupCard(ch, "oracle"));
    lookupResult.innerHTML = cards.join("");
  }

  lookupResult.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-script]");
    if (!btn) return;
    const card = btn.closest(".look-card");
    const wrap = document.createElement("div");
    wrap.innerHTML = await lookupCard(card.dataset.char, btn.dataset.script);
    card.replaceWith(wrap.firstElementChild);
  });

  $("lookupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runLookup(lookupInput.value);
  });

  document.querySelectorAll("#lookupChips button").forEach((btn) => {
    btn.addEventListener("click", () => {
      lookupInput.value = btn.textContent;
      runLookup(btn.textContent);
    });
  });

  /* ---------- guessing game ---------- */

  const game = { pool: [], rounds: [], index: 0, stars: 0 };

  async function startGame() {
    $("gameEnd").hidden = true;
    $("gameCard").hidden = false;
    if (!game.pool.length) {
      for (const ch of GAME_POOL) {
        const entry = JiaguChars.lookup(ch);
        if (!entry.found) continue;
        const glyph = await glyphFor(entry.char, "oracle");
        if (glyph.kind !== "none") game.pool.push({ entry, glyph });
      }
    }
    game.rounds = shuffle(game.pool).slice(0, GAME_ROUNDS);
    game.index = 0;
    game.stars = 0;
    showRound();
  }

  function showRound() {
    const round = game.rounds[game.index];
    const others = shuffle(game.pool.filter((item) => item !== round)).slice(0, 2);
    const choices = shuffle([round].concat(others));
    $("gameRound").textContent = "第 " + (game.index + 1) + "／" + game.rounds.length + " 題";
    $("gameStars").textContent = "★ " + game.stars;
    $("gameGlyph").innerHTML = round.glyph.html;
    $("gameGlyph").classList.remove("is-pop");
    void $("gameGlyph").offsetWidth;
    $("gameGlyph").classList.add("is-pop");
    $("gameFeedback").textContent = "";
    $("gameNext").hidden = true;
    $("gameChoices").innerHTML = choices
      .map((item) => `<button type="button" class="choice" data-char="${item.entry.char}">${item.entry.char}</button>`)
      .join("");
  }

  $("gameChoices").addEventListener("click", (event) => {
    const btn = event.target.closest(".choice");
    if (!btn || btn.disabled) return;
    const round = game.rounds[game.index];
    const right = btn.dataset.char === round.entry.char;
    $("gameChoices").querySelectorAll(".choice").forEach((b) => {
      b.disabled = true;
      if (b.dataset.char === round.entry.char) b.classList.add("is-right");
    });
    if (right) {
      game.stars += 1;
      burst(btn);
      $("gameFeedback").textContent = "答對了！" + shortStory(round.entry);
    } else {
      btn.classList.add("is-wrong");
      $("gameFeedback").textContent = "是「" + round.entry.char + "」喔！" + shortStory(round.entry);
    }
    $("gameStars").textContent = "★ " + game.stars;
    $("gameNext").textContent = game.index + 1 < game.rounds.length ? "下一題 →" : "看成績 →";
    $("gameNext").hidden = false;
    $("gameNext").focus();
  });

  $("gameNext").addEventListener("click", () => {
    game.index += 1;
    if (game.index < game.rounds.length) {
      showRound();
      return;
    }
    const total = game.rounds.length;
    $("gameCard").hidden = true;
    $("gameEnd").hidden = false;
    $("gameEndTitle").textContent =
      game.stars === total ? "全對！你是甲骨文小專家！" : game.stars >= total * 0.6 ? "好厲害！再玩一次挑戰全對吧！" : "多玩幾次，你會愈認愈多！";
    $("gameEndStars").textContent = "★".repeat(game.stars) + "☆".repeat(total - game.stars);
    burst($("gameEnd"));
  });

  $("gameAgain").addEventListener("click", startGame);

  /* ---------- facts ---------- */

  async function renderFacts() {
    const cards = [];
    for (const fact of FACTS) {
      const glyph = await glyphFor(fact.ch, "oracle");
      cards.push(`
        <button type="button" class="fact" aria-pressed="false">
          <span class="fact-front">
            <span class="fact-glyph">${glyph.html}</span>
            <span class="fact-q">${fact.q}</span>
          </span>
          <span class="fact-back">${fact.a}</span>
        </button>`);
    }
    $("facts").innerHTML = cards.join("");
  }

  $("facts").addEventListener("click", (event) => {
    const card = event.target.closest(".fact");
    if (!card) return;
    const on = !card.classList.contains("is-flipped");
    card.classList.toggle("is-flipped", on);
    card.setAttribute("aria-pressed", String(on));
  });

  /* ---------- start ---------- */

  buildSlabs(loadRoster());
  renderWall();
  const startTab = new URLSearchParams(location.search).get("tab");
  showTab(["wall", "lookup", "game", "learn"].includes(startTab) ? startTab : "wall");
  runLookup("日");
})();
