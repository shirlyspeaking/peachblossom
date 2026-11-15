(function () {
    'use strict';

    var SETTINGS_KEY = 'copybook-settings';
    var settings = {};
    try {
        settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {};
    } catch (_) {
        settings = {};
    }

    /* ---- Theme Picker ---- */
    var themeChips = document.querySelectorAll('.theme-chip');
    var THEMES = ['jun', 'ru', 'ding'];
    var LEGACY_THEMES = { silk: 'jun', longquan: 'ru', qinglv: 'ru', pink: 'jun', green: 'ru', blue: 'ru', silver: 'ding' };

    function applyTheme(name) {
        if (LEGACY_THEMES[name]) name = LEGACY_THEMES[name];
        if (THEMES.indexOf(name) < 0) name = 'jun';
        document.body.setAttribute('data-theme', name);
        themeChips.forEach(function (chip) {
            chip.setAttribute('aria-checked', chip.getAttribute('data-theme') === name ? 'true' : 'false');
        });
        settings.theme = name;
    }

    (function initTheme() {
        var saved = settings.theme;
        if (!saved) {
            try { saved = localStorage.getItem('copybook-theme'); } catch (_) {}
        }
        applyTheme(saved || 'jun');
    })();

    themeChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            applyTheme(chip.getAttribute('data-theme'));
            saveSettings();
        });
    });

    /* ---- 落英 ---- */
    var petalsLayer = document.getElementById('petals');
    var btnPetals = document.getElementById('btnPetals');
    var PETAL_SVG =
        '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 23C4.6 19.4 1.2 14.6 1.6 9.4 2 4.6 5.6 1.2 8.6 2.6 9.3 3 9.7 3.6 10 4.4 10.3 3.6 10.7 3 11.4 2.6 14.4 1.2 18 4.6 18.4 9.4 18.8 14.6 15.4 19.4 10 23Z"/></svg>';

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function buildPetals() {
        if (!petalsLayer || petalsLayer.childElementCount) return;
        var html = '';
        // 靜態散落在頁面四周，避開中央內容區
        var spots = [
            [3, 18], [6, 46], [2, 72], [8, 88], [12, 8],
            [94, 14], [97, 38], [91, 62], [96, 84], [88, 94],
            [30, 96], [62, 97], [48, 3], [76, 5]
        ];
        for (var i = 0; i < spots.length; i++) {
            html +=
                '<span class="petal petal--still" style="left:' + spots[i][0] + '%;top:' + spots[i][1] + '%;' +
                '--size:' + rand(12, 20).toFixed(1) + 'px;--rot:' + Math.round(rand(0, 360)) + 'deg;' +
                '--alpha:' + rand(0.35, 0.6).toFixed(2) + '">' + PETAL_SVG + '</span>';
        }
        var falling = 9;
        for (var f = 0; f < falling; f++) {
            var dur = rand(12, 20);
            html +=
                '<span class="petal petal--fall" style="--x:' + rand(2, 96).toFixed(1) + '%;' +
                '--size:' + rand(13, 21).toFixed(1) + 'px;--alpha:' + rand(0.4, 0.7).toFixed(2) + ';' +
                '--dur:' + dur.toFixed(1) + 's;--delay:-' + rand(0, dur).toFixed(1) + 's;' +
                '--drift:' + Math.round(rand(-80, 120)) + 'px;--spin:' + Math.round(rand(160, 420)) + 'deg">' +
                '<span class="petal-inner">' + PETAL_SVG + '</span></span>';
        }
        petalsLayer.innerHTML = html;
    }

    function applyPetals(on) {
        if (on) buildPetals();
        document.body.classList.toggle('petals-off', !on);
        if (btnPetals) btnPetals.setAttribute('aria-pressed', on ? 'true' : 'false');
        settings.petals = on;
    }

    applyPetals(settings.petals !== false);
    if (btnPetals) {
        btnPetals.addEventListener('click', function () {
            applyPetals(btnPetals.getAttribute('aria-pressed') !== 'true');
            saveSettings();
        });
    }

    /* ---- Controls ---- */
    var textInput = document.getElementById('textInput');
    var autoStrokeChars = document.getElementById('autoStrokeChars');
    var strokeHint = document.getElementById('strokeHint');
    var fontPreset = document.getElementById('fontPreset');
    var gridType = document.getElementById('gridType');
    var copyStyle = document.getElementById('copyStyle');
    var fontSize = document.getElementById('fontSize');
    var fontSizeValue = document.getElementById('fontSizeValue');
    var pageSize = document.getElementById('pageSize');
    var bgTiles = document.querySelectorAll('.bg-tile');
    var bgUploadThumb = document.getElementById('bgUploadThumb');
    var pageCountEl = document.getElementById('pageCount');
    var previewWrap = document.getElementById('previewWrap');
    var zoomBtns = document.querySelectorAll('.zoom-btn');
    var panel = document.getElementById('panel');
    var panelBackdrop = document.getElementById('panelBackdrop');
    var btnPanelOpen = document.getElementById('btnPanelOpen');
    var btnPanelClose = document.getElementById('btnPanelClose');
    var currentBg = 'none';
    var currentMode = 'free';
    var currentZoom = 'fit';
    var PAPER_WIDTH_PX = { a4: 793.7, a4l: 1122.5 };
    var DEFAULT_LINE_HEIGHT = 1.15;
    var DEFAULT_CHARS_PER_LINE = 12;
    var DEFAULT_LINES_PER_PAGE = 12;
    var DEFAULT_STROKE_LINES_PER_PAGE = 10;
    var STROKE_CELLS_PER_LINE = 12;
    var BRUSH_FONT_STACK = "'YShiPenShutiTC', 'Kaiti TC', 'STKaiti', 'KaiTi', serif";
    var PHOTO_BGS = {
        plum: 'backgrounds/\u6885\u82b1.jpg?v=5',
        orchid: 'backgrounds/\u862d\u82b1.jpg?v=5',
        bamboo: 'backgrounds/\u7af9\u5b50.jpg?v=5',
        chrysanthemum: 'backgrounds/\u83ca\u82b1.jpg?v=5',
        peony: 'backgrounds/\u7261\u4e39.jpg?v=5'
    };
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
        return currentMode === 'stroke' &&
            !!(strokePathLayout && strokePathLayout.rows && strokePathLayout.rows.length > 0);
    }

    function getFontFamily() {
        var value = fontPreset && fontPreset.value ? fontPreset.value.trim() : '';
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
        var missing = [];
        var results = await Promise.all(chars.map(function (ch) {
            return fetchHanziWriterData(ch).catch(function () { return null; });
        }));
        for (var ci = 0; ci < chars.length; ci++) {
            var ch = chars[ci];
            var data = results[ci];
            if (!data) {
                if (missing.indexOf(ch) < 0) missing.push(ch);
                continue;
            }
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

        return { rows: rows, cpl: maxCols, charsPerRow: 1, missing: missing };
    }

    function chunkLayoutRows(rows, lpp, padEmpty) {
        var n = Math.max(1, Math.min(20, parseInt(lpp, 10) || 12));
        var pages = [];
        for (var i = 0; i < rows.length; i += n) {
            var pageRows = rows.slice(i, i + n);
            if (padEmpty !== false) {
                while (pageRows.length < n) {
                    pageRows.push([]);
                }
            }
            pages.push(pageRows);
        }
        if (pages.length === 0) {
            pages.push(padEmpty === false ? [] : (function () {
                var emptyPage = [];
                while (emptyPage.length < n) emptyPage.push([]);
                return emptyPage;
            })());
        }
        return pages;
    }

    var strokeRequestId = 0;
    var strokeTimer = null;

    function setStrokeHint(text) {
        if (!strokeHint) return;
        strokeHint.textContent = text || '';
        strokeHint.hidden = !text;
    }

    async function onAutoStrokeFromChars() {
        if (!autoStrokeChars) return;
        var sourceText = autoStrokeChars.value.trim() ? autoStrokeChars.value : autoStrokeChars.placeholder;
        var chars = parseHanziChars(sourceText);
        var requestId = ++strokeRequestId;
        if (!chars.length) {
            strokePathLayout = null;
            setStrokeHint(autoStrokeChars.value.trim() ? '請輸入漢字' : '');
            renderNow();
            return;
        }
        var layout = await buildStrokePathLayoutRows(chars);
        if (requestId !== strokeRequestId) return;
        strokePathLayout = layout.rows.length ? { rows: layout.rows, cpl: layout.cpl } : null;
        setStrokeHint(layout.missing.length ? '找不到筆順資料：' + layout.missing.join('、') : '');
        renderNow();
    }

    function scheduleStrokeBuild() {
        if (strokeTimer) clearTimeout(strokeTimer);
        strokeTimer = setTimeout(function () {
            strokeTimer = null;
            onAutoStrokeFromChars();
        }, 500);
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
        var raw = textInput.value.trim() ? textInput.value : textInput.placeholder;
        var text = normalizeText(raw);
        var cpl = DEFAULT_CHARS_PER_LINE;
        var lpp = isStrokeMode() ? DEFAULT_STROKE_LINES_PER_PAGE : DEFAULT_LINES_PER_PAGE;
        var fsEl = fontSize;
        var fsMin = fsEl ? parseInt(fsEl.getAttribute('min'), 10) : 18;
        var fsMax = fsEl ? parseInt(fsEl.getAttribute('max'), 10) : 72;
        if (!Number.isFinite(fsMin)) fsMin = 18;
        if (!Number.isFinite(fsMax)) fsMax = 72;
        var fs = fsEl ? parseInt(String(fsEl.value).trim(), 10) : 36;
        if (!Number.isFinite(fs)) fs = 36;
        fs = Math.max(fsMin, Math.min(fsMax, fs));

        var lh = DEFAULT_LINE_HEIGHT;
        var gtype = gridType && gridType.value ? gridType.value : 'tian';
        var psize = pageSize && PAPER_WIDTH_PX[pageSize.value] ? pageSize.value : 'a4';
        var font = getFontFamily();
        var styleVal = copyStyle && copyStyle.value ? copyStyle.value : 'lightPinkHong';
        var hongMode = styleVal === 'hong' || styleVal === 'trace';
        var lightPinkHongMode = styleVal === 'lightPinkHong';

        var useStrokePaths = isStrokeMode();

        var rows;
        var pages;
        if (useStrokePaths) {
            var wrappedStrokeRows = [];
            var srcRows = strokePathLayout.rows || [];
            for (var wr = 0; wr < srcRows.length; wr++) {
                var srcRow = srcRows[wr] || [];
                if (!srcRow.length) continue;
                for (var ws = 0; ws < srcRow.length; ws += STROKE_CELLS_PER_LINE) {
                    wrappedStrokeRows.push(srcRow.slice(ws, ws + STROKE_CELLS_PER_LINE));
                }
            }
            strokePathLayout.cpl = STROKE_CELLS_PER_LINE;
            pages = chunkLayoutRows(wrappedStrokeRows, lpp, false);
        } else {
            rows = buildRows(text, cpl);
            pages = chunkPages(rows, lpp);
        }

        preview.innerHTML = '';
        var photoBgUrl = PHOTO_BGS[currentBg] || '';
        var bgVal = photoBgUrl ? currentBg : 'none';
        var uploadUrl = currentBg === 'upload' ? uploadedBgUrl : '';
        var useSheetBg = !!(uploadUrl || photoBgUrl);
        var cellBgVal = 'white';
        preview.className =
            'preview preview--' +
            psize +
            (useStrokePaths ? ' preview--stroke' : '') +
            (hongMode || lightPinkHongMode ? ' preview--hong' : '') +
            (lightPinkHongMode ? ' preview--light-pink-hong' : '') +
            (useSheetBg ? ' preview--bg-sheet' : '') +
            (uploadUrl ? ' preview--bg-upload' : '') +
            (bgVal !== 'none' ? ' preview--bg-' + bgVal : '') +
            ' preview--cellbg-' +
            cellBgVal;
        preview.style.removeProperty('--upload-bg');

        for (var p = 0; p < pages.length; p++) {
            var pageRows = pages[p];
            var pageEl = document.createElement('div');
            pageEl.className = 'page';
            pageEl.setAttribute('data-page-index', String(p + 1));

            if (useSheetBg) {
                var bgImg = document.createElement('img');
                bgImg.className = uploadUrl ? 'page-upload-bg' : 'page-photo-bg';
                bgImg.decoding = 'async';
                bgImg.src = uploadUrl || photoBgUrl;
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
                if (useStrokePaths && !(pageRows[r] && pageRows[r].length)) continue;
                var grid = document.createElement('div');
                grid.className = 'grid';
                var cellSize = Math.max(Math.round(fs * lh), fs + 8);

                if (useStrokePaths) {
                    var layoutCpl = STROKE_CELLS_PER_LINE;
                    var rowCells = pageRows[r] || [];
                    grid.classList.add('grid--stroke');
                    grid.style.gridTemplateColumns = 'repeat(' + layoutCpl + ', minmax(0, 1fr))';

                    for (var sc = 0; sc < layoutCpl; sc++) {
                        var item = rowCells[sc] || { kind: 'blank' };
                        var cell = document.createElement('div');
                        cell.className = cellClassForGrid(gtype);
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

        if (pageCountEl) pageCountEl.textContent = '共 ' + pages.length + ' 頁';
        applyZoom();

        if (typeof performance !== 'undefined') {
            var ms = performance.now() - t0;
            setStatus('已更新 · ' + pages.length + ' 頁（約 ' + ms.toFixed(0) + ' ms）');
        } else {
            setStatus('已更新 · ' + pages.length + ' 頁');
        }
    }

    function applyZoom() {
        if (!preview) return;
        var z;
        if (currentZoom === 'fit') {
            var psize = pageSize && PAPER_WIDTH_PX[pageSize.value] ? pageSize.value : 'a4';
            var avail = previewWrap ? previewWrap.clientWidth - 4 : 800;
            z = Math.max(0.3, Math.min(2, avail / PAPER_WIDTH_PX[psize]));
        } else {
            z = parseFloat(currentZoom) || 1;
        }
        preview.style.zoom = String(Math.round(z * 1000) / 1000);
    }

    function setZoom(value) {
        currentZoom = value;
        zoomBtns.forEach(function (btn) {
            btn.setAttribute('aria-checked', btn.getAttribute('data-zoom') === value ? 'true' : 'false');
        });
        applyZoom();
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
            var fillSheet = preview && preview.classList.contains('preview--bg-sheet');
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

    /* ---- 設定記憶 ---- */
    function saveSettings() {
        settings.text = textInput ? textInput.value : '';
        settings.strokeChars = autoStrokeChars ? autoStrokeChars.value : '';
        settings.font = fontPreset ? fontPreset.value : '';
        settings.style = copyStyle ? copyStyle.value : '';
        settings.size = fontSize ? fontSize.value : '';
        settings.grid = gridType ? gridType.value : '';
        settings.paper = pageSize ? pageSize.value : '';
        settings.bg = currentBg === 'upload' ? 'none' : currentBg;
        settings.zoom = currentZoom;
        settings.mode = currentMode;
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
    }

    function setSelectIfValid(el, value) {
        if (!el || value == null || value === '') return;
        for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === value) {
                el.value = value;
                return;
            }
        }
    }

    function restoreSettings() {
        if (textInput && typeof settings.text === 'string' &&
            settings.text.replace(/\r/g, '') !== textInput.placeholder) {
            textInput.value = settings.text;
        }
        if (autoStrokeChars && typeof settings.strokeChars === 'string') autoStrokeChars.value = settings.strokeChars;
        setSelectIfValid(fontPreset, settings.font);
        setSelectIfValid(copyStyle, settings.style);
        setSelectIfValid(gridType, settings.grid);
        setSelectIfValid(pageSize, settings.paper);
        var size = parseInt(settings.size, 10);
        if (fontSize && Number.isFinite(size)) fontSize.value = String(Math.max(18, Math.min(72, size)));
        if (settings.bg && PHOTO_BGS[settings.bg]) currentBg = settings.bg;
        if (settings.zoom && /^(fit|1|1\.5|2)$/.test(settings.zoom)) currentZoom = settings.zoom;
    }

    function syncFontUi() {
        if (fontSizeValue && fontSize) fontSizeValue.textContent = fontSize.value;
    }

    function onSettingChange() {
        syncFontUi();
        scheduleRender();
        saveSettings();
    }

    [fontPreset, gridType, copyStyle, fontSize, pageSize].forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', onSettingChange);
        el.addEventListener('change', onSettingChange);
    });
    if (pageSize) pageSize.addEventListener('change', applyZoom);
    if (textInput) {
        textInput.addEventListener('input', function () {
            scheduleRender();
            saveSettings();
        });
    }
    if (autoStrokeChars) {
        autoStrokeChars.addEventListener('input', function () {
            scheduleStrokeBuild();
            saveSettings();
        });
    }
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
        if (pdfPreviewModal && !pdfPreviewModal.hidden) {
            if (!pdfModalCanAct) return;
            e.preventDefault();
            closePdfPreview();
            return;
        }
        if (panel && panel.classList.contains('is-open')) closePanelSheet();
    });
    /* ---- 字帖背景 ---- */
    function selectBg(value) {
        if (value === 'upload' && !uploadedBgUrl) value = 'none';
        currentBg = value;
        bgTiles.forEach(function (tile) {
            var on = tile.getAttribute('data-bg') === value;
            tile.classList.toggle('is-selected', on);
            tile.setAttribute('aria-checked', on ? 'true' : 'false');
        });
    }

    function clearUploadedBg() {
        if (uploadedBgUrl) {
            URL.revokeObjectURL(uploadedBgUrl);
            uploadedBgUrl = '';
        }
        if (bgImageInput) bgImageInput.value = '';
        if (btnBgImageClear) btnBgImageClear.hidden = true;
        if (bgUploadThumb) {
            bgUploadThumb.style.backgroundImage = '';
            bgUploadThumb.classList.remove('has-image');
        }
        if (currentBg === 'upload') selectBg('none');
        renderNow();
        saveSettings();
    }

    bgTiles.forEach(function (tile) {
        tile.addEventListener('click', function () {
            var value = tile.getAttribute('data-bg');
            if (value === 'upload' && !uploadedBgUrl) {
                if (bgImageInput) bgImageInput.click();
                return;
            }
            selectBg(value);
            renderNow();
            saveSettings();
        });
    });

    if (btnBgImageUpload && bgImageInput) {
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
                    if (bgUploadThumb) {
                        bgUploadThumb.style.backgroundImage = 'url("' + url + '")';
                        bgUploadThumb.classList.add('has-image');
                    }
                    selectBg('upload');
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

    /* ---- 預覽大小 ---- */
    zoomBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setZoom(btn.getAttribute('data-zoom'));
            saveSettings();
        });
    });
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        if (currentZoom !== 'fit') return;
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(applyZoom);
    });

    /* ---- 手機版設定面板 ---- */
    function openPanelSheet() {
        if (!panel) return;
        panel.classList.add('is-open');
        if (panelBackdrop) panelBackdrop.hidden = false;
    }

    function closePanelSheet() {
        if (!panel) return;
        panel.classList.remove('is-open');
        if (panelBackdrop) panelBackdrop.hidden = true;
    }

    if (btnPanelOpen) btnPanelOpen.addEventListener('click', openPanelSheet);
    if (btnPanelClose) btnPanelClose.addEventListener('click', closePanelSheet);
    if (panelBackdrop) panelBackdrop.addEventListener('click', closePanelSheet);

    /* ---- 字帖／筆順字帖 分頁 ---- */
    var modeTabs = document.querySelectorAll('.mode-tab');
    function activateMode(tab, silent) {
        modeTabs.forEach(function (item) {
            var selected = item === tab;
            item.classList.toggle('is-active', selected);
            item.setAttribute('aria-selected', selected ? 'true' : 'false');
            item.tabIndex = selected ? 0 : -1;
            var tabPanel = document.getElementById(item.getAttribute('aria-controls'));
            if (tabPanel) tabPanel.hidden = !selected;
        });
        currentMode = tab && tab.id === 'tabStroke' ? 'stroke' : 'free';
        if (silent) return;
        saveSettings();
        if (currentMode === 'stroke' && !strokePathLayout) {
            onAutoStrokeFromChars();
            return;
        }
        renderNow();
    }
    modeTabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            activateMode(tab);
        });
        tab.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            var next = e.key === 'ArrowRight' ? index + 1 : index - 1;
            if (next < 0) next = modeTabs.length - 1;
            if (next >= modeTabs.length) next = 0;
            activateMode(modeTabs[next]);
            modeTabs[next].focus();
        });
    });

    restoreSettings();
    syncFontUi();
    selectBg(currentBg);
    setZoom(currentZoom);
    if (settings.mode === 'stroke') {
        activateMode(document.getElementById('tabStroke'), true);
        onAutoStrokeFromChars();
    }
    renderNow();
    whenBrushFontReady(function () {
        renderNow();
    });
})();
