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
  const CLASS_SIGNATURES = {
    郭昌慧: "昌",
    胡可: "可",
    葉肇鏘: "葉",
    蔣芳菲: "芳",
    金諾兒: "兒",
    李鈴浠: "李",
    劉晟陚: "晟",
    王溦: "王",
    謝宗翰: "宗",
  };

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
  const revealChar = document.getElementById("revealChar");
  const revealWho = document.getElementById("revealWho");
  const sheetLore = document.getElementById("sheetLore");
  const modeLookup = document.getElementById("modeLookup");
  const modeWall = document.getElementById("modeWall");
  const modeSeal = document.getElementById("modeSeal");
  const modeClass = document.getElementById("modeClass");
  const modeSolo = document.getElementById("modeSolo");
  const lookupPanel = document.getElementById("lookupPanel");
  const lookupForm = document.getElementById("lookupForm");
  const lookupInput = document.getElementById("lookupInput");
  const scriptSelect = document.getElementById("scriptSelect");
  const lookupStatus = document.getElementById("lookupStatus");
  const lookupGallery = document.getElementById("lookupGallery");
  const wallPanel = document.getElementById("wallPanel");
  const nameWall = document.getElementById("nameWall");
  const wallHint = document.getElementById("wallHint");
  const wallProgress = document.getElementById("wallProgress");
  const howOracle = document.getElementById("howOracle");
  const howSeal = document.getElementById("howSeal");
  const sealLede = document.getElementById("sealLede");

  const SEAL_MISSING = new Set(["鏘", "浠", "晟", "陚"]);
  const SCRIPT_FONTS = {
    oracle: "Oracular",
    bronze: "Jingfeng_ZSKSS",
    seal: "EBAS",
  };
  const SCRIPT_LABELS = {
    oracle: "甲骨文",
    bronze: "金文",
    seal: "小篆",
  };
  const SCRIPT_NOTES = {
    oracle: "三千多年前刻在龜甲或牛骨上的樣子。",
    bronze: "鑄在青銅器上的銘文風格，比甲骨文稍晚。",
    seal: "秦始皇統一文字後，比較圓轉整齊的小篆。",
  };

  if (!playfield || !scatter || !sheet) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BONE_SHAPES = 5;

  let mode = "lookup";
  let pieces = [];
  let wallSlabs = [];
  let activeIndex = -1;
  let activeWall = null;
  let lastFocus = null;
  let whoRevealed = false;
  let lookupScript = "oracle";
  let lookupEntries = [];

  function glyphMarkup(entry) {
    const svg = window.JiaguGlyphs && JiaguGlyphs.getGlyph(entry.char);
    if (svg) return svg;
    return `<span class="fallback-glyph" aria-hidden="true">兆</span>`;
  }

  function hasSealFont(ch) {
    return Boolean(ch) && !SEAL_MISSING.has(ch);
  }

  function sealMarkup(entry) {
    if (!hasSealFont(entry.char)) return glyphMarkup(entry);
    return `<span class="seal-glyph" lang="zh-Hant" aria-hidden="true">${entry.char}</span>`;
  }

  function isNameWall() {
    return mode === "wall" || mode === "seal";
  }

  async function fontCovers(family, ch) {
    if (!family || !ch) return false;
    try {
      await document.fonts.load('72px "' + family + '"', ch);
    } catch (err) {}
    return document.fonts.check('72px "' + family + '"', ch);
  }

  function parseChars(raw, max) {
    return Array.from((raw || "").trim())
      .filter((ch) => window.JiaguChars && JiaguChars.isCjk(ch))
      .slice(0, max || 16);
  }

  function scriptFaceMarkup(entry, script, covered) {
    if (covered) {
      return `<span class="script-glyph is-${script}" lang="zh-Hant" aria-hidden="true">${entry.char}</span>`;
    }
    if (window.JiaguGlyphs && JiaguGlyphs.hasGlyph(entry.char)) {
      return glyphMarkup(entry);
    }
    return `<span class="lookup-missing">尚未收錄</span>`;
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

  function buildRiddlePieces() {
    return CLASS_NAMES.map((name) => {
      const ch = CLASS_SIGNATURES[name];
      return Object.assign({}, JiaguChars.lookup(ch), {
        owner: name,
        flipped: false,
        named: false,
      });
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
    ["introLookup", "introWall", "introSeal", "introClass", "introSolo"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.hidden = id !== which;
    });
  }

  function setTab(btn, on) {
    if (!btn) return;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-selected", String(on));
  }

  function setMode(next) {
    mode = next;
    const isLookup = mode === "lookup";
    const isWall = mode === "wall";
    const isSeal = mode === "seal";
    const isClass = mode === "class";
    const isSolo = mode === "solo";
    setTab(modeLookup, isLookup);
    setTab(modeWall, isWall);
    setTab(modeSeal, isSeal);
    setTab(modeClass, isClass);
    setTab(modeSolo, isSolo);
    if (lookupPanel) lookupPanel.hidden = !isLookup;
    wallPanel.hidden = !isNameWall();
    if (howOracle) howOracle.hidden = !isWall;
    if (howSeal) howSeal.hidden = !isSeal;
    if (sealLede) sealLede.hidden = !isSeal;
    if (nameWall) nameWall.classList.toggle("is-seal", isSeal);
    classPanel.hidden = !isClass;
    form.hidden = !isSolo;
    if (isLookup) {
      heroCopy.textContent =
        "輸入任何字，再用下拉選單選甲骨文、金文或小篆，看看這個字在不同時代長什麼樣子。";
      setIntro("introLookup");
      hidePlay();
    } else if (isWall) {
      heroCopy.textContent =
        "九個名字藏進古文字裡。先看圖畫畫的是什麼，點下去會翻成現在的字，再跳出一塊磨砂小百科。";
      setIntro("introWall");
      hidePlay();
      renderWall(true);
    } else if (isSeal) {
      heroCopy.textContent =
        "九個名字改用秦朝小篆來寫。線條圓轉，像刻在玉上。點下去會翻成現在的字。";
      setIntro("introSeal");
      hidePlay();
      renderWall(true);
    } else if (isClass) {
      heroCopy.textContent =
        "每人名字裡只藏一個古字。先猜這幅小畫是什麼字，再猜是哪位同學。";
      setIntro("introClass");
      hidePlay();
      startRiddle();
    } else {
      heroCopy.textContent =
        "把名字刻上去之後，甲骨會散落開來。點一點，就能翻成現在的字，並看看它的小故事。";
      setIntro("introSolo");
      hidePlay();
    }
    if (intro) intro.hidden = isNameWall();
  }

  function hidePlay() {
    playfield.hidden = true;
    playfield.classList.remove("is-on");
    if (page) page.classList.toggle("is-playing", isNameWall());
    if (intro) intro.hidden = isNameWall();
    scatter.innerHTML = "";
    scatter.classList.remove("is-drawing");
    pieces = [];
    activeIndex = -1;
  }

  async function searchLookup(raw) {
    if (!window.JiaguChars || !lookupGallery) return;
    const chars = parseChars(raw, 16);
    lookupScript = (scriptSelect && scriptSelect.value) || "oracle";
    if (!chars.length) {
      lookupStatus.textContent = "先寫下一個中文字吧。";
      lookupGallery.innerHTML = "";
      lookupEntries = [];
      return;
    }
    lookupStatus.textContent = "正在找" + SCRIPT_LABELS[lookupScript] + "……";
    const family = SCRIPT_FONTS[lookupScript];
    const next = [];
    for (const ch of chars) {
      const entry = JiaguChars.lookup(ch);
      next.push(
        Object.assign({}, entry, {
          covered: await fontCovers(family, entry.char),
        })
      );
    }
    lookupEntries = next;
    renderLookupGallery();
    if (intro) intro.hidden = true;
    const missing = next.filter(
      (item) => !item.covered && !(window.JiaguGlyphs && JiaguGlyphs.hasGlyph(item.char))
    ).length;
    lookupStatus.textContent = missing
      ? SCRIPT_LABELS[lookupScript] + " · " + next.length + " 個字，其中 " + missing + " 個字型還沒收到"
      : SCRIPT_LABELS[lookupScript] + " · " + next.length + " 個字";
  }

  function renderLookupGallery() {
    lookupGallery.innerHTML = lookupEntries
      .map((entry, index) => {
        const hasParts = !entry.covered && window.JiaguGlyphs && JiaguGlyphs.hasGlyph(entry.char);
        const note = entry.covered
          ? SCRIPT_NOTES[lookupScript]
          : hasParts
            ? "這種字體還沒有這個字，先看教學零件圖。"
            : "這種字體還沒有這個字。";
        return `
          <button type="button" class="lookup-card is-${lookupScript}" data-index="${index}" aria-label="${entry.char}的${SCRIPT_LABELS[lookupScript]}">
            <span class="lookup-tile">
              ${scriptFaceMarkup(entry, lookupScript, entry.covered)}
            </span>
            <span class="lookup-modern">${entry.char}</span>
            <span class="lookup-pinyin">${entry.pinyin || ""}</span>
            <span class="lookup-script">${SCRIPT_LABELS[lookupScript]}</span>
            <span class="lookup-note">${note}</span>
          </button>`;
      })
      .join("");
    lookupGallery.querySelectorAll(".lookup-card").forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.index);
        const entry = lookupEntries[index];
        if (!entry) return;
        lastFocus = card;
        activeIndex = index;
        openSheet(entry, false);
      });
    });
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

  function sealButton(entry, index, extraClass, label) {
    const rot = ((index * 17) % 9) - 4;
    const delay = Math.min(index * 45, 600);
    const missing = !hasSealFont(entry.char);
    return `
      <button
        type="button"
        class="seal-piece${missing ? " is-parts" : ""}${extraClass ? " " + extraClass : ""}"
        data-index="${index}"
        style="--r:${rot}deg; --pop-delay:${delay}ms;"
        aria-label="${label || "一塊小篆，點擊翻成現在的字"}"
      >
        <span class="bone-float">
          <span class="bone-flip">
            <span class="face face-seal">${sealMarkup(entry)}</span>
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
      ? "已揭曉 " + shown + "／" + total + " 位同學"
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
      wallHint.textContent =
        mode === "seal"
          ? "九個小篆名字都現身了。再點任何一塊，還可以重看故事。"
          : "九個名字都現身了。再點任何一塊，還可以重看故事。";
    } else if (flipped) {
      wallHint.textContent = "同一排都翻開，這位同學的名字就會出現。";
    } else {
      wallHint.textContent =
        mode === "seal"
          ? "同一排是同一個人的名字。先認小篆，整排翻開後現代姓名就會出現。"
          : "同一排是同一個人的名字。把一排都翻開，現代姓名就會出現。";
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
    const makeTile = mode === "seal" ? sealButton : boneButton;
    const tileSel = mode === "seal" ? ".seal-piece" : ".bone-piece";
    const hiddenLabel = mode === "seal" ? "小篆，點擊翻開" : "古文字，點擊翻開";
    const countWord = mode === "seal" ? "小篆" : "古字";
    nameWall.innerHTML = wallSlabs
      .map((slab, slabIndex) => {
        const countLabel =
          slab.chars.length === 2 ? "兩個" + countWord : "三個" + countWord;
        return `
          <article class="name-slab${slab.decoded ? " is-decoded" : ""}" data-slab="${slabIndex}">
            <p class="slab-kicker">${slab.decoded ? "名字現身了" : countLabel}</p>
            <div class="slab-glyphs">
              ${slab.chars
                .map((entry, charIndex) =>
                  makeTile(
                    entry,
                    slabIndex * 4 + charIndex,
                    entry.flipped ? "is-flipped" : "",
                    entry.flipped
                      ? "現在的字：" + entry.char
                      : hiddenLabel
                  )
                )
                .join("")}
            </div>
            <p class="slab-name" ${slab.decoded ? "" : "hidden"}>${slab.name}</p>
            <p class="slab-veil" ${slab.decoded ? "hidden" : ""}>先認字，再看是誰</p>
          </article>`;
      })
      .join("");

    nameWall.querySelectorAll(tileSel).forEach((piece) => {
      piece.addEventListener("click", () => onWallClick(piece));
    });
    updateWallProgress();
  }

  function fillSheet(entry, classGuess) {
    const oracleEl = document.getElementById("sheetOracle");
    oracleEl.innerHTML =
      mode === "lookup"
        ? scriptFaceMarkup(entry, lookupScript, entry.covered)
        : mode === "seal"
          ? sealMarkup(entry)
          : glyphMarkup(entry);
    oracleEl.classList.toggle("is-seal", mode === "seal" || (mode === "lookup" && lookupScript === "seal"));
    oracleEl.classList.toggle("is-bronze", mode === "lookup" && lookupScript === "bronze");
    oracleEl.classList.toggle("is-oracle-font", mode === "lookup" && lookupScript === "oracle");
    const kicker = document.getElementById("sheetKicker");
    const title = document.getElementById("sheetTitle");
    const pinyin = document.getElementById("sheetPinyin");
    const badge = document.getElementById("sheetBadge");
    const ownerEl = document.getElementById("sheetOwner");
    badge.textContent = entry.eraMeta.label;
    badge.className = "sheet-badge badge " + entry.era;
    document.getElementById("sheetMeaning").textContent = entry.meaning;
    document.getElementById("sheetEra").textContent =
      mode === "lookup"
        ? entry.covered
          ? SCRIPT_NOTES[lookupScript]
          : "這種字體還沒有這個字，所以改看教學零件圖。"
        : mode === "seal" && hasSealFont(entry.char)
          ? "這一邊是《說文解字》裡的小篆寫法。"
          : mode === "seal"
            ? "說文小篆還沒有這個字，所以改看教學零件圖。"
            : entry.eraMeta.note;
    document.getElementById("sheetStory").textContent = entry.story;

    if (mode === "lookup") {
      kicker.textContent = SCRIPT_LABELS[lookupScript];
      title.textContent = entry.char;
      title.classList.remove("is-mystery");
      pinyin.textContent = entry.pinyin || "";
      badge.hidden = false;
      if (sheetLore) sheetLore.hidden = false;
      whoBox.hidden = true;
      whoResult.hidden = true;
      if (revealChar) revealChar.hidden = true;
      revealWho.hidden = true;
      return;
    }

    if (isNameWall()) {
      const slab = wallSlabs[entry.slabIndex];
      const decoded = slab && slab.decoded;
      kicker.textContent = "現在這樣寫";
      title.textContent = entry.char;
      title.classList.remove("is-mystery");
      pinyin.textContent = entry.pinyin || "";
      badge.hidden = false;
      if (sheetLore) sheetLore.hidden = false;
      whoBox.hidden = false;
      whoResult.hidden = false;
      if (revealChar) revealChar.hidden = true;
      revealWho.hidden = true;
      document.getElementById("whoPrompt").textContent = decoded
        ? "這是誰的名字裡的字？"
        : "這是同一排名字裡的一個字";
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

    if (classGuess && !entry.flipped) {
      kicker.textContent = "先看這幅小畫";
      title.textContent = "？";
      title.classList.add("is-mystery");
      pinyin.textContent = "";
      badge.hidden = true;
      if (sheetLore) sheetLore.hidden = true;
      whoBox.hidden = false;
      whoResult.hidden = true;
      if (revealChar) revealChar.hidden = false;
      revealWho.hidden = true;
      document.getElementById("whoPrompt").textContent = "猜猜：這是名字裡的哪一個字？";
      ownerEl.textContent = "";
      ownerEl.hidden = true;
      document.getElementById("sheetCue").textContent = "";
      whoRevealed = false;
      return;
    }

    kicker.textContent = "現在這樣寫";
    title.textContent = entry.char;
    title.classList.remove("is-mystery");
    pinyin.textContent = entry.pinyin || "";
    badge.hidden = false;
    if (sheetLore) sheetLore.hidden = false;

    whoRevealed = !classGuess || entry.named;
    whoBox.hidden = !classGuess;
    whoResult.hidden = !whoRevealed;
    if (revealChar) revealChar.hidden = true;
    revealWho.hidden = !classGuess || whoRevealed;
    document.getElementById("whoPrompt").textContent = whoRevealed
      ? "這位同學可以介紹自己了"
      : "這是誰的名字裡的字？先讓大家猜一猜。";
    if (whoRevealed && entry.owner) {
      ownerEl.hidden = false;
      ownerEl.textContent = entry.owner;
      document.getElementById("sheetCue").textContent =
        "請「" +
        entry.owner +
        "」站起來。跟大家說：我叫" +
        entry.owner +
        "。我名字裡的「" +
        entry.char +
        "」，讓我想到……";
    } else {
      ownerEl.textContent = "";
      ownerEl.hidden = true;
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
    const keepSpot =
      mode === "class" && pieces[activeIndex] && !pieces[activeIndex].named;
    if (!keepSpot) {
      scatter.classList.remove("is-drawing");
      scatter.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
      nameWall && nameWall.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    }
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
    scatter.classList.add("is-drawing");
    scatter.querySelectorAll(".is-spotlight").forEach((el) => el.classList.remove("is-spotlight"));
    piece.classList.add("is-spotlight");
    const classGuess = mode === "class" && Boolean(entry.owner);
    if (classGuess && !entry.flipped) {
      playHint.textContent = "看着這幅小畫。它像什麼？猜猜是什麼字。";
      openSheet(entry, true);
      return;
    }
    const firstFlip = !entry.flipped;
    entry.flipped = true;
    piece.classList.add("is-flipped");
    piece.setAttribute("aria-label", "現在的字：" + entry.char);
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
    const buttons = Array.from(slabEl.querySelectorAll(".bone-piece, .seal-piece"));
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

  function revealCharNow() {
    const entry = pieces[activeIndex];
    const piece = scatter.querySelector('[data-index="' + activeIndex + '"]');
    if (!entry || entry.flipped) return;
    entry.flipped = true;
    if (piece) {
      piece.classList.add("is-flipped");
      piece.setAttribute("aria-label", "現在的字：" + entry.char);
    }
    playHint.textContent = "字已經翻開了。猜猜這是哪位同學？";
    fillSheet(entry, true);
  }

  function revealOwner() {
    const entry = pieces[activeIndex];
    if (!entry) return;
    entry.named = true;
    whoRevealed = true;
    whoResult.hidden = false;
    revealWho.hidden = true;
    if (revealChar) revealChar.hidden = true;
    document.getElementById("whoPrompt").textContent = "這位同學可以介紹自己了";
    const ownerEl = document.getElementById("sheetOwner");
    ownerEl.hidden = false;
    ownerEl.textContent = entry.owner || "";
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

  function startRiddle() {
    if (!window.JiaguChars) return;
    rosterInput.value = CLASS_NAMES.join("\n");
    rosterBox.open = false;
    renderPieces(shuffle(buildRiddlePieces()));
    playHint.textContent = "九塊甲骨散落了。抽出一塊，先猜字，再猜人。";
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

  if (modeLookup) modeLookup.addEventListener("click", () => setMode("lookup"));
  modeWall.addEventListener("click", () => setMode("wall"));
  if (modeSeal) modeSeal.addEventListener("click", () => setMode("seal"));
  modeClass.addEventListener("click", () => setMode("class"));
  modeSolo.addEventListener("click", () => setMode("solo"));
  document.getElementById("resetWall").addEventListener("click", () => {
    closeSheet();
    renderWall(true);
    wallHint.textContent =
      mode === "seal"
        ? "同一排是同一個人的名字。先認小篆，整排翻開後現代姓名就會出現。"
        : "同一排是同一個人的名字。把一排都翻開，現代姓名就會出現。";
  });

  document.getElementById("carveClass").addEventListener("click", startClass);
  document.getElementById("drawOne").addEventListener("click", drawOne);
  document.getElementById("resetClass").addEventListener("click", startRiddle);
  document.getElementById("editRoster").addEventListener("click", () => {
    rosterBox.open = true;
    rosterInput.focus();
  });

  if (lookupForm) {
    lookupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchLookup(lookupInput.value);
    });
  }
  if (scriptSelect) {
    scriptSelect.addEventListener("change", () => {
      if (lookupInput && lookupInput.value.trim()) searchLookup(lookupInput.value);
    });
  }
  document.querySelectorAll("#lookupChips [data-chars]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lookupInput.value = btn.dataset.chars;
      searchLookup(btn.dataset.chars);
    });
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

  if (revealChar) revealChar.addEventListener("click", revealCharNow);
  revealWho.addEventListener("click", revealOwner);
  if (sheetClose) sheetClose.addEventListener("click", closeSheet);
  if (sheetBackdrop) sheetBackdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !sheet.hidden) closeSheet();
  });

  rosterInput.value = CLASS_NAMES.join("\n");
  rosterBox.open = false;
  const startMode = new URLSearchParams(location.search).get("mode");
  const allowed = { lookup: 1, wall: 1, seal: 1, class: 1, solo: 1 };
  setMode(allowed[startMode] ? startMode : "lookup");
})();
