(function () {
    'use strict';

    /* ---- Theme Picker ---- */
    var themeDots = document.querySelectorAll('.theme-dot');
    var THEME_KEY = 'copybook-theme';

    function applyTheme(name) {
        document.body.setAttribute('data-theme', name);
        themeDots.forEach(function (dot) {
            dot.classList.toggle('active', dot.getAttribute('data-theme') === name);
        });
        try { localStorage.setItem(THEME_KEY, name); } catch (_) {}
    }

    (function initTheme() {
        var saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
        applyTheme(saved || 'pink');
    })();

    themeDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            applyTheme(dot.getAttribute('data-theme'));
        });
    });

    /* ---- Controls ---- */
    var textInput = document.getElementById('textInput');
    var btnGenerate = document.getElementById('btnGenerate');
    var autoStrokeChars = document.getElementById('autoStrokeChars');
    var btnAutoStrokeFromChars = document.getElementById('btnAutoStrokeFromChars');
    var fontPreset = document.getElementById('fontPreset');
    var gridType = document.getElementById('gridType');
    var copyStyle = document.getElementById('copyStyle');
    var fontSize = document.getElementById('fontSize');
    var lineHeight = document.getElementById('lineHeight');
    var pageSize = document.getElementById('pageSize');
    var charsPerLine = document.getElementById('charsPerLine');
    var linesPerPage = document.getElementById('linesPerPage');
    var preview = document.getElementById('preview');
    var btnPrint = document.getElementById('btnPrint');
    var btnPdf = document.getElementById('btnPdf');
    var btnPng = document.getElementById('btnPng');
    var btnChenyuFont = document.getElementById('btnChenyuFont');
    var pageBackground = document.getElementById('pageBackground');
    var cellBackground = document.getElementById('cellBackground');

    var debounceTimer = null;
    var DEBOUNCE_MS = 320;

    /** 筆畫分解描紅：每格一筆（path），由 hanzi-writer-data 提供 SVG path */
    var strokePathLayout = null;

    /**
     * hanzi-writer path 外層縱向平移（數值愈小（愈負）則字形愈偏上）。
     */
    var STROKE_PATH_TRANSLATE_Y = -46;

    /**
     * 僅筆順第一格樣例字：在 path 共用平移上再下移（正值＝視覺下移），不影響累進格。
     */
    var STROKE_SAMPLE_TRANSLATE_EXTRA_Y = 14;

    function setStatus() {}

    function escapeSvgText(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeSvgAttr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    /**
     * 描紅：SVG 空心字（fill=none + 實線 stroke），字心鏤空、格線可透出；
     * 比 -webkit-text-stroke 跨瀏覽器與 html2canvas 匯出更穩定。
     */
    function buildHongSvgChar(ch, fontFamily, fs) {
        var fontSizeU = Math.min(78, Math.max(44, Math.round(50 + (fs - 24) * 0.72)));
        var strokeWU = Math.max(0.7, Math.min(2.4, fontSizeU / 38));
        var ff = escapeSvgAttr(fontFamily);
        var body = escapeSvgText(ch);
        var attrs =
            'x="50" y="54" font-size="' + fontSizeU + '" font-family="' + ff + '" ' +
            'text-anchor="middle" dominant-baseline="middle" ' +
            'fill="none" stroke="rgb(210, 70, 88)" stroke-opacity="0.95" ' +
            'stroke-width="' + strokeWU.toFixed(2) + '" stroke-linejoin="round" stroke-linecap="round"';
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" ' +
            'width="100%" height="100%" aria-hidden="true" focusable="false">' +
            '<text ' + attrs + '>' + body + '</text></svg>'
        );
    }

    /**
     * 淺粉色描紅：SVG 實心字（fill + stroke=none），與紅色鏤空描紅區隔；
     * 列印／html2canvas 與紅色描紅同樣穩定。
     */
    function buildLightPinkSolidSvgChar(ch, fontFamily, fs) {
        var fontSizeU = Math.min(78, Math.max(44, Math.round(50 + (fs - 24) * 0.72)));
        var ff = escapeSvgAttr(fontFamily);
        var body = escapeSvgText(ch);
        var attrs =
            'x="50" y="54" font-size="' + fontSizeU + '" font-family="' + ff + '" ' +
            'text-anchor="middle" dominant-baseline="middle" ' +
            'fill="rgb(224, 122, 158)" fill-opacity="0.98" stroke="none"';
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" ' +
            'width="100%" height="100%" aria-hidden="true" focusable="false">' +
            '<text ' + attrs + '>' + body + '</text></svg>'
        );
    }

    function buildReferenceFontSvgChar(ch, fontFamily, fs) {
        var fontSizeU = Math.min(80, Math.max(46, Math.round(54 + (fs - 24) * 0.72)));
        var ff = escapeSvgAttr(fontFamily);
        var body = escapeSvgText(ch);
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" ' +
            'width="100%" height="100%" aria-hidden="true" focusable="false">' +
            '<text x="50" y="54" font-size="' +
            fontSizeU +
            '" font-family="' +
            ff +
            '" text-anchor="middle" dominant-baseline="middle" fill="#2f2a28">' +
            body +
            '</text></svg>'
        );
    }

    /**
     * 筆順第一格樣例：一律黑色實心；版型與 buildStrokePathsSvg 同 viewBox／縱向平移，字級對齊 path。
     */
    function buildStrokeWorksheetSampleSvg(ch, fontFamily, fs) {
        var vb = '0 0 1024 1024';
        var ty = STROKE_PATH_TRANSLATE_Y + STROKE_SAMPLE_TRANSLATE_EXTRA_Y;
        var ff = escapeSvgAttr(fontFamily);
        var body = escapeSvgText(ch);
        var fsN = fs || 36;
        var fz = Math.round(Math.max(688, Math.min(806, 726 + (fsN - 36) * 2.35)));
        var yTxt = 550;
        var textAttrs = 'fill="#1a1719" stroke="none"';
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
            vb +
            '" preserveAspectRatio="xMidYMid meet" ' +
            'width="100%" height="100%" aria-hidden="true" focusable="false">' +
            '<g transform="translate(0,' +
            ty +
            ')">' +
            '<text x="512" y="' +
            yTxt +
            '" font-size="' +
            fz +
            '" font-family="' +
            ff +
            '" text-anchor="middle" dominant-baseline="middle" ' +
            textAttrs +
            '>' +
            body +
            '</text></g></svg>'
        );
    }

    /**
     * 筆順累進格：path 樣式與「字帖版本」一致（描紅空心／淺粉實心／標準實心），筆畫略加粗便於辨識。
     */
    function buildStrokePathsSvg(pathDs, fs, hongMode, lightPinkHongMode) {
        var vb = '0 0 1024 1024';
        var sw = Math.max(15, Math.min(54, Math.round(((fs || 36) + 4) * 0.85)));
        var ty = STROKE_PATH_TRANSLATE_Y;
        var parts = '';
        var i;
        if (hongMode) {
            for (i = 0; i < pathDs.length; i++) {
                parts +=
                    '<path d="' +
                    escapeSvgAttr(pathDs[i]) +
                    '" fill="none" stroke="rgb(210, 70, 88)" stroke-opacity="0.96" stroke-width="' +
                    sw +
                    '" stroke-linecap="round" stroke-linejoin="round"/>';
            }
        } else if (lightPinkHongMode) {
            var pc = 'rgb(224, 122, 158)';
            var ow = Math.max(12, Math.round(sw * 0.48));
            for (i = 0; i < pathDs.length; i++) {
                parts +=
                    '<path d="' +
                    escapeSvgAttr(pathDs[i]) +
                    '" fill="' +
                    pc +
                    '" fill-opacity="1" fill-rule="nonzero" stroke="' +
                    pc +
                    '" stroke-opacity="1" stroke-width="' +
                    ow +
                    '" stroke-linecap="round" stroke-linejoin="round"/>';
            }
        } else {
            var dk = '#2a2428';
            var dow = Math.max(12, Math.round(sw * 0.48));
            for (i = 0; i < pathDs.length; i++) {
                parts +=
                    '<path d="' +
                    escapeSvgAttr(pathDs[i]) +
                    '" fill="' +
                    dk +
                    '" fill-opacity="1" fill-rule="nonzero" stroke="' +
                    dk +
                    '" stroke-opacity="1" stroke-width="' +
                    dow +
                    '" stroke-linecap="round" stroke-linejoin="round"/>';
            }
        }
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
            vb +
            '" preserveAspectRatio="xMidYMid meet" ' +
            'width="100%" height="100%" aria-hidden="true" focusable="false">' +
            '<g transform="translate(0,' +
            ty +
            ')">' +
            '<g transform="translate(512,512) scale(0.86,-0.86) translate(-512,-512)">' +
            parts +
            '</g>' +
            '</g>' +
            '</svg>'
        );
    }

    function getFontFamily() {
        return fontPreset.value.trim();
    }

    function parseHanziChars(text) {
        var out = [];
        var chars = stringToChars(String(text || '').trim());
        for (var i = 0; i < chars.length; i++) {
            var ch = chars[i];
            if (!/[\u3400-\u9FFF\uF900-\uFAFF]/.test(ch)) continue;
            out.push(ch);
        }
        return out;
    }

    function clearStrokePathLayout() {
        strokePathLayout = null;
    }

    async function fetchHanziWriterData(ch) {
        var url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(ch) + '.json';
        var res = await fetch(url, { cache: 'force-cache' });
        if (!res.ok) throw new Error('找不到「' + ch + '」的筆畫資料（字庫無此字）');
        var data = await res.json();
        if (!data || !Array.isArray(data.strokes) || data.strokes.length === 0) {
            throw new Error('「' + ch + '」筆畫資料不完整');
        }
        return data;
    }

    async function buildStrokePathLayoutRows(chars) {
        var blocks = [];
        var totalCells = 0;
        for (var ci = 0; ci < chars.length; ci++) {
            var ch = chars[ci];
            var data = await fetchHanziWriterData(ch);
            var strokes = data.strokes;
            var cells = [{ kind: 'ref', ch: ch, total: strokes.length, pathDs: strokes }];
            for (var si = 0; si < strokes.length; si++) {
                cells.push({
                    kind: 'stroke',
                    ch: ch,
                    index: si + 1,
                    total: strokes.length,
                    pathDs: strokes.slice(0, si + 1)
                });
            }
            totalCells += cells.length;
            blocks.push(cells);
        }

        // 筆順字帖固定一行一字，避免不同字同列造成閱讀干擾
        var charsPerRow = 1;
        var rows = [];
        var maxCols = 1;

        for (var i = 0; i < blocks.length; i += charsPerRow) {
            var rowBlocks = blocks.slice(i, i + charsPerRow);
            var rowCells = [];
            for (var bi = 0; bi < rowBlocks.length; bi++) {
                if (bi > 0) rowCells.push({ kind: 'blank' });
                rowCells = rowCells.concat(rowBlocks[bi]);
            }
            if (rowCells.length > maxCols) maxCols = rowCells.length;
            rows.push(rowCells);
        }

        return { rows: rows, cpl: maxCols, charsPerRow: charsPerRow };
    }

    function applyStrokePathDefaults() {
        if (gridType) gridType.value = 'tian';
        if (fontSize) fontSize.value = '40';
        if (lineHeight) lineHeight.value = '1.15';
        if (charsPerLine) charsPerLine.value = '1';
        if (linesPerPage) linesPerPage.value = '10';
    }

    function chunkLayoutRows(rows, lpp) {
        var n = Math.max(1, Math.min(20, parseInt(lpp, 10) || 12));
        var pages = [];
        for (var i = 0; i < rows.length; i += n) {
            pages.push(rows.slice(i, i + n));
        }
        return pages;
    }

    async function onAutoStrokeFromChars() {
        var chars = parseHanziChars(autoStrokeChars ? autoStrokeChars.value : '');
        if (!chars.length) {
            window.alert('請先輸入至少一個漢字');
            return;
        }
        if (btnAutoStrokeFromChars) btnAutoStrokeFromChars.disabled = true;
        try {
            var layout = await buildStrokePathLayoutRows(chars);
            strokePathLayout = { rows: layout.rows, cpl: layout.cpl };
            if (textInput) textInput.value = '';
            applyStrokePathDefaults();
            if (charsPerLine) charsPerLine.value = String(layout.charsPerRow);
            renderNow();
        } catch (e) {
            window.alert('筆畫拆解失敗：' + (e.message || String(e)));
        } finally {
            if (btnAutoStrokeFromChars) btnAutoStrokeFromChars.disabled = false;
        }
    }

    /** 保留換行；每個半形空格對應字帖一格（不併格、不刪行尾空格）；Tab 轉為單一空格 */
    function normalizeText(raw) {
        return String(raw)
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\t/g, ' ');
    }

    /** 將文字切成排版用「行」，每行最多 cpl 字；空行保留為一列空白行 */
    function buildRows(text, cpl) {
        var lines = text.split('\n');
        var rows = [];
        var c = Math.max(1, Math.min(20, parseInt(cpl, 10) || 12));

        for (var li = 0; li < lines.length; li++) {
            var line = lines[li];
            if (line.length === 0) {
                rows.push('');
                continue;
            }
            var pts = stringToChars(line);
            for (var i = 0; i < pts.length; i += c) {
                rows.push(pts.slice(i, i + c).join(''));
            }
        }
        if (rows.length === 0) {
            rows.push('');
        }
        return rows;
    }

    function stringToChars(s) {
        var arr = [];
        var i = 0;
        while (i < s.length) {
            var cp = s.codePointAt(i);
            var ch = String.fromCodePoint(cp);
            arr.push(ch);
            i += ch.length;
        }
        return arr;
    }

    function padRowToLength(rowStr, cpl) {
        var out = rowStr.length ? stringToChars(rowStr) : [];
        while (out.length < cpl) {
            out.push('');
        }
        return out.slice(0, cpl);
    }

    function chunkPages(rows, lpp) {
        var n = Math.max(1, Math.min(20, parseInt(lpp, 10) || 12));
        var pages = [];
        for (var i = 0; i < rows.length; i += n) {
            pages.push(rows.slice(i, i + n));
        }
        return pages;
    }

    function cellClassForGrid(type) {
        if (type === 'mi') return 'cell mi';
        if (type === 'blank') return 'cell blank';
        return 'cell tian';
    }

    function render() {
        var t0 = typeof performance !== 'undefined' ? performance.now() : 0;
        var raw = textInput.value;
        var text = normalizeText(raw);
        var cpl = Math.max(1, Math.min(20, parseInt(charsPerLine.value, 10) || 12));
        var lpp = Math.max(1, Math.min(20, parseInt(linesPerPage.value, 10) || 12));
        var fsMin = parseInt(fontSize.getAttribute('min'), 10);
        var fsMax = parseInt(fontSize.getAttribute('max'), 10);
        if (!Number.isFinite(fsMin)) fsMin = 18;
        if (!Number.isFinite(fsMax)) fsMax = 72;
        var fs = parseInt(String(fontSize.value).trim(), 10);
        if (!Number.isFinite(fs)) fs = 36;
        fs = Math.max(fsMin, Math.min(fsMax, fs));

        var lhMin = parseFloat(lineHeight.getAttribute('min'));
        var lhMax = parseFloat(lineHeight.getAttribute('max'));
        if (!Number.isFinite(lhMin)) lhMin = 1;
        if (!Number.isFinite(lhMax)) lhMax = 2.5;
        var lh = parseFloat(String(lineHeight.value).trim().replace(',', '.'));
        if (!Number.isFinite(lh)) lh = 1.15;
        lh = Math.max(lhMin, Math.min(lhMax, lh));
        var gtype = gridType.value;
        var psize = pageSize.value;
        var font = getFontFamily();
        var hongMode =
            copyStyle &&
            (copyStyle.value === 'hong' || copyStyle.value === 'trace');
        var lightPinkHongMode = copyStyle && copyStyle.value === 'lightPinkHong';

        var useStrokePaths =
            strokePathLayout && strokePathLayout.rows && strokePathLayout.rows.length > 0;

        var rows;
        var pages;
        if (useStrokePaths) {
            pages = chunkLayoutRows(strokePathLayout.rows, lpp);
        } else {
            rows = buildRows(text, cpl);
            pages = chunkPages(rows, lpp);
        }

        preview.innerHTML = '';
        var rawBg = pageBackground && pageBackground.value ? pageBackground.value : 'none';
        var rawCellBg = cellBackground && cellBackground.value ? cellBackground.value : 'white';
        var bgVal =
            rawBg === 'xuan' ||
            rawBg === 'letter' ||
            rawBg === 'scroll' ||
            rawBg === 'redLines' ||
            rawBg === 'cloud'
                ? rawBg
                : 'none';
        var cellBgVal =
            rawCellBg === 'translucent' || rawCellBg === 'transparent' ? rawCellBg : 'white';
        preview.className =
            'preview preview--' +
            psize +
            (hongMode || lightPinkHongMode ? ' preview--hong' : '') +
            (lightPinkHongMode ? ' preview--light-pink-hong' : '') +
            (bgVal !== 'none' ? ' preview--bg-' + bgVal : '') +
            ' preview--cellbg-' +
            cellBgVal;

        for (var p = 0; p < pages.length; p++) {
            var pageRows = pages[p];
            var pageEl = document.createElement('div');
            pageEl.className = 'page';
            pageEl.setAttribute('data-page-index', String(p + 1));

            var title = document.createElement('div');
            title.className = 'page-title';
            title.textContent = '第 ' + (p + 1) + ' 頁 / 共 ' + pages.length + ' 頁';
            pageEl.appendChild(title);

            for (var r = 0; r < pageRows.length; r++) {
                var grid = document.createElement('div');
                grid.className = 'grid';
                var cellSize = Math.max(Math.round(fs * lh), fs + 8);

                if (useStrokePaths) {
                    var layoutCpl = strokePathLayout.cpl || 1;
                    var rowCells = pageRows[r] || [];
                    grid.style.gridTemplateColumns = 'repeat(' + layoutCpl + ', ' + cellSize + 'px)';
                    grid.style.gridTemplateRows = cellSize + 'px';

                    for (var sc = 0; sc < layoutCpl; sc++) {
                        var item = rowCells[sc] || { kind: 'blank' };
                        var cell = document.createElement('div');
                        cell.className = cellClassForGrid(gtype);
                        cell.style.width = cellSize + 'px';
                        cell.style.minWidth = cellSize + 'px';
                        cell.style.height = cellSize + 'px';
                        cell.style.minHeight = cellSize + 'px';
                        if (sc === layoutCpl - 1) cell.classList.add('col-last');
                        if (r === pageRows.length - 1) cell.classList.add('row-last');

                        var innerSp = document.createElement('span');
                        innerSp.style.fontSize = fs + 'px';
                        innerSp.style.lineHeight = String(lh);
                        innerSp.style.fontFamily = font;
                        if (item.kind === 'blank') {
                            innerSp.className = 'cell-inner';
                            innerSp.innerHTML = '&nbsp;';
                        } else if (item.kind === 'ref') {
                            innerSp.className = 'cell-inner cell-inner--hong stroke-worksheet-char';
                            innerSp.innerHTML = buildStrokeWorksheetSampleSvg(item.ch, font, fs);
                        } else if (item.kind === 'stroke') {
                            innerSp.className = 'cell-inner cell-inner--hong stroke-worksheet-char';
                            innerSp.innerHTML = buildStrokePathsSvg(
                                item.pathDs,
                                fs,
                                hongMode,
                                lightPinkHongMode
                            );
                        } else {
                            innerSp.className = 'cell-inner';
                            innerSp.innerHTML = '&nbsp;';
                        }
                        cell.appendChild(innerSp);
                        grid.appendChild(cell);
                    }
                } else {
                    var rowStr = pageRows[r];
                    var chars = padRowToLength(rowStr, cpl);
                    grid.style.gridTemplateColumns = 'repeat(' + cpl + ', ' + cellSize + 'px)';
                    grid.style.gridTemplateRows = cellSize + 'px';

                    for (var c = 0; c < chars.length; c++) {
                        var ch = chars[c];
                        var cell2 = document.createElement('div');
                        cell2.className = cellClassForGrid(gtype);
                        cell2.style.width = cellSize + 'px';
                        cell2.style.minWidth = cellSize + 'px';
                        cell2.style.height = cellSize + 'px';
                        cell2.style.minHeight = cellSize + 'px';

                        var isLastCol = c === cpl - 1;
                        var isLastRow = r === pageRows.length - 1;
                        if (isLastCol) cell2.classList.add('col-last');
                        if (isLastRow) cell2.classList.add('row-last');

                        var inner = document.createElement('span');
                        inner.className = 'cell-inner';
                        inner.style.fontSize = fs + 'px';
                        inner.style.lineHeight = String(lh);
                        inner.style.fontFamily = font;
                        if (ch === ' ') {
                            inner.innerHTML = '&nbsp;';
                        } else if (ch === '') {
                            inner.innerHTML = '&nbsp;';
                        } else if (hongMode) {
                            inner.className = 'cell-inner cell-inner--hong';
                            inner.innerHTML = buildHongSvgChar(ch, font, fs);
                        } else if (lightPinkHongMode) {
                            inner.className = 'cell-inner cell-inner--hong';
                            inner.innerHTML = buildLightPinkSolidSvgChar(ch, font, fs);
                        } else {
                            inner.textContent = ch;
                        }
                        cell2.appendChild(inner);
                        grid.appendChild(cell2);
                    }
                }
                pageEl.appendChild(grid);
            }
            preview.appendChild(pageEl);
        }

        if (typeof performance !== 'undefined') {
            var ms = performance.now() - t0;
            setStatus('已更新 · ' + pages.length + ' 頁（約 ' + ms.toFixed(0) + ' ms）');
        } else {
            setStatus('已更新 · ' + pages.length + ' 頁');
        }
    }

    function scheduleRender() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            try {
                render();
            } catch (e) {
                setStatus('排版錯誤：' + (e.message || String(e)));
            }
        }, DEBOUNCE_MS);
    }

    function renderNow() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        try {
            render();
        } catch (e) {
            setStatus('排版錯誤：' + (e.message || String(e)));
        }
    }

    function downloadBlob(filename, blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () {
            URL.revokeObjectURL(a.href);
        }, 2000);
    }

    function canvasToBlob(canvas) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (b) {
                if (b) resolve(b);
                else reject(new Error('無法產生圖片'));
            }, 'image/png');
        });
    }

    async function capturePageElements(pageEls, scale) {
        var s = scale || 2;
        var blobs = [];
        for (var i = 0; i < pageEls.length; i++) {
            setStatus('繪製第 ' + (i + 1) + ' 頁…');
            var canvas = await window.html2canvas(pageEls[i], {
                scale: s,
                useCORS: true,
                backgroundColor: null,
                logging: false
            });
            blobs.push(await canvasToBlob(canvas));
        }
        return blobs;
    }

    async function onPng() {
        if (!window.html2canvas) {
            setStatus('缺少 html2canvas，無法匯出 PNG');
            return;
        }
        var pages = preview.querySelectorAll('.page');
        if (!pages.length) {
            setStatus('沒有可匯出的內容');
            return;
        }
        btnPng.disabled = true;
        try {
            var blobs = await capturePageElements(pages, 2);
            if (blobs.length === 1) {
                downloadBlob('字帖.png', blobs[0]);
            } else {
                for (var i = 0; i < blobs.length; i++) {
                    downloadBlob('字帖-' + (i + 1) + '.png', blobs[i]);
                }
            }
            setStatus('已下載 PNG（' + blobs.length + ' 個檔案）');
        } catch (e) {
            setStatus('PNG 失敗：' + (e.message || String(e)));
        } finally {
            btnPng.disabled = false;
        }
    }

    async function onPdf() {
        if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
            setStatus('缺少 html2canvas 或 jsPDF');
            return;
        }
        var jsPDF = window.jspdf.jsPDF;
        var pages = preview.querySelectorAll('.page');
        if (!pages.length) {
            setStatus('沒有可匯出的內容');
            return;
        }
        btnPdf.disabled = true;
        try {
            var blobs = await capturePageElements(pages, 2);
            var pdf = null;
            for (var i = 0; i < blobs.length; i++) {
                var imgData = URL.createObjectURL(blobs[i]);
                var img = new Image();
                await new Promise(function (resolve, reject) {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imgData;
                });
                var wPx = img.naturalWidth;
                var hPx = img.naturalHeight;
                var wMm = (wPx * 25.4) / 96;
                var hMm = (hPx * 25.4) / 96;
                if (!pdf) {
                    pdf = new jsPDF({
                        orientation: wMm >= hMm ? 'l' : 'p',
                        unit: 'mm',
                        format: [wMm, hMm]
                    });
                } else {
                    pdf.addPage([wMm, hMm], wMm >= hMm ? 'l' : 'p');
                }
                var page = pdf.internal.getCurrentPageInfo().pageNumber;
                pdf.setPage(page);
                pdf.addImage(img, 'PNG', 0, 0, wMm, hMm, undefined, 'FAST');
                URL.revokeObjectURL(imgData);
            }
            pdf.save('字帖.pdf');
            setStatus('已下載 PDF（' + blobs.length + ' 頁）');
        } catch (e) {
            setStatus('PDF 失敗：' + (e.message || String(e)));
        } finally {
            btnPdf.disabled = false;
        }
    }

    function onPrint() {
        window.print();
    }

    function applyChenyuFont() {
        var opt = document.getElementById('fontOptChenyu');
        if (opt && fontPreset) fontPreset.value = opt.value;
        setStatus('已套用辰宇落雁體（開源字型，首次載入可能稍候）');
        renderNow();
    }

    var inputs = [
        fontPreset, gridType, copyStyle, pageBackground, cellBackground, fontSize, lineHeight,
        pageSize, charsPerLine, linesPerPage
    ];
    inputs.forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', scheduleRender);
        el.addEventListener('change', scheduleRender);
    });
    if (textInput) {
        textInput.addEventListener('input', function () {
            clearStrokePathLayout();
            scheduleRender();
        });
        textInput.addEventListener('change', scheduleRender);
    }
    if (btnGenerate) btnGenerate.addEventListener('click', function () {
        clearStrokePathLayout();
        renderNow();
    });
    if (btnPrint) btnPrint.addEventListener('click', onPrint);
    if (btnPdf) btnPdf.addEventListener('click', function () { onPdf(); });
    if (btnPng) btnPng.addEventListener('click', function () { onPng(); });
    if (btnAutoStrokeFromChars) btnAutoStrokeFromChars.addEventListener('click', function () { onAutoStrokeFromChars(); });
    if (btnChenyuFont) btnChenyuFont.addEventListener('click', applyChenyuFont);

    renderNow();
})();
