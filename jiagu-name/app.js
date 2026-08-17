(function () {
  const form = document.getElementById("nameForm");
  const input = document.getElementById("nameInput");
  const status = document.getElementById("status");
  const ritual = document.getElementById("ritual");
  const playfield = document.getElementById("playfield");
  const scatter = document.getElementById("scatter");
  const playHint = document.getElementById("playHint");
  const intro = document.getElementById("intro");
  const page = document.querySelector(".page");
  const sheet = document.getElementById("sheet");
  const sheetCard = document.getElementById("sheetCard");
  const sheetClose = document.getElementById("sheetClose");
  const sheetBackdrop = document.getElementById("sheetBackdrop");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SLOTS = [
    { x: 6, y: 8, s: 1.28, r: -14 },
    { x: 58, y: 4, s: 0.82, r: 16 },
    { x: 32, y: 38, s: 1.12, r: -5 },
    { x: 64, y: 46, s: 1.38, r: 9 },
    { x: 8, y: 56, s: 0.9, r: 18 },
    { x: 42, y: 14, s: 0.74, r: -20 },
  ];

  let entries = [];
  let foundCount = 0;
  let lastFocus = null;

  function parseName(raw) {
    const chars = Array.from((raw || "").trim());
    const cjk = chars.filter((ch) => JiaguChars.isCjk(ch));
    return cjk.slice(0, 6);
  }

  function glyphMarkup(entry) {
    const svg = JiaguGlyphs.getGlyph(entry.char, entry.glyph);
    if (svg) return svg;
    return `<span class="fallback-glyph">${entry.char}</span>`;
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

  function openSheet(entry) {
    document.getElementById("sheetOracle").innerHTML = glyphMarkup(entry);
    document.getElementById("sheetTitle").textContent = entry.char;
    document.getElementById("sheetPinyin").textContent = entry.pinyin || "";
    const badge = document.getElementById("sheetBadge");
    badge.textContent = entry.eraMeta.label;
    badge.className = "sheet-badge badge " + entry.era;
    document.getElementById("sheetMeaning").textContent = entry.meaning;
    document.getElementById("sheetEra").textContent = entry.eraMeta.note;
    document.getElementById("sheetStory").textContent = entry.story;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-on"));
    sheetClose.focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove("is-on");
    window.setTimeout(() => {
      sheet.hidden = true;
      if (lastFocus) lastFocus.focus();
    }, reduceMotion ? 0 : 180);
  }

  function clearView() {
    lastFocus = null;
    playfield.hidden = true;
    page.classList.remove("is-playing");
    scatter.innerHTML = "";
    foundCount = 0;
    sheet.classList.remove("is-on");
    sheet.hidden = true;
  }

  function updateHint() {
    if (!entries.length) return;
    if (foundCount >= entries.length) {
      playHint.textContent = "名字裡的字都認出來了。再點一次，還可以看故事。";
      status.textContent = "你把散落的甲骨都翻開了。";
    } else {
      playHint.textContent = "甲骨散落了。點一點，把它翻成現在的字。";
    }
  }

  function renderGame(nextEntries) {
    entries = nextEntries;
    foundCount = 0;
    const slots = shuffle(SLOTS).slice(0, entries.length);
    scatter.innerHTML = entries
      .map((entry, index) => {
        const slot = slots[index];
        return `
          <button
            type="button"
            class="bone-piece"
            data-index="${index}"
            style="--x:${slot.x}%; --y:${slot.y}%; --s:${slot.s}; --r:${slot.r}deg;"
            aria-label="一塊甲骨，點擊翻成現在的字"
          >
            <span class="bone-float">
              <span class="bone-flip">
                <span class="face face-oracle">${glyphMarkup(entry)}</span>
                <span class="face face-modern">${entry.char}</span>
              </span>
            </span>
          </button>`;
      })
      .join("");

    playfield.hidden = false;
    page.classList.add("is-playing");
    updateHint();

    const pieces = Array.from(scatter.querySelectorAll(".bone-piece"));
    pieces.forEach((piece, index) => {
      const land = () => piece.classList.add("is-landed");
      if (reduceMotion) land();
      else window.setTimeout(land, 40 + index * 90);
    });

    playfield.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function onPieceClick(piece) {
    const index = Number(piece.dataset.index);
    const entry = entries[index];
    if (!entry) return;
    lastFocus = piece;
    const firstFlip = !piece.classList.contains("is-flipped");
    piece.classList.add("is-flipped");
    piece.setAttribute("aria-label", "現在的字：" + entry.char);
    if (firstFlip) {
      foundCount += 1;
      updateHint();
    }
    const wait = firstFlip && !reduceMotion ? 520 : 0;
    window.setTimeout(() => openSheet(entry), wait);
  }

  function search(name) {
    const chars = parseName(name);
    status.textContent = "";
    clearView();

    if (!name.trim()) {
      intro.classList.remove("is-away");
      status.textContent = "先寫下一個名字吧。";
      input.focus();
      return;
    }
    if (!chars.length) {
      intro.classList.remove("is-away");
      status.textContent = "請輸入中文名字，例如「小雨」。";
      return;
    }

    const nextEntries = chars.map((ch) => JiaguChars.lookup(ch));
    intro.classList.add("is-away");
    const stage = document.getElementById("ritualStage");
    const bone = stage && stage.querySelector("svg");
    if (bone) stage.replaceChild(bone.cloneNode(true), bone);
    ritual.classList.add("is-on");
    ritual.setAttribute("aria-hidden", "false");

    const wait = reduceMotion ? 0 : 1900;
    window.setTimeout(() => {
      ritual.classList.remove("is-on");
      ritual.setAttribute("aria-hidden", "true");
      renderGame(nextEntries);
      status.textContent = "刻好了。去點散落的甲骨吧。";
    }, wait);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    search(input.value);
  });

  document.querySelectorAll(".chips [data-name]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.name;
      search(btn.dataset.name);
    });
  });

  scatter.addEventListener("click", (event) => {
    const piece = event.target.closest(".bone-piece");
    if (piece) onPieceClick(piece);
  });

  sheetClose.addEventListener("click", closeSheet);
  sheetBackdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !sheet.hidden) closeSheet();
  });
})();
