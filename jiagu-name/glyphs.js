/* 教學用古文字繪寫：強調象形特徵，方便五年級辨認，並非出土拓片逐筆臨摹。 */
(function (root) {
  const S = 'fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"';
  const T = 'fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"';

  const path = (d, thin) => `<path ${thin ? T : S} d="${d}"/>`;
  const line = (x1, y1, x2, y2, thin) =>
    `<line ${thin ? T : S} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const circle = (cx, cy, r, thin) =>
    `<circle ${thin ? T : S} cx="${cx}" cy="${cy}" r="${r}"/>`;
  const dot = (cx, cy, r = 4) =>
    `<circle fill="currentColor" cx="${cx}" cy="${cy}" r="${r}"/>`;

  const wrap = (inner) =>
    `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${inner}</svg>`;

  const G = {
    ren:
      path("M56 12c-7 16-18 32-26 70") +
      path("M56 12c6 20 14 38 28 62"),
    da:
      line(50, 12, 50, 50) +
      path("M16 42 L50 24 L84 42") +
      path("M26 88 L50 50 L74 88"),
    tian:
      circle(50, 18, 9) +
      line(50, 27, 50, 50) +
      path("M16 44 L50 30 L84 44") +
      path("M26 88 L50 50 L74 88"),
    zi:
      circle(50, 26, 17) +
      line(50, 43, 50, 76) +
      path("M30 58 H70") +
      path("M34 88 Q50 74 66 88") +
      dot(44, 24, 2.4) +
      dot(56, 24, 2.4),
    nv:
      path("M50 16c-16 16-20 38-8 60") +
      path("M50 16c16 16 20 38 8 60") +
      path("M26 46 H74") +
      path("M40 76 Q50 90 60 76"),
    kou: path("M26 26 H74 V74 H26 Z"),
    mu_eye:
      path("M10 50 Q50 16 90 50 Q50 84 10 50") +
      circle(50, 50, 10) +
      dot(50, 50, 3.4),
    er:
      path("M36 14c-14 8-16 24-6 38") +
      path("M36 14c24 4 32 22 24 46-4 16-18 30-34 32") +
      path("M42 40c10 2 14 12 8 20"),
    shou:
      path("M50 90 V40") +
      path("M50 40 C50 14 26 12 20 32") +
      path("M50 34 C64 10 84 16 80 38") +
      path("M50 38 C72 20 90 34 82 52") +
      path("M50 44 C68 36 80 54 66 64"),
    you_hand:
      path("M28 28 C18 42 22 70 30 84") +
      path("M28 28 C48 16 72 28 64 50") +
      path("M48 40 C44 62 58 78 54 88"),
    xiao:
      line(50, 16, 50, 44) +
      path("M28 38 L16 74") +
      path("M72 38 L84 74"),
    xin:
      path("M50 84 C16 58 20 26 50 34 C80 26 84 58 50 84") +
      line(50, 42, 50, 60, true) +
      line(38, 50, 46, 54, true) +
      line(62, 50, 54, 54, true),
    ri: circle(50, 50, 28) + line(34, 50, 66, 50) + dot(50, 38, 2.2),
    yue:
      path("M66 14 C26 32 26 68 66 86 C50 66 50 34 66 14") +
      line(48, 40, 48, 48, true) +
      line(48, 56, 48, 64, true),
    xing:
      circle(30, 34, 11) +
      circle(70, 32, 10) +
      circle(50, 70, 13) +
      dot(30, 34, 2.4) +
      dot(70, 32, 2.2) +
      dot(50, 70, 2.6),
    yu_rain:
      path("M20 26 H80") +
      path("M28 26 C28 12 72 12 72 26") +
      line(32, 40, 28, 80, true) +
      line(50, 38, 50, 84, true) +
      line(68, 40, 72, 80, true) +
      dot(32, 52, 2.4) +
      dot(50, 58, 2.4) +
      dot(68, 52, 2.4),
    yun:
      path("M22 58 C14 36 36 20 50 34 C64 16 90 28 78 52 C92 58 82 80 62 72 C54 88 28 84 26 66 C12 68 16 58 22 58"),
    shan:
      path("M6 80 L30 28 L50 80") +
      path("M30 80 L50 12 L70 80") +
      path("M50 80 L70 30 L94 80"),
    chuan:
      path("M26 12 C16 36 38 50 26 88") +
      path("M50 10 C40 38 62 54 50 90") +
      path("M74 12 C64 36 86 50 74 88"),
    shui:
      path("M50 10 C36 34 62 52 50 90") +
      path("M20 30 C30 40 30 54 16 66") +
      path("M80 30 C70 40 70 54 84 66"),
    huo:
      path("M50 90 C26 70 30 46 50 24 C70 46 74 70 50 90") +
      path("M50 24 C46 14 36 12 38 6") +
      path("M60 20 C70 10 78 16 80 8"),
    tu:
      path("M16 70 H84") +
      path("M50 26 V70") +
      path("M26 48 H74") +
      path("M20 84 H80"),
    mu:
      line(50, 8, 50, 90) +
      path("M20 36 L50 18 L80 36") +
      path("M24 88 L50 52 L76 88"),
    tian_field:
      path("M20 20 H80 V80 H20 Z") +
      line(50, 20, 50, 80) +
      line(20, 50, 80, 50),
    he:
      line(56, 10, 46, 90) +
      path("M26 26 L56 10 L80 30") +
      path("M32 48 L52 34") +
      path("M72 52 Q58 42 50 38") +
      path("M78 38 Q64 24 54 18"),
    zhu:
      path("M30 12 V84") +
      path("M70 12 V84") +
      path("M18 34 L30 24 L42 34") +
      path("M58 34 L70 24 L82 34") +
      path("M22 58 L30 48 L38 58") +
      path("M62 58 L70 48 L78 58"),
    cao:
      path("M20 82 L34 22 L48 82") +
      path("M52 82 L66 16 L80 82") +
      path("M26 52 H44") +
      path("M58 48 H76"),
    hua_leaf:
      path("M50 90 V24") +
      path("M50 38 C20 24 14 58 50 62") +
      path("M50 32 C80 18 88 54 50 58") +
      path("M34 18 Q50 6 66 18"),
    shi:
      path("M18 18 H82") +
      path("M26 18 L26 46") +
      path("M56 34 C70 48 76 72 50 84 C80 74 88 46 72 28") +
      circle(64, 58, 7, true),
    yu_jade:
      path("M36 14 H64 V86 H36 Z") +
      line(36, 38, 64, 38) +
      line(36, 62, 64, 62) +
      line(64, 26, 78, 26, true),
    yu_fish:
      path("M12 50 C24 24 58 20 80 50 C58 80 24 76 12 50") +
      path("M80 50 L96 30") +
      path("M80 50 L96 70") +
      path("M38 40 L52 40") +
      path("M38 60 L52 60") +
      circle(28, 46, 3.6) +
      path("M48 50 C58 46 58 54 48 50", true),
    niao:
      circle(36, 34, 13) +
      path("M48 28 C80 12 90 42 66 52") +
      path("M34 46 C24 70 16 86 36 88") +
      path("M42 48 C58 74 74 84 88 74") +
      path("M22 32 L12 24") +
      dot(32, 32, 2.8),
    ma:
      path("M18 46 C14 24 36 14 52 26") +
      path("M52 26 C80 18 92 44 72 58") +
      path("M32 48 V80") +
      path("M44 52 V82") +
      path("M56 54 V80") +
      path("M68 52 V78") +
      path("M72 58 C90 62 92 80 80 84") +
      path("M26 24 L18 12") +
      path("M36 20 L32 8") +
      circle(58, 32, 4.2, true),
    niu:
      path("M18 24 L36 48 L50 26 L64 48 L82 24") +
      path("M36 48 L36 80") +
      path("M64 48 L64 80") +
      path("M30 62 H70") +
      circle(50, 52, 7, true),
    yang:
      path("M14 28 L36 48 L50 16 L64 48 L86 28") +
      path("M36 48 L40 82") +
      path("M64 48 L60 82") +
      path("M32 62 H68") +
      path("M50 48 V72"),
    quan:
      path("M26 24 C14 46 26 64 24 84") +
      path("M26 24 C50 16 74 32 64 54") +
      path("M42 46 C38 66 52 80 48 88") +
      path("M64 54 C82 48 90 72 76 84") +
      path("M64 54 C88 58 94 40 90 30"),
    hu:
      path("M22 28 C12 56 28 78 26 90") +
      path("M22 28 C52 8 84 26 70 52") +
      path("M44 38 C40 62 58 76 54 88") +
      path("M70 52 C88 70 76 88 62 86") +
      line(38, 44, 52, 50, true) +
      line(36, 58, 50, 62, true) +
      path("M30 32 L22 18") +
      path("M40 22 L38 10"),
    long:
      path("M14 72 C18 40 48 26 64 44 C82 24 96 46 80 62 C98 70 86 90 62 82 C38 94 16 86 14 72") +
      path("M64 44 C60 14 82 10 86 26") +
      path("M72 20 L82 8") +
      circle(66, 38, 3.4),
    gui:
      path("M32 26 C32 12 68 12 68 26") +
      path("M26 34 C14 50 20 76 36 84") +
      path("M74 34 C86 50 80 76 64 84") +
      path("M36 84 Q50 94 64 84") +
      path("M32 42 H68 V72 H32 Z") +
      line(50, 42, 50, 72, true) +
      line(32, 57, 68, 57, true) +
      path("M22 46 L12 38") +
      path("M78 46 L88 38") +
      path("M24 76 L14 84") +
      path("M76 76 L86 84"),
    che:
      circle(22, 50, 16) +
      circle(78, 50, 16) +
      path("M22 50 H78") +
      path("M50 18 V82") +
      path("M36 32 H64") +
      path("M36 68 H64") +
      circle(22, 50, 4, true) +
      circle(78, 50, 4, true),
    zhou:
      path("M12 58 C26 24 74 24 88 58") +
      path("M16 58 H84") +
      path("M24 58 C28 76 72 76 76 58") +
      line(38, 40, 38, 58, true) +
      line(62, 40, 62, 58, true),
    men:
      path("M16 16 V84 H44 V16") +
      path("M56 16 V84 H84 V16") +
      path("M16 16 H84") +
      circle(36, 52, 3.2) +
      circle(64, 52, 3.2),
    gong: path("M28 12 C82 26 82 74 28 88") + path("M28 12 C42 50 28 88 28 88"),
    dao: path("M28 12 L72 18 L64 88 L26 80 Z") + path("M72 18 L88 12"),
    li: path("M36 12 C14 48 26 80 34 88") + path("M36 12 C58 38 80 34 86 24"),
    xing_road:
      path("M14 14 H46 V46 H14 Z") +
      path("M54 14 H86 V46 H54 Z") +
      path("M14 54 H46 V86 H14 Z") +
      path("M54 54 H86 V86 H54 Z"),
    shang: line(18, 72, 82, 72) + line(50, 24, 50, 72) + line(36, 38, 64, 38),
    xia: line(18, 28, 82, 28) + line(50, 28, 50, 80) + line(36, 66, 64, 66),
    zhong:
      path("M26 32 H74 V68 H26 Z") +
      line(50, 12, 50, 88) +
      path("M40 12 H60") +
      path("M40 88 H60"),
    wang:
      path("M18 24 H82") +
      path("M28 50 H72") +
      path("M18 76 H82") +
      path("M50 24 V76"),
    bu:
      path("M50 12 V88") +
      path("M50 40 L82 24") +
      path("M50 58 L80 74"),
    zhao:
      path("M20 18 C14 50 28 80 26 88") +
      path("M20 18 C48 26 38 60 58 88") +
      path("M34 46 C58 40 72 62 86 52"),
    shi_pig:
      path("M18 58 C22 32 70 28 84 50 C90 62 78 78 58 80 C36 84 16 74 18 58") +
      path("M84 50 L96 40") +
      circle(32, 50, 3.2),
    yan:
      path("M50 14 C42 28 42 40 50 48") +
      path("M38 48 H62 V86 H38 Z") +
      line(38, 62, 62, 62, true) +
      line(38, 74, 62, 74, true),
    yu_feather:
      path("M28 18 V82") +
      path("M72 18 V82") +
      path("M28 28 L42 22") +
      path("M28 48 L44 40") +
      path("M28 68 L42 60") +
      path("M72 28 L58 22") +
      path("M72 48 L56 40") +
      path("M72 68 L58 60"),
    shi_altar:
      path("M22 78 H78") +
      path("M50 22 V78") +
      path("M32 40 H68") +
      path("M28 22 H72"),
    jin:
      path("M18 70 H82") +
      path("M50 28 V70") +
      path("M28 48 H72") +
      circle(34, 78, 5) +
      circle(50, 84, 5) +
      circle(66, 78, 5),
    zhui:
      circle(40, 36, 11) +
      path("M50 32 C78 20 84 48 62 56") +
      path("M38 48 C32 70 48 82 70 74") +
      dot(38, 34, 2.4),
    si_silk:
      path("M50 12 C28 28 28 48 50 58 C72 48 72 28 50 12") +
      path("M50 58 V88") +
      path("M38 72 H62"),
    bei:
      path("M30 18 H70 V58 H30 Z") +
      path("M36 58 L28 84") +
      path("M64 58 L72 84") +
      line(30, 38, 70, 38, true),
    gong_work:
      path("M22 28 H78") +
      path("M50 28 V72") +
      path("M22 72 H78"),
    wo:
      path("M22 22 L50 78") +
      path("M50 40 H82") +
      path("M62 22 V82") +
      path("M50 62 L78 82"),
    ge:
      path("M18 58 H86") +
      path("M62 18 L62 82") +
      path("M62 28 L82 18"),
    wen:
      path("M50 12 L28 86") +
      path("M50 12 L72 86") +
      path("M36 48 Q50 62 64 48"),
    yong:
      path("M50 14 C28 36 28 64 22 86") +
      path("M50 14 C72 36 72 64 78 86") +
      path("M50 14 C42 48 58 48 50 82"),
    guang:
      path("M50 8 C40 22 42 34 50 40 C58 34 60 22 50 8") +
      path("M50 40 C28 52 24 78 36 88") +
      path("M50 40 C72 52 76 78 64 88") +
      path("M36 62 H64"),
    nian:
      path("M58 10 L48 46") +
      path("M32 22 L58 10 L78 28") +
      path("M42 46 C28 58 26 82 40 90") +
      path("M42 46 C70 40 78 70 66 88"),
    chun:
      path("M22 78 L34 28 L46 78") +
      circle(68, 38, 16) +
      line(60, 38, 76, 38, true) +
      path("M30 52 H42"),
    dong:
      path("M28 22 C48 18 52 40 50 58") +
      path("M50 58 C72 52 78 74 54 84") +
      path("M42 70 Q50 62 58 72"),
    dong_east:
      line(50, 10, 50, 90) +
      path("M22 36 L50 20 L78 36") +
      path("M26 86 L50 54 L74 86") +
      circle(50, 42, 10, true),
    xi:
      path("M22 58 C22 28 50 16 62 36") +
      path("M62 36 C84 28 88 58 70 70 C50 86 24 80 22 58") +
      circle(58, 42, 4, true),
    nan:
      path("M28 16 H72 V40 H28 Z") +
      path("M50 40 V84") +
      path("M32 62 H68") +
      path("M36 84 H64"),
    bei_dir:
      path("M28 18 C18 40 20 70 16 86") +
      path("M28 18 C40 36 28 64 38 86") +
      path("M72 18 C82 40 80 70 84 86") +
      path("M72 18 C60 36 72 64 62 86"),
    feng:
      path("M22 70 C28 36 58 22 74 44 C90 28 94 56 78 66 C92 78 74 92 52 84 C30 94 18 84 22 70") +
      path("M70 40 L82 22") +
      circle(64, 42, 3),
    quan_spring:
      path("M22 22 H78 V48 C78 74 22 74 22 48 Z") +
      path("M50 48 C42 60 58 70 50 86") +
      path("M36 58 C42 64 40 72 32 78", true) +
      path("M64 58 C58 64 60 72 68 78", true),
    bai:
      path("M50 14 C34 28 38 48 50 52 C62 48 66 28 50 14") +
      path("M36 52 V82") +
      path("M64 52 L78 82"),
    ding: circle(50, 50, 16) + dot(50, 50, 5),
    yu_flute:
      path("M32 16 C18 40 18 64 32 86") +
      path("M32 16 H70") +
      path("M48 16 V50") +
      path("M48 50 H66"),
    yu_i:
      path("M28 22 H72") +
      path("M50 22 V46") +
      path("M24 46 L50 78 L76 46") +
      path("M36 78 H64"),
    zhou_field:
      path("M22 22 H78 V78 H22 Z") +
      line(50, 22, 50, 78) +
      line(22, 50, 78, 50) +
      dot(36, 36, 3) +
      dot(64, 36, 3) +
      dot(36, 64, 3) +
      dot(64, 64, 3),
    zhu_red:
      line(50, 10, 50, 90) +
      path("M22 36 L50 20 L78 36") +
      path("M26 88 L50 54 L74 88") +
      path("M40 48 H60") +
      dot(50, 48, 4.2),
    xia_dance:
      path("M50 8 C42 18 44 28 50 34 C56 28 58 18 50 8") +
      path("M22 42 L50 28 L78 42") +
      path("M50 34 V62") +
      path("M28 88 L50 62 L72 88") +
      path("M18 54 H34") +
      path("M66 54 H82"),
    li_stand:
      path("M50 12 L28 48") +
      path("M50 12 L72 48") +
      path("M50 12 V70") +
      path("M28 70 L50 48 L72 70") +
      path("M16 86 H84"),
    pin:
      path("M36 12 H64 V36 H36 Z") +
      path("M14 52 H42 V86 H14 Z") +
      path("M58 52 H86 V86 H58 Z"),
    hui:
      path("M14 78 L26 28 L38 78") +
      path("M40 78 L50 18 L60 78") +
      path("M62 78 L74 28 L86 78"),
    jing_star:
      circle(50, 22, 12) +
      circle(26, 66, 12) +
      circle(74, 66, 12) +
      line(44, 22, 56, 22, true) +
      line(20, 66, 32, 66, true) +
      line(68, 66, 80, 66, true),
    chang:
      circle(50, 28, 16) +
      circle(50, 70, 16) +
      line(38, 28, 62, 28, true) +
      line(38, 70, 62, 70, true),
    hao_sky:
      circle(50, 22, 14) +
      line(42, 22, 58, 22, true) +
      line(50, 36, 50, 56) +
      path("M18 52 L50 40 L82 52") +
      path("M28 88 L50 56 L72 88"),
    sheng:
      path("M22 28 H78") +
      path("M30 28 L24 78") +
      path("M50 28 V78") +
      path("M70 28 L76 78") +
      path("M22 78 H78"),
    cheng:
      path("M22 22 L50 78") +
      path("M50 36 H82") +
      path("M62 22 V84") +
      path("M18 70 H46"),
    jun:
      path("M22 18 C16 40 20 70 18 86") +
      path("M22 18 C44 12 52 40 40 52") +
      path("M54 40 H86 V78 H54 Z"),
    cheng_hold:
      path("M14 58 C18 36 40 32 46 52") +
      path("M86 58 C82 36 60 32 54 52") +
      path("M50 18 C40 34 40 50 50 62 C60 50 60 34 50 18") +
      path("M50 62 V86"),
    qi_open:
      path("M18 20 V84 H46 V20") +
      path("M18 20 H46") +
      path("M58 28 C80 22 88 48 70 58") +
      path("M70 58 C84 70 70 88 54 82"),
    fu:
      path("M18 70 C22 40 44 36 50 58") +
      path("M82 70 C78 40 56 36 50 58") +
      path("M38 22 H62 V52 H38 Z") +
      path("M50 52 V70"),
    de:
      path("M18 18 H46 V46 H18 Z") +
      circle(32, 32, 6, true) +
      path("M58 18 C78 28 80 58 62 70") +
      path("M50 78 C28 64 32 48 50 54 C68 48 72 64 50 78"),
    qi_even:
      path("M22 78 L28 22 L36 78") +
      path("M44 78 L50 18 L56 78") +
      path("M64 78 L72 22 L78 78") +
      path("M20 48 H38") +
      path("M42 44 H58") +
      path("M62 48 H80"),
    chen_shell:
      path("M28 28 C18 50 28 76 50 84 C72 76 82 50 72 28") +
      path("M36 44 H64") +
      path("M40 58 H60") +
      path("M50 28 V18"),
    yue_music:
      line(28, 18, 28, 82) +
      line(50, 22, 50, 82) +
      line(72, 18, 72, 82) +
      path("M28 28 H72") +
      path("M28 48 H72") +
      path("M28 68 H72") +
      path("M22 18 H78"),
    lu:
      path("M30 36 C18 58 28 82 46 86 C70 90 88 68 78 48 C92 36 80 16 62 22 C48 8 28 18 30 36") +
      path("M58 18 L70 6") +
      path("M48 16 L44 4") +
      circle(42, 38, 3.2),
    tu_rabbit:
      path("M38 18 C32 8 22 8 24 22") +
      path("M50 16 C58 4 70 8 62 24") +
      path("M28 46 C26 26 70 22 74 46 C80 66 60 86 44 84 C24 82 22 62 28 46") +
      circle(42, 44, 3) +
      path("M70 70 C84 66 88 80 76 84"),
    yan_bird:
      path("M18 42 C36 28 50 36 50 50 C50 36 64 28 82 42") +
      path("M50 50 C40 70 28 78 18 74") +
      path("M50 50 C60 70 72 78 82 74") +
      path("M50 50 L50 86") +
      path("M42 86 L50 74 L58 86") +
      circle(50, 40, 4, true),
    feng_bird:
      path("M22 58 C28 28 62 16 78 40 C94 28 92 62 74 66 C90 78 70 92 48 82 C24 90 16 74 22 58") +
      path("M70 36 L86 16") +
      path("M62 28 L68 10") +
      circle(58, 38, 3.2) +
      path("M30 70 C18 78 22 90 36 84", true),
    li_deer:
      path("M24 50 C16 70 32 86 50 86 C74 88 90 66 78 48") +
      path("M40 48 C36 24 18 16 20 8") +
      path("M52 46 C60 22 82 16 84 8") +
      path("M40 48 C52 40 62 44 70 50") +
      circle(36, 52, 3),
    xue:
      path("M18 28 C18 14 50 8 50 22 C50 8 82 14 82 28") +
      path("M22 40 C18 58 30 70 50 62 C70 70 82 58 78 40") +
      path("M36 48 C40 62 44 78 32 88") +
      path("M64 48 C60 62 56 78 68 88") +
      path("M50 52 V86"),
    you_friend:
      path("M22 30 C12 50 18 76 26 86") +
      path("M22 30 C44 18 58 36 48 54") +
      path("M78 30 C88 50 82 76 74 86") +
      path("M78 30 C56 18 42 36 52 54") +
      path("M48 54 H52"),
    peng:
      path("M18 18 H46 V50 H18 Z") +
      path("M54 18 H82 V50 H54 Z") +
      path("M24 50 L16 82") +
      path("M40 50 L48 82") +
      path("M60 50 L52 82") +
      path("M76 50 L84 82"),
    mei_beauty:
      path("M18 28 L38 46 L50 14 L62 46 L82 28") +
      path("M50 46 V62") +
      path("M24 62 L50 50 L76 62") +
      path("M32 88 L50 62 L68 88"),
    huang:
      path("M50 10 L28 46") +
      path("M50 10 L72 46") +
      path("M50 10 V54") +
      path("M28 54 L50 40 L72 54") +
      path("M32 88 L50 54 L68 88") +
      path("M40 66 H60") +
      circle(50, 66, 5, true),
    wu:
      path("M58 12 C70 28 66 50 52 62") +
      path("M58 12 C40 24 28 54 34 78") +
      path("M52 62 L28 88") +
      path("M52 62 L72 88") +
      path("M40 48 H62"),
    ping:
      path("M18 50 H82") +
      path("M32 28 L50 50 L68 28") +
      path("M32 72 L50 50 L68 72"),
    kang:
      path("M22 22 H78") +
      path("M50 22 V50") +
      path("M28 50 H72 V82 H28 Z") +
      line(50, 50, 50, 82, true) +
      line(28, 66, 72, 66, true),
    ning:
      path("M16 38 L50 12 L84 38") +
      path("M50 78 C24 60 28 42 50 48 C72 42 76 60 50 78") +
      path("M36 82 H64"),
    xin_trust:
      path("M22 16c-6 18-12 36-10 70") +
      path("M22 16c8 16 16 30 28 48") +
      path("M58 28 H86 V78 H58 Z") +
      line(58, 46, 86, 46, true) +
      line(58, 62, 86, 62, true),
    yi_right:
      path("M12 30 L30 48 L42 18 L54 48 L72 30") +
      path("M42 48 V70") +
      path("M58 40 L78 78") +
      path("M70 48 H92") +
      path("M78 40 V84"),
    yong_brave:
      path("M28 14 C8 48 20 80 28 88") +
      path("M28 14 C48 36 72 32 80 22") +
      path("M54 46 H86 V82 H54 Z"),
    zhi_wis:
      path("M22 22 H50 V50 H22 Z") +
      path("M28 50 L22 78") +
      path("M44 50 L50 78") +
      circle(72, 40, 16) +
      line(64, 40, 80, 40, true),
    hua_flower:
      path("M50 90 V48") +
      path("M50 48 C22 48 18 18 50 22 C82 18 78 48 50 48") +
      path("M34 36 Q50 8 66 36") +
      path("M22 78 L50 58 L78 78"),
    tao:
      line(50, 10, 50, 90) +
      path("M22 36 L50 18 L78 36") +
      path("M26 88 L50 54 L74 88") +
      path("M60 48 C78 40 86 62 70 70") +
      path("M64 56 C76 52 78 64 68 66", true),
    hua_later:
      path("M18 40 L30 12 L42 40") +
      path("M58 40 L70 12 L82 40") +
      path("M50 40 C28 52 28 78 50 90 C72 78 72 52 50 40"),
    ice:
      path("M50 12 L42 40") +
      path("M50 12 L58 40") +
      path("M24 52 L50 40 L76 52") +
      path("M32 88 L50 52 L68 88") +
      dot(28, 36, 2.6) +
      dot(72, 36, 2.6),
    xue_snow:
      path("M20 24 H80") +
      path("M28 24 C28 12 72 12 72 24") +
      path("M36 44 L28 58 L36 72 L50 64 L64 72 L72 58 L64 44 L50 52 Z", true) +
      line(50, 40, 50, 78, true),
    he_river:
      path("M22 16 C12 40 32 56 22 86") +
      path("M40 18 C30 44 50 58 40 86") +
      path("M62 28 H90") +
      path("M70 28 V78") +
      path("M62 78 H90"),
    song:
      line(50, 10, 50, 90) +
      path("M20 42 L50 18 L80 42") +
      path("M26 62 L50 40 L74 62") +
      path("M30 88 L50 64 L70 88"),
    lan:
      path("M22 40 L32 12 L42 40") +
      path("M58 40 L68 12 L78 40") +
      path("M36 48 C20 62 28 86 50 88 C72 86 80 62 64 48") +
      path("M50 48 V78", true),
    ju:
      path("M22 36 L32 12 L42 36") +
      path("M58 36 L68 12 L78 36") +
      circle(50, 64, 22) +
      path("M50 46 V82", true) +
      path("M32 64 H68", true) +
      path("M36 52 L64 76", true) +
      path("M64 52 L36 76", true),
    he_crane:
      path("M40 22 C54 10 74 18 70 34") +
      circle(62, 24, 3) +
      path("M48 34 C28 46 22 78 40 88") +
      path("M48 34 C70 50 64 78 48 88") +
      path("M40 88 L36 96") +
      path("M48 88 L52 96") +
      path("M70 34 L84 28"),
    ai:
      path("M50 18 L28 40") +
      path("M50 18 L72 40") +
      path("M50 18 V48") +
      path("M50 86 C22 64 26 40 50 48 C74 40 78 64 50 86"),
    zhen:
      path("M28 18 H72 V42 H28 Z") +
      path("M50 42 V62") +
      path("M30 62 H70 V86 H30 Z") +
      line(50, 62, 50, 86, true),
    si_think:
      path("M24 16 H76 V46 H24 Z") +
      line(50, 16, 50, 46, true) +
      line(24, 31, 76, 31, true) +
      path("M50 86 C22 66 26 48 50 54 C74 48 78 66 50 86"),
    shu:
      path("M22 22 C12 44 18 74 26 86") +
      path("M22 22 C46 10 62 32 50 50") +
      path("M58 18 V86") +
      path("M58 34 H84") +
      path("M58 54 H80") +
      path("M58 74 H76"),
    hua_draw:
      path("M18 22 C10 44 16 70 24 82") +
      path("M18 22 C40 12 54 32 44 48") +
      path("M58 22 H90 V54 H58 Z") +
      line(74, 22, 74, 54, true) +
      line(58, 38, 90, 38, true),
    guan:
      path("M18 28 L50 10 L82 28") +
      path("M26 28 V46 H74 V28") +
      circle(50, 70, 18) +
      line(50, 46, 50, 52, true),
    yu_give:
      path("M24 28 C40 18 44 48 28 62") +
      path("M76 28 C60 18 56 48 72 62") +
      path("M28 62 L50 84 L72 62"),
    xin_core:
      path("M22 36 L32 12 L42 36") +
      path("M58 36 L68 12 L78 36") +
      path("M50 86 C22 64 26 42 50 50 C74 42 78 64 50 86"),
    zi_catalpa:
      line(50, 8, 50, 48) +
      path("M24 32 L50 16 L76 32") +
      path("M28 48 L50 36 L72 48") +
      path("M36 56 H64") +
      path("M42 56 V88") +
      path("M58 56 V88") +
      path("M36 72 H64"),
    shan_good:
      path("M18 24 L36 42 L48 14 L60 42 L78 24") +
      path("M48 42 V56") +
      path("M30 62 H70 V86 H30 Z") +
      line(30, 74, 70, 74, true),
    ren_kind:
      path("M28 14c-7 18-16 36-14 72") +
      path("M28 14c8 18 16 34 30 54") +
      path("M62 46 H86") +
      path("M62 70 H86"),
    hong:
      path("M16 40 L50 14 L84 40") +
      path("M28 48 C20 62 28 82 50 86 C72 82 80 62 72 48") +
      path("M36 58 H64"),
    yan_talent:
      path("M50 12 L30 42") +
      path("M50 12 L70 42") +
      path("M36 30 Q50 42 64 30") +
      path("M28 52 L50 88") +
      path("M50 52 L72 88") +
      path("M40 64 H60", true),
    yan_pretty:
      path("M28 16c-12 16-14 36-6 56") +
      path("M28 16c14 14 16 34 8 56") +
      path("M14 40 H46") +
      path("M58 28 H90") +
      path("M74 28 V78") +
      path("M58 78 H90"),
    yue_pearl:
      path("M28 18 H52 V82 H28 Z") +
      line(28, 40, 52, 40) +
      line(28, 62, 52, 62) +
      path("M70 16 C42 34 42 66 70 84 C58 66 58 34 70 16"),
    min_sky:
      circle(50, 22, 12) +
      line(42, 22, 58, 22, true) +
      path("M50 40 L30 86") +
      path("M50 40 L70 86") +
      path("M36 62 Q50 74 64 62"),
    you_forgive:
      path("M16 40 L50 14 L84 40") +
      path("M28 48 H72 V82 H28 Z") +
      line(50, 48, 50, 82, true) +
      line(28, 65, 72, 65, true),
    qian:
      path("M18 22 H46 V50 H18 Z") +
      line(18, 36, 46, 36, true) +
      path("M58 18 L70 46") +
      path("M82 18 L70 46") +
      path("M56 58 H84") +
      path("M56 76 H84"),
    jing_quiet:
      path("M24 18 H52") +
      path("M38 18 V42") +
      path("M24 42 H52") +
      circle(38, 64, 14) +
      path("M62 22 L78 86") +
      path("M86 22 L70 86") +
      path("M60 48 H90"),
    ya:
      path("M18 28 C28 16 48 20 46 40 C44 58 22 62 18 48") +
      path("M18 48 L28 82") +
      circle(70, 36, 10) +
      path("M78 40 C90 28 94 52 80 58") +
      path("M70 48 C64 70 80 82 90 74"),
    bo:
      path("M18 50 H46") +
      path("M32 22 V78") +
      path("M22 78 H42") +
      path("M58 28 H86") +
      path("M72 28 V78") +
      path("M58 52 H86") +
      path("M58 78 H86"),
    ze:
      path("M18 16 C8 40 28 54 18 86") +
      path("M34 18 C24 44 44 58 34 86") +
      path("M58 22 H86 V50 H58 Z") +
      circle(72, 36, 6, true) +
      path("M64 50 L56 82") +
      path("M80 50 L88 82"),
    lin_rain:
      path("M20 24 H80") +
      path("M28 24 C28 12 72 12 72 24") +
      line(50, 28, 50, 48, true) +
      line(34, 32, 30, 48, true) +
      line(66, 32, 70, 48, true) +
      line(38, 54, 38, 90) +
      line(62, 54, 62, 90) +
      path("M24 68 L38 56 L50 68") +
      path("M50 68 L62 56 L76 68") +
      path("M28 90 L38 72 L48 90") +
      path("M52 90 L62 72 L72 90"),
    hao_vast:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 22 H90") +
      path("M74 22 V50") +
      path("M58 50 H90") +
      path("M64 62 H86 V86 H64 Z"),
    rui:
      path("M18 18 H42 V78 H18 Z") +
      line(18, 38, 42, 38) +
      line(18, 58, 42, 58) +
      path("M58 22 H86") +
      path("M72 22 V50") +
      path("M58 50 H86") +
      path("M64 62 L72 86 L80 62"),
    xiang:
      path("M18 18 H46") +
      path("M32 18 V82") +
      path("M18 48 H46") +
      path("M18 82 H46") +
      path("M58 28 L74 48 L84 28") +
      path("M74 48 L78 82") +
      path("M70 48 L66 82"),
    en:
      path("M24 16 H52 V44 H24 Z") +
      path("M38 44 V56") +
      path("M50 90 C22 70 26 52 50 58 C74 52 78 70 50 90"),
    ci:
      path("M18 18 L30 40") +
      path("M42 18 L30 40") +
      path("M30 40 V56") +
      path("M58 18 L70 40") +
      path("M82 18 L70 40") +
      path("M70 40 V56") +
      path("M50 90 C24 70 28 52 50 60 C72 52 76 70 50 90"),
    zhi_will:
      path("M28 16 H72") +
      path("M50 16 V42") +
      path("M34 42 H66") +
      path("M50 90 C22 68 26 48 50 56 C74 48 78 68 50 90"),
    hao_hero:
      path("M22 58 C26 28 74 24 84 52 C90 66 74 84 52 84 C28 86 18 72 22 58") +
      path("M30 36 L22 18") +
      path("M42 28 L40 12") +
      path("M84 52 L96 40"),
    xuan:
      path("M18 36 L28 12 L38 36") +
      path("M42 36 L50 10 L58 36") +
      path("M62 36 L72 12 L82 36") +
      path("M24 48 H76 V82 H24 Z") +
      line(24, 65, 76, 65, true),
    ying:
      line(40, 12, 32, 48) +
      path("M18 24 L40 12 L56 28") +
      path("M68 22 L92 50") +
      path("M68 50 L92 22") +
      path("M80 36 V86") +
      path("M28 56 H52") +
      path("M34 56 V88") +
      path("M46 56 V88"),
    rui_wise:
      path("M22 18 H50 V42 H22 Z") +
      path("M28 42 L22 62") +
      path("M44 42 L50 62") +
      path("M62 16 C82 28 84 58 66 70") +
      path("M36 78 H78") +
      path("M50 70 V90"),
    yu_gem:
      path("M18 18 H42 V82 H18 Z") +
      line(18, 40, 42, 40) +
      line(18, 62, 42, 62) +
      path("M58 28 C78 18 90 40 74 52 C92 58 80 82 60 74 C52 88 48 60 58 52 C48 48 50 34 58 28"),
    lin_jade:
      path("M16 18 H40 V82 H16 Z") +
      line(16, 40, 40, 40) +
      line(16, 62, 40, 62) +
      line(58, 14, 58, 86) +
      path("M46 36 L58 22 L70 36") +
      path("M48 86 L58 58 L68 86") +
      line(78, 18, 78, 86) +
      path("M68 38 L78 24 L88 38") +
      path("M70 86 L78 60 L86 86"),
    qí_jade:
      path("M16 16 H40 V84 H16 Z") +
      line(16, 38, 40, 38) +
      line(16, 60, 40, 60) +
      path("M56 22 H88") +
      path("M72 22 V50") +
      path("M56 50 H88") +
      path("M64 62 H80 V84 H64 Z"),
    yao:
      path("M16 16 H40 V84 H16 Z") +
      line(16, 38, 40, 38) +
      line(16, 60, 40, 60) +
      path("M62 18 C50 34 50 48 62 58 C74 48 74 34 62 18") +
      path("M62 58 V86") +
      path("M50 72 H74"),
    zhen_gem:
      path("M16 16 H40 V84 H16 Z") +
      line(16, 38, 40, 38) +
      line(16, 60, 40, 60) +
      path("M58 22 L70 86") +
      path("M82 22 L70 86") +
      path("M62 48 H78", true) +
      path("M60 64 H80", true),
    zhu_pearl:
      path("M16 16 H40 V84 H16 Z") +
      line(16, 38, 40, 38) +
      line(16, 60, 40, 60) +
      line(70, 16, 70, 86) +
      path("M54 38 L70 24 L86 38") +
      path("M56 86 L70 56 L84 86") +
      path("M62 50 H78") +
      circle(70, 50, 4, true),
    yu_eaves:
      path("M14 40 L50 12 L86 40") +
      path("M22 40 V82") +
      path("M78 40 V82") +
      path("M22 82 H78") +
      path("M36 56 H64") +
      path("M36 68 H64"),
    xuan_cart:
      circle(24, 62, 14) +
      circle(76, 62, 14) +
      path("M24 62 H76") +
      path("M50 28 V78") +
      path("M36 38 H64") +
      path("M50 16 V28") +
      path("M38 16 H62"),
    han:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M56 22 H88 V78 H56 Z") +
      line(56, 40, 88, 40, true) +
      line(56, 58, 88, 58, true),
    shi_poem:
      path("M16 16 H44 V48 H16 Z") +
      line(16, 32, 44, 32, true) +
      path("M60 20 H88") +
      path("M74 20 V50") +
      path("M60 50 H88") +
      path("M66 62 H82 V86 H66 Z"),
    qing_sun:
      circle(28, 36, 16) +
      line(18, 36, 38, 36, true) +
      path("M54 18 H86") +
      path("M70 18 V44") +
      path("M54 44 H86") +
      circle(70, 68, 14),
    yang_sun:
      path("M8 78 L24 40 L40 78") +
      path("M24 78 L40 28 L56 78") +
      circle(74, 46, 18) +
      line(64, 46, 84, 46, true) +
      path("M74 22 V28", true) +
      path("M74 64 V70", true),
    chen_morn:
      circle(50, 22, 14) +
      line(42, 22, 58, 22, true) +
      path("M28 48 C18 66 28 86 50 90 C72 86 82 66 72 48") +
      path("M36 62 H64") +
      path("M40 74 H60"),
    jia_good:
      path("M22 18 H50 V42 H22 Z") +
      path("M28 42 L22 62") +
      path("M44 42 L50 62") +
      path("M62 20 L78 46") +
      path("M90 20 L78 46") +
      path("M64 58 H92") +
      path("M78 46 V82") +
      path("M64 82 H92"),
    xin_joy:
      path("M22 18 C12 40 18 66 26 82") +
      path("M22 18 C44 8 58 32 46 50") +
      path("M62 22 H90") +
      path("M76 22 V82") +
      path("M64 50 L76 42 L86 50"),
    yi_calm:
      path("M50 42 C22 26 18 58 50 72 C82 58 78 26 50 42") +
      line(50, 42, 50, 58, true) +
      path("M36 78 Q50 90 64 78") +
      path("M30 22 H46") +
      path("M54 22 H70"),
    ting:
      path("M24 14c-12 16-14 36-6 54") +
      path("M24 14c14 14 16 34 8 54") +
      path("M10 40 H42") +
      path("M54 20 L78 8 L90 22") +
      path("M78 20 V78") +
      path("M62 48 H90") +
      path("M66 78 H90"),
    jie:
      path("M18 16c-6 18-10 38-8 70") +
      path("M18 16c8 16 14 32 24 52") +
      line(62, 12, 62, 48) +
      path("M46 32 L62 18 L78 32") +
      path("M50 48 L62 36 L74 48") +
      path("M44 88 L62 56 L80 88"),
    fang:
      path("M18 40 L28 12 L38 40") +
      path("M42 40 L50 10 L58 40") +
      path("M62 40 L72 12 L82 40") +
      path("M34 56 L50 88") +
      path("M50 52 L66 88") +
      path("M38 68 H62", true),
    qiang:
      path("M16 16 C52 28 52 72 16 86") +
      path("M16 16 C28 50 16 86 16 86") +
      path("M58 28 C70 18 90 28 82 48 C96 52 90 78 72 76 C58 86 50 64 62 56 C50 48 52 34 58 28"),
    wei:
      path("M16 14c-6 18-10 38-8 72") +
      path("M16 14c8 16 14 32 24 52") +
      path("M52 22 H88") +
      path("M70 22 V50") +
      path("M52 50 H88") +
      path("M52 62 H88 V84 H52 Z"),
    li_etiquette:
      path("M16 16 H44") +
      path("M30 16 V82") +
      path("M16 46 H44") +
      path("M16 82 H44") +
      path("M58 28 H86 V54 H58 Z") +
      path("M72 54 V82") +
      path("M60 82 H84"),
    he_peace:
      line(28, 12, 20, 50) +
      path("M8 24 L28 12 L42 28") +
      path("M16 50 H36") +
      path("M22 50 V88") +
      path("M16 70 H36") +
      path("M58 28 H86 V72 H58 Z"),
    chen_mound:
      path("M14 28 L28 78") +
      path("M14 50 H32") +
      path("M14 78 H34") +
      line(62, 16, 62, 86) +
      path("M46 36 L62 22 L78 36") +
      path("M48 86 L62 54 L76 86") +
      circle(62, 42, 8, true),
    liu:
      path("M14 66 H46") +
      path("M30 36 V66") +
      path("M20 50 H40") +
      circle(22, 76, 4.2) +
      circle(30, 82, 4.2) +
      circle(38, 76, 4.2) +
      path("M58 14 L88 22 L80 88 L54 78 Z") +
      path("M88 22 L96 16"),
    yang_tree:
      line(28, 10, 28, 90) +
      path("M10 36 L28 20 L46 36") +
      path("M14 88 L28 54 L42 88") +
      circle(72, 42, 18) +
      line(62, 42, 82, 42, true) +
      path("M72 18 V24") +
      path("M72 60 V66") +
      path("M50 42 H56") +
      path("M88 42 H94"),
    cai:
      path("M16 40 L26 12 L36 40") +
      path("M40 40 L50 10 L60 40") +
      path("M64 40 L74 12 L84 40") +
      path("M28 52 H72") +
      path("M50 52 V86") +
      path("M34 68 H66") +
      path("M30 86 H70"),
    xu:
      path("M16 16 H44 V48 H16 Z") +
      line(16, 32, 44, 32, true) +
      path("M62 18 L78 48") +
      path("M90 18 L78 48") +
      path("M78 48 V84") +
      path("M64 66 H90"),
    xie:
      path("M14 16 H40 V46 H14 Z") +
      line(14, 31, 40, 31, true) +
      path("M58 18 C86 30 86 70 58 84") +
      path("M58 18 C68 50 58 84 58 84") +
      path("M70 48 L88 36") +
      path("M70 52 L90 62"),
    zheng:
      path("M18 20 H50 V48 H18 Z") +
      path("M34 48 V78") +
      path("M22 78 H46") +
      path("M62 18 L78 82") +
      path("M86 28 L78 82") +
      path("M68 48 H90"),
    xu_slow:
      path("M14 14 H42 V42 H14 Z") +
      path("M14 58 H42 V86 H14 Z") +
      path("M58 22 L70 50") +
      path("M86 22 L70 50") +
      path("M54 62 H90") +
      path("M70 50 V86"),
    sun_child:
      circle(28, 28, 14) +
      line(28, 42, 28, 62) +
      path("M16 52 H40") +
      path("M18 78 Q28 66 38 78") +
      path("M62 18 C44 36 44 56 62 68 C80 56 80 36 62 18") +
      path("M62 68 V88") +
      path("M50 78 H74"),
    jiang:
      path("M12 28 L28 46 L38 18 L48 46 L64 28") +
      path("M38 46 V62") +
      path("M72 18c12 14 14 32 8 52") +
      path("M72 18c-12 16-14 36-6 56") +
      path("M58 42 H88") +
      path("M70 70 Q78 84 86 70"),
    shen:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 22 C70 18 86 34 74 50") +
      path("M74 50 C60 62 70 82 86 78"),
    wang_water:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 22 H90") +
      path("M68 46 H82") +
      path("M58 70 H90") +
      path("M74 22 V70"),
    jiang_river:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 26 H90") +
      path("M74 26 V70") +
      path("M58 70 H90"),
    hai:
      path("M14 16 C6 40 24 54 14 86") +
      path("M28 18 C18 42 38 56 28 86") +
      path("M56 20 L68 44") +
      path("M84 20 L68 44") +
      path("M68 44 V58") +
      path("M50 72 C62 62 80 62 88 74") +
      path("M58 86 Q68 74 80 86"),
    qing_water:
      path("M14 16 C6 40 24 54 14 86") +
      path("M28 18 C18 42 38 56 28 86") +
      path("M54 18 H86") +
      path("M70 18 V44") +
      path("M54 44 H86") +
      circle(70, 68, 14),
    xi_stream:
      path("M14 16 C6 40 24 54 14 86") +
      path("M28 18 C18 42 38 56 28 86") +
      path("M62 18 C48 36 48 52 62 64 C76 52 76 36 62 18") +
      path("M62 64 V86") +
      path("M50 76 H74"),
    hu_lake:
      path("M14 16 C6 40 24 54 14 86") +
      path("M28 18 C18 42 38 56 28 86") +
      path("M58 22 H86") +
      path("M58 22 V50 H86 V22") +
      path("M68 50 V82") +
      path("M58 66 H86"),
    mei_plum:
      line(50, 10, 50, 48) +
      path("M24 34 L50 16 L76 34") +
      path("M28 48 L50 36 L72 48") +
      path("M36 56 L48 84") +
      path("M50 56 L62 84") +
      path("M64 56 L78 84") +
      path("M50 56 V64"),
    bai_cypress:
      line(50, 10, 50, 52) +
      path("M22 36 L50 16 L78 36") +
      path("M26 52 L50 38 L74 52") +
      path("M50 58 C36 70 40 84 50 86 C60 84 64 70 50 58") +
      path("M38 70 V90") +
      path("M62 70 L72 90"),
    he_what:
      path("M22 16c-7 18-12 38-10 70") +
      path("M22 16c8 16 16 32 28 50") +
      path("M58 26 H90") +
      path("M74 26 V70") +
      path("M58 70 H90"),
    gao:
      path("M28 14 H72 V36 H28 Z") +
      path("M36 36 V52") +
      path("M22 52 H78 V86 H22 Z") +
      line(22, 69, 78, 69, true),
    guo:
      path("M18 18 H50 V48 H18 Z") +
      path("M34 48 V78") +
      path("M22 78 H46") +
      path("M58 22 H86 V50 H58 Z") +
      path("M72 50 V82") +
      path("M62 82 H82"),
    hu_s:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 18 H86") +
      path("M58 18 V48") +
      path("M58 48 H86") +
      path("M68 48 V82") +
      path("M58 82 H86"),
    luo:
      path("M16 16 C44 28 44 56 16 72") +
      path("M16 16 V86") +
      path("M16 44 H40") +
      path("M58 20 H86 V48 H58 Z") +
      path("M72 48 V82") +
      path("M62 82 H82"),
    liang:
      path("M16 28 H46") +
      path("M16 50 H46") +
      path("M16 72 H46") +
      path("M58 18 L78 46") +
      path("M90 18 L78 46") +
      path("M62 58 H92") +
      path("M78 46 V86"),
    song_s:
      path("M18 16 H50 V42 H18 Z") +
      path("M26 42 L18 62") +
      path("M42 42 L50 62") +
      path("M62 20 H90") +
      path("M76 20 V52") +
      path("M62 52 H90") +
      path("M68 64 H84 V86 H68 Z"),
    tang:
      path("M18 20 H50") +
      path("M34 20 V48") +
      path("M18 48 H50") +
      path("M62 16 H90 V42 H62 Z") +
      path("M62 54 H90 V86 H62 Z") +
      line(62, 70, 90, 70, true),
    han_s:
      path("M16 16 H44 V46 H16 Z") +
      line(16, 31, 44, 31, true) +
      path("M62 18 H90") +
      path("M76 18 V48") +
      path("M62 48 H90") +
      path("M62 60 H90 V86 H62 Z"),
    cao_s:
      path("M22 14 H50") +
      path("M22 14 V48 H50 V14") +
      path("M62 18 H90") +
      path("M76 18 V50") +
      path("M62 50 H90") +
      path("M62 62 H90 V86 H62 Z"),
    zeng:
      path("M18 16 L32 42") +
      path("M46 16 L32 42") +
      path("M32 42 V58") +
      path("M20 58 H44 V84 H20 Z") +
      path("M58 20 H90") +
      path("M74 20 V50") +
      path("M58 50 H90") +
      path("M64 62 H84 V86 H64 Z"),
    peng_s:
      path("M18 38 L28 12 L38 38") +
      path("M42 38 L50 10 L58 38") +
      path("M62 38 L72 12 L82 38") +
      path("M28 50 H72") +
      path("M50 50 V86") +
      path("M34 68 H66"),
    xiao_s:
      path("M16 38 L26 12 L36 38") +
      path("M40 38 L50 10 L60 38") +
      path("M64 38 L74 12 L84 38") +
      path("M30 50 L50 86") +
      path("M50 52 L70 86") +
      path("M36 64 Q50 76 64 64"),
    lv:
      path("M22 16 H50 V42 H22 Z") +
      path("M36 42 V58") +
      path("M62 20 C82 28 84 56 66 68") +
      path("M28 70 H78") +
      path("M50 58 V88"),
    jiang_surname:
      path("M18 38 L28 12 L38 38") +
      path("M42 38 L50 10 L58 38") +
      path("M62 38 L72 12 L82 38") +
      path("M30 52 H70") +
      path("M36 52 V86") +
      path("M50 52 V86") +
      path("M64 52 V86") +
      path("M30 70 H70"),
    zhao_s:
      path("M16 22 H46") +
      path("M16 40 H46") +
      path("M16 58 H46") +
      path("M24 22 V84") +
      path("M38 58 L48 84") +
      path("M62 18 C90 30 90 70 62 84") +
      path("M62 18 C72 50 62 84 62 84"),
    feng_s:
      path("M22 16 C12 40 18 68 26 84") +
      path("M22 16 C44 8 58 32 46 50") +
      path("M62 20 H90") +
      path("M76 20 V52") +
      path("M62 52 H90") +
      path("M62 64 H90 V86 H62 Z"),
    deng:
      path("M18 16 H50 V42 H18 Z") +
      path("M26 42 L18 62") +
      path("M42 42 L50 62") +
      path("M62 18 L78 82") +
      path("M86 28 L78 82") +
      path("M68 48 H90"),
    cheng_s:
      path("M18 16 H50") +
      path("M34 16 V48") +
      path("M18 48 H50") +
      path("M26 60 H42 V86 H26 Z") +
      path("M58 22 H90") +
      path("M74 22 V50") +
      path("M58 50 H90") +
      path("M64 62 H84 V86 H64 Z"),
    wei_s:
      path("M16 16c-6 16-10 38-8 70") +
      path("M16 16c8 16 14 32 24 50") +
      path("M52 18 L64 46") +
      path("M80 18 L64 46") +
      path("M52 58 H88") +
      path("M70 46 V86") +
      path("M58 72 H82"),
    du:
      line(28, 10, 28, 90) +
      path("M10 36 L28 18 L46 36") +
      path("M14 88 L28 54 L42 88") +
      path("M58 20 H90") +
      path("M74 20 V50") +
      path("M58 50 H90") +
      path("M64 62 H84 V86 H64 Z"),
    pan:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M56 20 L70 48") +
      path("M88 20 L70 48") +
      path("M56 60 H88") +
      path("M72 48 V86"),
    yuan:
      path("M18 16 H48 V42 H18 Z") +
      path("M26 42 L18 62") +
      path("M40 42 L48 62") +
      path("M62 18 H90") +
      path("M62 18 V50 H90 V18") +
      path("M76 50 V84"),
    dong_s:
      path("M18 38 L28 12 L38 38") +
      path("M42 38 L50 10 L58 38") +
      path("M62 38 L72 12 L82 38") +
      path("M28 52 H72") +
      path("M50 52 V86") +
      path("M34 70 H66") +
      path("M28 86 H72"),
    su:
      path("M18 38 L28 12 L38 38") +
      path("M42 38 L50 10 L58 38") +
      path("M62 38 L72 12 L82 38") +
      path("M32 52 L50 88") +
      path("M50 54 L68 88") +
      path("M38 68 H62"),
    yao_s:
      path("M24 16c-12 16-14 36-6 54") +
      path("M24 16c14 14 16 34 8 54") +
      path("M10 40 H42") +
      path("M58 22 L76 50") +
      path("M90 22 L76 50") +
      path("M76 50 V84"),
    kong:
      path("M16 38 L50 12 L84 38") +
      path("M28 44 H72 V82 H28 Z") +
      line(50, 44, 50, 82, true) +
      line(28, 63, 72, 63, true),
    qin:
      path("M18 16 H50") +
      path("M34 16 V48") +
      path("M18 48 H50") +
      path("M26 60 H42 V86 H26 Z") +
      path("M62 20 C82 16 92 40 78 52") +
      path("M78 52 C64 64 76 84 90 80"),
    hou:
      path("M18 16c-6 18-10 38-8 70") +
      path("M18 16c8 16 14 32 24 50") +
      path("M56 18 L84 26 L76 86 L52 76 Z") +
      path("M84 26 L94 18"),
    meng:
      path("M18 18 H50 V46 H18 Z") +
      path("M26 46 L18 66") +
      path("M42 46 L50 66") +
      circle(74, 36, 14) +
      line(74, 50, 74, 70) +
      path("M62 62 H86") +
      path("M64 86 Q74 74 84 86"),
    lei:
      path("M18 16 H46 V44 H18 Z") +
      path("M54 16 H82 V44 H54 Z") +
      path("M18 56 H46 V84 H18 Z") +
      line(32, 16, 32, 44, true) +
      line(18, 30, 46, 30, true),
    qian_money:
      path("M22 18 H50 V46 H22 Z") +
      path("M36 46 V62") +
      path("M58 22 L70 50") +
      path("M86 22 L70 50") +
      path("M54 62 H90") +
      path("M70 50 V86"),
    jia_fine:
      path("M24 14c-12 16-14 36-6 54") +
      path("M24 14c14 14 16 34 8 54") +
      path("M10 40 H42") +
      path("M58 22 H90") +
      path("M74 22 V50") +
      path("M58 50 H90") +
      path("M64 62 H84 V86 H64 Z"),
    hui_wis:
      path("M18 16 H50") +
      path("M34 16 V46") +
      path("M18 46 H50") +
      path("M26 58 H42 V86 H26 Z") +
      path("M62 20 C82 28 84 56 66 68") +
      path("M50 86 C72 68 76 48 62 44 C90 48 92 72 70 86"),
    xiao_dawn:
      path("M18 16c-6 18-10 38-8 70") +
      path("M18 16c8 16 14 32 24 50") +
      circle(72, 36, 16) +
      line(62, 36, 82, 36, true) +
      path("M58 62 H86") +
      path("M72 52 V86"),
    yue_joy:
      path("M50 40 C22 24 18 56 50 72 C82 56 78 24 50 40") +
      line(50, 40, 50, 56, true) +
      path("M28 18 C40 8 52 18 50 30") +
      path("M72 18 C60 8 48 18 50 30"),
    hao_bright:
      circle(50, 28, 16) +
      line(40, 28, 60, 28, true) +
      path("M28 56 H72 V86 H28 Z") +
      line(50, 56, 50, 86, true) +
      line(28, 71, 72, 71, true),
    fei:
      path("M18 38 L28 12 L38 38") +
      path("M42 38 L50 10 L58 38") +
      path("M62 38 L72 12 L82 38") +
      path("M24 52 C16 70 28 88 50 86 C72 88 84 70 76 52") +
      path("M36 64 H64"),
    wen_cloud:
      path("M16 16 C8 40 26 54 16 86") +
      path("M32 18 C22 42 42 56 32 86") +
      path("M58 18 H86 V42 H58 Z") +
      path("M58 54 H86 V86 H58 Z") +
      line(58, 70, 86, 70, true),
  };

  function inner(key) {
    return G[key] || "";
  }

  function g(x, y, s, key) {
    return `<g transform="translate(${x} ${y}) scale(${s})">${inner(key)}</g>`;
  }

  function composeSide(left, right) {
    return g(0, 16, 0.48, left) + g(50, 16, 0.48, right);
  }

  function composeStack(top, bottom) {
    return g(16, 0, 0.48, top) + g(16, 50, 0.48, bottom);
  }

  function composeRoof(key) {
    return path("M14 40 L50 12 L86 40") + g(22, 38, 0.56, key);
  }

  function composeTriple(key) {
    return g(26, 0, 0.42, key) + g(2, 46, 0.42, key) + g(50, 46, 0.42, key);
  }

  const NAMED = {
    人: "ren", 大: "da", 天: "tian", 子: "zi", 女: "nv", 口: "kou",
    目: "mu_eye", 耳: "er", 手: "shou", 小: "xiao", 心: "xin",
    日: "ri", 月: "yue", 星: "xing", 雨: "yu_rain", 雲: "yun", 云: "yun",
    山: "shan", 川: "chuan", 水: "shui", 火: "huo", 土: "tu", 木: "mu",
    田: "tian_field", 禾: "he", 竹: "zhu", 草: "cao", 葉: "hua_leaf", 叶: "hua_leaf",
    石: "shi", 玉: "yu_jade", 魚: "yu_fish", 鱼: "yu_fish", 鳥: "niao", 鸟: "niao",
    馬: "ma", 马: "ma", 牛: "niu", 羊: "yang", 犬: "quan", 狗: "quan",
    虎: "hu", 龍: "long", 龙: "long", 龜: "gui", 龟: "gui",
    車: "che", 车: "che", 舟: "zhou", 門: "men", 门: "men",
    弓: "gong", 刀: "dao", 力: "li", 行: "xing_road",
    上: "shang", 下: "xia", 中: "zhong", 王: "wang", 卜: "bu", 兆: "zhao",
    文: "wen", 永: "yong", 光: "guang", 年: "nian", 春: "chun", 冬: "dong",
    東: "dong_east", 西: "xi", 南: "nan", 北: "bei_dir", 風: "feng", 风: "feng",
    泉: "quan_spring", 金: "jin", 白: "bai", 丁: "ding", 于: "yu_flute", 余: "yu_i",
    周: "zhou_field", 朱: "zhu_red", 夏: "xia_dance", 立: "li_stand",
    品: "pin", 卉: "hui", 晶: "jing_star", 昌: "chang", 昊: "hao_sky",
    升: "sheng", 成: "cheng", 君: "jun", 承: "cheng_hold", 啟: "qi_open", 启: "qi_open",
    言: "yan", 福: "fu", 德: "de", 齊: "qi_even", 齐: "qi_even", 辰: "chen_shell",
    樂: "yue_music", 乐: "yue_music", 鹿: "lu", 兔: "tu_rabbit",
    燕: "yan_bird", 鳳: "feng_bird", 凤: "feng_bird", 麗: "li_deer", 丽: "li_deer",
    學: "xue", 学: "xue", 友: "you_friend", 朋: "peng", 美: "mei_beauty",
    黃: "huang", 黄: "huang", 吳: "wu", 吴: "wu", 平: "ping", 康: "kang",
    寧: "ning", 宁: "ning", 信: "xin_trust", 義: "yi_right", 义: "yi_right",
    勇: "yong_brave", 智: "zhi_wis", 華: "hua_flower", 华: "hua_flower",
    桃: "tao", 花: "hua_later", 冰: "ice", 雪: "xue_snow", 鶴: "he_crane", 鹤: "he_crane",
    愛: "ai", 爱: "ai", 真: "zhen", 思: "si_think", 書: "shu", 书: "shu",
    畫: "hua_draw", 画: "hua_draw", 冠: "guan", 予: "yu_give", 芯: "xin_core",
    梓: "zi_catalpa", 善: "shan_good", 仁: "ren_kind", 宏: "hong", 彥: "yan_talent", 彦: "yan_talent",
    妍: "yan_pretty", 玥: "yue_pearl", 旻: "min_sky", 宥: "you_forgive",
    謙: "qian", 谦: "qian", 靜: "jing_quiet", 静: "jing_quiet", 雅: "ya",
    博: "bo", 澤: "ze", 泽: "ze", 霖: "lin_rain", 浩: "hao_vast",
    瑞: "rui", 祥: "xiang", 恩: "en", 慈: "ci", 志: "zhi_will", 豪: "hao_hero",
    翔: ["side", "yang", "yu_feather"],
    萱: "xuan", 穎: "ying", 颖: "ying", 睿: "rui_wise",
    瑜: "yu_gem", 琳: "lin_jade", 琪: "qí_jade", 瑤: "yao", 瑶: "yao",
    珍: "zhen_gem", 珠: "zhu_pearl", 宇: "yu_eaves", 軒: "xuan_cart", 轩: "xuan_cart",
    涵: "han", 詩: "shi_poem", 诗: "shi_poem", 晴: "qing_sun",
    陽: "yang_sun", 阳: "yang_sun", 晨: "chen_morn", 嘉: "jia_good",
    欣: "xin_joy", 怡: "yi_calm", 婷: "ting", 傑: "jie", 杰: "jie",
    芳: "fang", 強: "qiang", 强: "qiang", 偉: "wei", 伟: "wei",
    禮: "li_etiquette", 礼: "li_etiquette", 和: "he_peace",
    陳: "chen_mound", 陈: "chen_mound", 劉: "liu", 刘: "liu",
    楊: "yang_tree", 杨: "yang_tree", 蔡: "cai", 許: "xu", 许: "xu",
    謝: "xie", 谢: "xie", 鄭: "zheng", 郑: "zheng", 徐: "xu_slow",
    孫: "sun_child", 孙: "sun_child", 姜: "jiang", 沈: "shen", 汪: "wang_water",
    江: "jiang_river", 海: "hai", 清: "qing_water", 溪: "xi_stream", 湖: "hu_lake",
    松: "song", 梅: "mei_plum", 柏: "bai_cypress", 蘭: "lan", 兰: "lan", 菊: "ju",
    林: ["side", "mu", "mu"],
    森: ["triple", "mu"],
    明: ["side", "ri", "yue"],
    好: ["side", "nv", "zi"],
    安: ["roof", "nv"],
    家: ["roof", "shi_pig"],
    秋: ["side", "he", "huo"],
    李: ["stack", "mu", "zi"],
    張: ["side", "gong", "ren"], 张: ["side", "gong", "ren"],
    河: "he_river",
    何: "he_what", 高: "gao", 郭: "guo", 胡: "hu_s", 羅: "luo", 罗: "luo",
    梁: "liang", 宋: "song_s", 唐: "tang", 韓: "han_s", 韩: "han_s",
    曹: "cao_s", 曾: "zeng", 彭: "peng_s", 蕭: "xiao_s", 萧: "xiao_s",
    呂: "lv", 吕: "lv", 蔣: "jiang_surname", 蒋: "jiang_surname",
    趙: "zhao_s", 赵: "zhao_s", 馮: "feng_s", 冯: "feng_s",
    鄧: "deng", 邓: "deng", 程: "cheng_s", 魏: "wei_s", 杜: "du",
    潘: "pan", 袁: "yuan", 董: "dong_s", 蘇: "su", 苏: "su",
    姚: "yao_s", 孔: "kong", 秦: "qin", 侯: "hou", 孟: "meng", 雷: "lei",
    錢: "qian_money", 钱: "qian_money",
    佳: "jia_fine", 慧: "hui_wis", 曉: "xiao_dawn", 晓: "xiao_dawn",
    悅: "yue_joy", 悦: "yue_joy", 皓: "hao_bright", 菲: "fei", 雯: "wen_cloud",
  };

  function renderSpec(spec) {
    if (!spec) return "";
    if (typeof spec === "string") return inner(spec);
    const kind = spec[0];
    if (kind === "side") return composeSide(spec[1], spec[2]);
    if (kind === "stack") return composeStack(spec[1], spec[2]);
    if (kind === "roof") return composeRoof(spec[1]);
    if (kind === "triple") return composeTriple(spec[1]);
    return "";
  }

  function getGlyph(char) {
    const markup = renderSpec(NAMED[char]);
    return markup ? wrap(markup) : "";
  }

  function hasGlyph(char) {
    return Boolean(NAMED[char] && renderSpec(NAMED[char]));
  }

  root.JiaguGlyphs = { getGlyph, hasGlyph };
})(window);
