const SPOTS = [
  {
    id: "greeters",
    name: "捧案跪迎",
    short: "迎候",
    realm: "人間",
    kind: "人物",
    x: 36.5,
    y: 54.9,
    riddle: "畫上已經有一個紅圈。圈裡這兩個人正在做什麼？請點進去看看。",
    hint: "在帛畫中段、夫人的前方，兩位較小的人正捧著盤子跪迎。",
    story: "紅圈裡兩人捧案跪迎。學者有人看成引路的方士，也有人看成僕役。西漢人相信：過世以後，靈魂還要繼續走路，需要有人接引。",
    meaning: "這不是普通問好，而是送魂、迎魂的儀式：告訴我們這幅畫在講「靈魂要出發了」。",
    quiz: {
      q: "這兩個人最可能在做什麼？",
      options: ["在路邊聊天", "捧著案子跪迎、引導墓主人的靈魂", "比賽誰站得比較直"],
      answer: 1,
      explain: "他們面向拄柺杖的貴婦人，捧案跪迎，是在接引靈魂上路。"
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
    hint: "就在迎候者右側，穿華美長袍、面向西方、側身向左走的那位。",
    story: "這位拄杖老婦人面向西方，一般認為是墓主人辛追（軑侯夫人）。後面跟著三位侍女。這幅帛畫蓋在內棺上，像一封寫給天上的通行證。",
    meaning: "古人把墓主人畫進神話世界：她不是留在墳裡，而是準備升天。",
    quiz: {
      q: "辛追夫人拄著柺杖，主要是要去哪裡？",
      options: ["去菜市場", "走向天門，讓靈魂升天", "去河邊洗衣服"],
      answer: 1,
      explain: "整幅帛畫像一張地圖，中間這一段就是墓主人出發升天的樣子。"
    }
  },
  {
    id: "phoenix",
    name: "華蓋與鳳凰",
    short: "華蓋",
    realm: "人間",
    kind: "動物",
    x: 50,
    y: 43.8,
    riddle: "夫人頭頂上有三角形的華蓋。請找出蓋上站著的兩隻大鳥。",
    hint: "在夫人正上方，由花紋、鳥紋組成的三角華蓋，蓋頂站著兩隻鳳凰。",
    story: "人間最上端是三角華蓋，用華紋、鳥紋組成，像給靈魂遮陰的車蓋。蓋上站兩隻鳳凰；蓋下還有一隻展翅的有翼怪獸，有人看成鴟鴞，也有人看成風神飛廉。",
    meaning: "華蓋和鳳凰表示這一段已經接近神界：墓主人走在「有儀仗的路上」。",
    quiz: {
      q: "夫人頭上的三角華蓋，最像在做什麼？",
      options: ["給靈魂當車蓋和儀仗", "用來擋雨而已", "給鳳凰當鞦韆"],
      answer: 0,
      explain: "華蓋是高貴出行的頂蓋，鳳凰是瑞鳥，合在一起像升天的儀仗。"
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
    riddle: "夫人之下有一桌祭品。請找出那些俎豆和食案。",
    hint: "往下看，兩條龍身之間有食案，案上陳列許多禮器。",
    story: "這是設祭的食案，陳列俎、豆等禮器，表示用酒食獻給死者。幾個人踞案對飲，很像家屬在給老婦人送行。漢代人覺得：靈魂上路也要吃飯。",
    meaning: "俎豆代表「活著的人仍記得你」。神話不只在天上，也在家庭的祭桌上面。",
    quiz: {
      q: "畫裡擺出俎豆和食案，最主要是為了什麼？",
      options: ["裝飾房間比較好看", "以酒食獻祭，給靈魂送行", "給龍當玩具"],
      answer: 1,
      explain: "祭祀就是用食物、器物跟過世的親人說話。"
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
    riddle: "兩條龍交錯穿過一個圓環。那個圓環叫什麼？請找出它。",
    hint: "在夫人腳下、祭席上方，正中央有一個大圓孔，龍身從孔裡穿過去。",
    story: "兩側有兩龍，交錯穿過中間的玉璧。玉璧圓形有孔，象徵天。龍穿璧而過，等於幫靈魂打開通道：從人間鑽向天上。",
    meaning: "圓孔像門洞。龍是交通工具，玉璧是關卡。通過這裡，才能繼續升天。",
    quiz: {
      q: "龍穿過玉璧，最像在做什麼？",
      options: ["在玩呼拉圈", "為靈魂打開通往天上的通道", "把玉璧咬壞"],
      answer: 1,
      explain: "玉璧的圓孔被看成通天的門。"
    }
  },
  {
    id: "yuren",
    name: "人首鳥身羽人",
    short: "羽人",
    realm: "人間",
    kind: "人物",
    x: 35,
    y: 66.8,
    riddle: "玉璧下方有穿白衣、長翅膀的「似人非人」。請找出羽人。",
    hint: "在雙龍和祭案之間，兩側有身著白衣、人首鳥身、彼此相望的羽人。",
    story: "玉璧之下，有身著白衣、長著翅膀、似人非人的羽人相對而望。他們人首鳥身，像已經長出翅膀的仙人，守在人間通往天上的路口。",
    meaning: "羽人表示「人可以變成能飛的仙」。墓主人升天時，有這種精靈作伴。",
    quiz: {
      q: "羽人為什麼又像人又像鳥？",
      options: ["畫家還沒畫完", "表示人可以成仙、長出翅膀升天", "他們是普通的鴿子"],
      answer: 1,
      explain: "羽人是漢代常見的成仙形象：人首鳥身，能飛向天界。"
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
    riddle: "誰用雙手把上面的大地托起來？請找出這個大力士。",
    hint: "帛畫接近底部、祭桌正下方，有一個裸體、馬步下蹲、雙手向上托舉的巨人。",
    story: "這位裸體力士作馬步下蹲，雙手向上托著一塊白色扁平物，那一塊就象徵大地。學者有人看成北海神禺強，也有人看成治水的鯀。重點是：地不是空的，下面有神在撐著。",
    meaning: "古人把宇宙想成三層。最底層要有人扛住大地，世界才不會塌。",
    quiz: {
      q: "這個巨人最重要的工作是什麼？",
      options: ["睡覺", "托住象徵大地的白色扁平物", "跟魚比賽游泳"],
      answer: 1,
      explain: "他像柱子一樣，把人間從水底下托起來。"
    }
  },
  {
    id: "fish",
    name: "交纏鯨鯢",
    short: "鯨鯢",
    realm: "地下",
    kind: "動物",
    x: 50,
    y: 93.5,
    riddle: "力士站在兩條很大的水族動物背上。請把它們找出來。",
    hint: "整幅畫的最底部，兩條交纏的鯨鯢（大魚），尾端還有異獸。",
    story: "力士站在兩條交纏的鯨鯢身上。鯨鯢是巨大的水族動物。牠們的尾端還有兩隻異獸。中國神話裡，大地常常被想像成擱在大魚背上。",
    meaning: "冥界是水域。水不是盡頭，而是托住世界的根基。",
    quiz: {
      q: "為什麼要把大地畫在鯨鯢背上？",
      options: ["因為魚比較可愛", "表示世界下面是水，有神獸在支撐", "因為畫家只會畫魚"],
      answer: 1,
      explain: "這是古代的宇宙想像：天、人、冥界三層疊在一起。"
    }
  },
  {
    id: "turtles",
    name: "靈龜與鴟鳥",
    short: "靈龜",
    realm: "地下",
    kind: "動物",
    x: 28,
    y: 79.2,
    riddle: "大地和冥界交界的地方，有龜在游，龜背上還站著鳥。請找出來。",
    hint: "在力士兩側、大地平台邊緣，有兩隻浮游的靈龜，龜殼上站著鴟鳥。",
    story: "在大地和冥界的交界處，兩隻靈龜浮游，龜殼上站著鴟鳥（貓頭鷹一類）。龜能在水陸之間來去，鴟鳥屬於夜間，正好守在「上面是地、下面是水」的邊界。",
    meaning: "邊界也要有守衛。靈龜和鴟鳥告訴我們：冥界不是亂畫的，它有自己的動物和規則。",
    quiz: {
      q: "靈龜出現在大地和冥界交界，最可能表示什麼？",
      options: ["烏龜迷路了", "這裡是水陸交界，有神物看守", "烏龜想去參加祭宴"],
      answer: 1,
      explain: "龜能水陸兩棲，畫在交界處，像在看守兩個世界的門檻。"
    }
  },
  {
    id: "gate",
    name: "閶闔天門",
    short: "閶闔",
    realm: "天上",
    kind: "人物",
    x: 50,
    y: 27.2,
    riddle: "天界和人間中間有一道門。請找出門上的豹，以及拱手對坐的門吏。",
    hint: "人首蛇身神的正下方，兩根柱子是天門閶闔；兩豹攀在門上，門吏拱手對坐。",
    story: "這道門叫閶闔，把天界和人間隔開。兩隻豹攀騰在門上；門裡有守衛的門吏拱手對坐。學者有人看成帝閽（天帝的守門人），也有人看成大司命、少司命。",
    meaning: "升天不是飛著飛著就到了，而是過關。豹和門吏代表天上也有秩序。",
    quiz: {
      q: "閶闔兩旁拱手對坐的人，最像什麼角色？",
      options: ["守天門的神官", "在門口乘涼的路人", "賣包子的小販"],
      answer: 0,
      explain: "他們看守天界入口，決定靈魂能不能進去。"
    }
  },
  {
    id: "bells",
    name: "鐘鐸與神龍",
    short: "鐘鐸",
    realm: "天上",
    kind: "器物",
    x: 50,
    y: 21.4,
    riddle: "天門上方，有怪物騎著獸、把鐘掛在空中。請找出那口鐘。",
    hint: "就在閶闔天門上頭，騎獸的怪物懸著鐘鐸；鐘上有低頭的鴻雁，旁邊神龍張嘴呼嘯。",
    story: "天門之上，騎獸的怪物把鐘鐸懸在空中。鐘上有俯身的鴻雁，旁邊神龍張嘴呼嘯。鐘鐸是禮樂的樂器，讓天界不只看得見，也好像聽得見。",
    meaning: "神話裡的天，有龍、有鳥，也有音樂。鐘聲像在為靈魂通報：有人要進天門了。",
    quiz: {
      q: "為什麼要在天上畫鐘鐸？",
      options: ["因為天上也要舉行禮樂、通報來人", "因為鐘可以當雨傘", "因為龍喜歡聽音樂而已"],
      answer: 0,
      explain: "鐘鐸是禮器。畫在天門附近，像在舉行迎接靈魂的儀式。"
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
    riddle: "右上角有一輪紅日，日中有鳥。請找出太陽裡的金烏。",
    hint: "帛畫最上方偏右，一輪紅日裡有一隻黑色的鳥。",
    story: "右上角是一輪紅日，日中有金烏。古人看見太陽會動，就想像有神鳥載著它飛過天空。金烏因此成為太陽的標誌。",
    meaning: "不是「鳥等於太陽」，而是「太陽裡住著神鳥」。神話常用動物來解釋自然。",
    quiz: {
      q: "太陽圓圈裡的黑鳥代表什麼？",
      options: ["烏鴉來偷東西", "住在太陽裡的神鳥金烏", "晚上的蝙蝠"],
      answer: 1,
      explain: "金烏是太陽的神話形象，常見於漢代畫像。"
    }
  },
  {
    id: "fusang",
    name: "扶桑與八日",
    short: "扶桑",
    realm: "天上",
    kind: "植物",
    x: 81.5,
    y: 19.4,
    riddle: "紅日下面的神樹間，還掛著八個太陽。請找出那棵扶桑樹。",
    hint: "大金烏右下方，扶桑樹枝間有八個較小的圓，像還沒出發的太陽。",
    story: "扶桑是神話裡太陽升起的神樹。右上這輪紅日之下，樹間還有八個太陽。傳說本來有十個太陽輪流值班；畫裡是「正在值班的一個」加上「樹上的八個」。",
    meaning: "植物也可以是宇宙的道具：樹是太陽的家，也是白天開始的地方。",
    quiz: {
      q: "扶桑樹上為什麼有好多小圓圈？",
      options: ["那是樹上的橘子", "那是還沒輪班的太陽", "那是雨滴"],
      answer: 1,
      explain: "神話說太陽有十個，住在扶桑樹上輪流升起。這幅畫在樹間畫了八個。"
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
    riddle: "左上角一彎新月，月上有蟾蜍和玉兔。請找出月亮。",
    hint: "最上方偏左，彎月裡有斑點蟾蜍，旁邊還有玉兔。",
    story: "左上角是一彎新月，月上有蟾蜍和玉兔。漢代人看月亮的暗影，就把它們畫進去。玉兔搗藥跟長生有關，蟾蜍也是月的靈物。",
    meaning: "太陽有烏，月亮有蟾與兔。左右對稱，表示天上的晝與夜。",
    quiz: {
      q: "月亮裡出現蟾蜍和玉兔，主要想說明什麼？",
      options: ["月亮是動物園", "月亮裡住著神物，掌管黑夜與長生", "兔子喜歡吃蟾蜍"],
      answer: 1,
      explain: "月中動物是漢代人對月光暗影的神話解釋。"
    }
  },
  {
    id: "change",
    name: "嫦娥奔月",
    short: "嫦娥",
    realm: "天上",
    kind: "人物",
    x: 18.2,
    y: 16.4,
    riddle: "新月下面還有一個人在飛。請找出奔月的嫦娥。",
    hint: "月亮左下方，有衣袂飄起、正在飛向月亮的女子。",
    story: "月下畫著奔月的嫦娥。傳說她吃了長生藥，飛進月亮裡。帛畫把這個故事放在天界左邊，讓月亮不只是圓圈，還有一個正在趕路的人。",
    meaning: "嫦娥讓「去月亮」變成可以想像的旅程。墓主人升天，和奔月是同一類願望：離開人間，到更遠的地方。",
    quiz: {
      q: "嫦娥畫在月亮下面，最想講哪個故事？",
      options: ["她去月亮裡買菜", "她奔月，飛向長生的地方", "她在追兔子"],
      answer: 1,
      explain: "嫦娥奔月是著名神話，和長生、升天的願望連在一起。"
    }
  },
  {
    id: "crane",
    name: "仰首立鶴",
    short: "立鶴",
    realm: "天上",
    kind: "動物",
    x: 38.5,
    y: 5.6,
    riddle: "天帝周圍有仰著頭的長頸鳥。請找出天上的立鶴。",
    hint: "人首蛇身神的左上方，有長頸、仰首的立鶴。",
    story: "天帝周圍有仰首的立鶴，屬於天上的瑞鳥仙禽。鶴代表長壽，也常當仙人的伴侶。把牠們畫在天界，天空就顯得熱鬧、不死。",
    meaning: "立鶴是天上的瑞鳥。看到鶴，就想到長壽、成仙、護航靈魂。",
    quiz: {
      q: "為什麼要在天上畫立鶴？",
      options: ["因為鶴是天上的瑞鳥仙禽", "因為鶴會下蛋給太陽", "因為鶴比雞便宜"],
      answer: 0,
      explain: "鶴是長壽與仙界的動物符號。"
    }
  },
  {
    id: "deity",
    name: "人首蛇身天帝",
    short: "天帝",
    realm: "天上",
    kind: "人物",
    x: 50,
    y: 7.4,
    riddle: "最後一題：日、月之間那位披髮、人首蛇身的神，是誰？",
    hint: "帛畫正中央的最高處，披髮端坐，一條長尾自環於身體之間。",
    story: "日、月之間端坐著披髮的人首蛇身天帝，一條紅色長尾自環其中。學者有人看成女媧，也有人看成燭龍、太一或伏羲。蛇身表示這位神比普通人更古老。",
    meaning: "把天帝畫在最頂上，等於說：天的盡頭是創世的開始。靈魂升到這裡，才算回到神話的源頭。",
    quiz: {
      q: "為什麼這位天帝的下半身是蛇？",
      options: ["因為穿褲子不方便", "人首蛇身是更古老的創世神形象", "因為畫家畫錯了腿"],
      answer: 1,
      explain: "人首蛇身常見於女媧、伏羲等創世神，代表比人類更早的神。"
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

function setRealmChip(label) {
  const el = $("realm-chip");
  el.textContent = label;
  el.dataset.realm = ["天上", "人間", "地下"].includes(label) ? label : "";
}

function setMission() {
  const lore = $("lore");
  const dock = $("dock");
  lore.hidden = true;
  lore.innerHTML = "";
  dock.classList.remove("is-reading");
  dock.scrollTop = 0;
  if (state.mode === "teacher") {
    setRealmChip("導覽");
    $("mission-title").textContent = "老師導覽";
    $("mission-text").textContent = "點圖上任何光圈，就可以直接講解。學生不會被謎題卡住。";
    $("btn-hint").hidden = true;
    $("btn-free").textContent = "改回尋寶";
    return;
  }
  if (state.mode === "free") {
    setRealmChip("三界");
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
    setRealmChip("完成");
    $("mission-title").textContent = `${SPOTS.length} 處都找到了`;
    $("mission-text").textContent = "靈魂已經走到天門。往下看看結局。";
    showFinale();
    return;
  }
  setRealmChip(target.realm);
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
  setRealmChip(spot.realm);
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
