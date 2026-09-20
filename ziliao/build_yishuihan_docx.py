#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""產生《易水寒》荊軻刺秦王教學遊戲前期計畫 Word 文檔。"""

from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

HERE = Path(__file__).resolve().parent
STYLES = HERE / "yi-shui-han-styles"
OUT = HERE / "易水寒-荊軻刺秦王教學遊戲前期計畫.docx"

INK = RGBColor(0x3A, 0x32, 0x28)
INK_SOFT = RGBColor(0x6A, 0x5C, 0x4E)
TITLE = RGBColor(0x6B, 0x3A, 0x2E)
HEADER_BG = "E8D7C0"
ROW_ALT = "FBF7EE"
LINE = "D9CBB6"
ACCENT_HEX = "A66A4A"

FONT_TITLE = "Songti SC"
FONT_BODY = "PingFang TC"


def set_run_font(run, name, size=11, bold=False, color=INK):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.append(rFonts)
    rFonts.set(qn("w:ascii"), name)
    rFonts.set(qn("w:hAnsi"), name)
    rFonts.set(qn("w:eastAsia"), name)
    rFonts.set(qn("w:cs"), name)


def add_text(p, text, size=11, bold=False, color=INK, font=FONT_BODY):
    run = p.add_run(text)
    set_run_font(run, font, size, bold, color)
    return run


def shade_cell(cell, hex_color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = tcPr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tcPr.append(shd)
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)


def set_cell_border(cell):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = tcPr.find(qn("w:tcBorders"))
    if tcBorders is None:
        tcBorders = OxmlElement("w:tcBorders")
        tcPr.append(tcBorders)
    for edge in ("top", "left", "bottom", "right"):
        el = tcBorders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            tcBorders.append(el)
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), LINE)


def set_cell_margins(cell, top=40, bottom=40, left=60, right=60):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = tcPr.find(qn("w:tcMar"))
    if tcMar is None:
        tcMar = OxmlElement("w:tcMar")
        tcPr.append(tcMar)
    for name, val in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        node = tcMar.find(qn(f"w:{name}"))
        if node is None:
            node = OxmlElement(f"w:{name}")
            tcMar.append(node)
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")


def prevent_row_split(row):
    tr = row._tr
    trPr = tr.get_or_add_trPr()
    cant = trPr.find(qn("w:cantSplit"))
    if cant is None:
        cant = OxmlElement("w:cantSplit")
        trPr.append(cant)


def fill_cell(cell, text, *, header=False, size=10, bold=False, center=False):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    add_text(
        p,
        text,
        size=size,
        bold=bold or header,
        color=TITLE if header else INK,
        font=FONT_TITLE if header else FONT_BODY,
    )
    shade_cell(cell, HEADER_BG if header else "FFFFFF")
    set_cell_border(cell)
    set_cell_margins(cell)


def add_table(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    tbl = table._tbl
    tblPr = tbl.tblPr
    if tblPr is None:
        tblPr = OxmlElement("w:tblPr")
        tbl.insert(0, tblPr)
    layout = tblPr.find(qn("w:tblLayout"))
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tblPr.append(layout)
    layout.set(qn("w:type"), "fixed")

    for i, h in enumerate(headers):
        fill_cell(table.rows[0].cells[i], h, header=True, size=10, center=True)
    prevent_row_split(table.rows[0])

    for r_i, row in enumerate(rows):
        for c_i, val in enumerate(row):
            fill_cell(table.rows[r_i + 1].cells[c_i], val, size=10)
            if r_i % 2 == 1:
                shade_cell(table.rows[r_i + 1].cells[c_i], ROW_ALT)
        prevent_row_split(table.rows[r_i + 1])

    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = w
    doc.add_paragraph()
    return table


def heading(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16 if level == 1 else 12)
    p.paragraph_format.space_after = Pt(8)
    add_text(p, text, size=18 if level == 1 else 14, bold=True, color=TITLE, font=FONT_TITLE)
    p.style = doc.styles[f"Heading {level}"]
    # keep custom font after style assignment
    if p.runs:
        set_run_font(p.runs[0], FONT_TITLE, 18 if level == 1 else 14, True, TITLE)
    return p


def body(doc, text, *, size=11, bold=False, space_after=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.35
    add_text(p, text, size=size, bold=bold)
    return p


def caption(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(12)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_text(p, text, size=9, color=INK_SOFT)
    return p


def add_picture(doc, path, width_cm=15.2):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run()
    run.add_picture(str(path), width=Cm(width_cm))


def set_page(doc):
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.left_margin = Cm(1.8)
    section.right_margin = Cm(1.8)
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.different_first_page_header_footer = False
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_text(p, "《易水寒》荊軻刺秦王教學遊戲前期計畫", size=8, color=INK_SOFT)


def build():
    doc = Document()
    set_page(doc)
    normal = doc.styles["Normal"]
    normal.font.name = FONT_BODY
    normal.font.size = Pt(11)
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), FONT_BODY)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(4)
    add_text(p, "國中教學遊戲前期計畫", size=12, color=INK_SOFT, font=FONT_TITLE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    add_text(p, "易水寒：荊軻刺秦王", size=26, bold=True, color=TITLE, font=FONT_TITLE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    add_text(p, "對照「帶薪穿越大明」影片步驟，已填好可開工的完整方案", size=11, color=INK_SOFT)

    body(
        doc,
        "本文件把小紅書〈文科生用 GLM 5.3 做了款古風穿越遊戲〉（帶薪穿越大明，約 2 分 50 秒）裡實際提到的前期準備，整理成表格；並依同一套方法，直接填成給約 14 歲國中生的教學遊戲《易水寒》。學生不是去改寫歷史，而是以燕國見習舍人身分把《史記·刺客列傳》走一遍：籌物、送別、入殿、事敗，並在每一件道具底下看到引文。選擇只加深理解，不開放「刺秦成功」。",
    )

    heading(doc, "一、專案鎖定", 1)
    add_table(
        doc,
        ["項目", "已鎖定內容"],
        [
            ["遊戲名", "《易水寒》"],
            ["受眾", "國中生，約 14 歲"],
            ["時長", "一堂課 25–35 分鐘打完主線"],
            ["成品", "瀏覽器教學遊戲／靜態頁"],
            ["時代", "戰國末期，燕王喜二十八年／秦始皇二十年（前 227）"],
            ["玩法", "八章敘事＋史料解謎＋選擇；不是戰鬥砍殺"],
            ["玩家角色", "燕太子丹府中的見習舍人"],
            ["主線文獻", "《史記·刺客列傳》，以《戰國策·燕策三》《史記·秦始皇本紀》對讀"],
            ["美術", "方案 1：木刻線稿＋淡彩（對標《天工開物》線條語言）"],
            ["結局", "荊軻必敗；重開一局不放在主按鈕"],
        ],
        col_widths=[Cm(4.2), Cm(13.0)],
    )

    heading(doc, "二、影片要求 × 本專案對照", 1)
    body(
        doc,
        "影片分成四段：結構化提需求、美術資產、交互效果、開發心得。下表是畫面與口播裡真正要先做的事，以及《易水寒》已經填好的答案。",
        size=10,
    )
    add_table(
        doc,
        ["#", "影片段落", "她要你先做的具體事", "《易水寒》已填計畫"],
        [
            [
                "1",
                "結構化提需求",
                "先說清楚要做什麼：玩法、朝代、成品形態，不要直接叫 AI 開工。",
                "做給約 14 歲國中生的瀏覽器教學遊戲《易水寒》。玩家扮演燕太子丹府中的見習舍人，依《史記·刺客列傳》協助籌備刺秦。玩法是「八章敘事＋史料解謎＋選擇」，不是戰鬥砍殺。一堂課 25–35 分鐘打完主線。",
            ],
            [
                "2",
                "結構化提需求",
                "劃清楚考據邊界：哪些必須真、哪些不准編；出處優先官方或公開學術。",
                "採信《史記·刺客列傳》主線，用《戰國策·燕策三》《史記·秦始皇本紀》對讀。兩書有出入處做成「對讀卡」，不改史。不採用影視戲說、穿越改結局、刺秦成功。找不到文獻或文物依據的道具不進遊戲。",
            ],
            [
                "3",
                "結構化提需求",
                "指定時代，並問清「哪朝史料最多、最好考據」。",
                "鎖定戰國末期、燕王喜二十八年／秦始皇二十年（前 227）。不改宋、明。秦漢文獻與出土最多，足夠支撐課堂深度。",
            ],
            [
                "4",
                "結構化提需求",
                "內容庫要能找到畫作／器物圖再選；每件底下標註引用來源。",
                "只收八件核心物：樊於期首函、督亢地圖、徐夫人匕首、地圖匣、白衣冠、高漸離筑、殿中銅柱、夏無且藥囊。每件遊戲內顯示文獻句＋來源層級。首函用合上的匣象徵，不畫血肉。",
            ],
            [
                "5",
                "結構化提需求",
                "史料分層＋交叉自洽驗證，讓 AI 先出方案再確認。",
                "四層來源：正史、國策、考古、課綱。人物關係、出使禮儀、地圖與匕首來源都要能對上。先產出本計畫，確認後才寫程式。",
            ],
            [
                "6",
                "美術資產",
                "先讓 AI 列出完整「素材清單／視覺規範與生成指引」，再批次生圖。",
                "先鎖定畫風聖經與檔名表：9 名角色、5 處場景、8 件道具、UI 組件。圖片進 assets/raw/，壓縮後自動替換占位。沒圖前用 SVG 木刻線稿也能完整遊玩。",
            ],
            [
                "7",
                "美術資產",
                "視覺對標一部可考據的歷史插畫，不要「大街古風」。",
                "對標明代《天工開物》插圖的線條語言，題材改用戰國器物輪廓（銅器、車馬、深衣）。畫風：手繪線稿＋淡彩。拒絕仙俠、霓虹國風、日系大眼。",
            ],
            [
                "8",
                "美術資產",
                "把線質、構圖、色板寫進同一份提示詞，並與 UI 色完全一致。",
                "線條為骨、淡彩為肉；墨線有刀感與粗細變化，不用 CAD 細線、不用素描排線。留白 ≥40%，地平線低。色板見下文。",
            ],
            [
                "9",
                "交互效果",
                "先寫逐秒分鏡表：時間軸對畫面，再交給 AI 做動效。",
                "開場 0–5 秒：易水寬景 → 白衣冠一行 →「風蕭蕭兮易水寒」墨字 → 擊筑 → 進入第一章。後續每章都有 4–6 行分鏡，禁止無時間碼的「做漂亮一點」。",
            ],
            [
                "10",
                "交互效果",
                "把關鍵操作寫成可執行邏輯方案，主次按鈕分清，避免誤觸、邏輯自洽。",
                "主線不可改史：荊軻必敗。選擇只影響「理解深度／史料卡／課堂分數」，不影響史實結局。主按鈕＝繼續出使；次按鈕＝重看史料。重開一局是小字確認，不放在主按鈕。",
            ],
            [
                "11",
                "開發心得",
                "AI 用來放大人的判斷，不是代替備課；同一專案越寫越順。",
                "教師先審這份計畫與史料卡，再讓模型寫程式。每章完成後回歸本表檢查：有沒有出處、有沒有超尺度、畫風有沒有漂。",
            ],
        ],
        col_widths=[Cm(1.2), Cm(3.2), Cm(5.8), Cm(7.0)],
    )

    heading(doc, "三、已鎖定的設計邊界", 1)
    add_table(
        doc,
        ["面向", "規定"],
        [
            [
                "玩法",
                "章節式視覺敘事。每章 1 個場景、1 段對話、1–2 個選擇、1 張可點史料卡。三件信物（首函、地圖、匕首）收齊才能進入易水。沒有戰鬥數值、沒有商城。",
            ],
            [
                "考據邊界",
                "能對上《史記》或《戰國策》的才進主線。樊於期、夏無且、銅柱、白衣冠全部保留。不准穿越改結局、不准加飛劍、不准把秦王寫成卡通暴君。有爭議處只做對讀，不做「標準答案改史」。",
            ],
            [
                "14 歲教學目標",
                "能依序複述情節；能解釋督亢地圖、藥淬匕首、九賓、群臣不得持兵；能指出失敗原因（副使失態、劍長不及、殿中無兵）；能用自己的話談「士」與代價。對應國文課文＋歷史秦滅六國。",
            ],
            [
                "尺度",
                "田光自刎、樊於期獻首、殿中行刺都用象徵：劍置案、匣合蓋、袖斷、環柱。不渲染血、不特寫首級、不把暴力寫成爽感。失敗結局要寫清楚：這是悲劇，不是通關獎勵。",
            ],
        ],
        col_widths=[Cm(3.6), Cm(13.6)],
    )

    heading(doc, "四、史料源分層", 1)
    body(doc, "對應影片「全部官方／公開學術來源」表。遊戲內每張史料卡顯示層級徽章。", size=10)
    add_table(
        doc,
        ["層級", "來源", "管什麼", "在遊戲裡出現的內容"],
        [
            [
                "L1 正史",
                "《史記·刺客列傳》《史記·秦始皇本紀》",
                "情節主線、人物、結局",
                "田光自刎、樊於期獻頭、易水、圖窮匕見、事敗",
            ],
            [
                "L2 國策",
                "《戰國策·燕策三》",
                "對讀差異、外交辭令",
                "太子丹質秦逃歸、請荊軻、地圖與匕首的籌備",
            ],
            [
                "L3 考古",
                "燕下都遺址、咸陽宮遺址、兵馬俑、戰國銅器與車馬器",
                "建築、服飾輪廓、器物形制",
                "館舍、宮室柱網、地圖匣、筑、銅柱的外形依據",
            ],
            [
                "L4 課綱",
                "國中國文〈荊軻刺秦王〉課文與注釋；歷史「秦滅六國」",
                "14 歲詞彙、課堂任務",
                "字詞（淬、匕、九賓、偏袒）、課後選擇題與短答",
            ],
        ],
        col_widths=[Cm(2.6), Cm(5.6), Cm(3.8), Cm(5.2)],
    )

    heading(doc, "五、八章結構", 1)
    add_table(
        doc,
        ["章", "時空", "學生會經歷什麼", "這一章要學會什麼"],
        [
            ["0 序", "前 227 · 燕下都", "見習舍人接到密令：秦已滅韓趙，燕危。", "認清「為何非刺不可」與「為何極危險」"],
            ["1 薦士", "太子丹府", "田光薦荊軻，為守密自刎。", "判斷「士為知己者死」是氣節還是壓力；對讀兩書"],
            ["2 樊將軍", "館舍", "荊軻要樊於期之首以取秦王信。", "權衡：獻首能否換近身？課堂討論倫理，畫面只用合匣"],
            ["3 備物", "燕市／館中", "籌督亢地圖、徐夫人匕首、藥淬、地圖匣。", "三物齊備才能啟程；每物點開看出處"],
            ["4 易水", "易水河畔", "白衣冠送行，高漸離擊筑，歌「風蕭蕭兮易水寒」。", "聽歌填空＋解釋為何穿白衣冠"],
            ["5 入秦", "咸陽道", "秦舞陽色變；荊軻圓場，趨至陛前。", "辨「副使失態」如何幾乎壞事"],
            ["6 圖窮", "咸陽宮前殿", "九賓之禮，獻圖，圖窮而匕見。秦王環柱而走。", "還原空間：銅柱、群臣不得持兵、夏無且藥囊"],
            ["7 事敗", "殿中 → 燕亡", "荊軻被殺；後續秦破燕。固定史實結局。", "回答：失敗原因、為何仍被記入〈刺客列傳〉"],
        ],
        col_widths=[Cm(2.4), Cm(3.4), Cm(5.8), Cm(5.6)],
    )

    heading(doc, "六、物件庫", 1)
    body(doc, "對應影片「每個商品底下都標註了引用來源」。找不到出處的不進遊戲。", size=10)
    add_table(
        doc,
        ["物件", "畫面怎麼呈現", "引用", "層級", "狀態"],
        [
            ["樊於期首函", "合上漆匣，不開蓋", "《史記·刺客列傳》", "L1", "可進"],
            ["督亢地圖", "卷帛地圖，燕南富地", "《史記》《戰國策》", "L1／L2", "可進"],
            ["徐夫人匕首", "趙國匕首；只寫藥淬，不畫刺入", "《史記·刺客列傳》", "L1", "可進"],
            ["地圖匣", "木匣藏匕於圖", "情節需要＋戰國漆木器形制", "L1＋L3", "可進"],
            ["白衣冠", "送行者縞衣白冠", "《史記》「皆白衣冠以送之」", "L1", "可進"],
            ["高漸離筑", "擊筑樂器", "《史記》易水、後傳高漸離", "L1＋L3", "可進"],
            ["殿中銅柱", "秦王環柱而走的空間錨", "《史記》匕首中桐柱", "L1", "可進"],
            ["夏無且藥囊", "侍醫提藥囊擊軻", "《史記·刺客列傳》", "L1", "可進"],
            ["飛劍／穿越符", "影視常見", "無文獻", "—", "不進"],
            ["刺秦成功線", "改史", "與課綱、史料衝突", "—", "不進"],
        ],
        col_widths=[Cm(3.2), Cm(4.6), Cm(4.4), Cm(2.4), Cm(2.6)],
    )

    heading(doc, "七、美術資產清單", 1)
    body(doc, "影片原句：「我的做法是，讓它先列出完整的美術資產清單。」下列即《易水寒》版本。沒圖前先做 SVG 墨線占位，遊戲仍可把八章點完。", size=10)
    add_table(
        doc,
        ["類型", "要產出什麼", "規格"],
        [
            ["角色立繪", "荊軻、太子丹、田光、樊於期、秦舞陽、高漸離、秦始皇、夏無且、玩家舍人", "char/*.png 透明底，同一頭身比"],
            ["表情變體", "每人 3 面：靜、急、悲（秦舞陽加「色變」）", "只改五官，不改服裝"],
            ["場景寬圖", "燕下都館舍、太子丹府、易水河畔、咸陽道、咸陽宮前殿", "16:9，留白 40%，可作章節底"],
            ["道具圖", "八件核心物＋史料卡小圖", "方圖，線稿清楚，適合點擊熱區"],
            ["UI", "紙本對話框、選擇鈕、史料卡、進度「督亢圖卷」", "色板與場景完全同一套"],
            ["占位", "先做 SVG 墨線稿", "沒生圖也能把八章點完"],
        ],
        col_widths=[Cm(3.2), Cm(8.8), Cm(5.2)],
    )

    heading(doc, "畫風聖經", 2)
    body(
        doc,
        "手繪線稿＋淡彩，仿古木刻，近《天工開物》插圖線條，題材用戰國深衣與銅器輪廓。線條為骨、淡彩為肉；淡彩只在結構內低透明度平塗。線質：墨線微顫、轉角圓勁、有刀感。不用均勻細線，不用素描排線，不用霓虹金邊。構圖：留白至少四成，主體不頂滿，地平線偏低。克制、安靜，一眼能讀角色。",
    )
    add_table(
        doc,
        ["色名", "色碼", "用途"],
        [
            ["駝米紙底", "#F3E6C9", "頁面、卡片、生圖背景"],
            ["淡墨勾線", "#3C382F", "線稿，不用純黑"],
            ["燕玄衣", "#2C2A28", "荊軻、使團"],
            ["縞衣", "#EFE8DC", "易水送行"],
            ["易水青", "#5B6E6A", "河、遠山"],
            ["土赭", "#8C5A3C", "秦宮木構"],
            ["朱砂", "#9A3B2F", "只作點綴，不鋪滿"],
        ],
        col_widths=[Cm(4.0), Cm(4.0), Cm(9.2)],
    )
    body(doc, "給生圖模型的固定前綴：", size=10, space_after=4)
    body(
        doc,
        "Chinese educational game asset. Late Warring States, Jing Ke story. Hand-inked woodblock line plus light wash, Tiangong Kaiwu print language, paper beige #F3E6C9, ink #3C382F, 40% empty paper, low horizon, no anime, no xianxia, no blood, no gore, no modern objects, no text.",
        size=9,
    )

    heading(doc, "八、開場逐秒分鏡", 1)
    body(doc, "對應影片「分鏡 v2（逐秒）」。後續每章都要有同樣格式的 4–6 行，禁止只說「做漂亮一點」。", size=10)
    add_table(
        doc,
        ["時間", "畫面", "交互／聲音"],
        [
            ["0.0–1.0s", "純寬景：易水、蘆葦、低地平線，無 UI", "靜，風動蘆葦循環"],
            ["1.0–2.2s", "白衣冠一行自左側入畫，荊軻玄衣立於岸", "慢推 8%"],
            ["2.2–3.4s", "高漸離席地擊筑，墨點落下成聲紋", "筑聲起，音量低"],
            ["3.4–4.6s", "紙縫留白處浮現「風蕭蕭兮易水寒，壯士一去兮不復還」", "墨字，不搶框"],
            ["4.6–5.6s", "字停駐 1 秒", "無新元素"],
            ["5.6–6.4s", "字淡出，底部出現「第一章 · 薦士」與主按鈕「隨田光入府」", "主鈕實心；「重看課文」為小字"],
            ["6.4s 起", "可操作。誤觸重開不存在於這一屏", "進入章節狀態機"],
        ],
        col_widths=[Cm(3.0), Cm(8.6), Cm(5.6)],
    )

    heading(doc, "九、關鍵交互邏輯", 1)
    body(
        doc,
        "影片在「回檔＝對賬，不是再賣銀子」裡強調：主操作與毀滅性操作必須分開。本遊戲同樣處理「重來」與「看史料」。已選方案 A。",
        size=10,
    )
    add_table(
        doc,
        ["方案", "學生按下去會怎樣", "採用"],
        [
            ["A 繼續出使", "主按鈕永遠是「往下一章」。選錯只打開史料卡或扣課堂分，史實結局不變。", "採用"],
            ["B 改史分支", "讓荊軻刺中秦王。有戲劇性，但破壞課綱與考據邊界。", "不用"],
            ["C 一鍵清空", "主畫面放「重開一局」。容易誤觸，且像把悲劇當遊戲幣重刷。", "不用；重開放進選單小字＋二次確認"],
        ],
        col_widths=[Cm(3.4), Cm(9.6), Cm(4.2)],
    )

    heading(doc, "十、五種美術風格參考", 1)
    body(
        doc,
        "以下五張皆為課堂安全尺度。方案 1 已鎖定為生產風格；其餘只當扉頁、紋樣或宣傳圖，不混進關卡循環。",
        size=10,
    )
    add_table(
        doc,
        ["風格", "決策", "為什麼", "用在哪"],
        [
            ["1 木刻線稿＋淡彩", "已鎖定", "線條清楚、留白多、不血腥、生圖一致性高，最接近影片做法。", "課堂主視覺、全部角色／場景／UI"],
            ["2 楚帛畫／漆器礦彩", "備用章封面", "儀式感強，但變形大、服裝易漂，不適合作操作介面。", "僅「易水」「圖窮」兩張章節扉頁"],
            ["3 漢畫像石拓片", "史料卡點綴", "博物館感好，但漢代冠服易與戰國考據打架，學生也較難讀表情。", "史料卡背景紋，不用於立繪"],
            ["4 教科書連環畫", "備用總風格", "臉最親切，適合 14 歲；缺點是偏現代插畫，資產一致性略差。", "若要更暖的臉，立繪可改這套，場景仍用方案 1"],
            ["5 工筆重彩宮殿", "不用作主風格", "咸陽宮很有魄力，但細節太多、生成不穩，也不利批次替換。", "可做一張宣傳圖，不進關卡循環"],
        ],
        col_widths=[Cm(3.8), Cm(2.8), Cm(5.6), Cm(5.0)],
    )

    style_blocks = [
        (
            "style-1-woodcut-wash.png",
            "方案 1｜木刻線稿＋淡彩（已鎖定）",
            "易水送別。對標《天工開物》插圖線條：墨線為骨、淡彩為肉、大量留白。作為全部角色、場景與 UI 的生產風格。",
        ),
        (
            "style-2-chu-silk.png",
            "方案 2｜楚帛畫／漆器礦彩",
            "同一送別場面，礦彩、雲氣與鳳鳥紋。儀式感強，只宜做章節扉頁，不宜做操作介面。",
        ),
        (
            "style-3-han-stone.png",
            "方案 3｜漢畫像石拓片",
            "墨拓高對比、幾何邊飾。有博物館感，但衣冠偏漢，只當史料卡背景紋。",
        ),
        (
            "style-4-textbook-lianhuanhua.png",
            "方案 4｜教科書連環畫",
            "臉較親切，接近國中課本插圖。若教師要更暖的立繪可改這套，場景仍走方案 1。",
        ),
        (
            "style-5-qin-gongbi.png",
            "方案 5｜工筆重彩宮殿",
            "咸陽宮獻圖（課堂安全：只獻圖、不見匕、不畫血）。魄力夠，細節太密，最多做一張宣傳圖。",
        ),
    ]
    for filename, title, desc in style_blocks:
        heading(doc, title, 2)
        body(doc, desc, size=10, space_after=6)
        add_picture(doc, STYLES / filename, width_cm=14.8)
        caption(doc, title.replace("｜", " · "))

    heading(doc, "十一、開工順序", 1)
    body(
        doc,
        "依影片：先有這份結構化需求 → 用美術資產表生 SVG 占位 → 寫八章狀態機與開場分鏡動效 → 再按色板批次生圖替換。美術只走方案 1；方案 2、3 當紋樣；方案 5 最多一張宣傳圖。教師先審史料卡與尺度，再讓模型寫程式。每章完成後回到第二節對照表檢查：有沒有出處、有沒有超尺度、畫風有沒有漂。",
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_text(p, "—— 完 ——", size=11, color=INK_SOFT, font=FONT_TITLE)

    doc.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    build()
