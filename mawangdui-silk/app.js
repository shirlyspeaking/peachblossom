const SPOTS = [
  {
    id: "greeters",
    name: "迎候的人",
    short: "迎候",
    realm: "人間",
    kind: "人物",
    x: 36.5,
    y: 54.9,
    riddle: "畫上已經有一個紅圈。圈裡這兩個人正在做什麼？請點進去看看。",
    hint: "在帛畫中段、夫人的前方，兩位較小的人正彎身相迎。",
    story: "紅圈裡是兩位迎候者。他們站在辛追夫人面前，像在迎接她，又像在為她引路。西漢人相信：過世以後，靈魂還要繼續走路，需要有人接引。",
    meaning: "這不是普通的「鞠躬問好」，而是送魂、迎魂的儀式畫面：告訴我們這幅畫在講「靈魂要出發了」。",
    quiz: {
      q: "這兩個人最可能在做什麼？",
      options: ["在路邊聊天", "迎接並引導墓主人的靈魂", "比賽誰站得比較直"],
      answer: 1,
      explain: "他們面向拄柺杖的貴婦人，是在接引靈魂上路。"
    }
  },
  {
    id: "lady-dai",
    name: "辛追夫人",
    short: "夫人",
    realm: "人間",
    kind: "人物",
    x: 49.5,
    y: 52.2,
    riddle: "紅圈後面那位貴婦人拄著柺杖。她是誰？請找出她。",
    hint: "就在迎候者右側，穿華美長袍、側身向左走的那位。",
    story: "她是這座漢墓的主人辛追，也稱軑侯夫人。畫裡她拄著柺杖，後面跟著三位侍女，正要走向天門。這幅帛畫蓋在她的內棺上，像一封寫給天上的「通行證」。",
    meaning: "古人用畫像把墓主人「畫進」神話世界：她不是留在墳裡，而是準備升天。",
    quiz: {
      q: "辛追夫人拄著柺杖，主要是要去哪裡？",
      options: ["去菜市場", "走向天門，讓靈魂升天", "去河邊洗衣服"],
      answer: 1,
      explain: "整幅帛畫像一張地圖，中間這一段就是墓主人出發升天的樣子。"
    }
  },
  {
    id: "ritual",
    name: "祭祀宴席",
    short: "祭禮",
    realm: "人間",
    kind: "器物",
    x: 50,
    y: 71.5,
    riddle: "夫人之下有一桌祭品。請找出那些大罐子和鼎。",
    hint: "往下看，兩條龍身之間有屋簷，桌子上擺著許多圓腹的禮器。",
    story: "這是家人為墓主人準備的祭宴。鼎、壺、罐裡裝著酒食。漢代人覺得：靈魂上路也要吃飯，活人用隆重的宴會送行，死人才能安心離開。",
    meaning: "禮器代表「活著的人仍記得你」。神話不只在天上，也在家庭的祭桌上面。",
    quiz: {
      q: "畫裡擺出鼎和罐子，最主要是為了什麼？",
      options: ["裝飾房間比較好看", "給靈魂準備路上的飲食與敬意", "給龍當玩具"],
      answer: 1,
      explain: "祭祀就是用食物、器物跟過世的親人說話。"
    }
  },
  {
    id: "giant",
    name: "托地力士",
    short: "力士",
    realm: "地下",
    kind: "人物",
    x: 50,
    y: 82.5,
    riddle: "誰用肩膀把上面的人間托起來？請找出這個大力士。",
    hint: "帛畫接近底部、祭桌正下方，有一個蹲得很低、手臂張開的巨人。",
    story: "這個赤膊力士蹲在下面，雙手托住人間的平台。學者有時把他看成大地之神，或與治水失敗的鯀有關。重點是：地不是空的，下面有神在撐著。",
    meaning: "古人把宇宙想成三層樓。最底層要有人「扛房子」，世界才不會塌。",
    quiz: {
      q: "這個巨人最重要的工作是什麼？",
      options: ["睡覺", "托住上面的人間與祭壇", "跟魚比賽游泳"],
      answer: 1,
      explain: "他像柱子一樣，把人間從水底下托起來。"
    }
  },
  {
    id: "fish",
    name: "托世之魚",
    short: "巨魚",
    realm: "地下",
    kind: "動物",
    x: 50,
    y: 93.5,
    riddle: "力士腳下還有兩條很大的魚。請把它們找出來。",
    hint: "整幅畫的最底部，兩條帶鱗片的大魚交叉纏在一起。",
    story: "力士踩在兩條交纏的巨魚（也有人看成鯨或鰲）背上。中國神話裡，大地常常被想像成擱在大魚或巨鰲上面。魚一翻身，就可能地震。",
    meaning: "地下是水域。水不是盡頭，而是托住世界的根基。",
    quiz: {
      q: "為什麼要把大地畫在大魚背上？",
      options: ["因為魚比較可愛", "表示世界下面是水，有神獸在支撐", "因為畫家只會畫魚"],
      answer: 1,
      explain: "這是古代的宇宙想像：天、地、水三層疊在一起。"
    }
  },
  {
    id: "bi",
    name: "雙龍穿璧",
    short: "玉璧",
    realm: "人間",
    kind: "器物",
    x: 50,
    y: 63.2,
    riddle: "兩條龍共同穿過一個圓環。那個圓環叫什麼？請找出它。",
    hint: "在夫人腳下、祭席上方，正中央有一個大圓孔，龍身從孔裡穿過去。",
    story: "玉璧是圓形、中間有孔的禮玉，象徵天。兩條龍（有時稱為應龍）穿璧而過，等於幫靈魂打開一條通道：從人間鑽進天上。",
    meaning: "圓孔像門洞。龍是交通工具，玉璧是關卡。通過這裡，才能繼續升天。",
    quiz: {
      q: "龍穿過玉璧，最像在做什麼？",
      options: ["在玩呼拉圈", "為靈魂打開通往天上的通道", "把玉璧咬壞"],
      answer: 1,
      explain: "玉璧的圓孔被看成通天的門。"
    }
  },
  {
    id: "gate",
    name: "天門守者",
    short: "天門",
    realm: "天上",
    kind: "人物",
    x: 50,
    y: 27.2,
    riddle: "要進天庭，得先過一扇門。請找出坐在門兩邊的守門人。",
    hint: "在帛畫上段、人首蛇身神的正下方，兩根柱子中間坐著兩位戴冠的人。",
    story: "這是天門。兩位官員模樣的神人對坐，柱上還有豹。漢代人覺得天上也有衙門：不是誰都能闖進去，要有符信、有迎接，才能通過。",
    meaning: "升天不是「飛著飛著就到了」，而是過關。神話裡的門，代表秩序。",
    quiz: {
      q: "天門兩旁坐著的人，最像什麼角色？",
      options: ["守門的神官", "在門口乘涼的路人", "賣包子的小販"],
      answer: 0,
      explain: "他們看守天界入口，決定靈魂能不能進去。"
    }
  },
  {
    id: "sun",
    name: "太陽與金烏",
    short: "金烏",
    realm: "天上",
    kind: "動物",
    x: 75.8,
    y: 10.2,
    riddle: "天上有一隻住在圓圈裡的黑鳥。請找出太陽裡的那隻鳥。",
    hint: "帛畫最上方偏右，一個大圓圈裡有一隻黑色的鳥。",
    story: "那隻鳥叫金烏，傳說有三隻腳，住在太陽裡。古人看見太陽會動，就想像有神鳥載著它飛過天空。金烏因此成為太陽的標誌。",
    meaning: "不是「鳥等於太陽」，而是「太陽裡住著神鳥」。神話常用動物來解釋自然。",
    quiz: {
      q: "太陽圓圈裡的黑鳥代表什麼？",
      options: ["烏鴉來偷東西", "住在太陽裡的神鳥金烏", "晚上的蝙蝠"],
      answer: 1,
      explain: "金烏是太陽的神話形象，常見於漢代畫像。"
    }
  },
  {
    id: "moon",
    name: "月中蟾蜍與玉兔",
    short: "月兔",
    realm: "天上",
    kind: "動物",
    x: 21.5,
    y: 9.2,
    riddle: "月亮裡不只有玉兔，還蹲著另一種動物。請找出月亮。",
    hint: "最上方偏左，彎月裡有一隻斑點蟾蜍，旁邊還有搗藥的兔子。",
    story: "漢代人看月亮上的暗影，看成蟾蜍和玉兔。玉兔搗藥，跟長生不老有關；蟾蜍也是月的靈物。左邊有時還畫著飛向月亮的仙女，讓人想起嫦娥。",
    meaning: "太陽有烏，月亮有蟾與兔。左右對稱，表示天上的時間：晝與夜。",
    quiz: {
      q: "月亮裡出現蟾蜍和玉兔，主要想說明什麼？",
      options: ["月亮是動物園", "月亮裡住著神物，掌管黑夜與長生", "兔子喜歡吃蟾蜍"],
      answer: 1,
      explain: "月中動物是漢代人對月光暗影的神話解釋。"
    }
  },
  {
    id: "fusang",
    name: "扶桑與九日",
    short: "扶桑",
    realm: "天上",
    kind: "植物",
    x: 81.5,
    y: 19.4,
    riddle: "太陽旁邊的神樹上，還掛著好幾個小太陽。請找出那棵樹。",
    hint: "大金烏右下方，樹枝間有一串較小的圓圈，像還沒出發的太陽。",
    story: "扶桑是神話裡太陽升起的神樹，長在東海。傳說本來有十個太陽，輪流值班；後來十日齊出，大地烤焦，后羿才射下九個。畫裡的小圓，就是其餘那些太陽。",
    meaning: "植物也可以是宇宙的道具：樹是太陽的家，也是白天開始的地方。",
    quiz: {
      q: "扶桑樹上為什麼有好多小圓圈？",
      options: ["那是樹上的橘子", "那是還沒輪班的太陽", "那是雨滴"],
      answer: 1,
      explain: "神話說太陽有十個，住在扶桑樹上輪流升起。"
    }
  },
  {
    id: "crane",
    name: "仙鶴",
    short: "仙鶴",
    realm: "天上",
    kind: "動物",
    x: 38.5,
    y: 5.6,
    riddle: "天界還有長脖子的鳥在飛。請找出一隻仙鶴。",
    hint: "人首蛇身神的左上方，有長頸、伸翅的鳥。",
    story: "鶴在中國神話裡常當仙人的坐騎，也代表長壽。帛畫把牠們畫在天界，好像在為靈魂護航，也讓天空顯得熱鬧、不死。",
    meaning: "鶴連接人與仙。看到鶴，就想到「活得很長、走得很遠」。",
    quiz: {
      q: "為什麼要在天上畫仙鶴？",
      options: ["因為鶴代表長壽與成仙", "因為鶴會下蛋給太陽", "因為鶴比雞便宜"],
      answer: 0,
      explain: "鶴是長壽與仙界的動物符號。"
    }
  },
  {
    id: "deity",
    name: "人首蛇身神",
    short: "神人",
    realm: "天上",
    kind: "人物",
    x: 50,
    y: 7.4,
    riddle: "最後一題：最頂上那位上半身是人、下半身是蛇的神，是誰？",
    hint: "帛畫正中央的最高處，蛇尾盤成好幾圈。",
    story: "這位神人常被看成女媧，有時也與伏羲、燭龍或太一有關。女媧煉石補天、造人；蛇身表示她比普通人類更古老，屬於創世的一代。靈魂升到這裡，才算回到神話的源頭。",
    meaning: "蛇能脫皮，像生命可以更新。把創世神畫在最頂上，等於說：天的盡頭是「開始」。",
    quiz: {
      q: "為什麼這位神的下半身是蛇？",
      options: ["因為穿褲子不方便", "蛇能脫皮，象徵古老、能再生的創世神", "因為畫家畫錯了腿"],
      answer: 1,
      explain: "人首蛇身是伏羲、女媧常見的樣子，代表比人類更早的神。"
    }
  }
];

const STORAGE_KEY = "mawangdui-silk-found";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  mode: "riddle",
  found: new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")),
  selected: null,
  zoom: 1,
  muted: false,
  audio: null
};

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.found]));
}

function nextTarget() {
  return SPOTS.find((spot) => !state.found.has(spot.id)) || null;
}

function chime() {
  if (state.muted || reducedMotion) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!state.audio) state.audio = new AudioCtx();
  const ctx = state.audio;
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  [0, 5, 9].forEach((step, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 330 * 2 ** (step / 12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02 + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42 + i * 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + 0.5 + i * 0.05);
  });
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-on");
  clearTimeout(toast.tid);
  toast.tid = setTimeout(() => el.classList.remove("is-on"), 1800);
}

function renderStamps() {
  $("stamp-list").innerHTML = SPOTS.map((spot) => {
    const found = state.found.has(spot.id);
    return `<li><div class="stamp${found ? " is-found" : ""}" title="${spot.name}">${spot.short}</div></li>`;
  }).join("");
  $("progress-label").textContent = `已找到 ${state.found.size} / ${SPOTS.length}`;
}

function renderHotspots() {
  const layer = $("hotspot-layer");
  const target = nextTarget();
  layer.innerHTML = SPOTS.map((spot) => {
    const classes = ["hotspot"];
    if (state.found.has(spot.id)) classes.push("is-found");
    if (state.mode === "riddle" && target && target.id === spot.id) classes.push("is-target");
    const label = state.mode === "teacher" ? `<span class="hotspot-label">${spot.short}</span>` : "";
    return `<button type="button" class="${classes.join(" ")}" data-id="${spot.id}" style="left:${spot.x}%;top:${spot.y}%" aria-label="${spot.name}">${label}</button>`;
  }).join("");
  $("silk").classList.toggle("mode-teacher", state.mode === "teacher");
  $("silk").classList.toggle("mode-free", state.mode === "free");
  $("silk").classList.toggle("mode-riddle", state.mode === "riddle");
}

function setMission() {
  const lore = $("lore");
  const dock = $("dock");
  lore.hidden = true;
  lore.innerHTML = "";
  dock.classList.remove("is-reading");
  dock.scrollTop = 0;
  if (state.mode === "teacher") {
    $("realm-chip").textContent = "導覽";
    $("mission-title").textContent = "老師導覽";
    $("mission-text").textContent = "點圖上任何光圈，就可以直接講解。學生不會被謎題卡住。";
    $("btn-hint").hidden = true;
    $("btn-free").textContent = "改回尋寶";
    return;
  }
  if (state.mode === "free") {
    $("realm-chip").textContent = "三界";
    $("mission-title").textContent = "自由探索";
    $("mission-text").textContent = "想點哪裡就點哪裡。找到一處，就能聽到它的故事。";
    $("btn-hint").hidden = true;
    $("btn-free").textContent = "改回尋寶";
    return;
  }
  const target = nextTarget();
  $("btn-hint").hidden = false;
  $("btn-free").textContent = "自由探索";
  if (!target) {
    $("realm-chip").textContent = "完成";
    $("mission-title").textContent = "十二處都找到了";
    $("mission-text").textContent = "靈魂已經走到天門。往下看看結局。";
    showFinale();
    return;
  }
  $("realm-chip").textContent = target.realm;
  $("mission-title").textContent = "今日謎題";
  $("mission-text").textContent = target.riddle;
}

function loreHtml(spot, withQuiz) {
  const options = spot.quiz.options
    .map((text, index) => `<button type="button" class="quiz-btn" data-index="${index}">${text}</button>`)
    .join("");
  return `
    <div class="kind-row">
      <span>${spot.realm}</span>
      <span>${spot.kind}</span>
    </div>
    <p class="lore-meaning"><strong>它代表：</strong>${spot.meaning}</p>
    ${withQuiz ? `<div class="quiz"><h3>${spot.quiz.q}</h3>${options}<p class="feedback" id="quiz-feedback"></p></div>` : ""}
  `;
}

function openSpot(spot, fromRiddle) {
  state.selected = spot.id;
  const needQuiz = state.mode !== "teacher" && !state.found.has(spot.id);
  $("realm-chip").textContent = spot.realm;
  $("mission-title").textContent = spot.name;
  $("mission-text").textContent = spot.story;
  const lore = $("lore");
  const dock = $("dock");
  lore.hidden = false;
  lore.innerHTML = loreHtml(spot, needQuiz);
  dock.classList.add("is-reading");
  dock.scrollTop = 0;
  if (fromRiddle && needQuiz) {
    $("btn-hint").hidden = true;
  }
  lore.querySelectorAll(".quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => grade(spot, Number(btn.dataset.index), btn));
  });
}

function grade(spot, index, btn) {
  const feedback = $("quiz-feedback");
  const buttons = [...btn.parentElement.querySelectorAll(".quiz-btn")];
  if (index === spot.quiz.answer) {
    btn.classList.add("is-correct");
    buttons.forEach((item) => { item.disabled = true; });
    feedback.textContent = "答對了！" + spot.quiz.explain;
    markFound(spot);
  } else {
    btn.classList.add("is-wrong");
    feedback.textContent = "再想一想。" + spot.quiz.explain.replace(/。$/, "。");
  }
}

function markFound(spot) {
  const already = state.found.has(spot.id);
  state.found.add(spot.id);
  save();
  renderStamps();
  renderHotspots();
  if (!already) {
    chime();
    toast(`蓋印：${spot.name}`);
  }
  if (state.found.size === SPOTS.length) {
    setTimeout(showFinale, reducedMotion ? 400 : 900);
  } else if (state.mode === "riddle") {
    const target = nextTarget();
    if (target) {
      $("btn-hint").hidden = false;
      $("mission-text").textContent = "下一題：" + target.riddle;
    }
  }
}

function showFinale() {
  $("screen-game").hidden = true;
  $("screen-game").setAttribute("aria-hidden", "true");
  $("screen-finale").hidden = false;
  $("screen-finale").removeAttribute("aria-hidden");
}

function start(mode) {
  state.mode = mode;
  $("screen-intro").hidden = true;
  $("screen-intro").setAttribute("aria-hidden", "true");
  $("screen-finale").hidden = true;
  $("screen-finale").setAttribute("aria-hidden", "true");
  $("screen-game").hidden = false;
  $("screen-game").removeAttribute("aria-hidden");
  renderStamps();
  renderHotspots();
  setMission();
  $("main").focus();
}

function hint() {
  const target = nextTarget();
  if (!target) return;
  const btn = document.querySelector(`[data-id="${target.id}"]`);
  if (btn) {
    btn.classList.add("is-hint");
    btn.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center", inline: "center" });
  }
  toast(target.hint);
}

function onHotspotClick(id) {
  const spot = SPOTS.find((item) => item.id === id);
  if (!spot) return;
  const target = nextTarget();
  if (state.mode === "riddle" && target && spot.id !== target.id && !state.found.has(spot.id)) {
    openSpot(spot, false);
    toast(`你先碰到了「${spot.name}」。不過這一題要找的是另一處。`);
    return;
  }
  openSpot(spot, state.mode === "riddle");
  if (state.mode === "teacher" && !state.found.has(spot.id)) {
    state.found.add(spot.id);
    save();
    renderStamps();
    renderHotspots();
  }
}

function applyZoom() {
  $("silk-mount").style.setProperty("--zoom", String(state.zoom));
}

function bind() {
  $("btn-start").addEventListener("click", () => start("riddle"));
  $("btn-teacher").addEventListener("click", () => start("teacher"));
  $("btn-hint").addEventListener("click", hint);
  $("btn-free").addEventListener("click", () => {
    state.mode = state.mode === "riddle" ? "free" : "riddle";
    renderHotspots();
    setMission();
  });
  $("btn-zoom-in").addEventListener("click", () => {
    state.zoom = Math.min(2.4, state.zoom + 0.2);
    applyZoom();
  });
  $("btn-zoom-out").addEventListener("click", () => {
    state.zoom = Math.max(0.8, state.zoom - 0.2);
    applyZoom();
  });
  $("btn-mute").addEventListener("click", () => {
    state.muted = !state.muted;
    $("btn-mute").setAttribute("aria-pressed", String(state.muted));
    $("btn-mute").textContent = state.muted ? "靜" : "音";
  });
  $("btn-reset").addEventListener("click", () => {
    state.found = new Set();
    save();
    start(state.mode === "teacher" ? "teacher" : "riddle");
    toast("印記已清空，重新出發。");
  });
  $("btn-replay").addEventListener("click", () => {
    state.found = new Set();
    save();
    start("riddle");
  });
  $("hotspot-layer").addEventListener("click", (event) => {
    const btn = event.target.closest(".hotspot");
    if (btn) onHotspotClick(btn.dataset.id);
  });
  $("silk").addEventListener("click", (event) => {
    if (event.target.closest(".hotspot")) return;
    const debug = new URLSearchParams(location.search).has("debug");
    if (debug) {
      const rect = $("silk").getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      console.info(`hotspot ~ x:${x.toFixed(1)}, y:${y.toFixed(1)}`);
      toast(`座標 ${x.toFixed(1)}%, ${y.toFixed(1)}%`);
      return;
    }
    if (state.mode === "riddle") {
      toast("這裡還沒有故事，再靠近一點看看。");
    }
  });
}

bind();
