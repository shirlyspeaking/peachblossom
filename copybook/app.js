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
    var pageSize = document.getElementById('pageSize');
    var pageBackground = document.getElementById('pageBackground');
    var fontPresetStroke = document.getElementById('fontPresetStroke');
    var gridTypeStroke = document.getElementById('gridTypeStroke');
    var copyStyleStroke = document.getElementById('copyStyleStroke');
    var fontSizeStroke = document.getElementById('fontSizeStroke');
    var pageSizeStroke = document.getElementById('pageSizeStroke');
    var pageBackgroundStroke = document.getElementById('pageBackgroundStroke');
    var DEFAULT_LINE_HEIGHT = 1.15;
    var DEFAULT_CHARS_PER_LINE = 12;
    var DEFAULT_LINES_PER_PAGE = 12;
    var DEFAULT_STROKE_LINES_PER_PAGE = 10;
    var STROKE_CELLS_PER_LINE = 12;
    var BRUSH_FONT_STACK = "'YShiPenShutiTC', 'Kaiti TC', 'STKaiti', 'KaiTi', serif";
    var preview = document.getElementById('preview');
    var btnPdf = document.getElementById('btnPdf');
    var pdfPreviewModal = document.getElementById('pdfPreviewModal');
    var pdfPreviewPages = document.getElementById('pdfPreviewPages');
    var pdfPreviewSub = document.getElementById('pdfPreviewSub');
    var pdfPreviewClose = document.getElementById('pdfPreviewClose');
    var pdfPreviewCancel = document.getElementById('pdfPreviewCancel');
    var pdfPreviewDownload = document.getElementById('pdfPreviewDownload');
    var pendingPdf = null;
    var pdfModalCanAct = false;
    var pdfModalBusy = false;
    var btnPng = document.getElementById('btnPng');
    var btnChenyuFont = document.getElementById('btnChenyuFont');
    var bgImageInput = document.getElementById('bgImageInput');
    var btnBgImageUpload = document.getElementById('btnBgImageUpload');
    var btnBgImageClear = document.getElementById('btnBgImageClear');
    var uploadedBgUrl = '';

    function loadImageFromFile(file) {
        if (typeof createImageBitmap === 'function') {
            return createImageBitmap(file);
        }
        return new Promise(function (resolve, reject) {
            var url = URL.createObjectURL(file);
            var img = new Image();
            img.onload = function () {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = function () {
                URL.revokeObjectURL(url);
                reject(new Error('無法讀取圖片'));
            };
            img.src = url;
        });
    }

    /**
     * 上傳背景：優先保留原圖像素。
     * 僅當最長邊超過 5120px 才縮小，避免再壓成低解析正方形 JPEG。
     */
    function prepareUploadBg(file) {
        return loadImageFromFile(file).then(function (img) {
            var srcW = img.width || img.naturalWidth || 0;
            var srcH = img.height || img.naturalHeight || 0;
            var maxSide = 5120;
            var tooBig = srcW > maxSide || srcH > maxSide;
            function closeImg() {
                if (img.close) {
                    try {
                        img.close();
                    } catch (_) {}
                }
            }
            if (!tooBig || !srcW || !srcH) {
                closeImg();
                return URL.createObjectURL(file);
            }
            var scale = maxSide / Math.max(srcW, srcH);
            var w = Math.max(1, Math.round(srcW * scale));
            var h = Math.max(1, Math.round(srcH * scale));
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            if (!ctx) {
                closeImg();
                throw new Error('無法處理圖片');
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);
            closeImg();
            return new Promise(function (resolve, reject) {
                canvas.toBlob(
                    function (blob) {
                        if (!blob) reject(new Error('無法產生背景圖'));
                        else resolve(URL.createObjectURL(blob));
                    },
                    'image/jpeg',
                    0.96
                );
            });
        });
    }

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
            '" text-anchor="middle" dominant-baseline="middle" fill="currentColor">' +
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
        var sw = Math.max(13, Math.min(46, Math.round(((fs || 36) + 4) * 0.72)));
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
            '<g transform="translate(512,512) scale(0.82,-0.82) translate(-512,-512)">' +
            parts +
            '</g>' +
            '</g>' +
            '</svg>'
        );
    }

    function isStrokeMode() {
        return !!(strokePathLayout && strokePathLayout.rows && strokePathLayout.rows.length > 0);
    }

    function getActiveControls() {
        if (isStrokeMode()) {
            return {
                fontPreset: fontPresetStroke || fontPreset,
                gridType: gridTypeStroke || gridType,
                copyStyle: copyStyleStroke || copyStyle,
                fontSize: fontSizeStroke || fontSize,
                pageSize: pageSizeStroke || pageSize,
                pageBackground: pageBackgroundStroke || pageBackground
            };
        }
        return {
            fontPreset: fontPreset,
            gridType: gridType,
            copyStyle: copyStyle,
            fontSize: fontSize,
            pageSize: pageSize,
            pageBackground: pageBackground
        };
    }

    function getFontFamily() {
        var c = getActiveControls();
        var value = c.fontPreset && c.fontPreset.value ? c.fontPreset.value.trim() : '';
        return value || BRUSH_FONT_STACK;
    }

    function whenBrushFontReady(done) {
        var finish = typeof done === 'function' ? done : function () {};
        if (!document.fonts || !document.fonts.load) {
            finish();
            return;
        }
        var settled = false;
        function once() {
            if (settled) return;
            settled = true;
            finish();
        }
        document.fonts.load('36px "YShiPenShutiTC"').then(function () {
            if (document.fonts.check('36px "YShiPenShutiTC"')) {
                once();
                return;
            }
            return document.fonts.ready.then(once);
        }).catch(once);
        setTimeout(once, 20000);
    }

    function parseHanziChars(text) {
        var out = [];
        // 保留輸入順序與重複字；支援多行輸入（換行會被略過，不會中斷解析）
        var chars = stringToChars(String(text || ''));
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

        // 一行最多 12 格；筆畫很多的字自動折到下一行
        var maxCols = STROKE_CELLS_PER_LINE;
        var rows = [];
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (!block.length) continue;
            for (var start = 0; start < block.length; start += maxCols) {
                rows.push(block.slice(start, start + maxCols));
            }
        }

        return { rows: rows, cpl: maxCols, charsPerRow: 1 };
    }

    function applyStrokePathDefaults() {
        if (gridTypeStroke) gridTypeStroke.value = 'tian';
        if (fontSizeStroke) fontSizeStroke.value = '40';
    }

    function chunkLayoutRows(rows, lpp) {
        var n = Math.max(1, Math.min(20, parseInt(lpp, 10) || 12));
        var pages = [];
        for (var i = 0; i < rows.length; i += n) {
            var pageRows = rows.slice(i, i + n);
            while (pageRows.length < n) {
                pageRows.push([]);
            }
            pages.push(pageRows);
        }
        if (pages.length === 0) {
            var emptyPage = [];
            while (emptyPage.length < n) emptyPage.push([]);
            pages.push(emptyPage);
        }
        return pages;
    }

    async function onAutoStrokeFromChars() {
        var sourceText = '';
        if (autoStrokeChars && String(autoStrokeChars.value || '').trim()) {
            sourceText = autoStrokeChars.value;
        } else if (textInput) {
            sourceText = textInput.value;
        }
        var chars = parseHanziChars(sourceText);
        if (!chars.length) {
            window.alert('請先輸入至少一個漢字（可在筆順字帖輸入或字帖內容中輸入，多行可用）');
            return;
        }
        if (btnAutoStrokeFromChars) btnAutoStrokeFromChars.disabled = true;
        try {
            var layout = await buildStrokePathLayoutRows(chars);
            strokePathLayout = { rows: layout.rows, cpl: layout.cpl };
            if (textInput) textInput.value = '';
            applyStrokePathDefaults();
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
        var ctrls = getActiveControls();
        var cpl = DEFAULT_CHARS_PER_LINE;
        var lpp = isStrokeMode() ? DEFAULT_STROKE_LINES_PER_PAGE : DEFAULT_LINES_PER_PAGE;
        var fsEl = ctrls.fontSize;
        var fsMin = fsEl ? parseInt(fsEl.getAttribute('min'), 10) : 18;
        var fsMax = fsEl ? parseInt(fsEl.getAttribute('max'), 10) : 72;
        if (!Number.isFinite(fsMin)) fsMin = 18;
        if (!Number.isFinite(fsMax)) fsMax = 72;
        var fs = fsEl ? parseInt(String(fsEl.value).trim(), 10) : 36;
        if (!Number.isFinite(fs)) fs = 36;
        fs = Math.max(fsMin, Math.min(fsMax, fs));

        var lh = DEFAULT_LINE_HEIGHT;
        var gtype = ctrls.gridType && ctrls.gridType.value ? ctrls.gridType.value : 'tian';
        var psize = ctrls.pageSize && ctrls.pageSize.value ? ctrls.pageSize.value : 'a4';
        var font = getFontFamily();
        var styleVal = ctrls.copyStyle && ctrls.copyStyle.value ? ctrls.copyStyle.value : 'standard';
        var hongMode = styleVal === 'hong' || styleVal === 'trace';
        var lightPinkHongMode = styleVal === 'lightPinkHong';

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
        var rawBg = ctrls.pageBackground && ctrls.pageBackground.value ? ctrls.pageBackground.value : 'none';
        var bgVal =
            rawBg === 'xuan' ||
            rawBg === 'letter' ||
            rawBg === 'scroll' ||
            rawBg === 'redLines' ||
            rawBg === 'cloud'
                ? rawBg
                : 'none';
        var cellBgVal = uploadedBgUrl ? 'translucent' : 'white';
        preview.className =
            'preview preview--' +
            psize +
            (hongMode || lightPinkHongMode ? ' preview--hong' : '') +
            (lightPinkHongMode ? ' preview--light-pink-hong' : '') +
            (uploadedBgUrl ? ' preview--bg-upload' : '') +
            (bgVal !== 'none' ? ' preview--bg-' + bgVal : '') +
            ' preview--cellbg-' +
            cellBgVal;
        preview.style.removeProperty('--upload-bg');

        for (var p = 0; p < pages.length; p++) {
            var pageRows = pages[p];
            var pageEl = document.createElement('div');
            pageEl.className = 'page';
            pageEl.setAttribute('data-page-index', String(p + 1));

            if (uploadedBgUrl) {
                var bgImg = document.createElement('img');
                bgImg.className = 'page-upload-bg';
                bgImg.decoding = 'async';
                bgImg.src = uploadedBgUrl;
                bgImg.alt = '';
                bgImg.setAttribute('aria-hidden', 'true');
                bgImg.draggable = false;
                pageEl.appendChild(bgImg);
            }

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
                            inner.className = 'cell-inner cell-inner--hong';
                            inner.innerHTML = buildReferenceFontSvgChar(ch, font, fs);
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

    function yieldUi() {
        return new Promise(function (resolve) {
            requestAnimationFrame(function () {
                setTimeout(resolve, 50);
            });
        });
    }

    function getExportFill() {
        return '#ffffff';
    }

    function paintOpaqueCanvas(source, fill) {
        var out = document.createElement('canvas');
        out.width = source.width;
        out.height = source.height;
        var ctx = out.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = fill || '#ffffff';
        ctx.fillRect(0, 0, out.width, out.height);
        ctx.drawImage(source, 0, 0);
        return out;
    }

    function copyComputedInk(clonedPage, sourcePage) {
        if (!clonedPage || !sourcePage) return;
        var srcEls = sourcePage.querySelectorAll('.cell, .cell-inner, .page-title');
        var dstEls = clonedPage.querySelectorAll('.cell, .cell-inner, .page-title');
        var n = Math.min(srcEls.length, dstEls.length);
        for (var i = 0; i < n; i++) {
            var cs = window.getComputedStyle(srcEls[i]);
            if (cs.color && cs.color !== 'rgba(0, 0, 0, 0)') {
                dstEls[i].style.color = cs.color;
            }
        }
    }

    function prepareClonedPage(clonedDoc, clonedPage, sourcePage, paper) {
        if (clonedDoc.documentElement) {
            clonedDoc.documentElement.style.background = paper;
            clonedDoc.documentElement.style.backgroundColor = paper;
        }
        if (clonedDoc.body) {
            clonedDoc.body.style.background = paper;
            clonedDoc.body.style.backgroundColor = paper;
        }
        if (!clonedPage && clonedDoc.querySelector) {
            clonedPage = clonedDoc.querySelector('.page');
        }
        if (!clonedPage) return;

        var cs = sourcePage ? window.getComputedStyle(sourcePage) : null;
        clonedPage.style.boxShadow = 'none';
        clonedPage.style.border = 'none';
        clonedPage.style.borderRadius = '0';
        var bgColor = cs ? cs.backgroundColor : '';
        var hasPaintedBg = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
        clonedPage.style.backgroundColor = hasPaintedBg ? bgColor : paper;
        if (cs && cs.backgroundImage && cs.backgroundImage !== 'none') {
            clonedPage.style.backgroundImage = cs.backgroundImage;
            clonedPage.style.backgroundSize = cs.backgroundSize;
            clonedPage.style.backgroundRepeat = cs.backgroundRepeat;
            clonedPage.style.backgroundPosition = cs.backgroundPosition;
        }
        clonedPage.style.overflow = 'hidden';
        copyComputedInk(clonedPage, sourcePage);
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(
                function (b) {
                    if (b) resolve(b);
                    else reject(new Error('無法產生圖片'));
                },
                type || 'image/jpeg',
                quality == null ? 0.92 : quality
            );
        });
    }

    function flattenCharSvgs(pageEl) {
        var inners = pageEl.querySelectorAll('.cell-inner--hong');
        var backups = [];
        for (var i = 0; i < inners.length; i++) {
            var el = inners[i];
            var svg = el.querySelector('svg');
            if (!svg) continue;
            var text = svg.querySelector('text');
            if (!text) continue;
            backups.push({
                el: el,
                html: el.innerHTML,
                className: el.className,
                color: el.style.color,
                opacity: el.style.opacity
            });
            var fill = text.getAttribute('fill');
            var stroke = text.getAttribute('stroke');
            el.className = 'cell-inner';
            el.textContent = text.textContent || '';
            if (fill && fill !== 'none' && fill !== 'currentColor') {
                el.style.color = fill;
                if (text.getAttribute('fill-opacity')) {
                    el.style.opacity = text.getAttribute('fill-opacity');
                }
            } else if (fill === 'none' && stroke && stroke !== 'none') {
                el.style.color = stroke;
                if (text.getAttribute('stroke-opacity')) {
                    el.style.opacity = text.getAttribute('stroke-opacity');
                }
            }
        }
        return function restore() {
            for (var j = 0; j < backups.length; j++) {
                backups[j].el.className = backups[j].className;
                backups[j].el.innerHTML = backups[j].html;
                backups[j].el.style.color = backups[j].color;
                backups[j].el.style.opacity = backups[j].opacity;
            }
        };
    }

    var colorResolveProbe = null;
    var colorResolveCache = {};

    function resolveModernColor(value) {
        if (!value) return value;
        if (colorResolveCache[value]) return colorResolveCache[value];
        if (!colorResolveProbe) {
            colorResolveProbe = document.createElement('span');
            colorResolveProbe.setAttribute('aria-hidden', 'true');
            colorResolveProbe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;';
            document.body.appendChild(colorResolveProbe);
        }
        colorResolveProbe.style.color = '';
        try {
            colorResolveProbe.style.color = value;
        } catch (_) {
            colorResolveCache[value] = '#333333';
            return colorResolveCache[value];
        }
        var resolved = window.getComputedStyle(colorResolveProbe).color;
        if (!resolved || /oklch|oklab|color-mix/i.test(resolved)) {
            resolved = '#333333';
        }
        colorResolveCache[value] = resolved;
        return resolved;
    }

    function sanitizeCssColorValue(value) {
        if (!value || !/oklch|oklab|color-mix/i.test(value)) return value;
        var whole = resolveModernColor(value);
        if (whole && !/oklch|oklab|color-mix/i.test(whole)) return whole;
        return value
            .replace(/oklch\((?:[^)(]+|\([^)(]*\))*\)/gi, function (m) {
                return resolveModernColor(m);
            })
            .replace(/color-mix\((?:[^)(]+|\([^)(]*\))*\)/gi, function (m) {
                return resolveModernColor(m);
            });
    }

    function sanitizeStyleDeclaration(style) {
        if (!style) return;
        for (var i = style.length - 1; i >= 0; i--) {
            var prop = style.item(i);
            var val = style.getPropertyValue(prop);
            if (!val || !/oklch|oklab|color-mix/i.test(val)) continue;
            style.setProperty(prop, sanitizeCssColorValue(val), style.getPropertyPriority(prop));
        }
    }

    function sanitizeStyleSheet(sheet) {
        var rules;
        try {
            rules = sheet.cssRules || sheet.rules;
        } catch (_) {
            return;
        }
        if (!rules) return;
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.style) sanitizeStyleDeclaration(rule.style);
            if (rule.cssRules) sanitizeStyleSheet(rule);
        }
    }

    function sanitizeClonedDocument(clonedDoc) {
        var sheets = clonedDoc.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            sanitizeStyleSheet(sheets[i]);
        }
        var els = clonedDoc.querySelectorAll('*');
        for (var j = 0; j < els.length; j++) {
            if (els[j].style && els[j].style.length) {
                sanitizeStyleDeclaration(els[j].style);
            }
        }
        if (clonedDoc.documentElement && clonedDoc.documentElement.style) {
            sanitizeStyleDeclaration(clonedDoc.documentElement.style);
        }
    }

    function withTimeout(promise, ms, label) {
        return Promise.race([
            promise,
            new Promise(function (_, reject) {
                setTimeout(function () {
                    reject(new Error(label || '處理逾時'));
                }, ms);
            })
        ]);
    }

    async function rasterizePage(pageEl, paper) {
        var w = Math.max(1, pageEl.offsetWidth || pageEl.scrollWidth);
        var h = Math.max(1, pageEl.offsetHeight || pageEl.scrollHeight);
        return withTimeout(
            window.html2canvas(pageEl, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: paper,
                width: w,
                height: h,
                windowWidth: w,
                windowHeight: h,
                logging: false,
                imageTimeout: 4000,
                foreignObjectRendering: false,
                onclone: function (clonedDoc, clonedEl) {
                    sanitizeClonedDocument(clonedDoc);
                    prepareClonedPage(clonedDoc, clonedEl, pageEl, paper);
                }
            }),
            20000,
            '畫面擷取逾時，請再試一次'
        );
    }

    function waitForPageImages(pageEl) {
        var imgs = pageEl.querySelectorAll('img');
        var pending = [];
        for (var i = 0; i < imgs.length; i++) {
            (function (img) {
                if (img.complete && img.naturalWidth) return;
                pending.push(new Promise(function (resolve) {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                }));
            })(imgs[i]);
        }
        return pending.length ? Promise.all(pending) : Promise.resolve();
    }

    async function capturePageElements(pageEls, scale, type) {
        var blobs = [];
        var paper = getExportFill();
        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (_) {}
        }
        if (preview) preview.classList.add('preview--exporting');
        await yieldUi();
        try {
            for (var i = 0; i < pageEls.length; i++) {
                setStatus('繪製第 ' + (i + 1) + ' 頁…');
                var pageEl = pageEls[i];
                await waitForPageImages(pageEl);
                var restore = flattenCharSvgs(pageEl);
                try {
                    var canvas = await rasterizePage(pageEl, paper);
                    blobs.push(await canvasToBlob(paintOpaqueCanvas(canvas, paper), type || 'image/png'));
                } finally {
                    restore();
                }
            }
        } finally {
            if (preview) preview.classList.remove('preview--exporting');
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
            var blobs = await capturePageElements(pages, 1.5, 'image/png');
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

    function getPdfPaper() {
        if (preview && preview.classList.contains('preview--a4l')) {
            return { format: 'a4', orientation: 'l', w: 297, h: 210 };
        }
        if (preview && preview.classList.contains('preview--letter')) {
            return { format: 'letter', orientation: 'p', w: 215.9, h: 279.4 };
        }
        return { format: 'a4', orientation: 'p', w: 210, h: 297 };
    }

    function revokePendingPdf() {
        if (!pendingPdf) return;
        if (pendingPdf.previewUrls) {
            for (var i = 0; i < pendingPdf.previewUrls.length; i++) {
                URL.revokeObjectURL(pendingPdf.previewUrls[i]);
            }
        }
        pendingPdf = null;
    }

    function closePdfPreview() {
        if (pdfModalBusy) return;
        pdfModalCanAct = false;
        if (pdfPreviewModal) {
            pdfPreviewModal.classList.remove('is-open');
            pdfPreviewModal.hidden = true;
        }
        document.body.classList.remove('pdf-modal-open');
        if (pdfPreviewPages) pdfPreviewPages.innerHTML = '';
        revokePendingPdf();
        if (pdfPreviewDownload) {
            pdfPreviewDownload.disabled = false;
            pdfPreviewDownload.textContent = '確認下載';
        }
        if (pdfPreviewCancel) pdfPreviewCancel.disabled = false;
    }

    function openPdfPreview(pageCount) {
        pdfModalCanAct = false;
        if (pdfPreviewSub) {
            pdfPreviewSub.textContent = '共 ' + pageCount + ' 頁 · 看過之後再按確認下載';
        }
        if (pdfPreviewModal) {
            pdfPreviewModal.hidden = false;
            requestAnimationFrame(function () {
                pdfPreviewModal.classList.add('is-open');
            });
        }
        document.body.classList.add('pdf-modal-open');
        var dialog = pdfPreviewModal && pdfPreviewModal.querySelector('.pdf-modal-dialog');
        if (dialog) dialog.focus();
        setTimeout(function () {
            pdfModalCanAct = true;
        }, 450);
    }

    function blobToDataUrl(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { resolve(reader.result); };
            reader.onerror = function () { reject(new Error('圖片讀取失敗')); };
            reader.readAsDataURL(blob);
        });
    }

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () { resolve(image); };
            image.onerror = function () { reject(new Error('圖片讀取失敗')); };
            image.src = src;
        });
    }

    function sheetWrapClass(paper, fillSheet) {
        var cls = 'pdf-preview-sheet-wrap';
        if (fillSheet) cls += ' is-cover';
        if (paper.orientation === 'l') cls += ' is-landscape';
        if (paper.format === 'letter') cls += ' is-letter';
        return cls;
    }

    async function buildPdfBlob(pageBlobs, paper, fillSheet) {
        var jsPDF = window.jspdf.jsPDF;
        var pdf = null;
        for (var i = 0; i < pageBlobs.length; i++) {
            var dataUrl = await blobToDataUrl(pageBlobs[i]);
            if (!pdf) {
                pdf = new jsPDF({
                    orientation: paper.orientation,
                    unit: 'mm',
                    format: paper.format,
                    compress: true
                });
            } else {
                pdf.addPage(paper.format, paper.orientation);
            }
            var wMm = paper.w;
            var hMm = paper.h;
            pdf.setPage(pdf.internal.getCurrentPageInfo().pageNumber);
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, wMm, hMm, 'F');
            if (fillSheet) {
                pdf.addImage(dataUrl, 'PNG', 0, 0, wMm, hMm);
            } else {
                var img = await loadImage(dataUrl);
                var drawW = wMm;
                var drawH = wMm * (img.naturalHeight / Math.max(1, img.naturalWidth));
                if (drawH > hMm) {
                    var fit = hMm / drawH;
                    drawW *= fit;
                    drawH = hMm;
                }
                pdf.addImage(dataUrl, 'PNG', 0, 0, drawW, drawH);
            }
        }
        return pdf.output('blob');
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
        var oldLabel = btnPdf.textContent;
        btnPdf.disabled = true;
        btnPdf.textContent = '產生 PDF 中…';
        try {
            await yieldUi();
            var blobs = await capturePageElements(pages, 1, 'image/png');
            var fillSheet = preview && preview.classList.contains('preview--bg-upload');
            var paper = getPdfPaper();
            var previewUrls = [];
            for (var i = 0; i < blobs.length; i++) {
                previewUrls.push(URL.createObjectURL(blobs[i]));
            }
            revokePendingPdf();
            pendingPdf = {
                pageBlobs: blobs,
                paper: paper,
                fillSheet: fillSheet,
                previewUrls: previewUrls
            };
            if (pdfPreviewPages) {
                pdfPreviewPages.innerHTML = '';
                for (var p = 0; p < previewUrls.length; p++) {
                    var wrap = document.createElement('div');
                    wrap.className = sheetWrapClass(paper, fillSheet);
                    var sheet = document.createElement('img');
                    sheet.className = 'pdf-preview-sheet';
                    sheet.src = previewUrls[p];
                    sheet.alt = '第 ' + (p + 1) + ' 頁';
                    wrap.appendChild(sheet);
                    pdfPreviewPages.appendChild(wrap);
                }
            }
            openPdfPreview(blobs.length);
            setStatus('已開啟預覽（' + blobs.length + ' 頁），確認後才會下載');
        } catch (e) {
            window.alert('PDF 下載失敗：' + (e.message || String(e)));
            setStatus('PDF 失敗：' + (e.message || String(e)));
        } finally {
            btnPdf.textContent = oldLabel;
            btnPdf.disabled = false;
        }
    }

    function onPrint() {
        window.print();
    }

    function applyChenyuFont() {
        var opt = document.getElementById('fontOptChenyu');
        var optStroke = document.getElementById('fontOptChenyuStroke');
        if (opt && fontPreset) fontPreset.value = opt.value;
        if (optStroke && fontPresetStroke) fontPresetStroke.value = optStroke.value;
        setStatus('已套用辰宇落雁體（開源字型，首次載入可能稍候）');
        renderNow();
    }

    var inputs = [
        fontPreset, gridType, copyStyle, pageBackground, fontSize, pageSize,
        fontPresetStroke, gridTypeStroke, copyStyleStroke, pageBackgroundStroke, fontSizeStroke, pageSizeStroke
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
    if (btnPdf) btnPdf.addEventListener('click', function () { onPdf(); });
    if (pdfPreviewClose) pdfPreviewClose.addEventListener('click', function () { closePdfPreview(); });
    if (pdfPreviewCancel) pdfPreviewCancel.addEventListener('click', function () { closePdfPreview(); });
    if (pdfPreviewDownload) {
        pdfPreviewDownload.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!pdfModalCanAct || pdfModalBusy || !pendingPdf || !pendingPdf.pageBlobs) return;
            pdfModalBusy = true;
            pdfPreviewDownload.disabled = true;
            pdfPreviewDownload.textContent = '下載中…';
            if (pdfPreviewCancel) pdfPreviewCancel.disabled = true;
            try {
                var blob = await buildPdfBlob(pendingPdf.pageBlobs, pendingPdf.paper, pendingPdf.fillSheet);
                downloadBlob('字帖.pdf', blob);
                setStatus('已下載 PDF');
                pdfModalBusy = false;
                closePdfPreview();
            } catch (err) {
                window.alert('PDF 下載失敗：' + (err.message || String(err)));
                setStatus('PDF 失敗：' + (err.message || String(err)));
                pdfPreviewDownload.disabled = false;
                pdfPreviewDownload.textContent = '確認下載';
                if (pdfPreviewCancel) pdfPreviewCancel.disabled = false;
            } finally {
                pdfModalBusy = false;
            }
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (!pdfPreviewModal || pdfPreviewModal.hidden || !pdfModalCanAct) return;
        e.preventDefault();
        closePdfPreview();
    });
    if (btnAutoStrokeFromChars) btnAutoStrokeFromChars.addEventListener('click', function () { onAutoStrokeFromChars(); });
    if (btnChenyuFont) btnChenyuFont.addEventListener('click', applyChenyuFont);

    function clearUploadedBg() {
        if (uploadedBgUrl) {
            URL.revokeObjectURL(uploadedBgUrl);
            uploadedBgUrl = '';
        }
        if (bgImageInput) bgImageInput.value = '';
        if (btnBgImageClear) btnBgImageClear.hidden = true;
        renderNow();
    }

    if (btnBgImageUpload && bgImageInput) {
        btnBgImageUpload.addEventListener('click', function () {
            bgImageInput.click();
        });
        bgImageInput.addEventListener('change', function () {
            var file = bgImageInput.files && bgImageInput.files[0];
            if (!file) return;
            if (!/^image\//.test(file.type)) {
                window.alert('請選擇圖片檔');
                bgImageInput.value = '';
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                window.alert('圖片請小於 20MB');
                bgImageInput.value = '';
                return;
            }
            btnBgImageUpload.disabled = true;
            prepareUploadBg(file)
                .then(function (url) {
                    if (uploadedBgUrl) URL.revokeObjectURL(uploadedBgUrl);
                    uploadedBgUrl = url;
                    if (btnBgImageClear) btnBgImageClear.hidden = false;
                    renderNow();
                })
                .catch(function (e) {
                    window.alert('背景圖處理失敗：' + (e.message || String(e)));
                    bgImageInput.value = '';
                })
                .then(function () {
                    btnBgImageUpload.disabled = false;
                });
        });
    }
    if (btnBgImageClear) btnBgImageClear.addEventListener('click', clearUploadedBg);

    renderNow();
    whenBrushFontReady(function () {
        renderNow();
    });
})();
