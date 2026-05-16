/**
 * 山海密室 — 純前端試玩版狀態與謎題邏輯（與 EnjoyRead 無依賴）
 */

const STORAGE_KEY = "shanhaiEscapeProgress_v1";

/** 通關後符印數字，順序：東 → 南 → 西 → 北 → 中 */
const SEAL_DIGITS = {
  east: "9",
  south: "1",
  west: "6",
  north: "8",
  center: "7",
};

const FINAL_CODE = Object.values(SEAL_DIGITS).join("");

const ORDER = ["east", "south", "west", "north", "center"];

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.done !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

function saveProgress(doneMap, stoneCount = 0, foxNext = 1) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ done: doneMap, stoneCount, foxNext, savedAt: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

function createState() {
  const persisted = loadProgress();
  const done = persisted?.done || {};
  ORDER.forEach((k) => {
    if (done[k] !== true) delete done[k];
  });
  return {
    done,
    stoneCount: typeof persisted?.stoneCount === "number" ? persisted.stoneCount : 0,
    foxNext: typeof persisted?.foxNext === "number" ? persisted.foxNext : 1,
    zhulongInterval: null,
  };
}

let state = createState();

function $(sel, root = document) {
  return root.querySelector(sel);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = true;
    el.classList.remove("screen-active");
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.hidden = false;
  target.classList.add("screen-active");

  const mapBtn = $("#btn-map");
  const onHub = id === "screen-hub";
  const onIntro = id === "screen-intro";
  if (mapBtn) mapBtn.hidden = onHub || onIntro;

  clearZhulongInterval();
  if (id === "screen-south") startZhulongCycle();
}

function clearZhulongInterval() {
  if (state.zhulongInterval) {
    clearInterval(state.zhulongInterval);
    state.zhulongInterval = null;
  }
}

let zhulongIsDay = false;

function startZhulongCycle() {
  const disk = $("#sky-disk");
  const label = $("#phase-label");
  if (!disk || !label) return;

  const applyPhase = () => {
    disk.classList.toggle("is-day", zhulongIsDay);
    disk.classList.toggle("is-night", !zhulongIsDay);
    label.textContent = zhulongIsDay ? "相位：晝（太陽當空）" : "相位：夜（月色瀰漫）";
  };

  zhulongIsDay = false;
  applyPhase();

  state.zhulongInterval = setInterval(() => {
    zhulongIsDay = !zhulongIsDay;
    applyPhase();
  }, 2600);
}

function updateSealsRow() {
  ORDER.forEach((key) => {
    const el = document.querySelector(`[data-seal="${key}"]`);
    if (!el) return;
    const inner = el.querySelector(".seal-inner");
    if (state.done[key]) {
      el.classList.add("done");
      if (inner) inner.textContent = SEAL_DIGITS[key];
    } else {
      el.classList.remove("done");
      if (inner) inner.textContent = "—";
    }
  });

  const finaleBtn = $("#btn-finale");
  const finaleHint = $("#finale-hint");
  const allDone = ORDER.every((k) => state.done[k]);
  if (finaleBtn) finaleBtn.disabled = !allDone;
  if (finaleHint) {
    finaleHint.textContent = allDone
      ? "五符已備齊，序號為東→南→西→北→中。"
      : "集齊五道符印後解鎖。";
  }
}

function markDone(roomKey) {
  state.done[roomKey] = true;
  saveProgress(state.done, state.stoneCount, state.foxNext);
  updateSealsRow();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setupFoxRoom() {
  const grid = $("#fox-grid");
  const fb = $("#fox-feedback");
  if (!grid) return;

  grid.innerHTML = "";
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }

  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  nums.forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = String(n);
    b.dataset.num = String(n);
    b.addEventListener("click", () => {
      if (state.done.east) return;
      const expected = state.foxNext;
      const clicked = n;
      if (clicked === expected) {
        b.classList.add("done");
        b.disabled = true;
        state.foxNext = expected + 1;
        saveProgress(state.done, state.stoneCount, state.foxNext);
        if (state.foxNext > 9) {
          markDone("east");
          grid.querySelectorAll("button").forEach((btn) => {
            btn.classList.add("done");
            btn.disabled = true;
          });
          if (fb) {
            fb.textContent = "幻象散盡，東方符印到手：" + SEAL_DIGITS.east;
            fb.classList.add("ok");
          }
        }
      } else {
        b.classList.add("err-flash");
        setTimeout(() => b.classList.remove("err-flash"), 400);
        state.foxNext = 1;
        grid.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("done");
          btn.disabled = false;
        });
        saveProgress(state.done, state.stoneCount, state.foxNext);
        if (fb) {
          fb.textContent = "順序錯了，幻象重置。請再由「壹」開始。";
          fb.classList.add("err");
        }
      }
    });
    grid.appendChild(b);
  });

  if (state.done.east && fb) {
    fb.textContent = "此試煉已完成。";
    fb.classList.add("ok");
    grid.querySelectorAll("button").forEach((btn) => {
      btn.classList.add("done");
      btn.disabled = true;
    });
  }
}

function setupSouthRoom() {
  const fb = $("#south-feedback");
  const btn = $("#btn-seal-day");
  if (!btn) return;

  if (fb) {
    fb.textContent = state.done.south ? "此試煉已完成。" : "";
    fb.className = "feedback" + (state.done.south ? " ok" : "");
  }

  btn.replaceWith(btn.cloneNode(true));
  const fresh = $("#btn-seal-day");

  fresh.addEventListener("click", () => {
    if (state.done.south) return;
    if (!zhulongIsDay) {
      if (fb) {
        fb.textContent = "時機不對：請在「晝」相位再試。";
        fb.className = "feedback err";
      }
      return;
    }
    markDone("south");
    clearZhulongInterval();
    if (fb) {
      fb.textContent = "鐘山時間復位，南方符印：" + SEAL_DIGITS.south;
      fb.className = "feedback ok";
    }
  });
}

function setupWestRoom() {
  const input = $("#west-input");
  const fb = $("#west-feedback");
  const submit = $("#btn-west-submit");
  if (!input || !submit) return;

  input.value = "";
  if (fb) {
    fb.textContent = state.done.west ? "此試煉已完成。" : "";
    fb.className = "feedback" + (state.done.west ? " ok" : "");
  }

  submit.onclick = () => {
    if (state.done.west) return;
    const v = input.value.trim();
    if (v === "684") {
      markDone("west");
      if (fb) {
        fb.textContent = "倒景讀破，西方符印：" + SEAL_DIGITS.west;
        fb.className = "feedback ok";
      }
    } else {
      if (fb) {
        fb.textContent = "石碑語意未明，請再看倒轉後的三位數。";
        fb.className = "feedback err";
      }
    }
  };
}

function renderStones(n) {
  const wrap = $("#stones-visual");
  const countEl = $("#stone-count");
  if (countEl) countEl.textContent = String(n);
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    wrap.appendChild(s);
  }
}

function setupNorthRoom() {
  const fb = $("#north-feedback");
  const btn = $("#btn-add-stone");
  if (!btn) return;

  renderStones(state.stoneCount);

  if (fb) {
    fb.textContent = state.done.north ? "此試煉已完成。" : "";
    fb.className = "feedback" + (state.done.north ? " ok" : "");
  }

  btn.replaceWith(btn.cloneNode(true));
  const fresh = $("#btn-add-stone");

  fresh.addEventListener("click", () => {
    if (state.done.north) return;
    if (state.stoneCount >= 8) return;
    state.stoneCount += 1;
    saveProgress(state.done, state.stoneCount, state.foxNext);
    renderStones(state.stoneCount);
    if (state.stoneCount >= 8) {
      markDone("north");
      if (fb) {
        fb.textContent = "沧海之志不移，北方符印：" + SEAL_DIGITS.north;
        fb.className = "feedback ok";
      }
    }
  });
}

function setupCenterRoom() {
  const fb = $("#center-feedback");
  if (fb) {
    fb.textContent = state.done.center ? "此試煉已完成。" : "";
    fb.className = "feedback" + (state.done.center ? " ok" : "");
  }

  document.querySelectorAll("#screen-center .btn-choice").forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  document.querySelectorAll("#screen-center .btn-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.done.center) return;
      const choice = btn.dataset.choice;
      if (choice === "correct") {
        markDone("center");
        if (fb) {
          fb.textContent = "解渴於河渭，中央符印：" + SEAL_DIGITS.center;
          fb.className = "feedback ok";
        }
      } else {
        if (fb) {
          fb.textContent = "路子不對，更要乾渴了……想想經文裡去哪喝水。";
          fb.className = "feedback err";
        }
      }
    });
  });
}

function setupFinaleRoom() {
  const input = $("#finale-input");
  const fb = $("#finale-feedback");
  const submit = $("#btn-finale-submit");
  if (!input || !submit) return;

  input.value = "";
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }

  submit.onclick = () => {
    const v = input.value.trim();
    if (v === FINAL_CODE) {
      showScreen("screen-win");
      if (fb) fb.textContent = "";
    } else {
      if (fb) {
        fb.textContent = "封印順序或數字有誤。對照輿圖上五個符印（東→南→西→北→中）。";
        fb.className = "feedback err";
      }
    }
  };
}

function wireNavigation() {
  $("#btn-begin")?.addEventListener("click", () => {
    showScreen("screen-hub");
    updateSealsRow();
  });

  $("#btn-brand")?.addEventListener("click", () => {
    showScreen("screen-intro");
  });

  $("#btn-map")?.addEventListener("click", () => {
    showScreen("screen-hub");
    updateSealsRow();
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const room = btn.getAttribute("data-go");
      const id = `screen-${room}`;
      showScreen(id);
      if (room === "east") setupFoxRoom();
      if (room === "south") setupSouthRoom();
      if (room === "west") setupWestRoom();
      if (room === "north") setupNorthRoom();
      if (room === "center") setupCenterRoom();
    });
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showScreen("screen-hub");
      updateSealsRow();
    });
  });

  $("#btn-finale")?.addEventListener("click", () => {
    if (!ORDER.every((k) => state.done[k])) return;
    showScreen("screen-finale");
    setupFinaleRoom();
  });

  $("#btn-replay")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state = createState();
    state.foxNext = 1;
    state.stoneCount = 0;
    updateSealsRow();
    showScreen("screen-intro");
  });
}

function init() {
  wireNavigation();
  updateSealsRow();
}

init();
