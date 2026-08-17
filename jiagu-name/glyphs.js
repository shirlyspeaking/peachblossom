/* 教學用甲骨文繪寫：強調象形特徵，方便五年級辨認，並非出土拓片逐筆臨摹。 */
(function (root) {
  const STROKE = 'fill="none" stroke="currentColor" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"';
  const STROKE_THIN = 'fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"';

  const path = (d, thin) => `<path ${thin ? STROKE_THIN : STROKE} d="${d}"/>`;
  const line = (x1, y1, x2, y2, thin) =>
    `<line ${thin ? STROKE_THIN : STROKE} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const circle = (cx, cy, r, thin) =>
    `<circle ${thin ? STROKE_THIN : STROKE} cx="${cx}" cy="${cy}" r="${r}"/>`;
  const dot = (cx, cy, r = 4.2) =>
    `<circle fill="currentColor" cx="${cx}" cy="${cy}" r="${r}"/>`;

  const wrap = (inner) =>
    `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${inner}</svg>`;

  const G = {
    ren:
      path("M58 16c-8 14-18 28-28 62") +
      path("M58 16c4 22 10 38 26 56"),
    da:
      line(50, 14, 50, 52) +
      path("M18 44 L50 26 L82 44") +
      path("M28 86 L50 52 L72 86"),
    tian:
      circle(50, 22, 10) +
      line(50, 32, 50, 52) +
      path("M18 46 L50 32 L82 46") +
      path("M28 86 L50 52 L72 86"),
    zi:
      circle(50, 28, 16) +
      line(50, 44, 50, 78) +
      path("M32 58 H68") +
      path("M36 86 Q50 74 64 86"),
    nv:
      path("M50 18c-16 18-18 38-8 58") +
      path("M50 18c16 18 18 38 8 58") +
      path("M28 46 H72") +
      path("M42 76 Q50 88 58 76"),
    kou: path("M28 28 H72 V72 H28 Z"),
    mu_eye:
      path("M14 50 Q50 18 86 50 Q50 82 14 50") +
      circle(50, 50, 9) +
      dot(50, 50, 3.2),
    er:
      path("M38 18c-12 8-14 22-6 34") +
      path("M38 18c22 4 28 20 22 42-4 16-18 28-32 30") +
      path("M42 40c8 2 12 10 8 18"),
    shou:
      path("M50 88 V42") +
      path("M50 42 C50 18 28 16 22 34") +
      path("M50 36 C62 12 82 18 78 38") +
      path("M50 40 C70 22 88 34 80 52") +
      path("M50 44 C66 36 78 52 66 62"),
    xiao:
      line(50, 18, 50, 46) +
      path("M28 40 L18 72") +
      path("M72 40 L82 72"),
    xin:
      path("M50 82 C18 58 22 28 50 36 C78 28 82 58 50 82") +
      line(50, 44, 50, 62, true) +
      line(40, 50, 46, 54, true) +
      line(60, 50, 54, 54, true),
    ri: circle(50, 50, 30) + line(32, 50, 68, 50),
    yue:
      path("M64 16 C28 34 28 66 64 84 C50 66 50 34 64 16") +
      line(48, 40, 48, 48, true) +
      line(48, 56, 48, 64, true),
    xing:
      circle(32, 36, 11) +
      circle(68, 34, 10) +
      circle(50, 70, 12) +
      dot(32, 36, 2.4) +
      dot(68, 34, 2.2) +
      dot(50, 70, 2.4),
    yu_rain:
      path("M22 28 H78") +
      path("M30 28 C30 16 70 16 70 28") +
      line(34, 42, 30, 78, true) +
      line(50, 40, 50, 80, true) +
      line(66, 42, 70, 78, true) +
      dot(34, 50, 2.2) +
      dot(50, 56, 2.2) +
      dot(66, 50, 2.2),
    yun:
      path("M24 58 C18 38 38 22 50 36 C62 18 86 30 76 52 C90 58 80 78 62 72 C54 86 30 82 28 66 C16 68 18 58 24 58"),
    shan:
      path("M8 78 L32 28 L50 78") +
      path("M32 78 L50 14 L68 78") +
      path("M50 78 L68 32 L92 78"),
    chuan:
      path("M28 16 C18 38 38 50 28 84") +
      path("M50 14 C40 40 60 56 50 86") +
      path("M72 16 C62 38 82 50 72 84"),
    shui:
      path("M50 12 C38 36 62 52 50 88") +
      path("M22 32 C30 40 30 52 18 64") +
      path("M78 32 C70 40 70 52 82 64"),
    huo:
      path("M50 88 C28 70 32 48 50 28 C68 48 72 70 50 88") +
      path("M50 28 C46 18 38 16 40 10") +
      path("M58 22 C66 14 72 18 74 12"),
    tu:
      path("M18 70 H82") +
      path("M50 28 V70") +
      path("M28 48 H72") +
      path("M22 82 H78"),
    mu:
      line(50, 12, 50, 88) +
      path("M22 38 L50 22 L78 38") +
      path("M26 86 L50 54 L74 86"),
    tian_field:
      path("M22 22 H78 V78 H22 Z") +
      line(50, 22, 50, 78) +
      line(22, 50, 78, 50),
    he:
      line(54, 14, 46, 88) +
      path("M28 28 L54 14 L78 32") +
      path("M34 48 L52 36") +
      path("M70 52 Q58 44 52 40") +
      path("M76 40 Q64 28 56 22"),
    zhu:
      path("M32 16 V82") +
      path("M68 16 V82") +
      path("M20 36 L32 28 L44 36") +
      path("M56 36 L68 28 L80 36") +
      path("M24 58 L32 50 L40 58") +
      path("M60 58 L68 50 L76 58"),
    cao:
      path("M22 78 L34 28 L46 78") +
      path("M54 78 L66 22 L78 78") +
      path("M28 54 H42") +
      path("M60 50 H74"),
    hua_leaf:
      path("M50 88 V28") +
      path("M50 40 C22 28 18 58 50 62") +
      path("M50 34 C78 22 84 54 50 58") +
      path("M36 22 Q50 10 64 22"),
    shi:
      path("M22 22 H78") +
      path("M28 22 L28 48") +
      path("M58 36 C70 48 74 70 52 82 C78 74 86 48 70 32") +
      circle(64, 58, 7, true),
    yu_jade:
      path("M38 18 H62 V82 H38 Z") +
      line(38, 40, 62, 40) +
      line(38, 62, 62, 62) +
      line(62, 28, 74, 28, true),
    yu_fish:
      path("M18 50 C28 28 58 24 78 50 C58 76 28 72 18 50") +
      path("M78 50 L92 32") +
      path("M78 50 L92 68") +
      path("M40 42 L52 42") +
      path("M40 58 L52 58") +
      circle(32, 46, 3.4),
    niao:
      circle(38, 36, 14) +
      path("M50 30 C78 18 86 44 64 52") +
      path("M36 50 C28 70 22 84 38 86") +
      path("M44 50 C58 72 70 80 82 74") +
      path("M24 34 L16 28") +
      dot(34, 34, 2.6),
    ma:
      path("M22 48 C18 28 36 18 52 28") +
      path("M52 28 C78 22 88 46 70 58") +
      path("M34 48 V78") +
      path("M46 52 V80") +
      path("M58 54 V78") +
      path("M68 52 V76") +
      path("M70 58 C86 62 88 78 78 82") +
      path("M28 26 L22 16") +
      path("M36 22 L34 12") +
      circle(58, 34, 4, true),
    niu:
      path("M22 28 L38 48 L50 30 L62 48 L78 28") +
      path("M38 48 L38 78") +
      path("M62 48 L62 78") +
      path("M32 62 H68") +
      circle(50, 52, 6, true),
    yang:
      path("M18 32 L38 48 L50 22 L62 48 L82 32") +
      path("M38 48 L42 78") +
      path("M62 48 L58 78") +
      path("M34 62 H66") +
      path("M50 48 V70"),
    quan:
      path("M28 28 C18 48 28 64 26 82") +
      path("M28 28 C48 22 70 34 62 54") +
      path("M44 48 C40 66 52 78 48 86") +
      path("M62 54 C78 48 86 70 74 82") +
      path("M62 54 C84 58 90 42 86 34"),
    hu:
      path("M24 30 C16 58 30 78 28 88") +
      path("M24 30 C52 12 82 28 70 52") +
      path("M46 40 C42 62 58 74 54 86") +
      path("M70 52 C86 70 74 86 62 84") +
      line(40, 46, 52, 50, true) +
      line(38, 58, 50, 62, true),
    long:
      path("M18 70 C22 42 48 30 62 46 C78 28 92 48 78 62 C96 70 84 88 62 80 C40 92 20 84 18 70") +
      path("M62 46 C58 18 78 14 82 28") +
      path("M70 22 L78 12") +
      circle(66, 40, 3.2),
    gui:
      path("M32 30 C32 16 68 16 68 30") +
      path("M28 36 C18 50 22 74 36 82") +
      path("M72 36 C82 50 78 74 64 82") +
      path("M36 82 Q50 90 64 82") +
      path("M32 44 H68 V70 H32 Z") +
      line(50, 44, 50, 70, true) +
      line(32, 57, 68, 57, true) +
      path("M24 48 L16 42") +
      path("M76 48 L84 42") +
      path("M26 74 L18 80") +
      path("M74 74 L82 80"),
    che:
      circle(24, 50, 16) +
      circle(76, 50, 16) +
      path("M24 50 H76") +
      path("M50 22 V78") +
      path("M38 34 H62") +
      path("M38 66 H62") +
      circle(24, 50, 4, true) +
      circle(76, 50, 4, true),
    zhou:
      path("M16 58 C28 28 72 28 84 58") +
      path("M18 58 H82") +
      path("M26 58 C30 74 70 74 74 58") +
      line(40, 42, 40, 58, true) +
      line(60, 42, 60, 58, true),
    men:
      path("M18 20 V82 H46 V20") +
      path("M54 20 V82 H82 V20") +
      path("M18 20 H82") +
      circle(38, 52, 3) +
      circle(62, 52, 3),
    gong: path("M30 16 C78 28 78 72 30 84") + path("M30 16 C42 50 30 84 30 84"),
    dao: path("M30 16 L70 22 L62 84 L28 76 Z") + path("M70 22 L84 18"),
    li: path("M38 16 C18 48 28 78 36 86") + path("M38 16 C58 40 78 36 82 28"),
    xing:
      path("M18 18 H46 V46 H18 Z") +
      path("M54 18 H82 V46 H54 Z") +
      path("M18 54 H46 V82 H18 Z") +
      path("M54 54 H82 V82 H54 Z"),
    shang: line(22, 70, 78, 70) + line(50, 28, 50, 70) + line(38, 40, 62, 40),
    xia: line(22, 32, 78, 32) + line(50, 32, 50, 78) + line(38, 64, 62, 64),
    zhong:
      path("M28 34 H72 V66 H28 Z") +
      line(50, 16, 50, 84) +
      path("M42 16 H58") +
      path("M42 84 H58"),
    wang:
      path("M22 28 H78") +
      path("M30 50 H70") +
      path("M22 74 H78") +
      path("M50 28 V74"),
    bu:
      path("M50 16 V84") +
      path("M50 42 L78 28") +
      path("M50 58 L76 70"),
    zhao:
      path("M22 22 C18 50 30 78 28 86") +
      path("M22 22 C48 28 40 60 58 86") +
      path("M36 48 C58 42 70 62 82 54"),
    wang_king: null,
    he_mouth: null,
  };

  G.wang_king = G.wang;

  function inner(key) {
    return G[key] || "";
  }

  function composeSide(left, right) {
    return (
      `<g transform="translate(2 16) scale(0.48)">${inner(left)}</g>` +
      `<g transform="translate(50 16) scale(0.48)">${inner(right)}</g>`
    );
  }

  function composeStack(top, bottom) {
    return (
      `<g transform="translate(16 2) scale(0.48)">${inner(top)}</g>` +
      `<g transform="translate(16 50) scale(0.48)">${inner(bottom)}</g>`
    );
  }

  function composeTripleMu() {
    return (
      `<g transform="translate(26 2) scale(0.42)">${inner("mu")}</g>` +
      `<g transform="translate(2 46) scale(0.42)">${inner("mu")}</g>` +
      `<g transform="translate(50 46) scale(0.42)">${inner("mu")}</g>`
    );
  }

  const COMPOSE = {
    lin: () => composeSide("mu", "mu"),
    sen: () => composeTripleMu(),
    ming: () => composeSide("ri", "yue"),
    hao: () => composeSide("nv", "zi"),
    an: () =>
      path("M18 38 L50 14 L82 38") +
      `<g transform="translate(26 38) scale(0.48)">${inner("nv")}</g>`,
    jia: () =>
      path("M16 40 L50 12 L84 40") +
      path("M24 40 V84 H76 V40") +
      path("M50 40 V84") +
      path("M24 62 H76"),
    lei: () => composeSide("tian_field", "tian_field"),
    qiu: () => composeSide("he", "huo"),
    hai: () =>
      `<g transform="translate(0 8) scale(0.42)">${inner("shui")}</g>` +
      `<g transform="translate(38 8) scale(0.58)">${inner("mu")}</g>`,
    li_plum: () => composeStack("mu", "zi"),
    zhang: () => composeSide("gong", "ren"),
    yang_sun: () =>
      `<g transform="translate(4 10) scale(0.42)">${inner("shan")}</g>` +
      `<g transform="translate(40 8) scale(0.58)">${inner("ri")}</g>`,
    chen_morning: () =>
      `<g transform="translate(22 0) scale(0.42)">${inner("ri")}</g>` +
      `<g transform="translate(16 46) scale(0.5)">${inner("chen_shell")}</g>`,
  };

  G.chen_shell =
    path("M28 30 C20 50 28 74 50 80 C72 74 80 50 72 30") +
    path("M36 44 H64") +
    path("M40 58 H60");

  const NAMED = {
    人: "ren",
    大: "da",
    天: "tian",
    子: "zi",
    女: "nv",
    口: "kou",
    目: "mu_eye",
    耳: "er",
    手: "shou",
    小: "xiao",
    心: "xin",
    日: "ri",
    月: "yue",
    星: "xing",
    雨: "yu_rain",
    云: "yun",
    雲: "yun",
    山: "shan",
    川: "chuan",
    水: "shui",
    火: "huo",
    土: "tu",
    木: "mu",
    田: "tian_field",
    禾: "he",
    竹: "zhu",
    草: "cao",
    葉: "hua_leaf",
    叶: "hua_leaf",
    石: "shi",
    玉: "yu_jade",
    魚: "yu_fish",
    鱼: "yu_fish",
    鳥: "niao",
    鸟: "niao",
    馬: "ma",
    马: "ma",
    牛: "niu",
    羊: "yang",
    犬: "quan",
    狗: "quan",
    虎: "hu",
    龍: "long",
    龙: "long",
    龜: "gui",
    龟: "gui",
    車: "che",
    车: "che",
    舟: "zhou",
    門: "men",
    门: "men",
    弓: "gong",
    刀: "dao",
    力: "li",
    行: "xing",
    上: "shang",
    下: "xia",
    中: "zhong",
    王: "wang",
    卜: "bu",
    兆: "zhao",
    林: "lin",
    森: "sen",
    明: "ming",
    好: "hao",
    安: "an",
    家: "jia",
    秋: "qiu",
    李: "li_plum",
    張: "zhang",
    张: "zhang",
  };

  function getGlyph(char, spec) {
    let markup = "";
    if (spec && spec.compose) {
      markup = COMPOSE[spec.compose] ? COMPOSE[spec.compose]() : "";
    } else if (spec && spec.key) {
      markup = inner(spec.key);
    } else if (NAMED[char]) {
      const key = NAMED[char];
      markup = COMPOSE[key] ? COMPOSE[key]() : inner(key);
    }
    return markup ? wrap(markup) : "";
  }

  root.JiaguGlyphs = { getGlyph };
})(window);
