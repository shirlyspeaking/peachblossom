(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.RuShiGrade = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var PAIRS = [
    ["荆", "荊"], ["说", "說"], ["为", "為"], ["无", "無"], ["后", "後"], ["于", "於"],
    ["着", "著"], ["吓", "嚇"], ["么", "麼"], ["这", "這"], ["国", "國"], ["门", "門"],
    ["见", "見"], ["来", "來"], ["还", "還"], ["对", "對"], ["从", "從"], ["离", "離"],
    ["开", "開"], ["听", "聽"], ["识", "識"], ["称", "稱"], ["谓", "謂"], ["庆", "慶"],
    ["卫", "衛"], ["剑", "劍"], ["术", "術"], ["劝", "勸"], ["与", "與"], ["会", "會"],
    ["乐", "樂"], ["泪", "淚"], ["过", "過"], ["儿", "兒"], ["应", "應"], ["经", "經"],
    ["当", "當"], ["实", "實"], ["给", "給"], ["结", "結"], ["发", "發"], ["声", "聲"],
    ["边", "邊"], ["时", "時"], ["间", "間"], ["问", "問"], ["请", "請"], ["没", "沒"],
    ["别", "別"], ["样", "樣"], ["种", "種"], ["话", "話"], ["语", "語"], ["认", "認"],
    ["欢", "歡"], ["爱", "愛"], ["亲", "親"], ["难", "難"], ["虽", "雖"], ["尽", "盡"],
    ["并", "並"], ["个", "個"], ["够", "夠"], ["仅", "僅"], ["须", "須"], ["罢", "罷"],
    ["迁", "遷"], ["让", "讓"], ["却", "卻"], ["东", "東"], ["关", "關"], ["万", "萬"],
    ["与", "與"], ["云", "雲"], ["里", "裡"]
  ];

  function norm(value) {
    var text = String(value || "").replace(/\s+/g, "");
    text = text.replace(/[，。、！？「」『』（）()・…,.!?:：；;“”"‘’'【】《》\-—~～]/g, "");
    PAIRS.forEach(function (pair) {
      text = text.split(pair[0]).join(pair[1]);
    });
    return text;
  }

  function grade(puzzle, raw) {
    var text = norm(raw);
    if (!text) return { ok: false, reason: "empty" };

    var original = norm(puzzle.original);
    if (original && text.indexOf(original) !== -1) {
      return { ok: false, reason: "copy" };
    }

    var cleaned = text;
    (puzzle.strip || []).forEach(function (phrase) {
      cleaned = cleaned.split(norm(phrase)).join("");
    });
    var rejected = (puzzle.reject || []).some(function (phrase) {
      return cleaned.indexOf(norm(phrase)) !== -1;
    });
    if (rejected) return { ok: false, reason: "reject" };

    var traps = puzzle.traps || [];
    for (var i = 0; i < traps.length; i += 1) {
      var trap = traps[i];
      if (trap.re.test(text) && !(trap.unless && trap.unless.test(text))) {
        return { ok: false, reason: "trap", senseId: trap.id };
      }
    }

    var senses = puzzle.senses || [];
    var hits = 0;
    var missed = null;
    for (var j = 0; j < senses.length; j += 1) {
      if (senses[j].re.test(text)) hits += 1;
      else if (!missed) missed = senses[j].id;
    }
    var score = senses.length ? Math.round((100 * hits) / senses.length) : 0;
    if (score >= 80) return { ok: true, reason: "ok", score: score };
    return { ok: false, reason: "miss", senseId: missed, score: score };
  }

  return { norm: norm, grade: grade };
});
