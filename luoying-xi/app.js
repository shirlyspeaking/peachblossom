(function () {
  "use strict";

  const STORAGE_KEY = "luoyingxi-draft-v1";

  const openingTemplates = [
    (t, v) =>
      `關於「${t}」，我腦中先浮出一個安靜的畫面：光從某個意想不到的角度照進來。不如就從「誰最先察覺到這件事不一樣了」寫起——可能是你，也可能完全不重要。`,
    (t, v) =>
      v
        ? `你選了「${v}」的氛圍。那就讓「${t}」從一個很小的動作開始：手指停頓、門沒關緊、或者一句話說到一半。讀者不用立刻知道發生了什麼。`
        : `「${t}」如果是一條溪，先寫溪邊最不起眼的那顆石子：它從哪裡來、被誰踢過、此刻為什麼躺在這裡。細節會自己帶路。`,
    (t, v) =>
      `假設「${t}」是一場還沒人解釋清楚的誤會。第一段只要交代：時間、地點，以及一個讓人想往下讀的矛盾——誰以為自己很清楚，其實最不清楚。`,
    (t, v) =>
      `把「${t}」想成一道還沒命名的氣味。開頭不要解釋，只要讓讀者聞到：也許是雨後、舊書、或某種食物。氣味背後站著誰，第二段再讓他們出場也不遲。`,
    (t, v) =>
      `若「${t}」讓你緊張，那就寫一個角色假裝沒事。寫他說了什麼、沒說什麼、視線停在哪裡——${v ? `在「${v}」的調子裡，` : ""}沉默往往比台詞大聲。`,
  ];

  const imageTiles = [
    {
      src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80",
      alt: "盛開的粉色花叢",
      q: "如果這片花是你故事裡的「邊界」，另一邊藏著什麼還沒被說破的事？",
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      alt: "雲霧中的山徑",
      q: "沿著這條路走下去，你的主角是主動出發，還是被什麼轻轻推了一把？",
    },
    {
      src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80",
      alt: "寧靜的湖面與山影",
      q: "水面看起來平靜——底下有沒有什麼正在慢慢長大、即將浮上來？",
    },
    {
      src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80",
      alt: "海浪與沙灘",
      q: "潮水來去之間，有什麼東西被帶走、又有什麼被留在沙上？那可以是具體物件，也可以是一段關係。",
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
      alt: "星空下的山屋",
      q: "在這樣的夜裡，誰還醒著？他們在等的，是消息、還是一個不敢問出口的答案？",
    },
    {
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
      alt: "陽光穿過林間",
      q: "光束照到的第一個東西是什麼？它為什麼值得在第一段就被看見？",
    },
  ];

  function hashToIndex(str, mod) {
    let h = 0;
    const s = str || "";
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h) % mod;
  }

  function defaultTheme(topic) {
    const t = (topic || "").trim();
    return t || "這段還沒取名的時光";
  }

  function getVibe() {
    const el = document.querySelector('input[name="vibe"]:checked');
    return el && el.value ? el.value : "";
  }

  function pickOpening(topic, salt) {
    const t = defaultTheme(topic);
    const v = getVibe();
    const key = t + "|" + v + "|" + salt;
    const i = hashToIndex(key, openingTemplates.length);
    return openingTemplates[i](t, v);
  }

  const branchPaths = [
    {
      title: "往心裡走深一點",
      sub: (t) => `讓「${defaultTheme(t)}」不只是事件，而是某個人怎麼理解自己。`,
      bullets: (t) => [
        "加一段獨白：角色用一句話騙自己，但敘述裡露餡。",
        "換一個感官：不寫看見的，改寫聽見或觸覺。",
        "插入一個小小的「童年回聲」——不必解釋因果，留一條線頭即可。",
      ],
    },
    {
      title: "讓世界推回來",
      sub: (t) => `外在世界對「${defaultTheme(t)}」做出具體反應：天氣、旁人、制度、偶然。`,
      bullets: (t) => [
        "一個配角說了反話，主角假裝沒聽懂。",
        "環境突變：原本順的路被擋住，逼出第二個選擇。",
        "一件物品被遺忘在現場，之後會成為伏筆。",
      ],
    },
    {
      title: "留一個開放的出口",
      sub: (t) => `不把「${defaultTheme(t)}」說死，讓讀者帶著問號離場或休息。`,
      bullets: (t) => [
        "結尾回到開頭的意象，但意義已經悄悄改變。",
        "用一個沒被接起的電話、沒送出的訊息收束。",
        "寫「第二天」的一行：什麼變了、什麼假裝沒變。",
      ],
    },
  ];

  const el = {
    seedTopic: document.getElementById("seedTopic"),
    manuscript: document.getElementById("manuscript"),
    openingCard: document.getElementById("openingCard"),
    openingText: document.getElementById("openingText"),
    saveStatus: document.getElementById("saveStatus"),
    imgGrid: document.getElementById("imgGrid"),
    imgPreviewBlock: document.getElementById("imgPreviewBlock"),
    imgPreviewLarge: document.getElementById("imgPreviewLarge"),
    imgQuestion: document.getElementById("imgQuestion"),
    imgWatermark: document.getElementById("imgWatermark"),
    branchGrid: document.getElementById("branchGrid"),
    endGate: document.getElementById("endGate"),
    rail: document.getElementById("inspirationRail"),
    railOverlay: document.getElementById("railOverlay"),
    railToggle: document.getElementById("railToggle"),
  };

  let openingSalt = 0;
  let selectedImageIndex = -1;
  let endingsUnlocked = false;

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    const next = val.slice(0, start) + text + val.slice(end);
    textarea.value = next;
    const pos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
    textarea.focus();
    scheduleSave();
  }

  function showSaveStatus(msg) {
    const pill = el.saveStatus;
    pill.hidden = false;
    pill.textContent = msg;
    clearTimeout(showSaveStatus._t);
    showSaveStatus._t = setTimeout(() => {
      pill.hidden = true;
    }, 1600);
  }

  let saveTimer;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 450);
  }

  function collectPieces() {
    const map = {};
    document.querySelectorAll(".piece-btn").forEach((btn) => {
      map[btn.dataset.piece] = btn.getAttribute("aria-pressed") === "true";
    });
    return map;
  }

  function saveDraft() {
    const pieces = collectPieces();
    const data = {
      topic: el.seedTopic.value,
      manuscript: el.manuscript.value,
      vibe: getVibe(),
      pieces,
      openingSalt,
      endingsUnlocked,
      selectedImageIndex,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showSaveStatus("已自動儲存");
    } catch (_) {
      showSaveStatus("無法儲存（瀏覽器限制）");
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.topic != null) el.seedTopic.value = data.topic;
      if (data.manuscript != null) el.manuscript.value = data.manuscript;
      const vibeAllowed = new Set(["", "日常", "奇幻", "懸念", "抒情"]);
      if (data.vibe !== undefined && data.vibe !== null && vibeAllowed.has(data.vibe)) {
        const r = document.querySelector(`input[name="vibe"][value="${data.vibe}"]`);
        if (r) r.checked = true;
      }
      if (typeof data.openingSalt === "number") openingSalt = data.openingSalt;
      if (data.endingsUnlocked) {
        endingsUnlocked = true;
        renderEndings(true);
      }
      if (typeof data.selectedImageIndex === "number" && data.selectedImageIndex >= 0) {
        selectImage(data.selectedImageIndex, false);
      }
      if (data.pieces) {
        document.querySelectorAll(".piece-btn").forEach((btn) => {
          const on = data.pieces[btn.dataset.piece];
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }
    } catch (_) {
      /* ignore */
    }
  }

  function setOpeningText(text) {
    el.openingText.textContent = text;
    el.openingCard.hidden = false;
  }

  function genOpening() {
    openingSalt++;
    const text = pickOpening(el.seedTopic.value, openingSalt);
    setOpeningText(text);
    saveDraft();
  }

  function altOpening() {
    openingSalt++;
    const text = pickOpening(el.seedTopic.value, openingSalt);
    setOpeningText(text);
    saveDraft();
  }

  function buildImageGrid() {
    el.imgGrid.innerHTML = "";
    imageTiles.forEach((tile, index) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "img-tile";
      b.setAttribute("aria-pressed", "false");
      b.dataset.index = String(index);
      const img = document.createElement("img");
      img.src = tile.src;
      img.alt = tile.alt;
      img.loading = "lazy";
      b.appendChild(img);
      b.addEventListener("click", () => selectImage(index, true));
      el.imgGrid.appendChild(b);
    });
  }

  function selectImage(index, fromUser) {
    selectedImageIndex = index;
    const tile = imageTiles[index];
    if (!tile) return;

    document.querySelectorAll(".img-tile").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.index === String(index) ? "true" : "false");
    });

    el.imgPreviewBlock.hidden = false;
    el.imgPreviewLarge.src = tile.src;
    el.imgPreviewLarge.alt = tile.alt;
    el.imgQuestion.textContent = tile.q;

    const wm = el.imgWatermark;
    wm.hidden = false;
    wm.querySelector("img").src = tile.src;
    wm.querySelector("img").alt = "";

    if (fromUser) scheduleSave();
  }

  function insertImgNote() {
    if (selectedImageIndex < 0) return;
    const tile = imageTiles[selectedImageIndex];
    const line = `【畫面靈感】${tile.alt}：${tile.q}\n\n`;
    insertAtCursor(el.manuscript, line);
  }

  function renderEndings(skipGate) {
    const topic = el.seedTopic.value;
    el.endGate.hidden = skipGate || endingsUnlocked;
    el.branchGrid.hidden = !(skipGate || endingsUnlocked);
    if (!endingsUnlocked && !skipGate) return;

    el.branchGrid.innerHTML = "";
    branchPaths.forEach((path) => {
      const details = document.createElement("details");
      details.className = "branch-card";
      const summary = document.createElement("summary");
      summary.textContent = path.title;
      const sub = document.createElement("p");
      sub.className = "sub";
      sub.textContent = path.sub(topic);
      const ul = document.createElement("ul");
      ul.className = "bullets";
      path.bullets(topic).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      const row = document.createElement("div");
      row.className = "insert-row";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-secondary";
      btn.textContent = "插入這條岔路的備註";
      btn.addEventListener("click", () => {
        const block =
          `\n── 故事岔路「${path.title}」──\n` +
          path
            .bullets(topic)
            .map((b) => "・ " + b)
            .join("\n") +
          "\n\n";
        insertAtCursor(el.manuscript, block);
      });
      row.appendChild(btn);

      details.appendChild(summary);
      details.appendChild(sub);
      details.appendChild(ul);
      details.appendChild(row);
      el.branchGrid.appendChild(details);
    });
  }

  function maybeAutoUnlockEndings() {
    if (endingsUnlocked) return;
    if (el.manuscript.value.trim().length >= 40) {
      endingsUnlocked = true;
      renderEndings(true);
      scheduleSave();
    }
  }

  function setTab(which) {
    const tabs = ["Text", "Img", "End"].map((s) => document.getElementById("tab" + s));
    const panes = ["Text", "Img", "End"].map((s) => document.getElementById("pane" + s));
    const order = { text: 0, img: 1, end: 2 };
    const idx = order[which];
    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", i === idx ? "true" : "false");
    });
    panes.forEach((p, i) => {
      const on = i === idx;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  function openRail(open) {
    el.rail.classList.toggle("is-open", open);
    el.railOverlay.classList.toggle("is-visible", open);
    el.railOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    el.railToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) el.rail.querySelector('[role="tab"][aria-selected="true"]')?.focus();
  }

  function mqRail() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  /** --- wire events --- */
  document.getElementById("btnGenOpening").addEventListener("click", genOpening);
  document.getElementById("btnAltOpening").addEventListener("click", altOpening);
  document.getElementById("btnInsertOpening").addEventListener("click", () => {
    if (!el.openingText.textContent) return;
    insertAtCursor(el.manuscript, el.openingText.textContent.trim() + "\n\n");
  });

  document.getElementById("btnInsertImgNote").addEventListener("click", insertImgNote);

  document.getElementById("btnUnlockEndings").addEventListener("click", () => {
    endingsUnlocked = true;
    renderEndings(true);
    scheduleSave();
  });

  el.seedTopic.addEventListener("input", scheduleSave);
  el.manuscript.addEventListener("input", () => {
    scheduleSave();
    maybeAutoUnlockEndings();
  });

  document.querySelectorAll('input[name="vibe"]').forEach((r) =>
    r.addEventListener("change", scheduleSave)
  );

  document.querySelectorAll(".piece-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      scheduleSave();
    });
  });

  document.getElementById("tabText").addEventListener("click", () => setTab("text"));
  document.getElementById("tabImg").addEventListener("click", () => setTab("img"));
  document.getElementById("tabEnd").addEventListener("click", () => setTab("end"));

  el.railToggle.addEventListener("click", () => openRail(!el.rail.classList.contains("is-open")));
  el.railOverlay.addEventListener("click", () => openRail(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.rail.classList.contains("is-open")) openRail(false);
  });

  buildImageGrid();
  loadDraft();
  renderEndings(false);
  setTab("text");

  maybeAutoUnlockEndings();

  const mql = window.matchMedia("(max-width: 900px)");
  mql.addEventListener("change", () => {
    if (!mql.matches) openRail(false);
  });
})();
