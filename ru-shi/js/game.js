(function () {
  var grade = window.RuShiGrade.grade;
  var puzzles = window.RuShiPuzzles.byId;
  var order = window.RuShiPuzzles.order;
  var KEY = "rushi-yanshi-v2";
  var API = "https://peachblossom-enjoyread-quiz.shirlyspeaking.workers.dev";

  var IMG = {
    inn: "images/inn.jpg",
    wei: "images/wei.jpg",
    court: "images/court.jpg",
    yuci: "images/yuci.jpg",
    handan: "images/handan.jpg",
    joy: "images/joy.jpg",
    weep: "images/weep.jpg",
    tian: "images/tian.jpg"
  };

  var TABLE = [
    { id: "jing", name: "荊軻", x: 4, y: 14, w: 32, h: 72 },
    { id: "songyi", name: "宋意", x: 36, y: 12, w: 30, h: 74 },
    { id: "gao", name: "高漸離", x: 68, y: 12, w: 28, h: 72 }
  ];
  var WEI = [
    { id: "jing", name: "荊軻", x: 2, y: 8, w: 30, h: 80 },
    { id: "local", name: "衛人", x: 36, y: 8, w: 28, h: 80 },
    { id: "yan", name: "燕客", x: 64, y: 14, w: 32, h: 76 }
  ];
  var COURT = [
    { id: "jing", name: "荊軻", x: 2, y: 16, w: 36, h: 76 },
    { id: "lord", name: "衛元君", x: 56, y: 6, w: 36, h: 62 }
  ];
  var YUCI = [
    { id: "jing", name: "荊軻", x: 2, y: 10, w: 34, h: 80 },
    { id: "gai", name: "蓋聶", x: 52, y: 6, w: 42, h: 64 }
  ];
  var HANDAN = [
    { id: "jing", name: "荊軻", x: 4, y: 12, w: 38, h: 76 },
    { id: "lu", name: "魯句踐", x: 44, y: 6, w: 42, h: 80 }
  ];
  var TIAN = [
    { id: "jing", name: "荊軻", x: 4, y: 8, w: 34, h: 82 },
    { id: "tian", name: "田光", x: 50, y: 14, w: 36, h: 76 }
  ];

  function fresh() {
    return {
      step: "title",
      line: 0,
      mode: "ask",
      draft: "",
      answers: {},
      feeling: "",
      helps: {},
      stayCount: 0,
      mapMoved: false,
      crowd: {},
      aside: null,
      bubble: null,
      askDraft: "",
      askBusy: false,
      feedback: null,
      helpOpen: false,
      shouldFocus: false
    };
  }

  var state = fresh();
  var lastSrc = "";
  var placeNode = document.getElementById("place");
  var progressNode = document.getElementById("progress");
  var pipsNode = document.getElementById("pips");
  var stage = document.getElementById("stage");

  var STEPS = {
    title: { type: "title", place: "刺客列傳・荊軻" },
    pro1: {
      type: "talk",
      place: "開場",
      image: IMG.wei,
      alt: "黏土場景：荊軻站在衛國巷口",
      skip: "wake",
      lines: [{ speaker: "史記", text: "司馬遷寫《刺客列傳》，在專諸、聶政之後隔了二百二十多年，才寫到荊軻。" }],
      next: "pro2"
    },
    pro2: {
      type: "talk",
      place: "開場",
      image: IMG.court,
      alt: "黏土場景：衛元君轉身離開",
      skip: "wake",
      lines: [{ speaker: "史記", text: "他好讀書，也好擊劍。拿這套本領去見衛元君，衛元君不用他。" }],
      next: "pro3"
    },
    pro3: {
      type: "talk",
      place: "開場",
      image: IMG.handan,
      alt: "黏土場景：邯鄲棋局",
      skip: "wake",
      lines: [{ speaker: "史記", text: "後來那個衛也留不住人。他走過榆次，走過邯鄲，才到了燕。" }],
      next: "pro4"
    },
    pro4: {
      type: "talk",
      place: "開場",
      image: IMG.inn,
      alt: "黏土場景：燕市酒肆",
      lines: [{ speaker: "史記", text: "這一夜你在燕市睜眼。他們說的是古文。你只能用自己的白話，把話譯通。" }],
      doneLabel: "我在燕市醒來",
      next: "wake"
    },
    wake: {
      type: "talk",
      place: "燕市・酒肆",
      image: IMG.inn,
      alt: "荊軻、宋意與高漸離坐在酒肆",
      spots: TABLE,
      spotLines: {
        jing: ["荊軻", "你心裡只有白話。古文要寫出來，才算聽見。"],
        songyi: ["宋意", "《史記》沒把我的名字寫在酒桌上。《燕丹子》裡，我後來和高漸離一起唱。你叫我宋意就好。"],
        gao: ["高漸離", "築還沒有響。你先把來路譯清楚。"]
      },
      lines: [
        { speaker: "宋意", text: "你又在發呆。從衛國到這張桌子，中間那些人說的話，你自己都對不上。" },
        { speaker: "宋意", text: "我是宋意。把他們的話譯給我聽。譯通了，這首歌才唱得下去。" }
      ],
      doneLabel: "從衛國想起",
      next: "wei"
    },
    wei: translateStep("wei", {
      place: "回憶・衛巷",
      image: IMG.wei,
      alt: "衛國巷口，有人向荊軻招呼",
      spots: WEI,
      spotLines: {
        jing: ["荊軻", "同一個你，到了別的城，名字會換。"],
        local: ["衛人", "慶卿，你還在衛。"],
        yan: ["燕客", "而之燕，燕人謂之荊卿。"]
      },
      lead: ["燕客", "衛人叫你慶卿。燕國來的人，說的是另一句。"],
      doneLabel: "收下這句",
      next: "court"
    }),
    court: translateStep("court", {
      place: "回憶・衛元君",
      image: IMG.court,
      alt: "衛元君背對荊軻，走下木臺",
      spots: COURT,
      spotLines: {
        jing: ["荊軻", "你把本領帶進這間屋子。"],
        lord: ["衛元君", "他沒有回頭。"]
      },
      lead: ["史記", "你看見的是一個背影。書上這一句，寫在他轉身之後。"],
      doneLabel: "他已經走了",
      next: "map"
    }),
    map: {
      type: "map",
      place: "過場・東郡",
      next: "yuci"
    },
    yuci: translateStep("yuci", {
      place: "回憶・榆次",
      image: IMG.yuci,
      alt: "蓋聶在劍架前瞪著荊軻",
      spots: YUCI,
      spotLines: {
        jing: ["荊軻", "論劍論到這裡，話已經不投機。"],
        gai: ["蓋聶", "曩者吾與論劍有不稱者，吾目之。"]
      },
      lead: ["蓋聶", "他沒有拔劍。眼睛先壓過來。"],
      doneLabel: "人還在榆次",
      next: "yuci-choice"
    }),
    "yuci-choice": {
      type: "choice",
      place: "回憶・榆次",
      image: IMG.yuci,
      alt: "蓋聶仍在櫃後看著荊軻",
      speaker: "宋意",
      text: "那一瞪你聽懂了。現在可以留下分辨，也可以登車走。",
      options: [
        { label: "留下分辨", run: function () { state.stayCount += 1; go("yuci-stay"); } },
        { label: "登車離開", run: function () { go("yuci-leave"); } }
      ]
    },
    "yuci-stay": {
      type: "stay",
      place: "回憶・榆次",
      image: IMG.yuci,
      alt: "蓋聶又瞪了過來"
    },
    "yuci-leave": {
      type: "talk",
      place: "回憶・榆次",
      image: IMG.yuci,
      alt: "榆次的劍室，人已經該走了",
      lines: [{
        speaker: "宋意",
        text: "使者趕到時，屋子空了。蓋聶跟別人說：是他的眼光把你震走的。你的離開，到了他嘴裡，就變成怕。",
        classic: "固去也，吾曩者目攝之！"
      }],
      doneLabel: "走向邯鄲",
      next: "handan"
    },
    handan: translateStep("handan", {
      place: "回憶・邯鄲",
      image: IMG.handan,
      alt: "魯句踐在棋盤前斥責荊軻",
      spots: HANDAN,
      spotLines: {
        jing: ["荊軻", "這一格，你們都要。"],
        lu: ["魯句踐", "他的聲音已經壓過整條街。"]
      },
      lead: ["魯句踐", "棋路撞在一起。他當眾斥責。書上沒有寫你回了什麼。"],
      doneLabel: "走到巷口",
      next: "handan-feel"
    }),
    "handan-feel": {
      type: "choice",
      place: "邯鄲・巷口",
      image: IMG.handan,
      alt: "棋局散了，荊軻低著眼",
      speaker: "宋意",
      text: "他們說你逃。你認可嗎？這一句不寫進分數，只寫進譯卷。",
      options: [
        { label: "認可", run: function () { state.feeling = "yes"; go("joy"); } },
        { label: "不認可", run: function () { state.feeling = "no"; go("joy"); } },
        { label: "還說不清", run: function () { state.feeling = "unsure"; go("joy"); } }
      ]
    },
    joy: {
      type: "talk",
      place: "燕市・夜",
      image: IMG.joy,
      alt: "酒肆裡三人舉杯，高漸離抱著築",
      spots: TABLE,
      spotLines: {
        jing: ["荊軻", "你開口應和。先是笑。"],
        songyi: ["宋意", "快樂是真的。先別急著哭。"],
        gao: ["高漸離", "高漸離擊築，荊軻和而歌於市中，相樂也。"]
      },
      lines: [{
        speaker: "高漸離",
        text: "築聲進了市場。你在街市上應和。",
        classic: "高漸離擊築，荊軻和而歌於市中，相樂也。"
      }],
      doneLabel: "應和這一聲",
      next: "weep"
    },
    weep: translateStep("weep", {
      place: "燕市・夜",
      image: IMG.weep,
      alt: "同一張酒桌，三人流淚",
      spots: TABLE,
      spotLines: {
        jing: ["荊軻", "歌還是剛才那一支。"],
        songyi: ["宋意", "中間只隔了不久。"],
        gao: ["高漸離", "築還在膝上。人已經不唱了。"]
      },
      lead: ["宋意", "已而。同一張桌子，燈暗了一點。"],
      doneLabel: "看看旁邊的人",
      next: "crowd"
    }),
    crowd: {
      type: "crowd",
      place: "燕市・夜",
      image: IMG.weep,
      alt: "三人仍坐在桌邊，市上的人像不在",
      spots: TABLE.concat([
      { id: "vendor", name: "賣漿的", x: 6, y: 2, w: 16, h: 18 },
      { id: "passer", name: "過路的", x: 28, y: 0, w: 16, h: 16 },
      { id: "stoop", name: "門檻上的人", x: 50, y: 0, w: 18, h: 16 }
    ]),
      spotLines: {
        jing: ["荊軻", "你轉頭。市聲還在，可是聽不清。"],
        songyi: ["宋意", "我們還在這張桌子。你點的是外面的人。"],
        gao: ["高漸離", "他看著你，沒有再擊築。"],
        vendor: ["賣漿的", "……"],
        passer: ["過路的", "……"],
        stoop: ["門檻上的人", "……"]
      },
      next: "deep"
    },
    deep: translateStep("deep", {
      place: "燕市・夜巷",
      image: IMG.weep,
      alt: "酒肆門口，宋意看著荊軻",
      spots: TABLE,
      spotLines: {
        jing: ["荊軻", "市上的人只看見酒。"],
        songyi: ["宋意", "前半句我認得。你把轉折譯出來，門才在。"],
        gao: ["高漸離", "他不說話。築收著。"]
      },
      lead: ["宋意", "市上的人都說，你不過是個酒徒。"],
      doneLabel: "去看那扇門",
      next: "tian"
    }),
    tian: translateStep("tian", {
      place: "田光門",
      image: IMG.tian,
      alt: "田光站在木門裡，看著荊軻",
      spots: TIAN,
      spotLines: {
        jing: ["荊軻", "你沒有再解釋那兩次離開。"],
        tian: ["田光", "他沒有問你劍，也沒有問你酒。"]
      },
      lead: function () {
        return ["田光", tianLead()];
      },
      doneLabel: "打開譯卷",
      next: "end"
    }),
    end: { type: "end", place: "譯卷" }
  };

  function translateStep(id, extra) {
    var step = {
      type: "translate",
      puzzle: id,
      ok: okLine(id)
    };
    Object.keys(extra).forEach(function (key) { step[key] = extra[key]; });
    return step;
  }

  function okLine(id) {
    var lines = {
      wei: ["宋意", "名字總算落到對的城。譯卷收下這一句。"],
      court: ["宋意", "譯對了，也不會被留下。這就是不用。"],
      yuci: ["宋意", "那一瞪，你看懂了。"],
      handan: ["宋意", "巷口安靜了。「遂不復會」收下。"],
      weep: ["宋意", "人還在市上。你再點他們看看。"],
      deep: ["宋意", "他沉默了一會。夜巷盡頭有一扇門。"],
      tian: ["田光", "他看著譯卷，沒有再叫你酒徒。"]
    };
    return lines[id];
  }

  function tianLead() {
    if (state.feeling === "yes") return "你寫過：那一走，你認可是逃。田光還是看著你。";
    if (state.feeling === "no") return "你不認可那句「逃」。田光還沒有開口。";
    if (state.feeling === "unsure") return "你說你還沒想清楚。田光點了一下頭。";
    return "田光站在門裡，像是已經把你看過一遍。";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function go(id) {
    state.step = id;
    state.line = 0;
    state.mode = "ask";
    state.draft = "";
    state.aside = null;
    state.bubble = null;
    state.askDraft = "";
    state.askBusy = false;
    state.feedback = null;
    state.helpOpen = false;
    state.shouldFocus = false;
    primeBubble(STEPS[id]);
    save();
    render();
    window.scrollTo(0, 0);
  }

  function primeBubble(step) {
    if (!step) return;
    if (step.type === "translate") {
      var lead = typeof step.lead === "function" ? step.lead() : step.lead;
      if (lead) state.bubble = { id: idByName(lead[0]), name: lead[0], text: lead[1], ask: false };
      return;
    }
    if (step.type === "talk" && step.lines && step.lines[0]) {
      var line = step.lines[0];
      state.bubble = { id: line.speaker === "史記" ? "narrator" : idByName(line.speaker), name: line.speaker, text: line.text, ask: false };
      return;
    }
    if (step.type === "choice") {
      state.bubble = { id: idByName(step.speaker || "宋意"), name: step.speaker || "宋意", text: step.text, ask: false };
      return;
    }
    if (step.type === "stay") {
      state.bubble = { id: "songyi", name: "宋意", text: stayText(false), ask: false };
      return;
    }
    if (step.type === "map") {
      state.bubble = { id: "songyi", name: "宋意", text: "再點一次那座城。", ask: false };
      return;
    }
    if (step.type === "crowd") {
      state.bubble = { id: "songyi", name: "宋意", text: "人還在市上。你點點他們。", ask: false };
    }
  }

  function idByName(name) {
    var map = { 宋意: "songyi", 荊軻: "jing", 高漸離: "gao", 衛人: "local", 燕客: "yan", 衛元君: "lord", 蓋聶: "gai", 魯句踐: "lu", 田光: "tian", 史記: "narrator" };
    return map[name] || "songyi";
  }

  function stayText(hard) {
    return hard
      ? "他又瞪了一次。你可以留。史書上這一天，你沒有留。他不會把後面那句說給還站著的人聽。"
      : "眼睛還在。你可以留。要聽見他後來怎麼向別人講你，還是得上車。";
  }

  function save() {
    try {
      var copy = {};
      Object.keys(state).forEach(function (key) {
        if (key === "helpOpen" || key === "shouldFocus" || key === "aside") return;
        copy[key] = state[key];
      });
      localStorage.setItem(KEY, JSON.stringify(copy));
    } catch (err) {
      /* 試玩不依賴儲存。 */
    }
  }

  function readSave() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.step || data.step === "title" || !STEPS[data.step]) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  function applySave(data) {
    var next = fresh();
    Object.keys(next).forEach(function (key) {
      if (data[key] !== undefined && key !== "helpOpen" && key !== "shouldFocus" && key !== "aside") {
        next[key] = data[key];
      }
    });
    Object.keys(state).forEach(function (key) { delete state[key]; });
    Object.assign(state, next);
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (err) { /* 略過。 */ }
    var next = fresh();
    Object.keys(state).forEach(function (key) { delete state[key]; });
    Object.assign(state, next);
    lastSrc = "";
    render();
    window.scrollTo(0, 0);
  }

  function leadOf(step) {
    if (state.aside) return state.aside;
    var lead = step.lead;
    if (typeof lead === "function") lead = lead();
    if (lead) return { speaker: lead[0], text: lead[1] };
    return null;
  }

  function render() {
    var step = STEPS[state.step] || STEPS.title;
    var scroll = window.scrollY;
    placeNode.textContent = step.place || "";
    document.querySelector(".top").hidden = step.type === "title";
    renderPips(step);
    clear(stage);
    if (step.type === "title") renderTitle();
    else if (step.type === "talk") renderTalk(step);
    else if (step.type === "translate") renderTranslate(step);
    else if (step.type === "choice") renderChoice(step);
    else if (step.type === "stay") renderStay(step);
    else if (step.type === "map") renderMap(step);
    else if (step.type === "crowd") renderCrowd(step);
    else if (step.type === "end") renderEnd();
    if (state.step !== "title") window.scrollTo(0, scroll);
    var box = stage.querySelector("textarea");
    if (box && state.shouldFocus) {
      box.focus();
      var end = box.value.length;
      box.setSelectionRange(end, end);
      state.shouldFocus = false;
    }
  }

  function renderPips(step) {
    clear(pipsNode);
    if (step.type === "title") {
      progressNode.textContent = "";
      return;
    }
    var done = 0;
    order.forEach(function (id) { if (state.answers[id]) done += 1; });
    progressNode.textContent = "譯卷 " + done + " / " + order.length;
    order.forEach(function (id) {
      var li = el("li");
      var puzzle = puzzles[id];
      li.title = puzzle.place;
      if (state.answers[id]) li.className = "is-done";
      else if (step.puzzle === id) li.className = "is-now";
      li.appendChild(el("span", "sr", puzzle.place));
      pipsNode.appendChild(li);
    });
  }

  function renderTitle() {
    var saved = readSave();
    var block = el("section", "title-block");
    block.appendChild(el("h1", null, "入史"));
    block.appendChild(el("p", "volume", "燕市"));
    block.appendChild(el("p", "lede", "你在酒肆醒來，站在荊軻的位置上。他們說古文。你用自己的白話把話譯通，這一夜才走得下去。"));
    stage.appendChild(block);
    stage.appendChild(frameOf({
      image: IMG.inn,
      alt: "燕市酒肆，荊軻與宋意、高漸離同桌"
    }));
    var actions = el("div", "actions");
    actions.appendChild(button(saved ? "重新開始" : "走進這一夜", "primary", function () {
      reset();
      go("pro1");
    }));
    if (saved) {
      actions.appendChild(button("接著這一夜", "ghost", function () {
        applySave(saved);
        render();
      }));
    }
    stage.appendChild(actions);
    var back = el("a", "back", "回桃花源");
    back.href = "../index.html";
    stage.appendChild(back);
  }

  function sceneSpots(step) {
    var spots = (step.spots || []).slice();
    var lines = {};
    var src = step.spotLines || {};
    Object.keys(src).forEach(function (key) { lines[key] = src[key]; });
    if (step.type === "talk" && step.lines && step.lines[0] && step.lines[0].speaker === "史記") {
      var line = step.lines[state.line] || step.lines[0];
      spots = [{ id: "narrator", name: "史記", x: 6, y: 8, w: 22, h: 28 }];
      lines.narrator = ["史記", line.text];
    }
    if (step.type && step.type !== "title" && !spots.some(function (spot) { return spot.id === "songyi"; }) && step.image) {
      spots.push({ id: "songyi", name: "宋意", x: 76, y: 62, w: 20, h: 30 });
    }
    return { spots: spots, lines: lines };
  }

  function frameOf(step) {
    var frame = el("div", "frame");
    if (step.image) {
      var img = el("img");
      img.src = step.image;
      img.alt = step.alt || "";
      if (step.image !== lastSrc) img.classList.add("is-fresh");
      lastSrc = step.image;
      frame.appendChild(img);
      var scene = sceneSpots(step);
      mountSpots(frame, scene.spots, scene.lines, step);
      placeBubble(frame, scene.spots, step);
    }
    return frame;
  }

  function mountSpots(frame, spots, lines, step) {
    spots.forEach(function (spot) {
      var hit = el("button", "spot" + (state.bubble && state.bubble.id === spot.id ? " is-speaking" : ""));
      hit.type = "button";
      hit.style.left = spot.x + "%";
      hit.style.top = spot.y + "%";
      hit.style.width = spot.w + "%";
      hit.style.height = spot.h + "%";
      hit.setAttribute("aria-label", "點" + spot.name);
      hit.appendChild(el("span", null, spot.name));
      hit.addEventListener("click", function () {
        if (spot.id === "vendor" || spot.id === "passer" || spot.id === "stoop") state.crowd[spot.id] = true;
        if (spot.id === "songyi") {
          state.bubble = { id: "songyi", name: "宋意", text: state.askAnswer || "想問哪個字？", ask: true };
          render();
          return;
        }
        var line = lines && lines[spot.id];
        state.bubble = { id: spot.id, name: line ? line[0] : spot.name, text: line ? line[1] : "……", ask: false };
        save();
        render();
      });
      frame.appendChild(hit);
    });
  }

  function placeBubble(frame, spots, step) {
    if (!state.bubble) return;
    var spot = null;
    spots.forEach(function (item) { if (item.id === state.bubble.id) spot = item; });
    if (!spot) spot = { id: "songyi", x: 70, y: 58, w: 20, h: 24 };
    var bubble = el("div", "bubble" + (spot.x > 45 ? " is-right" : ""));
    bubble.appendChild(el("p", "bubble-name", state.bubble.name));
    var tone = state.mode === "ok" ? "ok" : (state.feedback ? "bad" : "");
    bubble.appendChild(el("p", "say" + (tone ? " " + tone : ""), state.bubble.text || ""));
    if (state.bubble.ask && state.mode !== "ok") {
      var form = el("form");
      var input = document.createElement("input");
      input.value = state.askDraft;
      input.maxLength = 24;
      input.placeholder = "例如：之";
      input.setAttribute("aria-label", "問宋意一個字");
      input.addEventListener("input", function () { state.askDraft = input.value; });
      var ask = el("button", null, state.askBusy ? "…" : "問");
      ask.type = "submit";
      ask.disabled = state.askBusy;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        askSongyi(step);
      });
      form.appendChild(input);
      form.appendChild(ask);
      bubble.appendChild(form);
    }
    frame.appendChild(bubble);
  }

  function paper(speaker, text, tone, classic) {
    var card = el("section", "paper");
    card.setAttribute("aria-live", "polite");
    if (speaker) card.appendChild(el("p", "who", speaker));
    var say = el("p", "say" + (tone ? " " + tone : ""), text || "");
    card.appendChild(say);
    if (classic) {
      var quote = el("div", "quote");
      quote.appendChild(el("small", null, "原文"));
      quote.appendChild(el("p", "classic", classic));
      card.appendChild(quote);
    }
    return card;
  }

  function button(label, className, onClick) {
    var node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  }

  function renderTalk(step) {
    stage.appendChild(frameOf(step));
    var line = step.lines[state.line] || step.lines[0];
    if (line.classic) stage.appendChild(originalCard(line.classic));
    var actions = el("div", "actions");
    var last = state.line >= step.lines.length - 1;
    actions.appendChild(button(last ? (step.doneLabel || "繼續") : "下一句", "primary", function () {
      if (!last) {
        state.line += 1;
        var nextLine = step.lines[state.line];
        state.bubble = {
          id: nextLine.speaker === "史記" ? "narrator" : idByName(nextLine.speaker),
          name: nextLine.speaker,
          text: nextLine.text,
          ask: false
        };
        save();
        render();
        return;
      }
      go(step.next);
    }));
    if (step.skip) actions.appendChild(button("跳過，直接醒來", "ghost", function () { go(step.skip); }));
    stage.appendChild(actions);
  }

  function originalCard(classic) {
    var card = el("section", "paper");
    var quote = el("div", "quote");
    quote.appendChild(el("small", null, "原文"));
    quote.appendChild(el("p", "classic", classic));
    card.appendChild(quote);
    return card;
  }

  function renderTranslate(step) {
    var puzzle = puzzles[step.puzzle];
    stage.appendChild(frameOf(step));
    var card = originalCard(puzzle.original);
    if (state.mode !== "ok") {
      var field = el("label", "listen", "用你的白話寫下這一句");
      var box = document.createElement("textarea");
      box.value = state.draft;
      box.maxLength = 200;
      box.placeholder = "寫成你聽懂的意思";
      box.disabled = state.mode === "wait";
      box.addEventListener("input", function () { state.draft = box.value; });
      box.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submit(step, puzzle);
        }
      });
      field.appendChild(box);
      card.appendChild(field);
    }
    stage.appendChild(card);
    var actions = el("div", "actions");
    if (state.mode === "ok") {
      actions.appendChild(button(step.doneLabel || "繼續", "primary", function () { go(step.next); }));
    } else {
      var send = button(state.mode === "wait" ? "宋意在聽…" : "譯給他聽", "primary", function () { submit(step, puzzle); });
      send.disabled = state.mode === "wait";
      actions.appendChild(send);
    }
    stage.appendChild(actions);
  }

  function showLocal(step, puzzle, result) {
    var key = result.senseId || result.reason;
    var pair = puzzle.replies[key] || puzzle.replies.empty;
    state.feedback = { speaker: pair[0], text: pair[1] };
    state.mode = "ask";
    state.bubble = { id: idByName(pair[0]), name: pair[0], text: pair[1], ask: false };
    state.shouldFocus = true;
    save();
    render();
  }

  function acceptAnswer(step, puzzle, reply, speaker) {
    state.answers[puzzle.id] = state.draft.trim();
    state.mode = "ok";
    state.feedback = null;
    state.bubble = { id: idByName(speaker || step.ok[0]), name: speaker || step.ok[0], text: reply || step.ok[1], ask: false };
    save();
    render();
  }

  function submit(step, puzzle) {
    if (state.mode === "wait") return;
    var local = grade(puzzle, state.draft);
    if (local.reason === "empty" || local.reason === "copy" || local.reason === "reject" || local.reason === "trap") {
      showLocal(step, puzzle, local);
      return;
    }
    state.mode = "wait";
    state.feedback = null;
    state.bubble = { id: "songyi", name: "宋意", text: "我聽一下。", ask: false };
    render();
    fetch(API + "/rushi/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original: puzzle.original,
        reference: puzzle.reference,
        answer: state.draft.trim()
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("judge");
      return res.json();
    }).then(function (data) {
      if (!data || typeof data.score !== "number") throw new Error("judge");
      if (data.score >= 80) acceptAnswer(step, puzzle, data.reply, "宋意");
      else {
        state.mode = "ask";
        state.feedback = { speaker: "宋意", text: data.reply || "還沒有到八成。" };
        state.bubble = { id: "songyi", name: "宋意", text: data.reply || "還沒有到八成。再看一個詞。", ask: false };
        state.shouldFocus = true;
        save();
        render();
      }
    }).catch(function () {
      if (local.ok) acceptAnswer(step, puzzle, step.ok[1], step.ok[0]);
      else showLocal(step, puzzle, local);
    });
  }

  function askSongyi(step) {
    if (state.askBusy) return;
    var question = state.askDraft.trim();
    var puzzle = step && step.puzzle ? puzzles[step.puzzle] : null;
    if (!question) {
      state.bubble = { id: "songyi", name: "宋意", text: "寫一個字來問我。", ask: true };
      render();
      return;
    }
    if (/整句|全句|翻譯這|幫我譯|譯出來|這句話/.test(question)) {
      state.bubble = { id: "songyi", name: "宋意", text: "你問一個字就好，整句我不相。", ask: true };
      render();
      return;
    }
    state.askBusy = true;
    state.bubble = { id: "songyi", name: "宋意", text: "我想想這個字。", ask: true };
    render();
    fetch(API + "/rushi/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original: puzzle ? puzzle.original : "", question: question })
    }).then(function (res) {
      if (!res.ok) throw new Error("ask");
      return res.json();
    }).then(function (data) {
      state.askBusy = false;
      state.askAnswer = (data && data.answer) || "這個字我再想想。";
      state.bubble = { id: "songyi", name: "宋意", text: state.askAnswer, ask: true };
      render();
    }).catch(function () {
      state.askBusy = false;
      state.bubble = { id: "songyi", name: "宋意", text: "這會兒問不到。你再問一次這個字。", ask: true };
      render();
    });
  }

  function renderChoice(step) {
    stage.appendChild(frameOf(step));
    var row = el("div", "actions choices");
    step.options.forEach(function (option) {
      row.appendChild(button(option.label, "choice", option.run));
    });
    stage.appendChild(row);
  }

  function renderStay(step) {
    var hard = state.stayCount >= 2;
    if (!state.bubble || state.bubble.ask) {
      state.bubble = { id: "songyi", name: "宋意", text: stayText(hard), ask: false };
    }
    stage.appendChild(frameOf(step));
    var actions = el("div", "actions");
    if (!hard) {
      actions.appendChild(button("再留一會", "ghost", function () {
        state.stayCount += 1;
        state.bubble = { id: "songyi", name: "宋意", text: stayText(true), ask: false };
        save();
        render();
      }));
    }
    actions.appendChild(button("登車離開", "primary", function () { go("yuci-leave"); }));
    stage.appendChild(actions);
  }

  function renderMap(step) {
    var frame = el("div", "frame");
    var board = el("div", "board");
    board.appendChild(el("p", "map-copy", "秦往東。衛的位子，要自己點。"));
    var road = el("div", "road");
    var pin = el("button", "pin" + (state.mapMoved ? " is-moved" : ""), state.mapMoved ? "野王" : "衛");
    pin.type = "button";
    pin.disabled = state.mapMoved;
    pin.addEventListener("click", function () {
      state.mapMoved = true;
      state.bubble = { id: "songyi", name: "宋意", text: "連那個不用你的地方，也不在原來的位子了。你後來才到燕。", ask: false };
      save();
      render();
    });
    road.appendChild(pin);
    if (!state.mapMoved) road.appendChild(el("span", "dest", "野王"));
    board.appendChild(road);
    frame.appendChild(board);
    var songyi = el("button", "spot" + (state.bubble && state.bubble.id === "songyi" ? " is-speaking" : ""));
    songyi.type = "button";
    songyi.style.left = "8%";
    songyi.style.top = "58%";
    songyi.style.width = "22%";
    songyi.style.height = "28%";
    songyi.setAttribute("aria-label", "點宋意");
    songyi.appendChild(el("span", null, "宋意"));
    songyi.addEventListener("click", function () {
      state.bubble = { id: "songyi", name: "宋意", text: state.askAnswer || "想問哪個字？", ask: true };
      render();
    });
    frame.appendChild(songyi);
    placeBubble(frame, [{ id: "songyi", x: 8, y: 58, w: 22, h: 28 }], step);
    stage.appendChild(frame);
    stage.appendChild(originalCard("秦伐魏，置東郡，徙衛元君之支屬於野王。"));
    var actions = el("div", "actions");
    var next = button("城已經不在了", "primary", function () { go(step.next); });
    next.disabled = !state.mapMoved;
    actions.appendChild(next);
    stage.appendChild(actions);
  }

  function renderCrowd(step) {
    stage.appendChild(frameOf(step));
    if (Object.keys(state.crowd).length >= 3) {
      var actions = el("div", "actions");
      actions.appendChild(button("只有這張桌子還有聲音", "primary", function () { go(step.next); }));
      stage.appendChild(actions);
    }
  }

  function renderEnd() {
    var block = el("section", "sheet");
    block.appendChild(el("h1", null, "譯卷"));
    block.appendChild(el("p", "lede", "這一夜停在有人看出你不是普通人。易水以後的風，是下一卷。"));
    var feel = {
      yes: "他們說你逃。你認可。",
      no: "他們說你逃。你不認可。",
      unsure: "他們說你逃。你還說不清。"
    };
    block.appendChild(el("p", null, feel[state.feeling] || "巷口那一問，還沒有落下。"));
    order.forEach(function (id) {
      var puzzle = puzzles[id];
      var entry = el("article", "entry");
      entry.appendChild(el("p", "who", puzzle.place));
      entry.appendChild(el("p", "original", puzzle.original));
      entry.appendChild(el("p", null, "你的話　" + (state.answers[id] || "這一句還沒寫。")));
      entry.appendChild(el("p", "muted", "一種參考　" + puzzle.reference));
      block.appendChild(entry);
    });
    stage.appendChild(block);
    var actions = el("div", "actions");
    actions.appendChild(button("再走一次這一夜", "primary", reset));
    stage.appendChild(actions);
  }

  render();
})();
