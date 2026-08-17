(function () {
  const form = document.getElementById("nameForm");
  const input = document.getElementById("nameInput");
  const status = document.getElementById("status");
  const ritual = document.getElementById("ritual");
  const shellStage = document.getElementById("shellStage");
  const shellName = document.getElementById("shellName");
  const results = document.getElementById("results");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parseName(raw) {
    const chars = Array.from((raw || "").trim());
    const cjk = chars.filter((ch) => JiaguChars.isCjk(ch));
    return cjk.slice(0, 6);
  }

  function glyphMarkup(entry) {
    const svg = JiaguGlyphs.getGlyph(entry.char, entry.glyph);
    if (svg) return svg;
    return `<span class="fallback-glyph">${entry.char}</span>`;
  }

  function render(entries) {
    shellName.innerHTML = entries
      .map(
        (entry) => `
        <div class="shell-glyph">
          ${glyphMarkup(entry)}
          <span class="modern">${entry.char}</span>
        </div>`
      )
      .join("");

    results.innerHTML = entries
      .map(
        (entry) => `
        <article class="shard">
          <div class="shard-head">
            <div class="glyph-frame">${glyphMarkup(entry)}</div>
            <div class="char-meta">
              <span class="modern-char">${entry.char}</span>
              <span class="pinyin">${entry.pinyin || " "}</span>
              <span class="badge ${entry.era}">${entry.eraMeta.label}</span>
            </div>
          </div>
          <p class="meaning">${entry.meaning}</p>
          <p class="era-note">${entry.eraMeta.note}</p>
          <p class="story">${entry.story}</p>
        </article>`
      )
      .join("");

    shellStage.classList.add("is-on");
    results.classList.add("is-on");
  }

  function clearView() {
    shellStage.classList.remove("is-on");
    results.classList.remove("is-on");
    shellName.innerHTML = "";
    results.innerHTML = "";
  }

  function search(name) {
    const chars = parseName(name);
    status.textContent = "";
    clearView();

    if (!name.trim()) {
      status.textContent = "先寫下一個名字吧。";
      input.focus();
      return;
    }
    if (!chars.length) {
      status.textContent = "請輸入中文名字，例如「小雨」。";
      return;
    }

    const entries = chars.map((ch) => JiaguChars.lookup(ch));
    ritual.classList.add("is-on");
    ritual.setAttribute("aria-hidden", "false");

    const wait = reduceMotion ? 0 : 1100;
    window.setTimeout(() => {
      ritual.classList.remove("is-on");
      ritual.setAttribute("aria-hidden", "true");
      render(entries);
      const missing = entries.filter((e) => !e.found).length;
      if (missing) {
        status.textContent = missing === entries.length
          ? "這些字還沒收進小字典，但你仍可以看它們現在的樣子。"
          : "有些字已找到古老圖畫，有些是後來才造的，正好一起比較。";
      } else {
        status.textContent = "找到了。點下面每一塊「甲骨」，讀讀它的小故事。";
      }
    }, wait);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    search(input.value);
  });

  document.querySelectorAll(".chips [data-name]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.name;
      search(btn.dataset.name);
    });
  });
})();
