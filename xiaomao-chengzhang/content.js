window.XIAOMAO = {
  title: "王小毛成長記",
  subtitle: "政策和機關，怎樣進到一個人的生活",
  teacher: {
    goal: "這不是當官遊戲。學生走完一條人生路，要能說出：人大、政協、政府分別做什麼；五年規劃怎樣進到學校、交通、醫療和行業；普通人（尤其依行業）可以怎樣把意見送回去。",
    time: "一堂課走完一條路，約 20–25 分鐘。可重玩其他地區或職業。故事停在三十多歲，不寫一生終結。",
    discuss: [
      "兩會為什麼常被合稱，人大和政協其實差在哪？",
      "你這條路裡，哪一件日常事連上了五年規劃？",
      "如果要把行業意見送進制度，諮詢、團體、向代表反映，哪一步最貼近普通人？",
    ],
  },
  labels: {
    school: { civic: "公民課／模擬兩會", union: "學生會", exam: "先把考試讀熟" },
    place: { hk: "香港", mainland: "內地城市", overseas: "國外" },
    returnPath: {
      stay: "留在國外",
      return_hk: "回流香港",
      return_mainland: "到內地城市工作",
    },
    job: { biz: "經商", law: "律師", med: "醫生", eng: "工程／創科" },
    stamps: {
      school: "學校",
      transit: "出行",
      housing: "住屋",
      work: "工作",
      medical: "醫療",
      city: "城市",
    },
    orgs: [
      { id: "party", name: "黨中央", hint: "提出規劃建議" },
      { id: "npc", name: "全國人大", hint: "審查批准" },
      { id: "cppcc", name: "全國政協", hint: "協商、提案" },
      { id: "state", name: "國務院", hint: "編製、執行" },
      { id: "hksar", name: "特區政府", hint: "香港落地" },
      { id: "hkdeputies", name: "港區代表／委員", hint: "反映意見" },
    ],
  },
  cards: {
    npc: {
      id: "npc",
      title: "全國人大",
      body: "全國人民代表大會是國家權力機關。法律和五年規劃，要經它審查批准，不是新聞標題自己生效。",
    },
    cppcc: {
      id: "cppcc",
      title: "全國政協",
      body: "中國人民政治協商會議負責協商、參政議政和提案。它很重要，但不是立法機關。",
    },
    twoSessions: {
      id: "twoSessions",
      title: "為什麼叫兩會",
      body: "每年三月，全國人大和全國政協差不多同期召開，新聞常合稱「兩會」。兩個會一起開，並不表示它們是同一個機關。",
    },
    planFlow: {
      id: "planFlow",
      title: "五年規劃誰編誰批",
      body: "大方向由黨中央提出建議，國務院編製規劃綱要，全國人大審查批准，再由各級政府和行業去落實。",
    },
    planLife: {
      id: "planLife",
      title: "規劃怎樣進到生活",
      body: "規劃不是明天早上的待辦清單。它會透過學位、交通、醫療、住房、產業和城市建設，進到普通人的日常。",
    },
    consult: {
      id: "consult",
      title: "公開諮詢",
      body: "政府把草案或政策公開徵求意見，是普通人最靠近的一步。你不一定在大會堂舉手，但仍可以把話寫進去。",
    },
    association: {
      id: "association",
      title: "行業團體",
      body: "商會、律師會、醫學會、工程師學會會把業界意見彙總。一門行業的聲音，通常比一封個人信更容易被聽到。",
    },
    hkNpc: {
      id: "hkNpc",
      title: "港區人大與政協",
      body: "香港人參與國家事務，常見通道是港區全國人大代表和港區全國政協委員。代表由選舉會議產生，不是全港一人一票；委員是協商產生。你可以向他們反映，和自己成為他們，不是同一件事。",
    },
  },
  jobs: {
    biz: { group: "商會", issue: "資助門檻、跨境清關、環保標準" },
    law: { group: "律師會", issue: "修例諮詢、專業資格、跨境執業" },
    med: { group: "醫學會", issue: "公營輪候、人手、跨境醫療" },
    eng: { group: "工程師學會", issue: "基建項目、創科園、技術與環保標準" },
  },
  match: [
    {
      id: "edu",
      plan: "教育現代化",
      stamp: "school",
      prompt: "這項規劃方向，最容易進到小毛生活的哪一塊？",
      options: [
        { id: "school", text: "課程、交流、學校設備", ok: true },
        { id: "stock", text: "股票明天升還是跌", ok: false },
        { id: "idol", text: "偶像團體巡迴演唱", ok: false },
      ],
      why: "教育方向會變成課程、師資和交流活動，中學階段就已經碰得到。",
    },
    {
      id: "green",
      plan: "綠色發展",
      stamp: "transit",
      prompt: "綠色發展跟普通人最直接的接觸是？",
      options: [
        { id: "air", text: "空氣、回收、出行方式", ok: true },
        { id: "game", text: "手機遊戲伺服器位置", ok: false },
        { id: "snack", text: "零食包裝上的吉祥物", ok: false },
      ],
      why: "節能、減廢、公共交通，都會變成城市裡每天呼吸和出門的方式。",
    },
    {
      id: "housing",
      plan: "住房與民生",
      stamp: "housing",
      prompt: "住房與民生規劃，家人最先感覺到的可能是？",
      options: [
        { id: "rent", text: "租金、公屋、醫療負擔", ok: true },
        { id: "meme", text: "網絡迷因熱搜", ok: false },
        { id: "fashion", text: "潮牌聯乘款式", ok: false },
      ],
      why: "民生項目透過住房、醫療和基本服務進家庭開支，不是抽象口號。",
    },
    {
      id: "transit",
      plan: "交通基建",
      stamp: "city",
      prompt: "交通基建對香港學生最看得見的例子是？",
      options: [
        { id: "rail", text: "高鐵、跨境通勤、城市軌道", ok: true },
        { id: "quiz", text: "班際問答比賽獎品", ok: false },
        { id: "pet", text: "寵物咖啡店排隊", ok: false },
      ],
      why: "軌道和跨境通道改變的是上學、探親和日後上班怎麼走。",
    },
    {
      id: "industry",
      plan: "產業與就業",
      stamp: "work",
      prompt: "產業規劃跟職業選擇的關係是？",
      options: [
        { id: "job", text: "哪一行較容易找到發揮的位置", ok: true },
        { id: "luck", text: "完全只看個人運氣", ok: false },
        { id: "horoscope", text: "星座運勢決定行業", ok: false },
      ],
      why: "創科、專業服務、醫療和基建若被列為優先，行業的職位和標準就會跟著變。",
    },
  ],
};

window.XIAOMAO.workPlace = function workPlace(state) {
  if (state.returnPath === "return_hk") return "hk";
  if (state.returnPath === "return_mainland") return "mainland";
  if (state.returnPath === "stay") return "overseas";
  return state.place;
};

window.XIAOMAO.buildSummary = function buildSummary(state) {
  const C = window.XIAOMAO;
  const school = {
    civic: "王小毛中學上公民課，還參加了模擬兩會，才分清人大在審查批准、政協在協商提意見。",
    union: "王小毛中學參加學生會，先為校園的事發聲，後來才明白更大的政策也有把意見送回去的渠道。",
    exam: "王小毛中學時先把考試範圍讀熟，後來才發現兩會和五年規劃並不是跟自己無關的新聞。",
  }[state.school];

  const placeKey = state.returnPath || state.place;
  const place = {
    hk: "他留在香港讀大學，分清特區諮詢和國家規劃不是同一層。",
    mainland: "他到內地城市讀大學，地鐵、產業園和醫院讓他看見規劃落地的樣子。",
    stay: "他到國外讀大學並留下工作，多用觀察和比較來理解這套制度，現場諮詢渠道比較少。",
    return_hk: "他先到國外讀書，後來回流香港，專業資格和本地學會的渠道重新打開。",
    return_mainland: "他先到國外讀書，後來到內地城市工作，對上大灣區的人才和創科政策。",
  }[placeKey];

  const job = {
    biz: "三十歲前後他經營生意，資助、清關和環保標準會影響接單和成本。",
    law: "三十歲前後他做律師，修例諮詢和跨境執業規則常進到自己經手的案件。",
    med: "三十歲前後他成為醫生，公營輪候和人手都連著衛生健康方面的規劃。",
    eng: "三十歲前後他做工程／創科，基建項目、創科園和技術標準就是規劃落在城市裡的樣子。",
  }[state.job];

  let voice;
  if (state.npcNear) {
    voice =
      "他把業界的話交給制度裡的人，也看過港區人大怎樣產生：選舉會議，不是全港一人一票。向代表反映，和自己成為代表，不是同一件事。";
  } else if (state.delegate) {
    voice = "他把業界困難交給代表、委員或諮詢委員會，明白大多數人不是去當官，而是把話送進制度。";
  } else if (state.association) {
    voice = "他透過行業團體把意見彙總送出，發現一門行業比一封個人信更容易被聽到。";
  } else if (state.consult) {
    voice = "他參加了一次公開諮詢，明白這是普通人最靠近的一步。";
  } else if (window.XIAOMAO.workPlace(state) === "overseas") {
    voice = "人在國外，他暫時以觀察為主，還沒把意見寫進具體諮詢。";
  } else {
    voice = "他已經能指出政策和自己的工作有關，暫時還沒把意見寫回去。";
  }

  const close = "路才走到三十多歲這裡，他已經能說出：政策和機關怎樣進到自己的生活。";
  return [school, place, job, voice, close].filter(Boolean).join("");
};
