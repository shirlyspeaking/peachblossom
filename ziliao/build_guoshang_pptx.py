#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""《九歌·國殤》教學簡報產生器。"""

from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

ASSETS = Path(
    "/Users/shirlyzhang/.cursor/projects/Users-shirlyzhang-Documents-GitHub-peachblossom/assets"
)
OUT = Path("/Users/shirlyzhang/Documents/GitHub/peachblossom/ziliao/國殤教學簡報.pptx")

# 淺色楚風：絹色底、淡赭、薄銅
BG = RGBColor(0xF6, 0xF0, 0xE4)
BG_CARD = RGBColor(0xFB, 0xF7, 0xEE)
BG_SOFT = RGBColor(0xEE, 0xE4, 0xD4)
INK = RGBColor(0x3A, 0x32, 0x28)
INK_SOFT = RGBColor(0x6A, 0x5C, 0x4E)
TITLE = RGBColor(0x6B, 0x3A, 0x2E)
ACCENT = RGBColor(0xA6, 0x6A, 0x4A)
BRONZE = RGBColor(0xC4, 0xA5, 0x74)
LINE = RGBColor(0xD9, 0xCB, 0xB6)
WHITE = RGBColor(0xFF, 0xFC, 0xF7)
HEADER_BG = RGBColor(0xE8, 0xD7, 0xC0)

FONT_TITLE = "Songti SC"
FONT_BODY = "Hiragino Sans GB"
FONT_FALLBACK = "STHeiti"

W = Inches(13.333)
H = Inches(7.5)


def _set_ea_font(run, name):
    rPr = run._r.get_or_add_rPr()
    for tag in ("a:latin", "a:ea", "a:cs"):
        el = rPr.find(qn(tag))
        if el is None:
            el = etree.SubElement(rPr, qn(tag))
        el.set("typeface", name)


def set_run(run, text, size, color, bold=False, font=FONT_BODY, align=None):
    run.text = text
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = font
    run.font.italic = False
    _set_ea_font(run, font)


def add_textbox(slide, l, t, w, h, text, size=14, color=INK, bold=False,
                font=FONT_BODY, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(l, t, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    p.space_after = Pt(0)
    p.space_before = Pt(0)
    set_run(p.add_run() if p.runs else p.runs[0] if False else _ensure_run(p),
            text, size, color, bold, font)
    return box


def _ensure_run(p):
    if p.runs:
        return p.runs[0]
    return p.add_run()


def write_para(tf, text, size=14, color=INK, bold=False, font=FONT_BODY,
               align=PP_ALIGN.LEFT, space_after=6, first=False):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.alignment = align
    p.space_after = Pt(space_after)
    p.space_before = Pt(0)
    p.line_spacing = 1.15
    run = p.add_run()
    set_run(run, text, size, color, bold, font)
    return p


def solid(shape, color):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def stroke(shape, color, pt=1.0):
    shape.line.color.rgb = color
    shape.line.width = Pt(pt)


def rect(slide, l, t, w, h, fill, line=None, line_pt=1.0, rounded=False):
    shp = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    s = slide.shapes.add_shape(shp, l, t, w, h)
    solid(s, fill)
    if rounded:
        s.adjustments[0] = 0.08
    if line:
        stroke(s, line, line_pt)
    else:
        s.line.fill.background()
    return s


def add_bg(slide):
    rect(slide, 0, 0, W, H, BG)
    rect(slide, 0, 0, W, Inches(0.08), BRONZE)
    rect(slide, 0, H - Inches(0.06), W, Inches(0.06), BRONZE)


def add_title_bar(slide, title, subtitle=None):
    rect(slide, Inches(0.45), Inches(0.28), Inches(0.10), Inches(0.46), ACCENT)
    add_textbox(slide, Inches(0.70), Inches(0.22), Inches(11.8), Inches(0.42),
                title, 24, TITLE, True, FONT_TITLE)
    rect(slide, Inches(0.70), Inches(0.72), Inches(12.2), Inches(0.015), LINE)
    if subtitle:
        add_textbox(slide, Inches(0.70), Inches(0.76), Inches(12.2), Inches(0.32),
                    subtitle, 12, INK_SOFT, False, FONT_BODY)


def add_footer(slide, n, total):
    add_textbox(slide, Inches(0.50), Inches(7.12), Inches(9.5), Inches(0.28),
                "《九歌·國殤》教學簡報　屈原", 10, INK_SOFT, False, FONT_BODY)
    add_textbox(slide, Inches(10.6), Inches(7.12), Inches(2.2), Inches(0.28),
                f"{n}  /  {total}", 10, INK_SOFT, False, FONT_BODY,
                align=PP_ALIGN.RIGHT)


def bullets(slide, l, t, w, h, items, size=14, color=INK, space=7):
    box = slide.shapes.add_textbox(l, t, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.space_after = Pt(space)
        p.line_spacing = 1.12
        if isinstance(item, tuple):
            label, rest = item
            r1 = p.add_run()
            set_run(r1, label, size, ACCENT, True, FONT_BODY)
            r2 = p.add_run()
            set_run(r2, rest, size, color, False, FONT_BODY)
        else:
            r = p.add_run()
            set_run(r, item, size, color, False, FONT_BODY)
    return box


def card(slide, l, t, w, h):
    return rect(slide, l, t, w, h, BG_CARD, LINE, 1.0, rounded=True)


def captioned_image(slide, path, l, t, w, h, caption):
    frame = rect(slide, l, t, w, h, WHITE, LINE, 1.0)
    inner_l, inner_t = l + Inches(0.06), t + Inches(0.06)
    inner_w, inner_h = w - Inches(0.12), h - Inches(0.40)
    slide.shapes.add_picture(str(path), inner_l, inner_t, inner_w, inner_h)
    add_textbox(slide, l, t + h - Inches(0.34), w, Inches(0.30),
                caption, 11, INK_SOFT, False, FONT_TITLE, PP_ALIGN.CENTER)
    return frame


def set_cell(cell, text, size=12, color=INK, bold=False, fill=None, align=PP_ALIGN.LEFT):
    if fill:
        cell.fill.solid()
        cell.fill.fore_color.rgb = fill
    else:
        cell.fill.background()
    cell.margin_left = Inches(0.08)
    cell.margin_right = Inches(0.06)
    cell.margin_top = Inches(0.05)
    cell.margin_bottom = Inches(0.05)
    tf = cell.text_frame
    tf.word_wrap = True
    tf.anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = align
    p.space_after = Pt(0)
    run = p.add_run()
    set_run(run, text, size, color, bold, FONT_BODY)


def add_table(slide, l, t, w, h, headers, rows, col_w=None, font_size=12):
    table_shape = slide.shapes.add_table(1 + len(rows), len(headers), l, t, w, h)
    table = table_shape.table
    if col_w:
        for i, cw in enumerate(col_w):
            table.columns[i].width = cw
    for i, htext in enumerate(headers):
        set_cell(table.cell(0, i), htext, font_size, TITLE, True, HEADER_BG, PP_ALIGN.CENTER)
    for r, row in enumerate(rows, start=1):
        bg = BG_CARD if r % 2 else BG_SOFT
        for c, val in enumerate(row):
            align = PP_ALIGN.LEFT
            set_cell(table.cell(r, c), val, font_size, INK, c == 0, bg, align)
    return table


def new_slide(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])


def build():
    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = H
    slides_meta = []

    def S():
        s = new_slide(prs)
        slides_meta.append(s)
        return s

    # 1 封面
    s = S()
    s.shapes.add_picture(str(ASSETS / "guoshang-cover.png"), 0, 0, W, H)
    rect(s, 0, 0, W, Inches(0.08), BRONZE)
    rect(s, 0, H - Inches(0.06), W, Inches(0.06), BRONZE)
    rect(s, Inches(0.70), Inches(1.55), Inches(7.35), Inches(4.35),
         RGBColor(0xF8, 0xF3, 0xE8), LINE, 1.25, rounded=True)
    add_textbox(s, Inches(1.00), Inches(1.80), Inches(6.8), Inches(0.40),
                "《九歌》第十篇　祭歌／輓歌／頌歌", 14, ACCENT, False, FONT_BODY)
    add_textbox(s, Inches(1.00), Inches(2.20), Inches(6.8), Inches(1.05),
                "國　　殤", 54, TITLE, True, FONT_TITLE)
    add_textbox(s, Inches(1.00), Inches(3.25), Inches(6.8), Inches(0.40),
                "屈原　｜　教學簡報", 18, INK, False, FONT_TITLE)
    rect(s, Inches(1.00), Inches(3.78), Inches(2.20), Inches(0.035), BRONZE)
    add_textbox(s, Inches(1.00), Inches(4.00), Inches(6.7), Inches(1.40),
                "為國而死曰國殤。\n本課由文意、意象、戰士、神明、評價五面讀這場敗而不屈的戰爭。",
                15, INK, False, FONT_BODY)

    # 2 目錄
    s = S()
    add_bg(s)
    add_title_bar(s, "本課結構", "五個問題，對應全詩的讀法")
    items = [
        ("一　", "分段文意解析：交戰／轉敗／頌悼，並看意象如何造成戰場。"),
        ("二　", "戰士形象如何一步步接到「英雄主義」。"),
        ("三　", "神明在詩中何時出現、做了什麼、沒做什麼。"),
        ("四　", "屈原如何評價國殤將士，以及楚人何以這樣評。"),
        ("五　", "這場戰爭給人的整體印象，與人們對戰爭的感受。"),
    ]
    for i, (k, v) in enumerate(items):
        top = Inches(1.20) + Inches(i * 1.05)
        card(s, Inches(0.70), top, Inches(11.95), Inches(0.92))
        num = rect(s, Inches(0.95), top + Inches(0.22), Inches(0.48), Inches(0.48),
                   BG_SOFT, None, 0, True)
        add_textbox(s, Inches(0.95), top + Inches(0.28), Inches(0.48), Inches(0.38),
                    str(i + 1), 16, TITLE, True, FONT_TITLE, PP_ALIGN.CENTER)
        add_textbox(s, Inches(1.65), top + Inches(0.18), Inches(10.6), Inches(0.58),
                    k + v, 16, INK, False, FONT_BODY)

    # 3 題解
    s = S()
    add_bg(s)
    add_title_bar(s, "題解與創作背景", "這是誰、祭什麼、為何而寫")
    card(s, Inches(0.55), Inches(1.15), Inches(6.05), Inches(5.55))
    add_textbox(s, Inches(0.80), Inches(1.35), Inches(5.6), Inches(0.40),
                "這首詩是什麼", 16, TITLE, True, FONT_TITLE)
    bullets(s, Inches(0.80), Inches(1.80), Inches(5.55), Inches(4.6), [
        ("名稱　", "國殤＝為國事而死的人，多指戰死沙場、不得善終之魂。"),
        ("文體　", "《九歌》祭神樂歌之一；十一篇中唯一主祭「人鬼」。"),
        ("寫法　", "戴震謂「通篇直賦其事」：少神幻，多戰場實寫。"),
        ("功能　", "招魂、哀悼、頌讚，兼激勵生者同仇敵愾。"),
        ("句式　", "十八句，句中嵌「兮」，節奏急促，如鼓點。"),
    ], 14, INK, 10)

    card(s, Inches(6.85), Inches(1.15), Inches(5.95), Inches(5.55))
    add_textbox(s, Inches(7.10), Inches(1.35), Inches(5.5), Inches(0.40),
                "為何會有大批「國殤」", 16, TITLE, True, FONT_TITLE)
    bullets(s, Inches(7.10), Inches(1.80), Inches(5.5), Inches(4.6), [
        ("時勢　", "懷王、頃襄王之世，楚屢敗於秦，丹陽、藍田等戰役死傷極重。"),
        ("戰場　", "戰死者暴屍原野，依禮近於「殤」——無主、未得完整喪葬。"),
        ("詩心　", "不寫勝仗，專寫敗仗中的死戰；哀其死，更壯其魂。"),
        ("民氣　", "後來「楚雖三戶，亡秦必楚」的集體意志，與此相通。"),
    ], 14, INK, 10)

    # 4 原文
    s = S()
    add_bg(s)
    add_title_bar(s, "原文　《九歌·國殤》", "十八句，每句中嵌「兮」。可先齊讀，再分段。")
    cols = [
        ("一　交戰", [
            "操吳戈兮被犀甲，",
            "車錯轂兮短兵接。",
            "旌蔽日兮敵若雲，",
            "矢交墜兮士爭先。",
        ]),
        ("二　轉敗", [
            "凌余陣兮躐余行，",
            "左驂殪兮右刃傷。",
            "霾兩輪兮縶四馬，",
            "援玉枹兮擊鳴鼓。",
            "天時懟兮威靈怒，",
            "嚴殺盡兮棄原野。",
        ]),
        ("三　頌悼", [
            "出不入兮往不反，",
            "平原忽兮路超遠。",
            "帶長劍兮挾秦弓，",
            "首身離兮心不懲。",
            "誠既勇兮又以武，",
            "終剛強兮不可凌。",
            "身既死兮神以靈，",
            "子魂魄兮為鬼雄。",
        ]),
    ]
    for i, (head, lines) in enumerate(cols):
        left = Inches(0.50) + Inches(i * 4.20)
        card(s, left, Inches(1.18), Inches(3.95), Inches(5.50))
        add_textbox(s, left + Inches(0.20), Inches(1.38), Inches(3.55), Inches(0.40),
                    head, 16, TITLE, True, FONT_TITLE)
        box = s.shapes.add_textbox(left + Inches(0.20), Inches(1.90), Inches(3.55), Inches(4.50))
        tf = box.text_frame
        tf.word_wrap = True
        for j, line in enumerate(lines):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.alignment = PP_ALIGN.LEFT
            p.space_after = Pt(10)
            p.line_spacing = 1.25
            run = p.add_run()
            set_run(run, line, 18, INK, False, FONT_TITLE)

    # 5 全文結構
    s = S()
    add_bg(s)
    add_title_bar(s, "全文結構　三部分", "先見全貌，再逐段讀")
    add_table(
        s, Inches(0.55), Inches(1.20), Inches(12.25), Inches(3.55),
        ["部分", "詩句範圍", "敘事重心", "情感基調"],
        [
            ["一　交戰", "操吳戈……士爭先", "披堅執銳、車戰近接、敵眾我寡", "急促、緊張、爭先"],
            ["二　轉敗", "凌余陣……棄原野", "破陣、死馬、埋輪擂鼓、全軍覆沒", "慘烈、死守、天地同怒"],
            ["三　頌悼", "出不入……為鬼雄", "永訣、無悔、勇武剛強、魂為鬼雄", "哀而壯、由人入神"],
        ],
        col_w=[Inches(2.1), Inches(3.2), Inches(4.4), Inches(2.55)],
        font_size=13,
    )
    card(s, Inches(0.55), Inches(5.00), Inches(12.25), Inches(1.70))
    bullets(s, Inches(0.80), Inches(5.18), Inches(11.8), Inches(1.40), [
        ("讀法提示　", "前十句主「事」（怎麼打、怎麼死），後八句主「評」（如何死、死了怎樣）。"),
        ("關鍵轉折　", "「嚴殺盡兮棄原野」是戰事結束；「出不入」起，改為祭者對亡魂說話。"),
    ], 15, INK, 8)

    # 5 第一部分文意
    s = S()
    add_bg(s)
    add_title_bar(s, "一、交戰開始　文意解析", "首四句：裝備、近戰、敵眾、爭先")
    rows = [
        ["操吳戈兮被犀甲", "執吳戈、披犀甲", "未開打先寫裝備：利器＋堅甲＝死戰準備已成。"],
        ["車錯轂兮短兵接", "車輪相交，短兵相接", "車戰已近到軸轂交錯，轉入白刃，節奏驟緊。"],
        ["旌蔽日兮敵若雲", "旌旗遮日，敵如雲聚", "用天象與雲量寫敵眾：先聲奪人，見己方壓力。"],
        ["矢交墜兮士爭先", "箭雨交墜，士卒爭先", "在對射中仍搶先衝鋒：勇見於「爭先」，而非勝勢。"],
    ]
    add_table(
        s, Inches(0.50), Inches(1.20), Inches(12.35), Inches(4.35),
        ["原句", "大意", "文意要點"],
        rows,
        col_w=[Inches(3.3), Inches(3.3), Inches(5.75)],
        font_size=13,
    )
    card(s, Inches(0.50), Inches(5.70), Inches(12.35), Inches(1.05))
    add_textbox(s, Inches(0.75), Inches(5.88), Inches(11.9), Inches(0.70),
                "此段尚未寫敗。重點是：敵已極盛，我仍爭先。戰爭氛圍由「裝備特寫」迅速拉成「全景壓迫」。",
                15, INK, False, FONT_BODY)

    # 6 第一部分意象
    s = S()
    add_bg(s)
    add_title_bar(s, "一、意象與環境　如何造成戰場", "裝備／車戰／旗海／箭雨——先把戰爭「看見」")
    captioned_image(s, ASSETS / "guoshang-chariot.png",
                    Inches(0.45), Inches(1.08), Inches(4.15), Inches(3.15),
                    "車錯轂兮短兵接")
    captioned_image(s, ASSETS / "guoshang-banners.png",
                    Inches(4.75), Inches(1.08), Inches(4.15), Inches(3.15),
                    "旌蔽日兮敵若雲")
    captioned_image(s, ASSETS / "guoshang-arrows.png",
                    Inches(9.05), Inches(1.08), Inches(3.80), Inches(3.15),
                    "矢交墜兮士爭先")
    add_table(
        s, Inches(0.45), Inches(4.38), Inches(12.45), Inches(2.38),
        ["意象", "所屬", "對戰爭場景／氛圍的作用"],
        [
            ["吳戈、犀甲", "裝備", "點出兵器精良、甲厚難透，戰爭從「物」開始，見決死之心。"],
            ["車錯轂、短兵", "近戰動態", "把距離壓到最短，場面由遠觀變為肉搏，緊張感驟升。"],
            ["旌蔽日、敵若雲", "規模／天象", "以日被遮、敵如雲，寫敵眾我寡的壓迫與戰場之廣。"],
            ["矢交墜、士爭先", "聲色／行動", "箭如雨落見殘酷；「爭先」把恐懼扭成主動的勇。"],
        ],
        col_w=[Inches(2.6), Inches(2.2), Inches(7.65)],
        font_size=12,
    )

    # 7 第二部分文意
    s = S()
    add_bg(s)
    add_title_bar(s, "二、戰況轉敗　文意解析", "次六句：破陣、死守、全殲")
    rows = [
        ["凌余陣兮躐余行", "敵衝破我陣、踐踏行列", "主動權易手。陣法一亂，敗象已現。"],
        ["左驂殪兮右刃傷", "左驂死、右驂受傷", "特寫主將戰車：動力盡失，進退不得。"],
        ["霾兩輪兮縶四馬", "埋輪、絆馬", "自絕退路。不是逃，是把戰場釘死在腳下。"],
        ["援玉枹兮擊鳴鼓", "持玉枹仍擊鼓", "主將職在督戰。鼓不停，即令不止、鬥志不散。"],
        ["天時懟兮威靈怒", "天怨、神靈震怒", "戰事已超出人力。敗不完全歸於將士不勇。"],
        ["嚴殺盡兮棄原野", "全軍被殺，屍棄荒野", "結局：全殲。無人收屍，正是「殤」的來處。"],
    ]
    add_table(
        s, Inches(0.45), Inches(1.15), Inches(12.45), Inches(5.55),
        ["原句", "大意", "文意要點"],
        rows,
        col_w=[Inches(3.3), Inches(3.4), Inches(5.75)],
        font_size=13,
    )

    # 8 第二部分意象
    s = S()
    add_bg(s)
    add_title_bar(s, "二、意象與環境　敗局中的死守", "馬死、輪埋、鼓不止；天怒，原野空")
    captioned_image(s, ASSETS / "guoshang-drum.png",
                    Inches(0.45), Inches(1.08), Inches(6.05), Inches(3.20),
                    "霾兩輪兮縶四馬，援玉枹兮擊鳴鼓")
    captioned_image(s, ASSETS / "guoshang-sky.png",
                    Inches(6.70), Inches(1.08), Inches(6.15), Inches(3.20),
                    "天時懟兮威靈怒，嚴殺盡兮棄原野")
    add_table(
        s, Inches(0.45), Inches(4.42), Inches(12.40), Inches(2.32),
        ["意象／環境", "類型", "具體作用"],
        [
            ["凌陣、躐行", "戰局", "用「破」「踏」寫空間失序，戰場由整變亂。"],
            ["左驂殪、右刃傷", "戰車／生物", "以馬的死傷代替人的慘叫，殘酷而克制。"],
            ["霾輪、縶馬、擊鼓", "動作", "退路被自己切斷；鼓聲維持最後的軍魂。"],
            ["天時、威靈、原野", "天象／空間", "把人戰抬到天地層；原野空曠，襯全軍之盡。"],
        ],
        col_w=[Inches(3.5), Inches(2.2), Inches(6.7)],
        font_size=12,
    )

    # 9 第三部分文意
    s = S()
    add_bg(s)
    add_title_bar(s, "三、哀祭與頌讚　文意解析", "後八句：永訣、無悔、勇武、鬼雄")
    rows = [
        ["出不入兮往不反", "出門即不再返", "以「不入／不反」寫永訣，祭歌口吻開始。"],
        ["平原忽兮路超遠", "平原空闊，歸路極遠", "空間拉遠：家與屍各在一方，死無歸處。"],
        ["帶長劍兮挾秦弓", "仍帶長劍、挾秦弓", "死後兵器不離身：戰者身分至死不變。"],
        ["首身離兮心不懲", "身首異處，心無悔", "形已裂，志不改。「懲」＝悔，關鍵在「不」。"],
        ["誠既勇兮又以武", "既勇敢，又善戰", "勇＝膽氣，武＝戰能。兩者並舉，非空讚。"],
        ["終剛強兮不可凌", "始終剛強，不可侵凌", "「終」字：從開戰到身死，氣不曾折。"],
        ["身既死兮神以靈", "身死而神靈不泯", "人鬼分途：肉體止於原野，精神進入祭祀。"],
        ["子魂魄兮為鬼雄", "魂魄成為鬼中雄傑", "最終定位：不是孤魂，是可敬的鬼雄。"],
    ]
    add_table(
        s, Inches(0.40), Inches(1.12), Inches(12.55), Inches(5.60),
        ["原句", "大意", "文意要點"],
        rows,
        col_w=[Inches(3.3), Inches(3.3), Inches(5.95)],
        font_size=12,
    )

    # 10 第三部分意象
    s = S()
    add_bg(s)
    add_title_bar(s, "三、意象與環境　永訣與不朽", "平原把人帶走；劍弓把人留下")
    captioned_image(s, ASSETS / "guoshang-plain.png",
                    Inches(0.45), Inches(1.08), Inches(6.05), Inches(3.20),
                    "出不入兮往不反，平原忽兮路超遠")
    captioned_image(s, ASSETS / "guoshang-hero.png",
                    Inches(6.70), Inches(1.08), Inches(6.15), Inches(3.20),
                    "帶長劍兮挾秦弓……子魂魄兮為鬼雄")
    add_table(
        s, Inches(0.45), Inches(4.42), Inches(12.40), Inches(2.32),
        ["意象／環境", "類型", "具體作用"],
        [
            ["出不入、往不反", "行程", "把戰爭收成單程路：去戰場＝去死亡。"],
            ["平原忽、路超遠", "戰後空間", "空、遠、茫：哀不靠哭聲，靠走不完的路。"],
            ["長劍、秦弓", "兵器（死後）", "人已死，物仍在握，戰者形象被「凍住」。"],
            ["首身離／神以靈、鬼雄", "身體 vs 神魂", "形可裂，名與魂不可滅；戰場轉祭壇。"],
        ],
        col_w=[Inches(3.6), Inches(2.3), Inches(6.5)],
        font_size=12,
    )

    # 11 意象分類總表
    s = S()
    add_bg(s)
    add_title_bar(s, "意象分類總表　戰爭如何被「做成」", "場景靠物與空間；氛圍靠規模、聲色與天象")
    add_table(
        s, Inches(0.40), Inches(1.15), Inches(12.55), Inches(5.55),
        ["類別", "主要意象", "造成的場景", "造成的氛圍"],
        [
            ["裝備兵器", "吳戈、犀甲、玉枹、長劍、秦弓", "可見的軍容與身分", "決死、莊重、戰者到底"],
            ["近戰動態", "車錯轂、短兵接、士爭先", "白刃、搶攻、車陣相咬", "急促、密、容不得退"],
            ["規模天象", "旌蔽日、敵若雲、矢交墜", "旗海、敵眾、箭雨", "壓迫、敵強我弱"],
            ["破敗細節", "凌陣躐行、驂殪刃傷、霾輪縶馬", "陣亂、車廢、無退路", "危急、死守"],
            ["聲與神", "擊鳴鼓、天時懟、威靈怒", "鼓不停、天地變色", "悲壯升到神聖層"],
            ["戰後空間", "棄原野、平原忽、路超遠", "空野、遠路、無歸", "蒼涼、永訣、祭奠感"],
        ],
        col_w=[Inches(1.9), Inches(4.15), Inches(3.15), Inches(3.35)],
        font_size=12,
    )

    # 12 戰士與英雄主義
    s = S()
    add_bg(s)
    add_title_bar(s, "戰士形象與英雄主義", "英雄不是打贏的人，是死了也不改其志的人")
    add_table(
        s, Inches(0.45), Inches(1.15), Inches(12.45), Inches(2.85),
        ["層次", "詩中依據", "形象效果"],
        [
            ["外在", "吳戈、犀甲、長劍、秦弓", "先是戰士，後才是英靈。"],
            ["行動", "士爭先、霾輪縶馬、擊鳴鼓", "主動赴死，不是被動挨打。"],
            ["意志", "心不懲、終剛強、不可凌", "形可碎，心不可悔、氣不可折。"],
            ["精神", "神以靈、魂魄為鬼雄", "個體死亡，集體英雄誕生。"],
        ],
        col_w=[Inches(1.8), Inches(5.3), Inches(5.35)],
        font_size=13,
    )
    card(s, Inches(0.45), Inches(4.20), Inches(6.05), Inches(2.50))
    add_textbox(s, Inches(0.70), Inches(4.38), Inches(5.6), Inches(0.36),
                "此詩英雄主義的特點", 15, TITLE, True, FONT_TITLE)
    bullets(s, Inches(0.70), Inches(4.80), Inches(5.55), Inches(1.75), [
        "以敗仗寫英雄：不以勝利定義勇。",
        "寫的是「群像」，不是一名主將傳記。",
        "最高讚語放在死後：「鬼雄」。",
    ], 14, INK, 6)

    card(s, Inches(6.70), Inches(4.20), Inches(6.20), Inches(2.50))
    add_textbox(s, Inches(6.95), Inches(4.38), Inches(5.7), Inches(0.36),
                "和一般英雄敘事的差別", 15, TITLE, True, FONT_TITLE)
    bullets(s, Inches(6.95), Inches(4.80), Inches(5.7), Inches(1.75), [
        "不是「天助英豪」的勝利神話。",
        "不是個人復仇，是為國而死的公共倫理。",
        "勇＋武並舉：有膽，也有戰能。",
    ], 14, INK, 6)

    # 13 神明
    s = S()
    add_bg(s)
    add_title_bar(s, "神明的介入：情況與作用", "神沒有把這場仗打贏；神把這些死人接進祭典")
    add_table(
        s, Inches(0.40), Inches(1.15), Inches(12.55), Inches(3.55),
        ["階段", "相關詩句", "神明在做什麼", "作用"],
        [
            ["戰中", "天時懟兮威靈怒", "天怨、神怒；未見助楚取勝", "寫慘烈已驚動天地；敗不全責將士"],
            ["戰後", "身既死兮神以靈", "人死，神靈仍在", "把「兵死」轉成可祭的存在"],
            ["定位", "子魂魄兮為鬼雄", "亡魂升為鬼中雄傑", "孤魂有名分，進入《九歌》神譜"],
            ["文體", "《九歌》本為祭神", "本篇獨祭人鬼", "戰爭記憶被納入國家祀典"],
        ],
        col_w=[Inches(1.5), Inches(3.3), Inches(3.6), Inches(4.15)],
        font_size=13,
    )
    card(s, Inches(0.40), Inches(4.90), Inches(12.55), Inches(1.80))
    bullets(s, Inches(0.65), Inches(5.08), Inches(12.1), Inches(1.50), [
        ("可記三句　", "① 開戰時神不現身。② 覆沒時神以「怒」登場。③ 祭祀時神以「靈」完成。"),
        ("因此　", "神明不是救場的援軍，而是解釋失敗、安頓亡魂、把英雄送進另一個世界的力量。"),
    ], 15, INK, 8)

    # 14 屈原評價
    s = S()
    add_bg(s)
    add_title_bar(s, "屈原如何評價這些將士", "評語都在詩的最後四句，幾乎全是肯定")
    add_table(
        s, Inches(0.45), Inches(1.15), Inches(12.45), Inches(2.55),
        ["評語", "原句", "意思"],
        [
            ["勇", "誠既勇兮又以武", "敢赴死，不怕。"],
            ["武", "誠既勇兮又以武", "能作戰，不是空有氣。"],
            ["剛強不可凌", "終剛強兮不可凌", "至死不被折辱、不被征服。"],
            ["神靈／鬼雄", "神以靈……為鬼雄", "死不是結束，是另一種英雄。"],
        ],
        col_w=[Inches(2.5), Inches(4.3), Inches(5.65)],
        font_size=13,
    )
    card(s, Inches(0.45), Inches(3.95), Inches(12.45), Inches(2.70))
    add_textbox(s, Inches(0.70), Inches(4.12), Inches(12.0), Inches(0.36),
                "他為什麼這樣評（先看詩內邏輯）", 15, TITLE, True, FONT_TITLE)
    bullets(s, Inches(0.70), Inches(4.55), Inches(11.95), Inches(1.90), [
        "全軍覆沒，若按勝敗來評，只剩「敗者」。屈原改用「死法」來評。",
        "把失敗歸因於敵眾、天時、神怒，於是將士可以同時是敗者與英雄。",
        "評價的目的不只是哭：是給亡魂名分，也給活人榜樣。",
        "最後稱「子」，是面對面的祭告，不是旁觀者的史評。",
    ], 14, INK, 5)

    # 15 楚人特質
    s = S()
    add_bg(s)
    add_title_bar(s, "評價的文化原因　楚人與他國何以不同", "同一場死，中原、秦、楚會讀成不同的意義")
    add_table(
        s, Inches(0.35), Inches(1.12), Inches(12.65), Inches(4.35),
        ["對照", "楚", "中原諸國", "秦"],
        [
            ["鬼神", "親鬼好巫，人死可入祀", "敬鬼神而遠之，重喪禮分際", "重法令實利，少以巫祭論戰"],
            ["價值", "情感強烈，愛國「深固難徙」", "較重禮法、名分、秩序", "尚首功，以斬獲定爵"],
            ["戰敗", "敗仍可頌；魂可為雄", "無勇而死，常近於不得善終", "重結果，敗則罪責分明"],
            ["文學", "浪漫：神靈、魂魄可續存", "《詩》多寫實、克制、怨而不亂", "少此種祭歌式的英雄抒情"],
            ["身分", "自謂「蠻夷」，不盡守周禮", "以禮樂自居中心", "以耕戰富強為中心"],
        ],
        col_w=[Inches(1.5), Inches(3.85), Inches(3.85), Inches(3.45)],
        font_size=12,
    )
    card(s, Inches(0.35), Inches(5.60), Inches(12.65), Inches(1.15))
    add_textbox(s, Inches(0.60), Inches(5.78), Inches(12.2), Inches(0.80),
                "所以屈原能說：他們雖死於敗，仍「勇武剛強」；死後不是厲鬼，是鬼雄。這是楚文化才走得通的評價路徑：巫祭給名分，愛國給理由，浪漫給不朽。",
                14, INK, False, FONT_BODY)

    # 16 戰爭印象與感受
    s = S()
    add_bg(s)
    add_title_bar(s, "戰爭的整體印象　人們如何感受戰爭", "這不是凱旋詩。它讓人看見慘，仍願意敬")
    add_table(
        s, Inches(0.40), Inches(1.15), Inches(12.55), Inches(3.15),
        ["印象", "詩中依據", "人們的感受"],
        [
            ["敵眾我寡，從一開始就難", "旌蔽日、敵若雲、矢交墜", "壓迫、不利、戰爭極不對等"],
            ["近戰殘酷，全軍可以盡", "短兵接、嚴殺盡、棄原野", "恐懼與震驚：戰爭會把人吃乾淨"],
            ["敗局裡仍有人把退路切斷", "霾兩輪、擊鳴鼓、心不懲", "敬：慘烈之外還有不肯屈的人"],
            ["死者回不了家，卻可成為神", "往不反、路超遠、為鬼雄", "哀其永訣，同時以祭祀完成安慰"],
        ],
        col_w=[Inches(3.5), Inches(4.2), Inches(4.85)],
        font_size=13,
    )
    card(s, Inches(0.40), Inches(4.50), Inches(6.05), Inches(2.20))
    add_textbox(s, Inches(0.65), Inches(4.68), Inches(5.6), Inches(0.34),
                "整體印象（四字可記）", 15, TITLE, True, FONT_TITLE)
    bullets(s, Inches(0.65), Inches(5.10), Inches(5.55), Inches(1.40), [
        "慘烈　全景是敗，不是勝。",
        "悲壯　哀與敬同時成立。",
        "神聖　人戰被寫成可祭之事。",
    ], 14, INK, 5)

    card(s, Inches(6.70), Inches(4.50), Inches(6.25), Inches(2.20))
    add_textbox(s, Inches(6.95), Inches(4.68), Inches(5.8), Inches(0.34),
                "對戰爭的態度", 15, TITLE, True, FONT_TITLE)
    bullets(s, Inches(6.95), Inches(5.10), Inches(5.8), Inches(1.40), [
        "不是歌頌戰爭本身好。",
        "也不是單純反戰、求免死。",
        "是：知戰之慘，仍以死為榮。",
    ], 14, INK, 5)

    # 17 總結
    s = S()
    add_bg(s)
    add_title_bar(s, "課堂收束", "三句話記住全詩")
    points = [
        ("戰可敗，人不可屈", "前兩段把仗寫輸了，但「爭先、擊鼓、心不懲」不許形象垮掉。"),
        ("人可死，神不可滅", "神明不救場，卻在最後把亡魂接走：身死，神以靈。"),
        ("哀其死，更壯其魂", "感受是哀＋敬。屈原的評價，是楚人把敗仗讀成不朽的方式。"),
    ]
    for i, (k, v) in enumerate(points):
        top = Inches(1.25) + Inches(i * 1.45)
        card(s, Inches(0.70), top, Inches(11.95), Inches(1.28))
        rect(s, Inches(0.70), top, Inches(0.12), Inches(1.28), ACCENT)
        add_textbox(s, Inches(1.10), top + Inches(0.18), Inches(11.2), Inches(0.42),
                    k, 20, TITLE, True, FONT_TITLE)
        add_textbox(s, Inches(1.10), top + Inches(0.62), Inches(11.2), Inches(0.48),
                    v, 14, INK, False, FONT_BODY)

    total = len(prs.slides)
    for i, slide in enumerate(prs.slides, start=1):
        if i == 1:
            add_textbox(slide, Inches(1.00), Inches(6.85), Inches(6.5), Inches(0.30),
                        "教學用　顏色取淺絹與薄銅，以配祭歌的哀與莊", 11, INK_SOFT, False, FONT_BODY)
            continue
        add_footer(slide, i, total)

    prs.save(str(OUT))
    print(f"saved {OUT} slides={total}")


if __name__ == "__main__":
    build()
