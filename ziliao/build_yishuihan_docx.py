#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""產生《易水寒》荊軻刺秦王教學遊戲前期計畫 Word 文檔。"""

from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
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
    add_text(p, "《易水寒》荊軻刺秦王教學遊戲前期計畫（分支商店版）", size=8, color=INK_SOFT)


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
    add_text(p, "國中教學遊戲前期計畫　·　分支商店版", size=12, color=INK_SOFT, font=FONT_TITLE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    add_text(p, "易水寒：荊軻刺秦王", size=26, bold=True, color=TITLE, font=FONT_TITLE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    add_text(p, "選擇會改走向　·　商店有圖可逛　·　多結局　·　全部生圖、不用 SVG", size=11, color=INK_SOFT)

    body(
        doc,
        "這次改寫的核心不是「把課文點完」，而是讓學生在燕國籌備刺秦時自己做決定。兵器庫、信物庫、同伴署都像商店：每件東西有獨立插圖，點下去會看到利弊，選了就寫進行囊，後面的關卡與結局會跟著變。史實路線是眾多可能之一，不是唯一通關法。學生要思考的是：為什麼匕首必須短？為什麼要地圖？為什麼副使會壞事？選錯不是扣分了事，而是走出另一個看得見的後果。",
    )
    body(
        doc,
        "表格格式仍對照小紅書〈文科生用 GLM 5.3 做了款古風穿越遊戲〉的前期步驟。美術改為較誇張、不那麼傳統的五種風格，全部用生圖，禁止 SVG 占位。",
    )

    heading(doc, "一、專案鎖定", 1)
    add_table(
        doc,
        ["項目", "已鎖定內容"],
        [
            ["遊戲名", "《易水寒》"],
            ["受眾", "國中生，約 14 歲"],
            ["時長", "一堂課 30–40 分鐘可走完一條線；可重開看其他結局"],
            ["成品", "瀏覽器教學遊戲；畫面全為生圖，不用 SVG"],
            ["時代", "戰國末期，燕王喜二十八年／秦始皇二十年（前 227）"],
            ["玩法", "可逛商店的分支敘事：兵器庫／信物庫／同伴署 → 入秦 → 多結局"],
            ["玩家角色", "燕太子丹府中的見習舍人，替荊軻採買、決策、同行"],
            ["主線文獻", "《史記·刺客列傳》，對讀《戰國策·燕策三》《史記·秦始皇本紀》"],
            ["美術", "方案 D：復古 RPG 道具卡（已鎖定）。商店裡每件兵器都是可點的插畫卡"],
            ["結局", "六條，含史實線與「假設刺中」思考線；沒有戰鬥砍殺"],
        ],
        col_widths=[Cm(4.2), Cm(13.0)],
    )

    heading(doc, "二、影片要求 × 本專案對照", 1)
    body(
        doc,
        "影片四段仍是：結構化提需求、美術資產、交互效果、開發心得。右欄已改成「選擇會分叉」的版本。",
        size=10,
    )
    add_table(
        doc,
        ["#", "影片段落", "她要你先做的具體事", "《易水寒》已填計畫（本版）"],
        [
            [
                "1",
                "結構化提需求",
                "先說清楚要做什麼：玩法、朝代、成品形態。",
                "給 14 歲的分支籌備遊戲。學生可進兵器庫、信物庫、同伴署「採買」。每項有圖。選擇寫入行囊，改變後續關卡與結局。不是戰鬥，是決策模擬。",
            ],
            [
                "2",
                "結構化提需求",
                "劃清楚考據邊界。",
                "商店裡的每件東西都要能說出文獻或文物依據，或標成「有意的假設」。假設線（例如刺中秦王）結束後必須對讀《史記》，問學生：史書為什麼不是這樣走？不准無來源的飛劍、火器、穿越符。",
            ],
            [
                "3",
                "結構化提需求",
                "指定時代。",
                "仍鎖定前 227 燕秦。兵器形制用戰國：劍、匕、吳鉤、弩、銅兵。生圖提示詞禁止近代槍炮。",
            ],
            [
                "4",
                "結構化提需求",
                "內容庫要能找到圖；每件標註來源。",
                "改成三個可逛的店，不是固定八件道具。兵器庫 6 選 1、信物庫可多選、同伴署 3 選 1。每張商品卡：插圖、一句利、一句弊、一條史料或假設標記。",
            ],
            [
                "5",
                "結構化提需求",
                "史料分層＋交叉驗證，先出方案再開工。",
                "四層來源不變。另加「遊戲旗標」表：藏得住／過得了搜檢／取不取信／副使會不會色變。結局由旗標組合決定，不靠隨機。",
            ],
            [
                "6",
                "美術資產",
                "先列完整素材清單再批次生圖。",
                "清單改為：角色、三間店場景、每件商品獨立圖、六張結局卡、UI。全部生圖。禁止 SVG 占位；沒圖就不進遊戲，先把該張圖生出來。",
            ],
            [
                "7",
                "美術資產",
                "視覺對標一套可重複的風格，不要大街古風。",
                "本版不走木刻淡彩。主風格鎖定復古 RPG 道具卡：誇張角色立繪＋金框物品卡，適合「看圖選兵器」。其餘四種誇張風格見第十節。",
            ],
            [
                "8",
                "美術資產",
                "線質、構圖、色板寫進提示詞，與 UI 一致。",
                "色板改為暗金／深藍斗篷／朱砂邊／銅綠。商店卡同一套金框。提示詞固定寫：no SVG, painted illustration, no firearms, no blood, no readable letters。",
            ],
            [
                "9",
                "交互效果",
                "先寫逐秒分鏡。",
                "開場改為推入兵器庫：貨架上多件兵器依次亮起，再交給玩家點選。每個商店都有「進店 2 秒分鏡 → 可點商品」。",
            ],
            [
                "10",
                "交互效果",
                "關鍵操作寫成可執行邏輯，主次鈕分清。",
                "主操作＝把東西放進行囊／出發。次操作＝看利弊與史料。毀滅性操作＝丟棄行囊重開，放選單並二次確認。選了長劍，後面就不能假裝還拿著匕首。",
            ],
            [
                "11",
                "開發心得",
                "AI 放大判斷，不代替備課。",
                "教師先玩過兩條線（史實線＋搜檢失敗線）再帶班。課後問：哪一條最接近《史記》？你為什麼當初不選匕首？",
            ],
        ],
        col_widths=[Cm(1.2), Cm(3.2), Cm(5.6), Cm(7.2)],
    )

    heading(doc, "三、已鎖定的設計邊界", 1)
    add_table(
        doc,
        ["面向", "規定"],
        [
            [
                "玩法",
                "燕下都可自由進出三間店，直到按下「啟程」。之後不能再改行囊。入秦後依旗標走分支，不再回到商店。沒有血量條、沒有真的砍殺畫面。",
            ],
            [
                "思考性",
                "商品先給「利／弊」不問標準答案。第一次遊玩不劇透史實。結局畫面才打開對讀卡：這一次跟《史記》哪裡一樣、哪裡不一樣。鼓勵重開，比較不同結局。",
            ],
            [
                "考據",
                "史實元件（匕、地圖、樊於期函、白衣冠、秦舞陽、銅柱、藥囊）必須可選。假設元件標「假設」。火器、飛劍、穿越、無來源魔法不進店。",
            ],
            [
                "尺度",
                "兵器是器物圖，不是殺人特寫。樊於期只用合匣。結局用袖、柱、匣、搜檢、詔令象徵，不畫血。刺中線不是勝利狂歡，而是「然後呢」的史論。",
            ],
        ],
        col_widths=[Cm(3.6), Cm(13.6)],
    )

    heading(doc, "四、史料源分層", 1)
    add_table(
        doc,
        ["層級", "來源", "管什麼", "在遊戲裡怎麼用"],
        [
            ["L1 正史", "《史記·刺客列傳》《史記·秦始皇本紀》", "史實元件與史實結局", "匕首、地圖、函、白衣冠、副使色變、環柱、藥囊"],
            ["L2 國策", "《戰國策·燕策三》", "外交與籌備對讀", "為何要信物才能近秦王"],
            ["L3 考古", "燕下都、咸陽宮、戰國銅兵、弩機、劍的形制", "店裡兵器長什麼樣", "長劍、吳鉤、弩、銅兵的外形；禁止近代槍"],
            ["L4 課綱", "國文〈荊軻刺秦王〉；歷史秦滅六國", "詞彙與課後討論", "淬、匕、九賓、偏袒；「成功了燕就能活嗎」"],
        ],
        col_widths=[Cm(2.6), Cm(5.6), Cm(3.8), Cm(5.2)],
    )

    heading(doc, "五、章節：先逛店，再出發", 1)
    body(doc, "前半是可來回的商店區，後半被行囊鎖死。這才能讓「買錯兵器」真的走錯路。", size=10)
    add_table(
        doc,
        ["章", "空間", "學生做什麼", "這一章在想什麼"],
        [
            ["0 序", "燕下都", "接到密令：要幫荊軻籌備入秦。", "燕為什麼急、近秦王為什麼難"],
            ["1 薦士", "太子丹府", "聽田光、見荊軻。可問兩句，不可改史實人物。", "士為知己者死：氣節還是壓力"],
            ["2 信物庫", "可逛、可多選", "地圖／樊於期函／藥淬／縞衣，各有圖。", "沒有信物，秦王見不見你？"],
            ["3 兵器庫", "可逛、六選一", "看圖買兵器。這是最關鍵的分支。", "能藏進地圖的，才過得了搜檢"],
            ["4 同伴署", "可逛、三選一", "秦舞陽／另薦壯士／獨行。", "副使色變會不會提前暴露"],
            ["5 啟程", "易水", "白衣冠高歌、悄悄走、或大張旗鼓。", "名聲是壯行還是洩密"],
            ["6 入秦", "關與宮門", "系統用行囊判定搜檢、取信、覲見。", "前面的選擇在這裡兌現"],
            ["7 殿上／結局", "依旗標分叉", "走到六結局之一，打開對讀卡。", "跟《史記》比，你改了什麼、代價是什麼"],
        ],
        col_widths=[Cm(2.4), Cm(3.4), Cm(5.6), Cm(5.8)],
    )

    heading(doc, "六、兵器庫（看圖選，選了就改結局）", 1)
    body(
        doc,
        "店裡一次只能帶一件主兵器出發。每件都是獨立生圖，放在 RPG 金框卡上，點開才顯示利弊。第一次不寫「這是標準答案」。",
        size=10,
    )
    add_table(
        doc,
        ["兵器（皆有圖）", "表面上的好處", "實際後果旗標", "文獻／標記"],
        [
            ["徐夫人匕", "短、輕、可捲進地圖匣", "藏得住＝是；可藥淬＝是 → 能進殿", "L1《史記》"],
            ["燕國長劍", "氣勢足，像英雄", "藏得住＝否 → 關前搜出，結局「搜檢敗」", "L3 戰國長劍形制；假設用於入宮"],
            ["吳鉤", "彎刃近身利", "藏得住＝否（捲不進圖）→ 搜檢敗或殿上抽不出", "L3 吳鉤形制；假設"],
            ["弩機", "遠距離，看起來穩", "殿中無用＋過不了門 → 搜檢敗", "L3 戰國弩；殿中不得持兵"],
            ["銅鎚／戈", "一擊看起來很重", "完全藏不住 → 搜檢敗", "L3；假設"],
            ["不買，擬奪秦王佩劍", "身上乾淨，不怕搜", "進殿後劍長難拔（史實細節）→ 結局「拔劍不及」", "L1 秦王環柱、群臣不得持兵"],
        ],
        col_widths=[Cm(3.6), Cm(4.0), Cm(5.2), Cm(4.4)],
    )

    heading(doc, "七、信物庫與同伴署", 1)
    add_table(
        doc,
        ["商店", "選項（皆有圖）", "選了之後"],
        [
            ["信物庫", "督亢真圖", "秦廷願意見你；可把短兵藏進匣"],
            ["信物庫", "假地圖", "過得了門、獻圖時露餡，結局「獻圖敗」"],
            ["信物庫", "樊於期函（合匣，不開蓋）", "取信大增，才能近陛；倫理課後討論"],
            ["信物庫", "不用人頭、只帶禮物", "較難覲見，易走「不得近身」"],
            ["信物庫", "藥淬／不淬", "淬了：擊中可能致命。不淬：擊而不死"],
            ["同伴署", "秦舞陽（史實）", "殿上色變，暴露風險高，仍可能被荊軻圓場"],
            ["同伴署", "另薦膽壯者（假設）", "較不易色變，才開得了「刺中」思考線"],
            ["同伴署", "獨行", "沒有副手捧圖，獻圖不順，易露餡"],
        ],
        col_widths=[Cm(3.0), Cm(5.4), Cm(8.8)],
    )

    heading(doc, "八、六個結局（由行囊旗標決定）", 1)
    body(doc, "判定由上到下，先符合的先觸發。沒有隨機。每張結局都是一張生圖＋對讀卡，不是一段文字結束。", size=10)
    add_table(
        doc,
        ["結局", "觸發條件", "學生會看見", "要思考的問題"],
        [
            ["A 搜檢敗", "兵器藏不住", "宮門繳械，出使中止", "為什麼史書裡的兵器是「匕」不是劍？"],
            ["B 不得近身", "沒有真圖、也沒有取信之物", "九賓之禮輪不到你", "地圖和函，到底買的是什麼？"],
            ["C 獻圖敗", "假圖，或獨行捧圖失手", "圖未窮，計已破", "「圖窮」為什麼一定要有真圖？"],
            ["D 圖窮匕見（史實）", "短匕＋真圖＋取信＋秦舞陽", "環柱、藥囊、事敗（象徵畫面）", "最接近課文。失敗原因有幾條？"],
            ["E 擊而不死", "短匕進殿，但沒藥淬；或擬奪佩劍卻拔不出", "秦王負傷／拔劍不及，燕更快被問罪", "「淬」這個字為什麼在課文裡？"],
            ["F 刺中之後（思考線）", "短匕＋藥淬＋真圖＋取信＋膽壯同伴", "秦王倒，接著是詔令、亂局、燕仍難存", "刺中了，燕就能活嗎？為什麼《史記》不是這樣寫？"],
        ],
        col_widths=[Cm(3.6), Cm(4.2), Cm(4.6), Cm(4.8)],
    )

    heading(doc, "九、美術資產清單（全部生圖，不用 SVG）", 1)
    add_table(
        doc,
        ["類型", "要生什麼", "規格"],
        [
            ["角色立繪", "荊軻、太子丹、田光、樊於期、秦舞陽、膽壯者、高漸離、秦始皇、夏無且、店主、玩家舍人", "RPG 立繪，同一頭身比，透明或純色底"],
            ["商店場景", "兵器庫、信物庫、同伴署 各一張寬圖", "16:9 生圖，可放可點熱區"],
            ["商品卡", "6 兵器＋5 信物＋3 同伴＝14 張獨立圖", "金框卡，一眼能分辨，禁止槍炮"],
            ["結局卡", "結局 A–F 各一張", "象徵畫面，不血腥"],
            ["章節場景", "燕下都、太子丹府、易水、宮門、咸陽殿", "與角色同一套光色"],
            ["禁止", "SVG、純色方塊占位、emoji、火器、血、開蓋的首級", "沒圖就先生圖，不准用程式畫替代"],
        ],
        col_widths=[Cm(3.2), Cm(8.8), Cm(5.2)],
    )

    heading(doc, "畫風聖經（已鎖定方案 D）", 2)
    body(
        doc,
        "復古 RPG 道具卡：左側是誇張、嚴肅的角色立繪（可有斗篷與強輪廓光），右側或下方是金框物品卡。商店體驗要像「看圖選裝備」，不要像課本線描。不走木刻、工筆、帛畫。道具必須清楚可點。生圖若出現火槍、現代物件，整張作廢重來。",
    )
    add_table(
        doc,
        ["色名", "色碼", "用途"],
        [
            ["夜藍斗篷", "#1B2A4A", "角色、商店暗部"],
            ["暗金框", "#C9A24A", "商品卡邊、UI"],
            ["朱砂邊", "#9A3B2F", "選中、關鍵道具"],
            ["銅綠", "#3F6F64", "信物、地圖"],
            ["燈暖", "#E8C99A", "店鋪光源"],
            ["墨底", "#161410", "卡面底，不用純黑死黑"],
        ],
        col_widths=[Cm(4.0), Cm(4.0), Cm(9.2)],
    )
    body(doc, "給生圖模型的固定前綴：", size=10, space_after=4)
    body(
        doc,
        "Educational history game asset, late Warring States China, Jing Ke. Painted 1990s JRPG illustration, exaggerated heroic proportions, gold inventory frames, dark blue cloak, vermillion and bronze accents, clear readable weapon icons, no SVG, no vector flat icons, no firearms, no rifles, no blood, no gore, no modern objects, no readable text, no watermark.",
        size=9,
    )

    heading(doc, "十、開場逐秒分鏡（進兵器庫）", 1)
    add_table(
        doc,
        ["時間", "畫面", "交互"],
        [
            ["0.0–1.2s", "兵器庫寬景生圖：貨架未亮", "不可點"],
            ["1.2–3.0s", "六張兵器卡由左至右依次亮起（皆為生圖）", "仍不可點，建立「有很多選擇」"],
            ["3.0–4.0s", "荊軻立繪側立，店主抬手", "低語：挑一件能活著走到殿上的"],
            ["4.0s 起", "六卡可點；點開顯示利／弊，尚未寫史實答案", "主鈕「放進行囊」；次鈕「先不買，去別家店」"],
        ],
        col_widths=[Cm(3.0), Cm(8.6), Cm(5.6)],
    )

    heading(doc, "十一、關鍵交互邏輯", 1)
    add_table(
        doc,
        ["方案", "學生按下去會怎樣", "採用"],
        [
            ["A 行囊分叉", "選什麼就帶什麼。長劍不能在殿上變成匕首。結局由旗標表決定。", "採用"],
            ["B 只改分數、結局不變", "怎麼選都圖窮匕見。互動是假的。", "不用"],
            ["C 主畫面「重開」", "誤觸會把一堂課的思考清掉。", "不用；重開放選單＋二次確認"],
        ],
        col_widths=[Cm(3.6), Cm(9.4), Cm(4.2)],
    )

    heading(doc, "十二、五種較誇張、不那麼傳統的畫風", 1)
    body(
        doc,
        "同一題材：燕國兵器庫，貨架上有多種可選兵器。刻意離開木刻、工筆、帛畫。方案 D 已鎖定為生產風格，因為最像「有圖可點的商店」。",
        size=10,
    )
    add_table(
        doc,
        ["風格", "決策", "為什麼", "用在哪"],
        [
            ["A 新國潮誇張造型", "章節大場面備用", "披風與光極強，很有遊戲感；暗部太多，商品不夠一目了然。", "易水、殿上寬景，不拿來做商品卡"],
            ["B 黑暗漫畫／Noir", "結局卡備用", "張力夠；易生出火槍等時代錯誤（本張參考圖已出現，故不能當主風格）。", "結局 D、E 的象徵畫面，生圖時必須禁火器"],
            ["C 黏土定格", "若課堂要更暖", "選擇物最清楚，14 歲友善；不夠誇張英雄感。", "可作兵器庫熱區的替代方案"],
            ["D 復古 RPG 道具卡", "已鎖定", "左邊角色、右邊一排可選武器，正是本遊戲要的互動。誇張但不傳統。", "全部角色、商店、14 張商品卡、UI"],
            ["E 超現實波普拼貼", "章節扉頁", "尺寸誇張，適合「你以為兵器有多大」的思考；不適合作精細選單。", "進店前的一張封面"],
        ],
        col_widths=[Cm(4.0), Cm(2.8), Cm(5.6), Cm(4.8)],
    )

    style_blocks = [
        (
            "style-a-neo-guochao-shop.png",
            "方案 A｜新國潮誇張造型",
            "黑金朱砂、誇張披風。適合大場面，不適合讓學生快速辨認六件兵器。",
        ),
        (
            "style-b-noir-comic-shop.png",
            "方案 B｜黑暗漫畫",
            "光影強、選擇感足。參考圖混入火器，提醒正式生圖必須寫 no firearms。",
        ),
        (
            "style-c-claymation-shop.png",
            "方案 C｜黏土定格",
            "每件兵器放在自己的木箱上，最像「點哪一件」。若學校覺得 RPG 太銳，可改這套。",
        ),
        (
            "style-d-rpg-shop-ui.png",
            "方案 D｜復古 RPG 道具卡（已鎖定）",
            "角色立繪＋右側武器清單，直接就是商店介面。生產風格用這一套。",
        ),
        (
            "style-e-pop-collage-shop.png",
            "方案 E｜超現實波普拼貼",
            "一把大到像建築的兵器。用來做進店封面，問學生：你要的到底是氣勢，還是藏得住。",
        ),
    ]
    for filename, title, desc in style_blocks:
        heading(doc, title, 2)
        body(doc, desc, size=10, space_after=6)
        add_picture(doc, STYLES / filename, width_cm=14.8)
        caption(doc, title.replace("｜", " · "))

    heading(doc, "十三、開工順序", 1)
    body(
        doc,
        "1）先生 14 張商品卡（方案 D，禁用 SVG 與火器）。2）生三間店場景與角色立繪。3）做行囊與旗標狀態機，讓長劍走結局 A、短匕走 D。4）再生六張結局卡與對讀文案。5）教師先打通 A 與 D 兩條再上課。每章檢查：選擇有沒有真的改變後續、圖是不是生圖、有沒有超尺度。",
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_text(p, "—— 完 ——", size=11, color=INK_SOFT, font=FONT_TITLE)

    doc.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    build()

