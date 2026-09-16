(() => {
  const C = () => window.XIAOMAO;
  const STORAGE = "xiaomao-chengzhang-v1";

  const defaultState = () => ({
    node: "intro",
    school: null,
    place: null,
    returnPath: null,
    job: null,
    consult: false,
    association: false,
    delegate: false,
    npcSeen: false,
    npcNear: false,
    cards: [],
    stamps: [],
    matchIndex: 0,
    matchDone: [],
  });

  let state = defaultState();
  let pendingCard = null;
  let teacherOpen = false;
  let albumOpen = false;

  const $ = (id) => document.getElementById(id);

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(state));
    } catch (_) {
      /* ignore */
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state = { ...defaultState(), ...parsed };
    } catch (_) {
      state = defaultState();
    }
  }

  function addCard(id) {
    if (!id || state.cards.includes(id)) return;
    state.cards.push(id);
    pendingCard = C().cards[id];
  }

  function addStamp(id) {
    if (!id || state.stamps.includes(id)) return;
    state.stamps.push(id);
  }

  function workPlace() {
    return C().workPlace(state);
  }

  function jobMeta() {
    return C().jobs[state.job] || C().jobs.biz;
  }

  function highlightOrgs() {
    const ids = new Set();
    if (state.cards.includes("twoSessions") || state.cards.includes("npc")) ids.add("npc");
    if (state.cards.includes("cppcc") || state.cards.includes("twoSessions")) ids.add("cppcc");
    if (state.cards.includes("planFlow")) {
      ids.add("party");
      ids.add("state");
      ids.add("npc");
    }
    if (workPlace() === "hk" || state.place === "hk") ids.add("hksar");
    if (state.cards.includes("hkNpc") || state.delegate) ids.add("hkdeputies");
    return ids;
  }

  function chapterOf(node) {
    if (node === "intro") return 0;
    if (node.startsWith("ch1")) return 1;
    if (node.startsWith("ch2")) return 2;
    if (node.startsWith("ch3")) return 3;
    if (node.startsWith("ch4") || node === "npc") return 4;
    if (node.startsWith("match")) return 5;
    if (node === "summary") return 6;
    return 1;
  }

  function scene() {
    const data = C();
    const node = state.node;
    const job = jobMeta();
    const place = workPlace();

    if (node === "intro") {
      return {
        kind: "intro",
      };
    }

    if (node === "ch1") {
      return {
        eyebrow: "中學 · 十五歲",
        title: "政策其實已經在身上",
        body: "王小毛在香港讀中三。公民課講到國家機構，新聞又在說「兩會」和「五年規劃」。同學覺得那些離自己很遠。可是學校正在準備內地交流，家人週末會坐高鐵，屋租和空氣也天天上新聞。",
        choices: [
          { text: "認真上公民課，還去參加模擬兩會", next: "ch1_after", set: { school: "civic" } },
          { text: "先參加學生會，為校園的事發聲", next: "ch1_after", set: { school: "union" } },
          { text: "考試要緊，先把範圍讀熟", next: "ch1_after", set: { school: "exam" } },
        ],
      };
    }

    if (node === "ch1_after") {
      const extra = {
        civic: "模擬兩會那天，小毛被分到「人大」組，才發現這個會是在審查批准；隔壁「政協」組一直在提建議。原來兩會常被合稱，卻不是同一個機關。",
        union: "學生會讓他練習把同學的意見寫成建議。老師說：將來面對更大的政策，也有類似的渠道，只是機關不同。",
        exam: "他把名詞背下來了。老師補了一句：這些詞會變成課程、交通和住房，不是只出現在試卷上。",
      }[state.school];
      return {
        eyebrow: "中學",
        title: "先認得兩個會",
        body: extra + " 三月的新聞畫面裡，全國人大和全國政協差不多同期開會。規劃要經人大批准，政協則把意見送進去。",
        cards: ["twoSessions", "npc", "cppcc", "planLife"],
        stamps: ["school", "transit", "housing"],
        next: "ch2",
        nextLabel: "選大學",
      };
    }

    if (node === "ch2") {
      return {
        eyebrow: "升學",
        title: "在哪裡讀，就站在哪裡看",
        body: "中學畢業了。小毛可以留在香港、到內地城市，或出國。這不是選哪個比較厲害，而是之後接觸政策和提意見的現場會不一樣。",
        choices: [
          { text: "留在香港讀大學", next: "ch2_place", set: { place: "hk", returnPath: null } },
          { text: "到內地城市讀大學", next: "ch2_place", set: { place: "mainland", returnPath: null } },
          { text: "到國外讀大學", next: "ch2_place", set: { place: "overseas", returnPath: null } },
        ],
      };
    }

    if (node === "ch2_place") {
      const copy = {
        hk: {
          title: "香港：兩層要分開",
          body: "在香港，特區政府會就本地政策做公開諮詢。國家的五年規劃和法律，則是另一層。香港人參與國家事務，常見通道是港區全國人大代表和港區政協委員，不是全港直選國家機構。",
          next: "ch3",
          cards: ["hkNpc"],
        },
        mainland: {
          title: "內地城市：規劃看得見",
          body: "小毛到大灣區一座城市讀書。新地鐵、產業園、醫院擴建，讓規劃變得很具體。港澳學生可以參加公開徵求意見、行業活動和青年計劃。國家事務仍較多靠港區人大、港區政協這條通道，而不是去當當地鄉鎮代表。",
          next: "ch3",
          stamps: ["city"],
          cards: ["planFlow"],
        },
        overseas: {
          title: "國外：先看清楚，再決定留不留",
          body: "在國外，小毛常被人問中國怎麼做決定。他可以比較、觀察，但很難參加香港或內地某一份具體諮詢的現場說明。接下來要決定：留下，還是回來。",
          next: "ch2_return",
        },
      }[state.place];
      return {
        eyebrow: "升學",
        nextLabel: state.place === "overseas" ? "留下還是回來" : "選職業",
        ...copy,
      };
    }

    if (node === "ch2_return") {
      return {
        eyebrow: "國外之後",
        title: "留下，或把渠道重新打開",
        body: "出國不是永遠缺席。若回流，專業資格、學會和諮詢會重新接上。若留下，就先當一位看得懂制度的觀察者。",
        choices: [
          { text: "留在國外工作", next: "ch3", set: { returnPath: "stay" } },
          { text: "回流香港", next: "ch3", set: { returnPath: "return_hk" } },
          { text: "到內地城市工作", next: "ch3", set: { returnPath: "return_mainland" } },
        ],
      };
    }

    if (node === "ch3") {
      return {
        eyebrow: "職業 · 二十多歲",
        title: "規劃會碰到哪一行",
        body: "大學之後，小毛走進城市裡的工作。選行業，就是選以後最先被哪一類政策碰到。",
        choices: [
          { text: "經商", next: "ch3_work", set: { job: "biz" } },
          { text: "律師", next: "ch3_work", set: { job: "law" } },
          { text: "醫生", next: "ch3_work", set: { job: "med" } },
          { text: "工程／創科", next: "ch3_work", set: { job: "eng" } },
        ],
      };
    }

    if (node === "ch3_work") {
      const work = {
        biz: "他開始做生意。資助計劃、清關和環保標準一改，成本和能不能接單就跟著變。商會的通知，常常就是規劃落地的樣子。",
        law: "他成為律師。修例諮詢、專業資格和跨境執業規則，會寫進自己經手的案件。法律意見書，有時就是政策走進行業的門口。",
        med: "他在醫院工作。公營輪候、人手和跨境就醫，都連著衛生健康方向的安排。家人看病等多久，不再只是醫院內部的事。",
        eng: "他做工程或創科。地鐵、房屋、科研園和技術標準，把規劃畫在城市地圖上。項目公示和環保要求，會直接進工作室。",
      }[state.job];
      const where = {
        hk: "工作城市在香港。特區諮詢和國家規劃會同時出現，但不是同一層。",
        mainland: "工作城市在內地。項目和園區很具體，徵求意見也常貼在城市層。",
        overseas: "他人在國外，行業標準仍看得到，可是要把意見送進香港或內地的具體諮詢，距離遠了。",
      }[place];
      const stamps = ["work"];
      if (state.job === "med") stamps.push("medical");
      if (state.job === "eng") stamps.push("city");
      return {
        eyebrow: "工作",
        title: data.labels.job[state.job],
        body: work + " " + where + " 到了三十歲前後，問題變成：要不要把行業裡的困難說回去？",
        stamps,
        cards: state.cards.includes("planFlow") ? [] : ["planFlow"],
        next: "ch4_consult",
        nextLabel: "試著提意見",
      };
    }

    if (node === "ch4_consult") {
      if (place === "overseas") {
        return {
          eyebrow: "參與 · 公開諮詢",
          title: "人在國外，這一層比較遠",
          body: "一份公開徵求意見正在進行，說明會和截止日期都不在他的城市。關注仍然有用，只是現場渠道少。",
          cards: ["consult"],
          choices: [
            { text: "先當觀察者，把資料看完", next: "ch4_assoc", set: { consult: false } },
            { text: "仍試著在網上提交短意見", next: "ch4_assoc", set: { consult: true } },
          ],
        };
      }
      return {
        eyebrow: "參與 · 公開諮詢",
        title: "普通人最靠近的一步",
        body:
          "這次有一份公開諮詢／徵求意見，內容剛好碰到他的行業：" +
          job.issue +
          "。寫進去不一定立刻改政策，但這是制度裡為普通人留的門口。",
        cards: ["consult"],
        choices: [
          { text: "寫一份短意見交上去", next: "ch4_assoc", set: { consult: true } },
          { text: "這次先觀察，暫不提交", next: "ch4_assoc", set: { consult: false } },
        ],
      };
    }

    if (node === "ch4_assoc") {
      if (place === "overseas") {
        return {
          eyebrow: "參與 · 行業團體",
          title: "海外也能聽業界，較難送進現場",
          body: "國外也有專業組織。它們適合交流，可是要把意見彙總送進香港或內地那一份諮詢，通常還是要靠本地的" + job.group + "。",
          cards: ["association"],
          choices: [
            { text: "加入海外交流，暫時不走本地團體", next: "ch4_delegate", set: { association: false } },
            { text: "聯絡本地" + job.group + "，請它們代為反映", next: "ch4_delegate", set: { association: true } },
          ],
        };
      }
      return {
        eyebrow: "參與 · 行業團體",
        title: job.group + "可以把聲音彙總",
        body: "一封個人信很輕。" + job.group + "若把業界對「" + job.issue + "」的意見收在一起，比較容易被聽到。這一步仍不是當代表。",
        cards: ["association"],
        choices: [
          { text: "參加" + job.group + "，把意見交進去", next: "ch4_delegate", set: { association: true } },
          { text: "先做好本業，暫不加入", next: "ch4_delegate", set: { association: false } },
        ],
      };
    }

    if (node === "ch4_delegate") {
      if (place === "overseas") {
        return {
          eyebrow: "參與 · 制度裡的人",
          title: "資格和現場都不在身邊",
          body: "港區人大代表、政協委員可以反映意見，但產生方式和本地直選不同。人在國外，這一層更遠。小毛仍可以搞清楚通道，不必假裝自己正在參選。",
          cards: ["hkNpc"],
          choices: [
            { text: "先搞清楚通道，當觀察者", next: "match", set: { delegate: false, npcNear: false } },
            { text: "回流前，先把反映途徑記下來", next: "match", set: { delegate: true, npcNear: false } },
          ],
        };
      }
      if (place === "mainland") {
        return {
          eyebrow: "參與 · 制度裡的人",
          title: "城市裡反映，國家事務走港區通道",
          body: "在內地城市，項目公示和行業協會是日常。港澳居民若要把意見送到國家事務層，仍較多透過港區人大代表或港區政協委員，而不是去當當地鄉鎮代表。",
          cards: ["hkNpc"],
          choices: [
            { text: "向港區代表／委員反映業界情況", next: "match", set: { delegate: true, npcNear: false } },
            { text: "先走城市層的徵求意見就好", next: "match", set: { delegate: false, npcNear: false } },
          ],
        };
      }
      return {
        eyebrow: "參與 · 制度裡的人",
        title: "可以向他們反映",
        body: "有人告訴小毛：港區全國人大代表和港區政協委員會收集業界意見。立法會議員和諮詢委員會也在本地這一層。向他們反映，和自己成為他們，不是同一件事。",
        cards: ["hkNpc"],
        choices: [
          { text: "了解港區人大怎樣產生，並把意見交去", next: "npc", set: { delegate: true } },
          { text: "把意見交給本地諮詢委員會就好", next: "match", set: { delegate: true, npcNear: false } },
          { text: "這一步先不做", next: "match", set: { delegate: false, npcNear: false } },
        ],
      };
    }

    if (node === "npc") {
      return {
        kind: "npc",
        eyebrow: "港區人大 · 一頁簡圖",
        title: "不是全港一人一票",
        body: "香港政治人物或業界人士可以成為港區全國人大代表，但程序和選立法會議員不同。小毛把業界情況交出去之後，手帳只寫到：通道在這裡。他自己不必當上代表，遊戲也不把這當成通關獎勵。",
        cards: ["hkNpc"],
        next: "match",
        nextLabel: "看五年規劃",
        setOnContinue: { npcSeen: true, npcNear: true },
      };
    }

    if (node === "match") {
      const i = state.matchIndex;
      const item = data.match[i];
      if (!item) {
        return {
          eyebrow: "五年規劃",
          title: "規劃怎樣進到生活",
          body: "規劃：黨中央提出建議，國務院編製，全國人大審查批准，再由各級政府和行業去落實。普通人多半不是在大會堂舉手，而是在生活裡感覺到它，並在諮詢和團體裡把意見送回去。",
          cards: ["planFlow", "planLife"],
          next: "summary",
          nextLabel: "看成長總結",
        };
      }
      return {
        kind: "match",
        eyebrow: "五年規劃 · " + (i + 1) + "／" + data.match.length,
        title: item.plan,
        body: item.prompt,
        item,
      };
    }

    if (node === "summary") {
      return {
        kind: "summary",
        eyebrow: "三十多歲 · 成長總結",
        title: "路才走到這裡",
        body: data.buildSummary(state),
      };
    }

    return { title: "繼續", body: "", next: "intro" };
  }

  function applySet(set) {
    if (!set) return;
    Object.assign(state, set);
  }

  function go(next, set) {
    applySet(set);
    const current = scene();
    if (current.cards) current.cards.forEach(addCard);
    if (current.stamps) current.stamps.forEach(addStamp);
    state.node = next;
    const arrived = scene();
    if (arrived.cards) arrived.cards.forEach(addCard);
    if (arrived.stamps) arrived.stamps.forEach(addStamp);
    save();
    render();
  }

  function restart() {
    state = defaultState();
    pendingCard = null;
    save();
    render();
  }

  function renderStamps() {
    const box = $("stamp-list");
    const names = C().labels.stamps;
    box.innerHTML = Object.keys(names)
      .map((id) => {
        const on = state.stamps.includes(id);
        return `<li class="stamp${on ? " is-on" : ""}">${names[id]}</li>`;
      })
      .join("");
  }

  function renderOrgs() {
    const box = $("org-list");
    const on = highlightOrgs();
    box.innerHTML = C()
      .labels.orgs.map(
        (org) =>
          `<li class="org${on.has(org.id) ? " is-on" : ""}"><strong>${org.name}</strong><span>${org.hint}</span></li>`
      )
      .join("");
  }

  function renderProgress() {
    const steps = ["中學", "升學", "職業", "參與", "規劃", "總結"];
    const ch = chapterOf(state.node);
    $("progress-list").innerHTML = steps
      .map((name, i) => {
        const n = i + 1;
        const cls = n < ch ? "is-done" : n === ch ? "is-now" : "";
        return `<li class="${cls}">${name}</li>`;
      })
      .join("");
  }

  function renderAlbum() {
    const box = $("album-list");
    const cards = C().cards;
    box.innerHTML = Object.values(cards)
      .map((card) => {
        const on = state.cards.includes(card.id);
        return `<article class="album-card${on ? " is-on" : ""}"><h3>${card.title}</h3><p>${on ? card.body : "尚未收集"}</p></article>`;
      })
      .join("");
    $("btn-album").textContent = `知識卡 ${state.cards.length}/${Object.keys(cards).length}`;
  }

  function renderCardToast() {
    const toast = $("card-toast");
    if (!pendingCard) {
      toast.hidden = true;
      return;
    }
    toast.hidden = false;
    $("toast-title").textContent = pendingCard.title;
    $("toast-body").textContent = pendingCard.body;
  }

  function renderTeacher() {
    $("teacher-panel").hidden = !teacherOpen;
  }

  function renderAlbumPanel() {
    $("album-panel").hidden = !albumOpen;
  }

  function renderIntro() {
    $("screen-intro").hidden = false;
    $("screen-game").hidden = true;
    $("screen-summary").hidden = true;
  }

  function choiceButtons(choices) {
    return choices
      .map(
        (choice, i) =>
          `<button type="button" class="choice" data-choice="${i}">${choice.text}</button>`
      )
      .join("");
  }

  function renderGame() {
    const view = scene();
    $("screen-intro").hidden = true;
    $("screen-summary").hidden = view.kind !== "summary";
    $("screen-game").hidden = view.kind === "summary";

    if (view.kind === "summary") {
      pendingCard = null;
      $("screen-summary").hidden = false;
      $("summary-text").textContent = view.body;
      const placeLabel =
        C().labels.returnPath[state.returnPath] || C().labels.place[state.place] || "—";
      const voiceLabel = state.npcNear
        ? "靠近港區人大通道"
        : state.delegate
          ? "向代表／委員反映"
          : state.association
            ? "經行業團體"
            : state.consult
              ? "寫過諮詢"
              : "尚未提意見";
      $("summary-tags").innerHTML = [
        C().labels.school[state.school],
        placeLabel,
        C().labels.job[state.job],
        voiceLabel,
      ]
        .filter(Boolean)
        .map((t) => `<li>${t}</li>`)
        .join("");
      renderStamps();
      renderOrgs();
      renderProgress();
      renderAlbum();
      renderCardToast();
      return;
    }

    $("scene-eyebrow").textContent = view.eyebrow || "";
    $("scene-title").textContent = view.title || "";
    $("scene-body").textContent = view.body || "";
    const actions = $("scene-actions");
    const npc = $("npc-diagram");
    npc.hidden = view.kind !== "npc";

    if (view.kind === "match") {
      const item = view.item;
      actions.innerHTML = item.options
        .map(
          (opt) =>
            `<button type="button" class="choice" data-match="${opt.id}" data-ok="${opt.ok}">${opt.text}</button>`
        )
        .join("");
    } else if (view.choices) {
      actions.innerHTML = choiceButtons(view.choices);
    } else if (view.next) {
      actions.innerHTML = `<button type="button" class="btn-primary" data-next="${view.next}">${view.nextLabel || "繼續"}</button>`;
    } else {
      actions.innerHTML = "";
    }

    renderStamps();
    renderOrgs();
    renderProgress();
    renderAlbum();
    renderCardToast();
  }

  function render() {
    if (state.node === "intro") {
      $("screen-intro").hidden = false;
      $("screen-game").hidden = true;
      $("screen-summary").hidden = true;
    } else {
      renderGame();
    }
    renderTeacher();
    renderAlbumPanel();
  }

  function onChoice(index) {
    const view = scene();
    const choice = view.choices[index];
    if (!choice) return;
    go(choice.next, choice.set);
  }

  function onMatch(ok, id) {
    const view = scene();
    const item = view.item;
    if (!item) return;
    addStamp(item.stamp);
    const why = item.why;
    const picked = item.options.find((o) => o.id === id);
    $("scene-body").textContent = (ok ? "對上了。" : "這一題更靠近生活的是另一項。") + " " + why;
    $("scene-actions").innerHTML = `<button type="button" class="btn-primary" id="btn-match-next">下一題</button>`;
    $("btn-match-next").addEventListener("click", () => {
      state.matchDone.push({ id: item.id, pick: picked && picked.id, ok: !!ok });
      state.matchIndex += 1;
      const wrap = scene();
      if (wrap.cards) wrap.cards.forEach(addCard);
      save();
      render();
    });
  }

  function continueNext() {
    const view = scene();
    if (view.setOnContinue) applySet(view.setOnContinue);
    if (view.cards) view.cards.forEach(addCard);
    if (view.stamps) view.stamps.forEach(addStamp);
    go(view.next);
  }

  function bind() {
    $("btn-start").addEventListener("click", () => {
      state = defaultState();
      state.node = "ch1";
      pendingCard = null;
      save();
      render();
    });
    $("btn-teacher").addEventListener("click", () => {
      teacherOpen = true;
      renderTeacher();
    });
    $("btn-teacher-close").addEventListener("click", () => {
      teacherOpen = false;
      renderTeacher();
    });
    $("btn-teacher-game").addEventListener("click", () => {
      teacherOpen = true;
      renderTeacher();
    });
    $("btn-album").addEventListener("click", () => {
      albumOpen = true;
      renderAlbum();
      renderAlbumPanel();
    });
    $("btn-album-close").addEventListener("click", () => {
      albumOpen = false;
      renderAlbumPanel();
    });
    $("btn-toast-close").addEventListener("click", () => {
      pendingCard = null;
      renderCardToast();
    });
    $("btn-restart").addEventListener("click", restart);
    $("btn-play-again").addEventListener("click", restart);
    $("scene-actions").addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (!btn) return;
      if (btn.dataset.choice != null) onChoice(Number(btn.dataset.choice));
      else if (btn.dataset.match) onMatch(btn.dataset.ok === "true", btn.dataset.match);
      else if (btn.dataset.next) {
        const view = scene();
        if (view.setOnContinue) applySet(view.setOnContinue);
        go(btn.dataset.next);
      }
    });
  }

  load();
  if (state.node !== "intro" && !state.school && state.node !== "ch1") {
    state = defaultState();
  }
  bind();
  render();
})();
