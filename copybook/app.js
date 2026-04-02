(function () {
    'use strict';

    var textInput = document.getElementById('textInput');
    var fontPreset = document.getElementById('fontPreset');
    var customFont = document.getElementById('customFont');
    var gridType = document.getElementById('gridType');
    var fontSize = document.getElementById('fontSize');
    var lineHeight = document.getElementById('lineHeight');
    var pageSize = document.getElementById('pageSize');
    var charsPerLine = document.getElementById('charsPerLine');
    var linesPerPage = document.getElementById('linesPerPage');
    var preview = document.getElementById('preview');
    var statusEl = document.getElementById('status');
    var btnRegenerate = document.getElementById('btnRegenerate');
    var btnPrint = document.getElementById('btnPrint');
    var btnPdf = document.getElementById('btnPdf');
    var btnPng = document.getElementById('btnPng');
    var btnTxt = document.getElementById('btnTxt');

    var debounceTimer = null;
    var DEBOUNCE_MS = 320;

    function setStatus(msg) {
        if (statusEl) statusEl.textContent = msg;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getFontFamily() {
        var preset = fontPreset.value.trim();
        var custom = customFont.value.trim();
        if (custom) {
            return custom + ', ' + preset;
        }
        return preset;
    }

    /** 保留換行；行內連續空白壓成單一空格；移除行尾空白 */
    function normalizeText(raw) {
        return String(raw)
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\t/g, ' ')
            .split('\n')
            .map(function (line) {
                return line.replace(/ +/g, ' ').replace(/\s+$/g, '');
            })
            .join('\n');
    }

    /** 將文字切成排版用「行」，每行最多 cpl 字；空行保留為一列空白行 */
    function buildRows(text, cpl) {
        var lines = text.split('\n');
        var rows = [];
        var c = Math.max(4, Math.min(20, parseInt(cpl, 10) || 12));

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
        var n = Math.max(4, Math.min(20, parseInt(lpp, 10) || 12));
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
        var cpl = parseInt(charsPerLine.value, 10) || 12;
        var lpp = parseInt(linesPerPage.value, 10) || 12;
        var fs = parseInt(fontSize.value, 10) || 36;
        var lh = parseFloat(lineHeight.value) || 1.15;
        var gtype = gridType.value;
        var psize = pageSize.value;
        var font = getFontFamily();

        var rows = buildRows(text, cpl);
        var pages = chunkPages(rows, lpp);

        preview.innerHTML = '';
        preview.className = 'preview preview--' + psize;

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
                var rowStr = pageRows[r];
                var chars = padRowToLength(rowStr, cpl);
                var grid = document.createElement('div');
                grid.className = 'grid';
                grid.style.gridTemplateColumns = 'repeat(' + cpl + ', 1fr)';

                var cellMin = Math.max(fs * lh, fs + 8);
                grid.style.minHeight = '';

                for (var c = 0; c < chars.length; c++) {
                    var ch = chars[c];
                    var cell = document.createElement('div');
                    cell.className = cellClassForGrid(gtype);
                    cell.style.minHeight = cellMin + 'px';
                    cell.style.fontSize = fs + 'px';
                    cell.style.fontFamily = font;
                    cell.style.lineHeight = lh;

                    var isLastCol = c === cpl - 1;
                    var isLastRow = r === pageRows.length - 1;
                    if (isLastCol) cell.classList.add('col-last');
                    if (isLastRow) cell.classList.add('row-last');

                    var inner = document.createElement('span');
                    inner.className = 'cell-inner';
                    if (ch === ' ') {
                        inner.innerHTML = '&nbsp;';
                    } else if (ch === '') {
                        inner.innerHTML = '&nbsp;';
                    } else {
                        inner.textContent = ch;
                    }
                    cell.appendChild(inner);
                    grid.appendChild(cell);
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

    function buildTxtContent() {
        return normalizeText(textInput.value);
    }

    function onTxt() {
        var blob = new Blob([buildTxtContent()], { type: 'text/plain;charset=utf-8' });
        downloadBlob('字帖內容.txt', blob);
        setStatus('已下載 TXT');
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
                backgroundColor: '#fffdf8',
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

    var inputs = [
        textInput, fontPreset, customFont, gridType, fontSize, lineHeight,
        pageSize, charsPerLine, linesPerPage
    ];
    inputs.forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', scheduleRender);
        el.addEventListener('change', scheduleRender);
    });
    if (btnRegenerate) btnRegenerate.addEventListener('click', renderNow);
    if (btnPrint) btnPrint.addEventListener('click', onPrint);
    if (btnPdf) btnPdf.addEventListener('click', function () { onPdf(); });
    if (btnPng) btnPng.addEventListener('click', function () { onPng(); });
    if (btnTxt) btnTxt.addEventListener('click', onTxt);

    renderNow();
})();
