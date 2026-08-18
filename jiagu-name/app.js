(function () {
  const STORAGE_KEY = "peachblossom-jiagu-roster";
  const SAMPLE = "陳小雨\n林安\n張樂\n王山\n李木\n黃日\n吳泉\n趙鹿";
  const CLASS_NAMES = [
    "郭昌慧",
    "胡可",
    "葉肇鏘",
    "蔣芳菲",
    "金諾兒",
    "李鈴浠",
    "劉晟陚",
    "王溦",
    "謝宗翰",
  ];

  const page = document.getElementById("page");
  const main = document.getElementById("main");
  const form = document.getElementById("nameForm");
  const input = document.getElementById("nameInput");
  const status = document.getElementById("status");
  const playfield = document.getElementById("playfield");
  const scatter = document.getElementById("scatter");
  const playHint = document.getElementById("playHint");
  const intro = document.getElementById("intro");
  const sheet = document.getElementById("sheet");
  const sheetClose = document.getElementById("sheetClose");
  const sheetBackdrop = document.getElementById("sheetBackdrop");
  const classPanel = document.getElementById("classPanel");
  const rosterBox = document.getElementById("rosterBox");
  const rosterInput = document.getElementById("rosterInput");
  const classToolbar = document.getElementById("classToolbar");
  const classProgress = document.getElementById("classProgress");
  const heroCopy = document.getElementById("heroCopy");
  const whoBox = document.getElementById("whoBox");
  const whoResult = document.getElementById("whoResult");
  const revealWho = document.getElementById("revealWho");
  const modeWall = document.getElementById("modeWall");
  const modeClass = document.getElementById("modeClass");
  const modeSolo = document.getElementById("modeSolo");
  const wallPanel = document.getElementById("wallPanel");
  const nameWall = document.getElementById("nameWall");
  const wallHint = document.getElementById("wallHint");
  const wallProgress = document.getElementById("wallProgress");

  if (!playfield || !scatter || !sheet) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BONE_SHAPES = 5;

  let mode = "wall";
  let pieces = [];
  let wallSlabs = [];
  let activeIndex = -1;
  let activeWall = null;
  let lastFocus = null;
  let whoRevealed = false;

  function glyphMarkup(entry) {
    const svg = window.JiaguGlyphs && JiaguGlyphs.getGlyph(entry.char);
    if (svg) return svg;
    return `<span class="fallback-glyph" aria-hidden="true">兆</span>`;
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function parseRoster(raw) {
    const seen = new Set();
    return (raw || "")
      .split(/[\n,，、;；]+/)
      .map((line) => line.trim())
      .filter((line) => line && window.JiaguChars && JiaguChars.parseName(line).length)
      .filter((name) => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
  }

  function buildClassPieces(names) {
    const used = new Set();
    return names.map((name) => {
      const entry = JiaguChars.pickSignature(name, used);
      if (entry && entry.char) used.add(entry.char);
      return Object.assign({}, entry, { owner: name, flipped: false, named: false });
    });
  }

  function buildSoloPieces(name) {
    const chars = JiaguChars.parseName(name);
    return chars.map((ch) =>
      Object.assign({}, JiaguChars.lookup(ch), { owner: name, flipped: false, named: true })
    );
  }

  function buildWallSlabs() {
    return CLASS_NAMES.map((name, slabIndex) => {
      const chars = JiaguChars.parseName(name).map((ch, charIndex) =>
        Object.assign({}, JiaguChars.lookup(ch), {
          owner: name,
          flipped: false,
          slabIndex,
          charIndex,
        })
      );
      return { name, chars, decoded: false };
    });
  }

  function setIntro(which) {
    ["introWall", "introClass", "introSolo"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = id !== which;
    });
  }

  function setMode(next) {
    mode = next;
    const isWall = mode === "wall";
    const isClass = mode === "class";
    modeWall.classList.toggle("is-on", isWall);
    modeClass.classList.toggle("is-on", isClass);
    modeSolo.classList.toggle("is-on", !isWall && !isClass);
    modeWall.setAttribute("aria-selected", String(isWall));
    modeClass.setAttribute("aria-selected", String(isClass));
    modeSolo.setAttribute("aria-selected", String(!isWall && !isClass));
    wallPanel.hidden = !isWall;
    classPanel.hidden = !isClass;
    form.hidden = isWall || isClass;
    if (isWall) {
      heroCopy.textContent =
        "九個名字藏進古文字裡。先看圖畫畫的是什麼，點下去會翻成現在的字，再跳出一塊磨砂小百科。";
      setIntro("introWall");
      hidePlay();
      renderWall(true);
    } else if (isClass) {
      heroCopy.textContent =
        "全班的名字藏在甲骨裡。先猜這是什麼字，再猜是哪位同學，然後請那個人介紹自己。";
      setIntro("introClass");
      hidePlay();
    } else {
      heroCopy.textContent =
        "把名字刻上去之後，甲骨會散落開來。點一點，就能翻成現在的字，並看看它的小故事。";
      setIntro("introSolo");
      hidePlay();
    }
    if (intro) intro.hidden = isWall;
  }

  function hidePlay() {
    playfield.hidden = true;
    playfield.classList.remove("is-on");
    if (page) page.classList.toggle("is-playing", mode === "wall");
    if (intro) intro.hidden = mode === "wall";
    scatter.innerHTML = "";
    scatter.classList.remove("is-drawing");
    pieces = [];
    activeIndex = -1;
  }

  function boneButton(entry, index, extraClass, label) {
    const rot = ((index * 47) % 21) - 10;
    const delay = Math.min(index * 45, 600);
    return `
      <button
        type="button"
        class="bone-piece${extraClass ? " " + extraClass : ""}"
        data-index="${index}"
        data-shape="${(index % BONE_SHAPES) + 1}"
        style="--r:${rot}deg; --pop-delay:${delay}ms;"
        aria-label="${label || "一塊甲骨，點擊翻成現在的字"}"
      >
        <span class="bone-float">
          <span class="bone-flip">
            <span class="face face-oracle">${glyphMarkup(entry)}</span>
            <span class="face face-modern">${entry.char}</span>
          </span>
        </span>
      </button>`;
  }

  function updateProgress() {
    if (mode !== "class") return;
    const total = pieces.length;
    const shown = pieces.filter((p) => p.named).length;
    classProgress.textContent = total
      ? "已現身 " + shown + " / " + total + " 位同學"
      : "";
    if (shown >= total && total) {
      playHint.textContent = "全班的字都認出來了。點任何一塊，還可以再看故事。";
    }
  }

  function updateWallProgress() {
    const all = wallSlabs.reduce((sum, slab) => sum + slab.chars.length, 0);
    const flipped = wallSlabs.reduce(
      (sum, slab) => sum + slab.chars.filter((ch) => ch.flipped).length,
      0
    );
    const decoded = wallSlabs.filter((slab) => slab.decoded).length;
    wallProgress.textContent =
      "已翻開 " + flipped + "／" + all + " 個字 · 認出 " + decoded + "／" + wallSlabs.length + " 個名字";
    if (decoded >= wallSlabs.length && wallSlabs.length) {
      wallHint.textContent = "九個名字都現身了。再點任何一塊，還可以重看故事。";
    } else if (flipped) {
      wallHint.textContent = "同一排都翻開，這位同學的名字就會出現。";
    } else {
      wallHint.textContent = "同一排是同一個人的名字。把一排都翻開，現代姓名就會出現。";
    }
  }

  function renderPieces(nextPieces) {
    pieces = nextPieces;
    activeIndex = -1;
    const n = pieces.length;
    scatter.className = "scatter" + (n > 16 ? " is-dense" : n > 10 ? " is-mid" : "");
    scatter.innerHTML = pieces
      .map((entry, index) => boneButton(entry, index))
      .join("");

    playfield.hidden = false;
    playfield.classList.add("is-on");
    if (page) page.classList.add("is-playing");
    if (intro) intro.hidden = true;
    scatter.querySelectorAll(".bone-piece").forEach((piece) => {
      piece.addEventListener("click", () => onPieceClick(piece));
    });
    updateProgress();
  }

  function renderWall(reset) {
    if (!window.JiaguChars || !nameWall) return;
    if (reset || !wallSlabs.length) wallSlabs = buildWallSlabs();
    if (page) page.classList.add("is-playing");
    if (intro) intro.hidden = true;
    nameWall.innerHTML = wallSlabs
      .map((slab, slabIndex) => {
        const countLabel = slab.chars.length === 2 ? "兩個古字" : "三個古字";
        return `
          <article class="name-slab${slab.decoded ? " is-decoded" : ""}" data-slab="${slabIndex}">
            <p class="slab-kicker">${slab.decoded ? "名字現身了" : countLabel}</p>
            <div class="slab-glyphs">
              ${slab.chars
                .map((entry, charIndex) =>
                  boneButton(
                    entry,
                    slabIndex * 4 + charIndex,
                    entry.flipped ? "is-flipped" : "",
                    entry.flipped
                      ? "現在的字：" + entry.char
                      : "古文字，點擊翻開"
                  )
                )
                .join("")}
            </div>
            <p class="slab-name" ${slab.decoded ? "" : "hidden"}>${slab.name}</p>
            <p class="slab-veil" ${slab.decoded ? "hidden" : ""}>先認字，再看是誰</p>
          </article>`;
      })
      .join("");

    nameWall.querySelectorAll(".bone-piece").forEach((piece) => {
      piece.addEventListener("click", () => onWallClick(piece));
    });
    updateWallProgress();
  }

  function fillSheet(entry, classGuess) {
    document.getElementById("sheetOracle").innerHTML = glyphMarkup(entry);
    document.getElementById("sheetTitle").textContent = entry.char;
    document.getElementById("sheetPinyin").textContent = entry.pinyin || "";
    const badge = document.getElementById("sheetBadge");
    badge.textContent = entry.eraMeta.label;
    badge.className = "sheet-badge badge " + entry.era;
    document.getElementById("sheetMeaning").textContent = entry.meaning;
    document.getElementById("sheetEra").textContent = entry.eraMeta.note;
    document.getElementById("sheetStory").textContent = entry.story;

    if (mode === "wall") {
      const slab = wallSlabs[entry.slabIndex];
      const decoded = slab && slab.decoded;
      whoBox.hidden = false;
      whoResult.hidden = false;
      revealWho.hidden = true;
      document.getElementById("whoPrompt").textContent = decoded
        ? "這是誰的名字裡的字？"
        : "這是同一排名字裡的一個字";
      const ownerEl = document.getElementById("sheetOwner");
      ownerEl.textContent = decoded ? slab.name : "";
      ownerEl.hidden = !decoded;
      document.getElementById("sheetCue").textContent = decoded
        ? "「" +
          slab.name +
          "」名字裡的「" +
          entry.char +
          "」。讀完故事，可以再去翻同一排剩下的字。"
        : "同一排都翻開以後，這位同學的名字就會出現。";
      whoRevealed = decoded;
      return;
    }

    whoRevealed = !classGuess || entry.named;
    whoBox.hidden = !classGuess;
    whoResult.hidden = !whoRevealed;
    revealWho.hidden = whoRevealed;
    document.getElementById("whoPrompt").textContent = whoRevealed
      ? "這位同學可以介紹自己了"
      : "這是誰的名字裡的字？先讓大家猜一猜。";
    if (whoRevealed && entry.owner) {
      document.getElementById("sheetOwner").textContent = entry.owner;
      document.getElementById("sheetCue").textContent =
        "請「" +
        entry.owner +
        "」站起來。跟大家說：我叫" +
        entry.owner +
        "。我名字裡的「" +
        entry.char +
        "」，讓我想到……";
    } else {
      document.getElementById("sheetOwner").textContent = "";
      document.getElementById("sheetCue").textContent = "";
    }
  }

  function openSheet(entry, classGuess) {
    fillSheet(entry, classGuess);
    sheet.hidden = false;
    if (main) main.inert = true;
    requestAnimationFrame(() => sheet.classList.add("is-on"));
    if (sheetClose) sheetClose.focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove("is-on");
    scatter.classList.remove("is-drawing");
    scatter.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    nameWall && nameWall.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    if (main) main.inert = false;
    window.setTimeout(() => {
      sheet.hidden = true;
      if (lastFocus) lastFocus.focus();
    }, reduceMotion ? 0 : 180);
  }

  function onPieceClick(piece) {
    const index = Number(piece.dataset.index);
    const entry = pieces[index];
    if (!entry) return;
    lastFocus = piece;
    activeIndex = index;
    const firstFlip = !entry.flipped;
    entry.flipped = true;
    piece.classList.add("is-flipped");
    piece.setAttribute("aria-label", "現在的字：" + entry.char);
    scatter.classList.add("is-drawing");
    scatter.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    piece.classList.add("is-spotlight");
    const classGuess = mode === "class" && Boolean(entry.owner);
    if (mode !== "class") {
      if (firstFlip) playHint.textContent = "再點別的甲骨，或再看一次故事。";
    } else if (!entry.named) {
      playHint.textContent = "字已經翻開了。猜猜這是哪位同學？";
    }
    const delay = reduceMotion || !firstFlip ? 0 : 320;
    window.setTimeout(() => openSheet(entry, classGuess), delay);
  }

  function onWallClick(piece) {
    const slabEl = piece.closest(".name-slab");
    if (!slabEl) return;
    const slabIndex = Number(slabEl.dataset.slab);
    const slab = wallSlabs[slabIndex];
    if (!slab) return;
    const buttons = Array.from(slabEl.querySelectorAll(".bone-piece"));
    const charIndex = buttons.indexOf(piece);
    const entry = slab.chars[charIndex];
    if (!entry) return;
    lastFocus = piece;
    activeWall = { slabIndex, charIndex };
    const firstFlip = !entry.flipped;
    entry.flipped = true;
    piece.classList.add("is-flipped");
    piece.setAttribute("aria-label", "現在的字：" + entry.char);
    nameWall.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    piece.classList.add("is-spotlight");

    const justDecoded = !slab.decoded && slab.chars.every((ch) => ch.flipped);
    if (justDecoded) {
      slab.decoded = true;
      slabEl.classList.add("is-decoded");
      const nameEl = slabEl.querySelector(".slab-name");
      const veilEl = slabEl.querySelector(".slab-veil");
      const kicker = slabEl.querySelector(".slab-kicker");
      if (nameEl) nameEl.hidden = false;
      if (veilEl) veilEl.hidden = true;
      if (kicker) kicker.textContent = "名字現身了";
    }
    updateWallProgress();
    const delay = reduceMotion || !firstFlip ? 0 : 320;
    window.setTimeout(() => openSheet(entry, false), delay);
  }

  function revealOwner() {
    const entry = pieces[activeIndex];
    if (!entry) return;
    entry.named = true;
    whoRevealed = true;
    whoResult.hidden = false;
    revealWho.hidden = true;
    document.getElementById("whoPrompt").textContent = "這位同學可以介紹自己了";
    document.getElementById("sheetOwner").textContent = entry.owner || "";
    document.getElementById("sheetCue").textContent = entry.owner
      ? "請「" +
        entry.owner +
        "」站起來。跟大家說：我叫" +
        entry.owner +
        "。我名字裡的「" +
        entry.char +
        "」，讓我想到……"
      : "";
    const piece = scatter.querySelector('[data-index="' + activeIndex + '"]');
    if (piece) piece.classList.add("is-named");
    updateProgress();
  }

  function startClass() {
    if (!window.JiaguChars) return;
    const names = parseRoster(rosterInput.value);
    if (!names.length) {
      classProgress.textContent = "請先貼上中文名字，一人一行。";
      rosterBox.open = true;
      rosterInput.focus();
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, rosterInput.value);
    } catch (err) {}
    renderPieces(shuffle(buildClassPieces(names)));
    rosterBox.open = false;
    classToolbar.hidden = false;
    playHint.textContent = "甲骨散落了。抽出一塊，先猜字，再猜人。";
    updateProgress();
  }

  function drawOne() {
    const hidden = pieces
      .map((p, i) => ({ p, i }))
      .filter((item) => !item.p.named);
    if (!hidden.length) {
      playHint.textContent = "全班都現身了。";
      return;
    }
    const pick = hidden[Math.floor(Math.random() * hidden.length)];
    const piece = scatter.querySelector('[data-index="' + pick.i + '"]');
    if (!piece) return;
    scatter.classList.add("is-drawing");
    scatter.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    piece.classList.add("is-spotlight");
    piece.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    playHint.textContent = "看着這幅小畫。它像什麼？猜猜是什麼字。";
    lastFocus = piece;
  }

  function searchSolo(name) {
    status.textContent = "";
    if (!name.trim()) {
      status.textContent = "先寫下一個名字吧。";
      input.focus();
      return;
    }
    if (!window.JiaguChars) {
      status.textContent = "字庫還沒載入完成，請再按一次。";
      return;
    }
    const next = buildSoloPieces(name);
    if (!next.length) {
      status.textContent = "請輸入中文名字，例如「小雨」。";
      return;
    }
    renderPieces(next);
    status.textContent = "甲骨散落了。點一點看看。";
    playHint.textContent = "點一點散落的甲骨，把它翻成現在的字。";
  }

  modeWall.addEventListener("click", () => setMode("wall"));
  modeClass.addEventListener("click", () => setMode("class"));
  modeSolo.addEventListener("click", () => setMode("solo"));
  document.getElementById("resetWall").addEventListener("click", () => {
    closeSheet();
    renderWall(true);
    wallHint.textContent = "同一排是同一個人的名字。把一排都翻開，現代姓名就會出現。";
  });

  document.getElementById("carveClass").addEventListener("click", startClass);
  document.getElementById("drawOne").addEventListener("click", drawOne);
  document.getElementById("resetClass").addEventListener("click", startClass);
  document.getElementById("editRoster").addEventListener("click", () => {
    rosterBox.open = true;
    rosterInput.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    searchSolo(input.value);
  });
  document.querySelectorAll(".chips [data-name]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.name;
      searchSolo(btn.dataset.name);
    });
  });

  revealWho.addEventListener("click", revealOwner);
  if (sheetClose) sheetClose.addEventListener("click", closeSheet);
  if (sheetBackdrop) sheetBackdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !sheet.hidden) closeSheet();
  });

  try {
    rosterInput.value = localStorage.getItem(STORAGE_KEY) || SAMPLE;
  } catch (err) {
    rosterInput.value = SAMPLE;
  }
  rosterBox.open = true;
  setMode("wall");
})();
