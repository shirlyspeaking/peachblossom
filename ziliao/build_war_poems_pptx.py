#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""《詩經》與漢樂府戰爭詩教學簡報。

配色按兩種詩的氣質分開，不用楚風銅赭：
- 詩經：麻紙、草木綠。質樸，物小，貼著身體和屋子。
- 漢樂府：暮色青灰。更冷、更直，像把場面攤開來說。
- 「回家」只用一點土色，像門檻，不是典禮用的金。
"""

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
OUT = Path("/Users/shirlyzhang/Documents/GitHub/peachblossom/ziliao/戰爭詩四首教學簡報.pptx")

# 詩經：麻紙、草木
BG_FENG = RGBColor(0xF3, 0xF0, 0xE4)
SOFT_FENG = RGBColor(0xE2, 0xEE, 0xE6)
TITLE_FENG = RGBColor(0x1A, 0x3C, 0x34)
FENG = RGBColor(0x2A, 0x6B, 0x52)
FENG_DEEP = RGBColor(0x1C, 0x45, 0x38)

# 漢樂府：暮色、松柏
BG_YUE = RGBColor(0xE6, 0xEA, 0xE8)
SOFT_YUE = RGBColor(0xDE, 0xE5, 0xEC)
TITLE_YUE = RGBColor(0x1C, 0x2C, 0x3C)
YUE = RGBColor(0x3A, 0x52, 0x68)
YUE_DEEP = RGBColor(0x24, 0x38, 0x4A)

# 兩種詩並置、以及「家」的土色
BG_BOTH = RGBColor(0xEE, 0xF0, 0xE8)
BG_HOME = RGBColor(0xF6, 0xF1, 0xE6)
SOFT_HOME = RGBColor(0xF3, 0xE8, 0xDA)
HOME = RGBColor(0x8A, 0x5E, 0x38)
HOME_DEEP = RGBColor(0x6A, 0x45, 0x28)

CARD = RGBColor(0xFB, 0xF9, 0xF3)
INK = RGBColor(0x1C, 0x2C, 0x28)
INK_SOFT = RGBColor(0x5A, 0x68, 0x62)
LINE = RGBColor(0xCD, 0xD6, 0xD0)
WHITE = RGBColor(0xFF, 0xFC, 0xF7)
LINE_YUE = RGBColor(0xC9, 0xD2, 0xD8)

FONT_TITLE = "Songti SC"
FONT_BODY = "Hiragino Sans GB"

# 標準 16:9。尺寸和 type 必須一致，Keynote 才開得了。
W = Emu(12192000)
H = Emu(6858000)
HYPERLINK = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"

KIND = {
    "feng": (BG_FENG, FENG, TITLE_FENG, SOFT_FENG, LINE),
    "yue": (BG_YUE, YUE, TITLE_YUE, SOFT_YUE, LINE_YUE),
    "both": (BG_BOTH, FENG, TITLE_FENG, SOFT_FENG, LINE),
    "home": (BG_HOME, HOME, HOME_DEEP, SOFT_HOME, LINE),
}


def _set_ea_font(run, name):
    rPr = run._r.get_or_add_rPr()
    rPr.set("lang", "zh-TW")
    for tag in ("a:latin", "a:ea", "a:cs"):
        el = rPr.find(qn(tag))
        if el is None:
            el = etree.SubElement(rPr, qn(tag))
        el.set("typeface", name)


def set_run(run, text, size, color, bold=False, font=FONT_BODY, url=None):
    run.text = text
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = font
    run.font.italic = False
    run.font.underline = bool(url)
    _set_ea_font(run, font)
    if url:
        rel = run.part.relate_to(url, HYPERLINK, is_external=True)
        rPr = run._r.get_or_add_rPr()
        h = rPr.find(qn("a:hlinkClick"))
        if h is None:
            h = etree.SubElement(rPr, qn("a:hlinkClick"))
        h.set(qn("r:id"), rel)


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
    set_run(p.add_run(), text, size, color, bold, font)
    return box


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


def image_size(path):
    """讀 PNG 或 JPEG 的像素寬高。這些圖檔名是 .png，內容其實是 JPEG。"""
    import struct
    with open(path, "rb") as f:
        head = f.read(32)
        if head.startswith(b"\x89PNG\r\n\x1a\n"):
            return struct.unpack(">II", head[16:24])
        if not head.startswith(b"\xff\xd8"):
            raise ValueError(f"不支援的圖片：{path}")
        f.seek(2)
        while True:
            marker = f.read(1)
            if not marker:
                break
            while marker != b"\xff":
                marker = f.read(1)
                if not marker:
                    break
            kind = f.read(1)
            if not kind or kind in (b"\xd8", b"\xd9", b"\x00"):
                continue
            seglen = struct.unpack(">H", f.read(2))[0]
            if kind in (b"\xc0", b"\xc1", b"\xc2"):
                f.read(1)
                height, width = struct.unpack(">HH", f.read(4))
                return width, height
            f.seek(seglen - 2, 1)
    raise ValueError(f"讀不到圖片尺寸：{path}")


def add_bg(slide, kind):
    bg, accent, _title, _soft, _line = KIND[kind]
    rect(slide, 0, 0, W, H, bg)
    if kind == "both":
        rect(slide, 0, 0, W / 2, Inches(0.08), FENG)
        rect(slide, W / 2, 0, W / 2, Inches(0.08), YUE)
        rect(slide, 0, H - Inches(0.05), W / 2, Inches(0.05), FENG)
        rect(slide, W / 2, H - Inches(0.05), W / 2, Inches(0.05), YUE)
    else:
        rect(slide, 0, 0, W, Inches(0.08), accent)
        rect(slide, 0, H - Inches(0.05), W, Inches(0.05), accent)


def add_title_bar(slide, title, subtitle, kind):
    _bg, accent, title_c, _soft, line = KIND[kind]
    rect(slide, Inches(0.48), Inches(0.26), Inches(0.09), Inches(0.40), accent)
    add_textbox(slide, Inches(0.72), Inches(0.20), Inches(12.1), Inches(0.42),
                title, 26, title_c, True, FONT_TITLE, anchor=MSO_ANCHOR.MIDDLE)
    rect(slide, Inches(0.72), Inches(0.68), Inches(12.1), Inches(0.012), line)
    if subtitle:
        add_textbox(slide, Inches(0.72), Inches(0.74), Inches(12.1), Inches(0.32),
                    subtitle, 14, INK_SOFT, False, FONT_BODY)


def add_footer(slide, n, total):
    add_textbox(slide, Inches(0.48), Inches(7.12), Inches(9.2), Inches(0.28),
                "戰爭詩四首　詩經與漢樂府", 11, INK_SOFT, False, FONT_BODY,
                anchor=MSO_ANCHOR.MIDDLE)
    add_textbox(slide, Inches(10.4), Inches(7.12), Inches(2.4), Inches(0.28),
                f"{n}  /  {total}", 11, INK_SOFT, False, FONT_BODY,
                align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)


def add_notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def card(slide, l, t, w, h, fill=CARD, line=LINE):
    return rect(slide, l, t, w, h, fill, line, 1.0, rounded=True)


def framed_pic(slide, path, l, t, w, caption):
    pad = int(Inches(0.06))
    cap_h = int(Inches(0.30))
    iw, ih = image_size(path)
    pic_w = int(w) - pad * 2
    pic_h = int(pic_w * ih / iw)
    frame_h = pad + pic_h + cap_h
    if pic_h <= 0 or frame_h <= 0:
        raise ValueError(f"圖片框高度無效：{path} {iw}x{ih}")
    rect(slide, l, t, w, frame_h, WHITE, LINE, 1.0)
    slide.shapes.add_picture(str(path), int(l) + pad, int(t) + pad, pic_w, pic_h)
    add_textbox(slide, l + Inches(0.08), t + pad + pic_h, w - Inches(0.16), cap_h,
                caption, 12, INK_SOFT, False, FONT_TITLE,
                PP_ALIGN.CENTER, MSO_ANCHOR.MIDDLE)
    return frame_h


def new_slide(prs):
    return prs.slides.add_slide(prs.slide_layouts[6])


def register_notes_master(prs):
    """備註頁必須寫進 presentation.xml，否則 Keynote 會判格式無效。"""
    notes_rid = None
    for rel in prs.part.rels.values():
        if rel.reltype.endswith("/notesMaster"):
            notes_rid = rel.rId
            break
    if not notes_rid:
        return
    el = prs.element
    if el.find(qn("p:notesMasterIdLst")) is not None:
        return
    lst = etree.Element(qn("p:notesMasterIdLst"))
    node = etree.SubElement(lst, qn("p:notesMasterId"))
    node.set(qn("r:id"), notes_rid)
    el.find(qn("p:sldIdLst")).addprevious(lst)


def activity_steps(slide, kind, steps):
    """三步以內的課堂活動。每步一行，給學生看。"""
    _bg, accent, title_c, soft, line = KIND[kind]
    n = len(steps)
    top = Inches(1.18)
    gap = Inches(0.10)
    row_h = Inches(1.18)
    for i, text in enumerate(steps):
        y = top + i * (row_h + gap)
        card(slide, Inches(0.48), y, Inches(12.38), row_h)
        rect(slide, Inches(0.70), y + Inches(0.28), Inches(0.62), Inches(0.62), accent, None, 0, True)
        add_textbox(slide, Inches(0.70), y + Inches(0.28), Inches(0.62), Inches(0.62),
                    str(i + 1), 20, WHITE, True, FONT_TITLE,
                    PP_ALIGN.CENTER, MSO_ANCHOR.MIDDLE)
        add_textbox(slide, Inches(1.55), y + Inches(0.16), Inches(11.0), Inches(0.86),
                    text, 20, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    return top + n * row_h + (n - 1) * gap


def point_card(slide, l, t, w, h, label, text, accent):
    card(slide, l, t, w, h)
    rect(slide, l, t + Inches(0.12), Inches(0.08), h - Inches(0.24), accent)
    add_textbox(slide, l + Inches(0.22), t + Inches(0.10), w - Inches(0.34), Inches(0.32),
                label, 14, accent, True, FONT_BODY)
    add_textbox(slide, l + Inches(0.22), t + Inches(0.44), w - Inches(0.36), h - Inches(0.54),
                text, 14, INK, False, FONT_BODY)


def poem_slide(slide, kind, gloss, pairs):
    """pairs: (classic, vernacular)."""
    _bg, accent, title_c, soft, line = KIND[kind]
    top = Inches(1.14)
    add_textbox(slide, Inches(0.55), top, Inches(6.3), Inches(0.28),
                "原文", 12, accent, True, FONT_BODY)
    add_textbox(slide, Inches(7.05), top, Inches(5.7), Inches(0.28),
                "白話", 12, accent, True, FONT_BODY)
    gloss_top = Inches(6.42)
    area_top = Inches(1.46)
    area_h = gloss_top - area_top - Inches(0.08)
    n = len(pairs)
    gap = Inches(0.07)
    row_h = int((area_h - gap * (n - 1)) / n)
    size = 16 if n <= 4 else 15 if n == 5 else 14
    vsize = size - 1
    for i, (classic, vernacular) in enumerate(pairs):
        y = area_top + i * (row_h + gap)
        card(slide, Inches(0.48), y, Inches(12.38), row_h)
        rect(slide, Inches(0.48), y, Inches(0.08), row_h, accent)
        rect(slide, Inches(6.95), y + Inches(0.06), Inches(5.82), row_h - Inches(0.12), soft)
        add_textbox(slide, Inches(0.70), y, Inches(6.1), row_h,
                    classic, size, title_c, False, FONT_TITLE, anchor=MSO_ANCHOR.MIDDLE)
        add_textbox(slide, Inches(7.10), y, Inches(5.55), row_h,
                    vernacular, vsize, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    card(slide, Inches(0.48), gloss_top, Inches(12.38), Inches(0.58), soft, line)
    add_textbox(slide, Inches(0.66), gloss_top, Inches(12.05), Inches(0.58),
                gloss, 13, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)


def analysis_slide(slide, kind, image, caption, points, images):
    _bg, accent, title_c, soft, line = KIND[kind]
    img_w = Inches(4.70)
    frame_h = framed_pic(slide, image, Inches(0.42), Inches(1.14), img_w, caption)
    grid_l = Inches(5.28)
    grid_w = Inches(7.62)
    col_w = Inches(3.74)
    gap = Inches(0.10)
    row_h = int((frame_h - gap) / 2)
    for i, (label, text) in enumerate(points):
        c = i % 2
        r = i // 2
        point_card(
            slide,
            grid_l + c * (col_w + gap),
            Inches(1.14) + r * (row_h + gap),
            col_w,
            row_h,
            label,
            text,
            accent,
        )
    band_top = Inches(1.14) + frame_h + Inches(0.10)
    band_h = Inches(6.98) - band_top
    card(slide, Inches(0.42), band_top, Inches(12.48), band_h, soft, line)
    add_textbox(slide, Inches(0.58), band_top + Inches(0.06), Inches(1.3), Inches(0.30),
                "意象", 14, accent, True, FONT_TITLE)
    col = Inches(3.85)
    for i, (name, text) in enumerate(images):
        x = Inches(1.85) + i * col
        add_textbox(slide, x, band_top + Inches(0.08), col - Inches(0.15), Inches(0.30),
                    name, 14, title_c, True, FONT_BODY)
        add_textbox(slide, x, band_top + Inches(0.38), col - Inches(0.18), band_h - Inches(0.46),
                    text, 13, INK, False, FONT_BODY)


def build():
    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = H
    prs.element.sldSz.set("type", "screen16x9")
    prs.element.sldSz.set("cx", str(int(W)))
    prs.element.sldSz.set("cy", str(int(H)))
    prs.core_properties.title = "戰爭詩四首：詩經與漢樂府"
    slides = []

    def S(kind):
        s = new_slide(prs)
        slides.append((s, kind))
        if kind:
            add_bg(s, kind)
        return s

    # 1 封面
    s = S(None)
    s.shapes.add_picture(str(ASSETS / "war-cover.png"), 0, 0, W, H)
    rect(s, 0, 0, W / 2, Inches(0.08), FENG)
    rect(s, W / 2, 0, W / 2, Inches(0.08), YUE)
    rect(s, 0, H - Inches(0.06), W / 2, Inches(0.06), FENG)
    rect(s, W / 2, H - Inches(0.06), W / 2, Inches(0.06), YUE)
    rect(s, Inches(0.55), Inches(4.15), Inches(8.15), Inches(2.85), CARD, LINE, 1.0, True)
    rect(s, Inches(0.55), Inches(4.15), Inches(0.10), Inches(2.85), FENG)
    add_textbox(s, Inches(0.90), Inches(4.28), Inches(7.5), Inches(0.28),
                "中學比較文學", 13, FENG, False, FONT_BODY)
    add_textbox(s, Inches(0.90), Inches(4.52), Inches(7.5), Inches(0.62),
                "戰爭詩四首", 36, TITLE_FENG, True, FONT_TITLE)
    add_textbox(s, Inches(0.90), Inches(5.18), Inches(7.5), Inches(0.36),
                "《詩經》國風　　漢樂府", 16, INK, False, FONT_TITLE)
    add_textbox(s, Inches(0.90), Inches(5.58), Inches(7.5), Inches(0.55),
                "〈擊鼓〉〈伯兮〉〈戰城南〉〈十五從軍徵〉", 15, INK_SOFT, False, FONT_BODY)
    add_textbox(s, Inches(0.90), Inches(6.20), Inches(7.5), Inches(0.55),
                "先分開讀。再問：打仗若是為了家，人為什麼回不去？", 15, HOME_DEEP, False, FONT_BODY)
    add_notes(s, (
        "建議節奏：背景約十分鐘。四首邊讀邊停，三次小活動各三到四分鐘。\n"
        "讀完「回家」再做四個角，約五分鐘。總結不必再講一遍活動裡已經說過的話。\n"
        "中文較弱的學生，每首先看右側白話。活動都允許用自己的話，不必背原文。\n"
        "時間不夠時，只留兩個活動：兩人一句話，以及「飯還是熱的」。影片只播〈十五從軍徵〉約六分鐘。"
    ))

    # 2 路線
    s = S("both")
    add_title_bar(s, "今天讀四首", "綠色兩首出自《詩經》，青灰兩首出自漢樂府。", "both")
    poems = [
        ("擊鼓", "出征的士兵", "邶風", "feng"),
        ("伯兮", "等待的妻子", "衛風", "feng"),
        ("戰城南", "戰死的人", "樂府", "yue"),
        ("十五從軍徵", "回來的老兵", "樂府", "yue"),
    ]
    for i, (name, who, src, k) in enumerate(poems):
        accent = FENG if k == "feng" else YUE
        soft = SOFT_FENG if k == "feng" else SOFT_YUE
        x = Inches(0.42) + i * Inches(3.22)
        card(s, x, Inches(1.22), Inches(3.05), Inches(2.15), soft)
        rect(s, x, Inches(1.22), Inches(3.05), Inches(0.08), accent)
        add_textbox(s, x + Inches(0.16), Inches(1.42), Inches(2.75), Inches(0.55),
                    name, 22, accent, True, FONT_TITLE)
        add_textbox(s, x + Inches(0.16), Inches(2.05), Inches(2.75), Inches(0.40),
                    who, 16, INK, False, FONT_BODY)
        add_textbox(s, x + Inches(0.16), Inches(2.55), Inches(2.75), Inches(0.40),
                    src, 14, INK_SOFT, False, FONT_BODY)
    labels = [
        ("1  內容", "寫的是什麼事"),
        ("2  角度", "誰在說話"),
        ("3  情感", "心情怎麼變"),
        ("4  態度", "怎麼看戰爭"),
    ]
    for i, (a, b) in enumerate(labels):
        x = Inches(0.42) + i * Inches(3.22)
        card(s, x, Inches(3.55), Inches(3.05), Inches(1.35))
        add_textbox(s, x + Inches(0.16), Inches(3.68), Inches(2.75), Inches(0.40),
                    a, 16, TITLE_FENG, True, FONT_BODY)
        add_textbox(s, x + Inches(0.16), Inches(4.15), Inches(2.75), Inches(0.40),
                    b, 14, INK, False, FONT_BODY)
    card(s, Inches(0.42), Inches(5.10), Inches(12.48), Inches(1.85), SOFT_HOME)
    add_textbox(s, Inches(0.66), Inches(5.28), Inches(12.0), Inches(0.36),
                "另外盯住「物」", 16, HOME_DEEP, True, FONT_TITLE)
    add_textbox(s, Inches(0.66), Inches(5.72), Inches(12.0), Inches(0.95),
                "每首只先抓兩三個意象：鼓、飛蓬、烏鴉、一碗飯。\n"
                "最後再問：這些物是用來裝飾，還是用來證明人回不了家？",
                16, INK, False, FONT_BODY)

    # 3 詩經
    s = S("feng")
    add_title_bar(s, "《詩經》是什麼", "中國最早的一部詩歌總集。", "feng")
    card(s, Inches(0.42), Inches(1.18), Inches(7.15), Inches(5.70))
    bits = [
        ("時間　", "大約西周到春秋，離現在兩千五百年以上。"),
        ("篇數　", "三百零五篇，常被叫做「詩三百」。"),
        ("本來　", "多半是配了音樂唱的。樂譜後來失傳，詩留下了。"),
        ("內容　", "勞動、愛情、怨刺、祭祀，也有戰爭和征役。"),
        ("編成　", "後人分成風、雅、頌三部分。"),
        ("今天　", "兩首都不在廟堂，而在「國風」：地方上的歌。"),
    ]
    y = Inches(1.40)
    for i, (lab, rest) in enumerate(bits):
        add_textbox(s, Inches(0.68), y + i * Inches(0.85), Inches(6.6), Inches(0.36),
                    lab, 16, FENG, True, FONT_BODY)
        add_textbox(s, Inches(0.68), y + i * Inches(0.85) + Inches(0.34), Inches(6.6), Inches(0.40),
                    rest, 15, INK, False, FONT_BODY)
    img_h = framed_pic(s, ASSETS / "war-shijing.png", Inches(7.75), Inches(1.18),
                       Inches(5.15), "風：地方上的人在唱歌")
    qtop = Inches(1.18) + img_h + Inches(0.12)
    card(s, Inches(7.75), qtop, Inches(5.15), Inches(6.88) - qtop, SOFT_FENG)
    add_textbox(s, Inches(7.95), qtop + Inches(0.12), Inches(4.8), Inches(0.90),
                "詩可以興、觀、群、怨。", 18, TITLE_FENG, True, FONT_TITLE)
    add_textbox(s, Inches(7.95), qtop + Inches(1.05), Inches(4.8), Inches(1.15),
                "孔子的話。本課最接近「怨」：把征役的苦說出來。",
                14, INK, False, FONT_BODY)

    # 4 風雅頌
    s = S("feng")
    add_title_bar(s, "風、雅、頌", "三個名字，是三種場合的歌。", "feng")
    blocks = [
        (FENG, "風", "地方的聲音", [
            "各地民歌",
            "一百六十篇",
            "稱「十五國風」",
            "日子、愛情、征役",
        ]),
        (YUE_DEEP, "雅", "朝廷的聲音", [
            "王朝的樂歌",
            "一百零五篇",
            "大雅：史詩、祭祀",
            "小雅：宴飲、怨刺、戍邊",
        ]),
        (INK_SOFT, "頌", "廟堂的聲音", [
            "宗廟祭祀的歌",
            "四十篇",
            "周頌、魯頌、商頌",
            "歌頌祖先與功德",
        ]),
    ]
    for i, (color, name, role, lines) in enumerate(blocks):
        x = Inches(0.42) + i * Inches(4.28)
        card(s, x, Inches(1.22), Inches(4.08), Inches(4.55))
        rect(s, x, Inches(1.22), Inches(4.08), Inches(0.10), color)
        add_textbox(s, x + Inches(0.22), Inches(1.48), Inches(3.65), Inches(0.70),
                    name, 36, color, True, FONT_TITLE)
        add_textbox(s, x + Inches(0.22), Inches(2.22), Inches(3.65), Inches(0.40),
                    role, 16, INK, True, FONT_BODY)
        yy = Inches(2.80)
        for line in lines:
            add_textbox(s, x + Inches(0.22), yy, Inches(3.65), Inches(0.42),
                        line, 16, INK, False, FONT_BODY)
            yy += Inches(0.48)
    card(s, Inches(0.42), Inches(5.95), Inches(12.48), Inches(0.95), SOFT_FENG)
    add_textbox(s, Inches(0.66), Inches(5.95), Inches(12.05), Inches(0.95),
                "今天兩首都在「風」裡。風最靠近普通人的日子。",
                18, TITLE_FENG, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)

    # 5 十五國風
    s = S("feng")
    add_title_bar(s, "十五國風", "「風」是一個地方的樂調，也是那個地方的歌。", "feng")
    names = [
        ("周南", ""), ("召南", ""), ("邶", "擊鼓"), ("鄘", ""), ("衛", "伯兮"),
        ("王", ""), ("鄭", ""), ("齊", ""), ("魏", ""), ("唐", ""),
        ("秦", ""), ("陳", ""), ("檜", ""), ("曹", ""), ("豳", ""),
    ]
    for i, (name, tag) in enumerate(names):
        r, c = divmod(i, 5)
        x = Inches(0.55) + c * Inches(2.52)
        y = Inches(1.25) + r * Inches(0.95)
        hot = name in ("邶", "衛")
        rect(s, x, y, Inches(2.35), Inches(0.82), FENG if hot else SOFT_FENG, None, 0, True)
        add_textbox(s, x, y + Inches(0.08), Inches(2.35), Inches(0.40),
                    name, 20, WHITE if hot else TITLE_FENG, True, FONT_TITLE,
                    PP_ALIGN.CENTER)
        if tag:
            add_textbox(s, x, y + Inches(0.44), Inches(2.35), Inches(0.30),
                        tag, 12, WHITE, False, FONT_BODY, PP_ALIGN.CENTER)
    card(s, Inches(0.48), Inches(4.25), Inches(12.38), Inches(2.60))
    add_textbox(s, Inches(0.72), Inches(4.42), Inches(11.9), Inches(0.40),
                "今天讀邶風、衛風", 18, FENG, True, FONT_TITLE)
    add_textbox(s, Inches(0.72), Inches(4.95), Inches(11.9), Inches(1.65),
                "邶、鄘、衛都在殷商舊地，大約今天河南北部，後來常合稱衛地的歌。\n"
                "所以這兩首可以放在一起：同一個地區，兩種人在說話。\n"
                "一個在路上，一個在家裡。",
                16, INK, False, FONT_BODY)

    # 6 漢樂府
    s = S("yue")
    add_title_bar(s, "漢樂府是什麼", "機關的名字，後來也變成詩的名字。", "yue")
    card(s, Inches(0.42), Inches(1.18), Inches(7.15), Inches(5.70))
    bits = [
        ("機關　", "漢武帝設立樂府，到各地收集歌辭，再配樂演唱。"),
        ("名稱　", "這些歌，以及後人仿作的，都叫樂府詩。"),
        ("來源　", "《漢書》說它們「感於哀樂，緣事而發」。"),
        ("意思　", "先有真實的事和情緒，然後才唱出來。"),
        ("特點　", "寫普通人；像說話；常常有故事。"),
        ("句子　", "比《詩經》自由。五言漸漸變多。"),
    ]
    y = Inches(1.40)
    for i, (lab, rest) in enumerate(bits):
        add_textbox(s, Inches(0.68), y + i * Inches(0.85), Inches(6.6), Inches(0.36),
                    lab, 16, YUE, True, FONT_BODY)
        add_textbox(s, Inches(0.68), y + i * Inches(0.85) + Inches(0.34), Inches(6.6), Inches(0.40),
                    rest, 15, INK, False, FONT_BODY)
    img_h = framed_pic(s, ASSETS / "war-yuefu.png", Inches(7.75), Inches(1.18),
                       Inches(5.15), "把普通人的歌記下來")
    qtop = Inches(1.18) + img_h + Inches(0.12)
    card(s, Inches(7.75), qtop, Inches(5.15), Inches(6.88) - qtop, SOFT_YUE)
    add_textbox(s, Inches(7.95), qtop + Inches(0.14), Inches(4.8), Inches(1.05),
                "感於哀樂\n緣事而發", 22, TITLE_YUE, True, FONT_TITLE)
    add_textbox(s, Inches(7.95), qtop + Inches(1.30), Inches(4.8), Inches(0.80),
                "先有事，再有歌。所以樂府的戰爭詩特別具體。",
                14, INK, False, FONT_BODY)
    add_notes(s, (
        "〈戰城南〉是漢鼓吹鐃歌十八曲，可以確定是漢樂府。\n"
        "〈十五從軍徵〉今本見於《樂府詩集·梁鼓角橫吹曲》，中學教材多標漢樂府，"
        "學界多當漢代舊辭流傳。課堂按漢樂府講即可。學生若問出處，說後來收進南朝曲辭，"
        "寫的仍是久戍老兵。"
    ))

    # 7 對照
    s = S("both")
    add_title_bar(s, "兩種詩，先分開看", "讀的時候可以先盯住「物」。後面再一起收。", "both")
    add_table = None
    rows_data = [
        ["時間", "西周到春秋", "兩漢"],
        ["從哪來", "各地民歌，後來編成", "樂府采集，配樂演唱"],
        ["句子", "以四言為主", "五言變多，可長可短"],
        ["戰爭詩", "多寫征人、思婦", "更敢寫死亡、荒村、質問"],
        ["意象", "常常一個物就夠", "喜歡把一整個場面攤開"],
        ["今天", "〈擊鼓〉〈伯兮〉", "〈戰城南〉〈十五從軍徵〉"],
    ]
    table_shape = s.shapes.add_table(1 + len(rows_data), 3, Inches(0.55), Inches(1.25),
                                     Inches(12.2), Inches(4.55))
    table = table_shape.table
    table.columns[0].width = Inches(2.3)
    table.columns[1].width = Inches(4.95)
    table.columns[2].width = Inches(4.95)
    headers = ["比較", "詩經・國風", "漢樂府"]
    fills = [SOFT_FENG, SOFT_FENG, SOFT_YUE]
    colors = [TITLE_FENG, TITLE_FENG, TITLE_YUE]
    for c, htext in enumerate(headers):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = fills[c]
        cell.margin_left = Inches(0.12)
        tf = cell.text_frame
        tf.word_wrap = True
        tf.anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        set_run(p.add_run(), htext, 16, colors[c], True, FONT_TITLE)
    for r, row in enumerate(rows_data, start=1):
        for c, val in enumerate(row):
            cell = table.cell(r, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD if r % 2 else BG_BOTH
            cell.margin_left = Inches(0.12)
            tf = cell.text_frame
            tf.word_wrap = True
            tf.anchor = MSO_ANCHOR.MIDDLE
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.LEFT if c else PP_ALIGN.CENTER
            set_run(p.add_run(), val, 15, INK, c == 0, FONT_BODY)
    card(s, Inches(0.55), Inches(6.00), Inches(12.2), Inches(0.90), SOFT_FENG)
    add_textbox(s, Inches(0.75), Inches(6.00), Inches(11.85), Inches(0.90),
                "相同的地方：兩種詩都很少寫勝利。不同的地方：詩經更含蓄，樂府更直接。",
                16, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)

    # 8 擊鼓原文
    s = S("feng")
    add_title_bar(s, "〈擊鼓〉　詩經・邶風", "士兵被派往南方。先盯住：鼓、馬、手。", "feng")
    poem_slide(s, "feng",
               "鏜 tāng 鼓聲　　爰 yuán 在哪裡　　契闊 聚散　　于嗟 xū jiē 歎息　　洵 xún 遠　　信 守約",
               [
                   ("擊鼓其鏜，踊躍用兵。土國城漕，我獨南行。",
                    "鼓聲很響。有人在國內修城，只有我往南走。"),
                   ("從孫子仲，平陳與宋。不我以歸，憂心有忡。",
                    "跟著將領去辦陳、宋的事。不讓我回去。"),
                   ("爰居爰處？爰喪其馬？于以求之？于林之下。",
                    "住在哪？馬丟在哪？到樹林底下去找。"),
                   ("死生契闊，與子成說。執子之手，與子偕老。",
                    "無論聚散生死，我說定了：握住你的手，一起到老。"),
                   ("于嗟闊兮，不我活兮。于嗟洵兮，不我信兮。",
                    "隔得太遠，不能再相聚。約定也守不住。"),
               ])
    add_notes(s, (
        "毛詩序說這首是怨衛國州吁用兵。課堂不必展開史事，說「衛國士兵被派往南方，久久不能回家」即可。\n"
        "「平陳與宋」有聯合、調解兩種解釋。\n"
        "「子」：本課取「家人」說，好和〈伯兮〉、和「家」相扣。舊注也有「同伍戰友」說。兩說都是：約定被戰爭打斷。\n"
        "若學生把「執子之手」只當成情話，提醒這是離別時的誓，不是團圓時的誓。\n"
        "「活」這裡多讀作「佸」，相會。課堂說「不能再相聚」。\n"
        "「洵」這裡是遠，不是「實在」。"
    ))

    # 9 擊鼓分析
    s = S("feng")
    add_title_bar(s, "〈擊鼓〉怎麼讀", "開頭像要出征，結尾只剩一聲歎息。", "feng")
    analysis_slide(
        s, "feng", ASSETS / "war-jigu.png", "于嗟洵兮，不我信兮",
        [
            ("內容", "被派去南方，軍中困頓，臨別的約定守不住。不寫勝敗。"),
            ("角度", "出征者自己說「我」。不是將領，也不是史官。"),
            ("情感", "振奮 → 不平 → 憂愁 → 茫然 → 絕望"),
            ("對戰爭", "不歌頌。人回不去，誓言變成空話。"),
        ],
        [
            ("鼓", "用聲音開場。後來鼓不再響，人還回不去。"),
            ("馬", "用丟失的馬寫亂。馬在林下，歸路也斷了。"),
            ("手", "用最暖的動作，記住守不住的約定。"),
        ],
    )

    # 10 伯兮原文
    s = S("feng")
    add_title_bar(s, "〈伯兮〉　詩經・衛風", "妻子在家等待。先盯住：飛蓬、太陽、諼草。", "feng")
    poem_slide(s, "feng",
               "朅 qiè 威武　　桀 傑出　　殳 shū 長兵器　　適 悅，討人喜歡　　杲 gǎo 明亮　　諼 xuān 忘憂草　　背 北堂　　痗 mèi 病",
               [
                   ("伯兮朅兮，邦之桀兮。伯也執殳，為王前驅。",
                    "丈夫真威武，是國中傑出的人。他拿長兵器，走在王師前面。"),
                   ("自伯之東，首如飛蓬。豈無膏沐？誰適為容！",
                    "他東征後，頭髮亂得像草。不是沒有髮油，打扮給誰看？"),
                   ("其雨其雨，杲杲出日。願言思伯，甘心首疾。",
                    "盼下雨，天卻大晴。一心想他，想得頭痛也願意。"),
                   ("焉得諼草？言樹之背。願言思伯，使我心痗。",
                    "哪裡找得到忘憂草？想種在屋子北面。想他，想出病來。"),
               ])
    add_notes(s, (
        "伯：兄弟排行，這裡是女子稱丈夫。\n"
        "誰適為容：適，悅。打扮了要取悅誰。\n"
        "其雨其雨，杲杲出日：先寫天氣，再寫想人。這是詩經常見的起興。盼歸而不至，不是天氣預報。\n"
        "首如飛蓬的「如」是打比方。\n"
        "諼草即萱草。焉得＝還沒有得到。背＝北堂，屋子北面，婦人常處的地方。\n"
        "為王前驅：這次出征有王事的名義，所以能討論「為了邦國，家卻空了」。"
    ))

    # 11 伯兮分析
    s = S("feng")
    add_title_bar(s, "〈伯兮〉怎麼讀", "她承認丈夫光榮。光榮留下的是空房。", "feng")
    analysis_slide(
        s, "feng", ASSETS / "war-boxi.png", "豈無膏沐？誰適為容！",
        [
            ("內容", "丈夫東征，是國中的先鋒。妻子從無心梳洗，到思念成病。"),
            ("角度", "留在家裡的妻子。和〈擊鼓〉相反：一個在路上，一個在窗邊。"),
            ("情感", "驕傲 → 無心梳洗 → 盼不到 → 想忘，忘不了"),
            ("對戰爭", "不否認「為王前驅」。只是把代價放在日常生活裡。"),
        ],
        [
            ("飛蓬", "用頭髮寫心。不是沒有髮油，是沒有人值得打扮。"),
            ("太陽", "用相反的天氣寫盼不到。先寫天，再寫人。"),
            ("諼草", "用「想忘記」寫「忘不了」。草還沒有，人已經病了。"),
        ],
    )

    # 12 對看
    s = S("feng")
    add_title_bar(s, "兩首放一起", "同一個地區。詩經不寫敵人，寫身上和家裡的物。", "feng")
    left = [
        ("誰在說", "被派出去的士兵"),
        ("他記得", "鼓聲、丟失的馬、握住的手"),
        ("情感落在", "約好了，人卻回不去"),
        ("看戰爭", "誓言變成空話"),
    ]
    right = [
        ("誰在說", "留在家裡的妻子"),
        ("她記得", "亂髮、大太陽、一株沒有的草"),
        ("情感落在", "為他驕傲，也為他生病"),
        ("看戰爭", "光榮是真的，空房也是真的"),
    ]
    for col, title, items, x in (
        ("〈擊鼓〉", "路上的人", left, Inches(0.42)),
        ("〈伯兮〉", "窗邊的人", right, Inches(6.88)),
    ):
        card(s, x, Inches(1.20), Inches(6.05), Inches(4.55))
        add_textbox(s, x + Inches(0.25), Inches(1.35), Inches(5.55), Inches(0.40),
                    col, 20, FENG, True, FONT_TITLE)
        add_textbox(s, x + Inches(0.25), Inches(1.80), Inches(5.55), Inches(0.32),
                    title, 14, INK_SOFT, False, FONT_BODY)
        for i, (k, v) in enumerate(items):
            yy = Inches(2.28) + i * Inches(0.78)
            add_textbox(s, x + Inches(0.25), yy, Inches(5.55), Inches(0.28),
                        k, 13, FENG, True, FONT_BODY)
            add_textbox(s, x + Inches(0.25), yy + Inches(0.28), Inches(5.55), Inches(0.36),
                        v, 16, INK, False, FONT_BODY)
    card(s, Inches(0.42), Inches(5.92), Inches(12.50), Inches(0.98), SOFT_FENG)
    add_textbox(s, Inches(0.66), Inches(5.92), Inches(12.1), Inches(0.98),
                "一個記得握住的手，一個連頭髮都不想梳。家從人離開的這一刻開始空。",
                18, TITLE_FENG, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)

    # 活動一：兩人見不到面
    s = S("feng")
    add_title_bar(s, "停一下　路上的人，窗邊的人", "約 4 分鐘。兩人一組。用自己的話，不必背詩。", "feng")
    activity_steps(s, "feng", [
        "一人當士兵，一人當妻子。各想一句話。",
        "句裡要有一個物：手、馬、飛蓬、太陽，或諼草。",
        "不可以說「我想你」。說完就轉身，不要回答對方。",
    ])
    card(s, Inches(0.48), Inches(5.05), Inches(12.38), Inches(1.80), SOFT_FENG)
    add_textbox(s, Inches(0.72), Inches(5.22), Inches(11.9), Inches(0.40),
                "這是在懂什麼", 16, FENG, True, FONT_TITLE)
    add_textbox(s, Inches(0.72), Inches(5.68), Inches(11.9), Inches(0.90),
                "這兩首詩沒有讓他們見面。\n活動就是把「見不到」做出來。",
                20, INK, False, FONT_BODY)
    add_notes(s, (
        "先給一分鐘安靜想，再同時說，不要變成對話。\n"
        "中文較弱的學生可以只說物：例如「手還在，人已經走了」「頭髮亂了，不梳」。\n"
        "若有人說成「我想你」，請他改成一個看得見的東西。\n"
        "全班不必每組都上台。聽兩組就夠，然後進〈戰城南〉。"
    ))

    # 13 戰城南原文
    s = S("yue")
    add_title_bar(s, "〈戰城南〉　漢樂府", "意象從身體走到城外。先盯住：烏鴉、馬、禾黍。", "yue")
    poem_slide(s, "yue",
               "郭 外城　　豪 háo 同「嚎」，招魂的哭　　客 死在他鄉的人　　梟騎 好馬　　駑馬 nú 劣馬　　禾黍 莊稼",
               [
                   ("戰城南，死郭北，野死不葬烏可食。",
                    "城南在打，城北在死。人死在野外，沒有安葬。"),
                   ("為我謂烏：「且為客豪！野死諒不葬，腐肉安能去子逃？」",
                    "請烏鴉先為客死的人哭一聲。反正不會被埋葬。"),
                   ("水深激激，蒲葦冥冥。梟騎戰鬥死，駑馬徘徊鳴。",
                    "水又深又急，蘆葦暗沉。好馬死了，劣馬獨自叫。"),
                   ("梁築室，何以南，何以北？禾黍不獲君何食？願為忠臣安可得？",
                    "路走不通。莊稼沒收，國君吃什麼？忠臣也做不成。"),
                   ("思子良臣，良臣誠可思：朝行出攻，暮不夜歸。",
                    "令人想念的好臣子：早上出去進攻，晚上再也不回來。"),
               ])
    add_notes(s, (
        "漢鼓吹鐃歌十八曲之一，大約西漢。字句各本略有不同，本課用常見讀本，關鍵句是「暮不夜歸」。\n"
        "城南、郭北是互文：不是只有一個角落，是到處都在死。\n"
        "講「烏可食」點到「沒有人埋葬、只好跟烏鴉說話」即可，不要展開畫面。\n"
        "梁築室：課堂說南北路不通。舊注有一說是有人在橋上蓋房子，交通斷了。\n"
        "禾黍不獲君何食：把戰爭、收成、國君的責任連在一起問。"
    ))

    # 14 戰城南分析
    s = S("yue")
    add_title_bar(s, "〈戰城南〉怎麼讀", "好馬死了，劣馬還在叫。忠臣的結局是回不來。", "yue")
    analysis_slide(
        s, "yue", ASSETS / "war-zhanchengnan.png", "朝行出攻，暮不夜歸",
        [
            ("內容", "人死在城外，無人安葬。路斷了，田也荒了。"),
            ("角度", "像死者自己開口，又像旁人在問國君。不是凱旋將軍。"),
            ("情感", "慘 → 向烏鴉懇求 → 荒涼 → 質問 → 哀悼"),
            ("對戰爭", "四首裡最直接。死亡之外，還質問：田荒了，忠臣怎麼做？"),
        ],
        [
            ("烏鴉", "用人該做的哭喪，交給一隻鳥。"),
            ("馬", "用好馬死、劣馬鳴，代替戰場上的人聲。"),
            ("禾黍", "用沒收的穀，把打仗接到「還有沒有飯」。"),
        ],
    )

    # 活動二：朝與暮
    s = S("yue")
    add_title_bar(s, "停一下　早上出去", "約 3 分鐘。全班一起做。", "yue")
    activity_steps(s, "yue", [
        "站起來。聽到「朝行出攻」，向前走一步。",
        "聽到「暮不夜歸」，停住。不要回頭。",
        "坐下，補半句：他出門時，家裡還有________。",
    ])
    card(s, Inches(0.48), Inches(5.05), Inches(12.38), Inches(1.80), SOFT_YUE)
    add_textbox(s, Inches(0.72), Inches(5.22), Inches(11.9), Inches(0.40),
                "這是在懂什麼", 16, YUE, True, FONT_TITLE)
    add_textbox(s, Inches(0.72), Inches(5.68), Inches(11.9), Inches(0.90),
                "不用一天的時間，人就從家裡被拿走了。\n教室若擠，坐著把雙手伸出，再收回來，表示出了門。",
                18, INK, False, FONT_BODY)
    add_notes(s, (
        "老師只讀那兩句，不要先解釋。讓身體先懂，再寫。\n"
        "「家裡還有」可以很具體：燈、飯、母親的聲音、沒有說完的話。\n"
        "不要引導到血腥。這一頁接的是「暮不夜歸」，不是屍體。"
    ))

    # 15 十五原文
    s = S("yue")
    add_title_bar(s, "〈十五從軍徵〉　漢樂府", "場面走回家裡，家卻空了。先盯住：松柏、兔雉、羹飯。", "yue")
    poem_slide(s, "yue",
               "徵 被召當兵　　阿誰 誰　　冢纍纍 zhǒng léi 墳一座座　　狗竇 dòu 狗洞　　雉 zhì 野雞　　旅 沒人種、自己長的　　飰 同「飯」　　貽 yí 送給",
               [
                   ("十五從軍徵，八十始得歸。",
                    "十五歲當兵，八十歲才回家。"),
                   ("道逢鄉里人：「家中有阿誰？」",
                    "路上問同鄉：家裡還有誰？"),
                   ("「遙看是君家，松柏冢纍纍。」",
                    "遠遠那裡就是你家。松柏下面，都是墳。"),
                   ("兔從狗竇入，雉從梁上飛。",
                    "兔子鑽進狗洞，野雞在屋梁上飛。"),
                   ("中庭生旅穀，井上生旅葵。舂穀持作飰，採葵持作羹。",
                    "院子和井邊長滿野穀、野菜。他拿來煮成飯和湯。"),
                   ("羹飰一時熟，不知貽阿誰。出門東向看，淚落沾我衣。",
                    "飯熟了，不知道給誰吃。出門一望，淚濕了衣服。"),
               ])
    add_notes(s, (
        "文獻：今本在《樂府詩集》「梁鼓角橫吹曲」。教材通作漢樂府。課堂不必先講版本；"
        "若有學生問，說這首後來被收進南朝的橫吹曲，寫的仍是打了一輩子仗的老兵。\n"
        "旅穀、旅葵的「旅」：不因播種而生。穀和葵本是人的食物，現在自己長進院子。\n"
        "這首是白描的好例子：前面幾乎不說「傷心」，直到最後一行才落淚。\n"
        "東向不必坐實成某個地名。人望向空處即可。\n"
        "十五和八十之間是六十五年。這六十五年，詩一句仗都不寫。"
    ))

    # 16 十五分析
    s = S("yue")
    add_title_bar(s, "〈十五從軍徵〉怎麼讀", "最殘酷的不是死在外面，是活著回來，家先沒了。", "yue")
    analysis_slide(
        s, "yue", ASSETS / "war-shiwu.png", "不知貽阿誰",
        [
            ("內容", "六十五年後回家。家人已成墳，屋子給了野物。飯熟了，沒人吃。"),
            ("角度", "回來的老兵。有問有答，像一個小故事。"),
            ("情感", "能回了 → 還有誰 → 只剩墳 → 獨自煮飯 → 落淚"),
            ("對戰爭", "不通篇責罵。用一個人的一生，把代價算出來。"),
        ],
        [
            ("松柏", "用墳邊的樹換掉「家」。鄉人指給你看的，是墓地。"),
            ("兔、雉", "用不該進門的動物，代替「家毀了」這句話。"),
            ("羹飯", "用煮熟的一餐把家幾乎找回來，下一句再落空。"),
        ],
    )

    # 活動三：不說傷心
    s = S("yue")
    add_title_bar(s, "停一下　不要寫「傷心」", "約 4 分鐘。每人兩行。模仿這首詩的寫法。", "yue")
    activity_steps(s, "yue", [
        "寫兩行。不准用「傷心」「可憐」「戰爭」。",
        "第一行是一個還熱著的東西。",
        "第二行：那樣東西還在，人卻不在了。",
    ])
    card(s, Inches(0.48), Inches(5.05), Inches(6.05), Inches(1.80), SOFT_YUE)
    add_textbox(s, Inches(0.70), Inches(5.20), Inches(5.65), Inches(0.36),
                "可以改成自己的", 14, YUE, True, FONT_BODY)
    add_textbox(s, Inches(0.70), Inches(5.58), Inches(5.65), Inches(1.05),
                "飯還是熱的。\n可是沒有人拿筷子。", 20, TITLE_YUE, True, FONT_TITLE)
    card(s, Inches(6.70), Inches(5.05), Inches(6.16), Inches(1.80))
    add_textbox(s, Inches(6.92), Inches(5.20), Inches(5.75), Inches(0.36),
                "這是在懂什麼", 14, YUE, True, FONT_BODY)
    add_textbox(s, Inches(6.92), Inches(5.62), Inches(5.75), Inches(1.00),
                "樂府不先說心情。\n它先給你一個看得見的東西。", 18, INK, False, FONT_BODY)
    add_notes(s, (
        "例子只是支架。請學生換掉「飯」和「筷子」：燈、椅子、名字、鞋。\n"
        "中文較弱的可以用填空：________還是熱的。可是沒有人________。\n"
        "收三個就好。問他們：你沒有寫「傷心」，我們為什麼還是懂？"
    ))

    # 17 四首總表
    s = S("both")
    add_title_bar(s, "四首合起來，戰爭寫了哪些方面", "沒有一首寫在慶功的時候。", "both")
    data = [
        ["〈擊鼓〉", "出征的士兵", "別離，約定落空", "鼓、馬、手"],
        ["〈伯兮〉", "家中的妻子", "等待，英雄留下空位", "飛蓬、太陽、諼草"],
        ["〈戰城南〉", "戰死的人", "死亡，田地荒廢", "烏鴉、馬、禾黍"],
        ["〈十五從軍徵〉", "歸來的老兵", "人回來，家已經不在", "松柏、兔雉、羹飯"],
    ]
    table_shape = s.shapes.add_table(5, 4, Inches(0.42), Inches(1.22), Inches(12.48), Inches(3.90))
    table = table_shape.table
    widths = [Inches(2.55), Inches(2.7), Inches(3.85), Inches(3.38)]
    for i, cw in enumerate(widths):
        table.columns[i].width = cw
    heads = ["詩", "誰在說話", "戰爭的哪一面", "記得的意象"]
    for c, htext in enumerate(heads):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = SOFT_FENG if c < 2 else SOFT_YUE
        cell.margin_left = Inches(0.10)
        tf = cell.text_frame
        tf.anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        set_run(p.add_run(), htext, 14, TITLE_FENG if c < 2 else TITLE_YUE, True, FONT_BODY)
    for r, row in enumerate(data, start=1):
        for c, val in enumerate(row):
            cell = table.cell(r, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD if r % 2 else BG_BOTH
            cell.margin_left = Inches(0.10)
            cell.margin_right = Inches(0.08)
            tf = cell.text_frame
            tf.word_wrap = True
            tf.anchor = MSO_ANCHOR.MIDDLE
            p = tf.paragraphs[0]
            set_run(p.add_run(), val, 14, INK, c == 0, FONT_BODY)
    card(s, Inches(0.42), Inches(5.32), Inches(12.48), Inches(1.58), SOFT_HOME)
    add_textbox(s, Inches(0.66), Inches(5.48), Inches(12.05), Inches(1.25),
                "別離、等待、死亡、晚歸。\n四種代價，最後都落到同一個地方：家。",
                20, HOME_DEEP, True, FONT_TITLE)

    # 18 意象用法總結
    s = S("both")
    add_title_bar(s, "意象怎麼用", "不是裝飾。它們是回不了家的證據。", "both")
    cols = [
        (SOFT_FENG, FENG, TITLE_FENG, "詩經：一個物，一種心情",
         "鼓、手、飛蓬、太陽、諼草。",
         "物很小，貼著身體和屋子。一個物頂住一種心情，不必把戰場鋪開。"),
        (SOFT_YUE, YUE, TITLE_YUE, "樂府：一串物，一幅畫",
         "烏鴉、蘆葦、馬、松柏、兔、飯。",
         "物很多，排成看得到的場面。詩先不判斷，讓你自己看見。"),
        (SOFT_HOME, HOME, HOME_DEEP, "四首共通的用法",
         "執手、萱草、羹飯。",
         "最暖的東西，用來寫最空的時刻。溫暖一出現，就說明它已經失去。"),
    ]
    for i, (soft, accent, title_c, head, ex, body) in enumerate(cols):
        x = Inches(0.40) + i * Inches(4.28)
        card(s, x, Inches(1.20), Inches(4.10), Inches(4.15), soft)
        add_textbox(s, x + Inches(0.18), Inches(1.38), Inches(3.75), Inches(0.85),
                    head, 18, title_c, True, FONT_TITLE)
        add_textbox(s, x + Inches(0.18), Inches(2.30), Inches(3.75), Inches(0.85),
                    ex, 15, INK, True, FONT_BODY)
        add_textbox(s, x + Inches(0.18), Inches(3.20), Inches(3.75), Inches(1.85),
                    body, 15, INK, False, FONT_BODY)
    card(s, Inches(0.40), Inches(5.52), Inches(12.52), Inches(1.38))
    add_textbox(s, Inches(0.62), Inches(5.68), Inches(12.1), Inches(1.05),
                "還有一個對調：烏鴉來送葬，兔子住進狗洞。\n人的位置空了，野的東西補上來。",
                18, INK, False, FONT_BODY)

    # 19 戰爭觀
    s = S("both")
    add_title_bar(s, "這些詩怎麼看戰爭", "就這四首而言，不是就所有中國詩而言。", "both")
    views = [
        ("可以出征", "〈伯兮〉承認「為王前驅」是光榮。詩不是說絕對不能打仗。"),
        ("幾乎不寫勝利", "四首不寫敵人，不寫計謀，也不寫慶功。它們寫人失去什麼。"),
        ("看得最清的是代價", "戰爭可以有名義。詩選擇站在名義外面的那個人。"),
    ]
    for i, (h, b) in enumerate(views):
        y = Inches(1.22) + i * Inches(1.45)
        card(s, Inches(0.48), y, Inches(12.38), Inches(1.32))
        add_textbox(s, Inches(0.74), y + Inches(0.16), Inches(11.9), Inches(0.36),
                    h, 18, TITLE_FENG if i < 2 else HOME_DEEP, True, FONT_TITLE)
        add_textbox(s, Inches(0.74), y + Inches(0.58), Inches(11.9), Inches(0.55),
                    b, 16, INK, False, FONT_BODY)
    add_textbox(s, Inches(0.55), Inches(5.70), Inches(12.2), Inches(1.15),
                "《詩經》裡也有〈無衣〉這樣「與子同仇」的聲音。那是另一條線。\n"
                "今天這四首走得更遠：寫戰爭怎麼碰到家。",
                16, INK_SOFT, False, FONT_BODY)
    add_notes(s, "不要收成「中國人都反戰」。〈無衣〉〈采薇〉〈國殤〉都是不同的聲音。本課只收這四首的共同點：代價，以及家。")

    # 20 英雄
    s = S("both")
    add_title_bar(s, "這些詩怎麼看英雄", "英雄常常不是打贏的人。", "both")
    heroes = [
        ("〈伯兮〉", "邦之桀，執殳前驅。英雄很亮。家裡只剩一頭亂髮。"),
        ("〈戰城南〉", "良臣只有一個定義：朝行出攻，暮不夜歸。"),
        ("〈十五從軍徵〉", "人活著回來了，沒有凱旋。兔子比他更像這房子的主人。"),
        ("所以", "這些詩裡，英雄常常是把家交出去的人。光榮和回不了家，是同一件事。"),
    ]
    for i, (h, b) in enumerate(heroes):
        y = Inches(1.20) + i * Inches(1.28)
        soft = SOFT_HOME if i == 3 else CARD
        card(s, Inches(0.48), y, Inches(12.38), Inches(1.16), soft)
        add_textbox(s, Inches(0.74), y + Inches(0.12), Inches(3.2), Inches(0.90),
                    h, 18, HOME_DEEP if i == 3 else TITLE_YUE, True, FONT_TITLE,
                    anchor=MSO_ANCHOR.MIDDLE)
        add_textbox(s, Inches(4.00), y + Inches(0.14), Inches(8.5), Inches(0.88),
                    b, 16, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    add_notes(s, "若班上剛讀過〈國殤〉：那裡死者是鬼雄，死得壯。這四首把光環拿掉，沒有神，也沒有表彰。兩種英雄觀可以對看，不必分高下。")

    # 21 回家
    s = S("home")
    add_title_bar(s, "回家", "這是四首最後要收住的地方。", "home")
    add_textbox(s, Inches(0.55), Inches(1.15), Inches(12.2), Inches(1.15),
                "戰爭是為了保衛家園，\n最後卻回不了家。", 28, HOME_DEEP, True, FONT_TITLE)
    frame_h = framed_pic(s, ASSETS / "war-door.png", Inches(0.42), Inches(2.45),
                         Inches(6.15), "門還在。家不一定還在。")
    steps = [
        ("〈擊鼓〉", "不放你回", "不我以歸"),
        ("〈伯兮〉", "家在等人", "人被抽走，屋子還在"),
        ("〈戰城南〉", "死在外面", "暮不夜歸"),
        ("〈十五從軍徵〉", "人回了，家沒了", "不知貽阿誰"),
    ]
    # 右側四層。若圖片較矮，仍從 2.45 排到接近底部。
    avail = Inches(6.95) - Inches(2.45)
    gap = Inches(0.08)
    sh = int((avail - gap * 3) / 4)
    for i, (name, what, proof) in enumerate(steps):
        y = Inches(2.45) + i * (sh + gap)
        card(s, Inches(6.75), y, Inches(6.12), sh, SOFT_HOME if i < 3 else HOME)
        name_c = HOME_DEEP if i < 3 else WHITE
        body_c = INK if i < 3 else WHITE
        add_textbox(s, Inches(6.95), y + Inches(0.06), Inches(5.75), Inches(0.32),
                    name, 14, name_c, True, FONT_TITLE)
        add_textbox(s, Inches(6.95), y + Inches(0.36), Inches(5.75), sh - Inches(0.44),
                    what + "　" + proof, 15, body_c, False, FONT_BODY)

    # 活動四：四個角
    s = S("home")
    add_title_bar(s, "停一下　你站在哪一種回不去", "約 5 分鐘。走到一角，用「我」說一句。", "home")
    corners = [
        ("不放你回", "擊鼓的士兵"),
        ("家在等人", "伯兮的妻子"),
        ("死在外面", "戰城南的人"),
        ("人回了，家沒了", "八十歲的老兵"),
    ]
    for i, (what, who) in enumerate(corners):
        r, c = divmod(i, 2)
        x = Inches(0.48) + c * Inches(6.40)
        y = Inches(1.22) + r * Inches(2.15)
        fill = HOME if i == 3 else SOFT_HOME
        name_c = WHITE if i == 3 else HOME_DEEP
        body_c = WHITE if i == 3 else INK
        card(s, x, y, Inches(6.20), Inches(2.00), fill)
        add_textbox(s, x + Inches(0.28), y + Inches(0.28), Inches(5.65), Inches(0.70),
                    what, 26, name_c, True, FONT_TITLE)
        add_textbox(s, x + Inches(0.28), y + Inches(1.10), Inches(5.65), Inches(0.55),
                    who, 16, body_c, False, FONT_BODY)
    card(s, Inches(0.48), Inches(5.62), Inches(12.38), Inches(1.25))
    add_textbox(s, Inches(0.72), Inches(5.62), Inches(11.95), Inches(1.25),
                "不是解釋這首詩。是那個人自己在說：我……\n沒有標準答案。站到你覺得最重的那一角。",
                18, HOME_DEEP, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    add_notes(s, (
        "四個角先在教室裡指好，再放這一頁。\n"
        "每人只說一句，以「我」開頭。例如：「我不被放回去。」「我還在窗邊。」「我早上出門了。」「我把飯煮好了。」\n"
        "若某一角人太多，請那一角自己聽出：為什麼多數人站在這裡。\n"
        "這一頁做完，後面的總結就用他們的句子，不必再講一遍四種回不去。"
    ))

    # 22 補充
    s = S("both")
    add_title_bar(s, "還可以記住的兩件事", "時間，以及一起吃飯。", "both")
    card(s, Inches(0.42), Inches(1.22), Inches(6.15), Inches(5.55), SOFT_FENG)
    add_textbox(s, Inches(0.66), Inches(1.42), Inches(5.7), Inches(0.45),
                "時間越來越長", 20, TITLE_FENG, True, FONT_TITLE)
    times = [
        ("〈擊鼓〉", "一次被派往南方"),
        ("〈伯兮〉", "一天一天在等"),
        ("〈戰城南〉", "早上出去，晚上回不來"),
        ("〈十五從軍徵〉", "十五歲到八十歲"),
    ]
    for i, (a, b) in enumerate(times):
        y = Inches(2.15) + i * Inches(1.05)
        add_textbox(s, Inches(0.70), y, Inches(5.5), Inches(0.32),
                    a, 14, FENG, True, FONT_BODY)
        add_textbox(s, Inches(0.70), y + Inches(0.32), Inches(5.5), Inches(0.40),
                    b, 18, INK, False, FONT_BODY)
    card(s, Inches(6.75), Inches(1.22), Inches(6.15), Inches(5.55), SOFT_YUE)
    add_textbox(s, Inches(7.00), Inches(1.42), Inches(5.7), Inches(0.70),
                "家是有人一起吃飯", 20, TITLE_YUE, True, FONT_TITLE)
    add_textbox(s, Inches(7.00), Inches(2.30), Inches(5.7), Inches(4.10),
                "〈戰城南〉問：禾黍不獲，君何食。\n\n"
                "〈十五從軍徵〉寫：羹飯熟了，不知給誰。\n\n"
                "仗先毀掉莊稼，再毀掉共食的人。\n"
                "保衛家園的戰爭，最後拆掉家的地基。",
                16, INK, False, FONT_BODY)

    # 活動之後再問
    s = S("both")
    add_title_bar(s, "用剛才的句子再問兩句", "不必另做一張學習單。就接他們說過的話。", "both")
    qs = [
        ("1", "你剛才那句「我……」，最靠近哪一個物？手、飛蓬、烏鴉，還是那碗飯？"),
        ("2", "如果教室裡還要加第五個角，你會讓誰站在那裡？"),
    ]
    for i, (n, q) in enumerate(qs):
        y = Inches(1.25) + i * Inches(2.15)
        card(s, Inches(0.48), y, Inches(12.38), Inches(2.00))
        bubble = FENG if i == 0 else HOME
        rect(s, Inches(0.72), y + Inches(0.55), Inches(0.80), Inches(0.80), bubble, None, 0, True)
        add_textbox(s, Inches(0.72), y + Inches(0.55), Inches(0.80), Inches(0.80),
                    n, 22, WHITE, True, FONT_TITLE, PP_ALIGN.CENTER, MSO_ANCHOR.MIDDLE)
        add_textbox(s, Inches(1.80), y + Inches(0.35), Inches(10.7), Inches(1.30),
                    q, 22, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    add_notes(s, (
        "時間夠再加兩問，不要一開始就問：\n"
        "「執子之手」若改成團圓時說，和離別時說有什麼不一樣？\n"
        "伯兮的丈夫算英雄嗎？請用詩裡的一句話，不要只說「算」或「不算」。\n"
        "十五歲離開、八十歲回來，會錯過誰？這一問留給中文較吃力、還沒開口的學生。"
    ))

    # 接到比較論文：同一個「不歸」
    s = S("both")
    add_title_bar(s, "寫〈國殤〉論文時，接在這裡", "論文說戰爭詩不寫勝利，而寫死亡和榮譽。今天四首只答應前半句。", "both")
    claims = [
        (SOFT_FENG, FENG, "論文的句子", "不寫打贏。寫肉體的死，也寫死者留下的榮譽。"),
        (SOFT_YUE, YUE, "今天四首", "也不寫打贏。但死了以後，多半沒有榮譽，只剩下回不了家。"),
        (SOFT_HOME, HOME, "〈國殤〉不同", "它把兩半又綁在一起：身既死兮神以靈，魂魄毅兮為鬼雄。"),
    ]
    for i, (fill, color, head, body) in enumerate(claims):
        y = Inches(1.20) + i * Inches(1.28)
        card(s, Inches(0.48), y, Inches(12.38), Inches(1.16), fill)
        add_textbox(s, Inches(0.72), y + Inches(0.14), Inches(3.15), Inches(0.88),
                    head, 18, color, True, FONT_TITLE, anchor=MSO_ANCHOR.MIDDLE)
        add_textbox(s, Inches(4.00), y + Inches(0.16), Inches(8.55), Inches(0.84),
                    body, 16, INK, False, FONT_BODY, anchor=MSO_ANCHOR.MIDDLE)
    card(s, Inches(0.48), Inches(5.15), Inches(12.38), Inches(1.70))
    add_textbox(s, Inches(0.72), Inches(5.30), Inches(11.95), Inches(0.40),
                "可以繞過去的那一個點", 14, HOME, True, FONT_BODY)
    add_textbox(s, Inches(0.72), Inches(5.72), Inches(11.95), Inches(0.90),
                "同一個「不歸」。四首寫成家沒了。〈國殤〉寫成鬼雄。",
                22, HOME_DEEP, True, FONT_TITLE)
    add_notes(s, (
        "論文題目：Ancient war poetry is rarely about victory; it focuses on physical death "
        "and the lasting honor of the fallen. 對文是 Iliad 16 帕特羅克洛斯之死，和〈國殤〉。\n"
        "不要把四首說成「中國人都反戰」。只說：它們證明「死」和「榮」可以拆開。\n"
        "〈國殤〉「出不入兮往不反」和擊鼓「不我以歸」、戰城南「暮不夜歸」是同一件事，評價相反。\n"
        "戰城南是野死不葬；〈國殤〉也寫棄原野，但接著用祭歌把魂安頓成鬼雄。這就是榮譽從哪裡來：不是勝仗，是這首詩本身。"
    ))

    s = S("both")
    add_title_bar(s, "論文三段，各借今天一句", "仍是 Iliad 對〈國殤〉。四首只用來說明〈國殤〉為什麼特別。", "both")
    rows = [
        ["戰場", "四首不鋪勝利，只留鼓、烏鴉、熱飯。", "〈國殤〉也先寫全軍盡，再把戰場收成祭歌。"],
        ["英雄", "英雄是把家交出去的人。", "〈國殤〉的英雄是魂還在的人：為鬼雄。"],
        ["死後", "〈戰城南〉連埋葬都沒有。", "〈國殤〉用一首詩給他們位置：神以靈。"],
    ]
    table_shape = s.shapes.add_table(4, 3, Inches(0.42), Inches(1.20), Inches(12.48), Inches(3.55))
    table = table_shape.table
    for i, cw in enumerate((Inches(1.7), Inches(5.5), Inches(5.28))):
        table.columns[i].width = cw
    heads = ["論文要寫", "今天四首", "轉到〈國殤〉"]
    for c, htext in enumerate(heads):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = SOFT_HOME if c == 2 else SOFT_FENG
        cell.margin_left = Inches(0.08)
        tf = cell.text_frame
        tf.word_wrap = True
        tf.anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        set_run(p.add_run(), htext, 14, HOME_DEEP if c == 2 else TITLE_FENG, True, FONT_BODY)
    for r, row in enumerate(rows, start=1):
        for c, val in enumerate(row):
            cell = table.cell(r, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD if r % 2 else BG_BOTH
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.06)
            tf = cell.text_frame
            tf.word_wrap = True
            tf.anchor = MSO_ANCHOR.MIDDLE
            p = tf.paragraphs[0]
            set_run(p.add_run(), val, 13, INK, c == 0, FONT_BODY)
    card(s, Inches(0.42), Inches(4.95), Inches(12.48), Inches(1.90))
    add_textbox(s, Inches(0.66), Inches(5.10), Inches(12.05), Inches(0.36),
                "和荷馬並在一段裡時，可以這樣收", 14, YUE, True, FONT_BODY)
    add_textbox(s, Inches(0.66), Inches(5.48), Inches(12.05), Inches(1.15),
                "荷馬把榮譽放在一個有名字的身體上。\n〈國殤〉把榮譽放在一群沒有名字的魂上。",
                20, INK, False, FONT_TITLE)
    add_notes(s, (
        "英文可嵌入：Homer attaches honor to one named body; Guo Shang attaches it to unnamed souls. "
        "The Shijing and Han yuefu poems show that Chinese war poetry can also refuse that second step: "
        "never returning becomes a ruined home, not a hero among the shades.\n"
        "Iliad 引文用短句即可：Apollo strikes Patroclus; the helmet rolls in blood and dust; Hector boasts. "
        "對〈國殤〉：出不入兮往不反／首身離兮心不懲／魂魄毅兮為鬼雄。\n"
        "神靈一題若要寫：荷馬是神從背後推倒一個人。〈國殤〉只說天時懟、威靈怒，神不拯救，也不點名。榮譽是祭歌給的，不是神給的。"
    ))

    # 24 影片
    s = S("both")
    add_title_bar(s, "可以播的影片", "集數若對不上，在系列裡搜標題即可。", "both")
    videos = [
        (FENG, "課上先播", "駱玉明〈十五從軍徵〉約 6 分鐘。故事最清楚。",
         "開啟第 22 集", "https://www.bilibili.com/video/BV1Kc41157mU/"),
        (YUE, "可接著選", "同一系列〈戰城南〉約 24 分鐘。",
         "開啟第 19 集", "https://www.bilibili.com/video/BV1Kc41157mU/"),
        (FENG_DEEP, "老師備課", "孟凡君逐字講〈擊鼓〉〈伯兮〉，各約 30 分鐘。",
         "開啟擊鼓（第 31 集）", "https://www.bilibili.com/video/BV1zf421f7yb/"),
        (YUE_DEEP, "延伸約 30 分鐘", "紀錄片《嘿，這就是詩經》第 6 集〈戰爭篇〉，講到「豈無膏沐，誰適為容」。",
         "Bilibili 搜：嘿，这就是诗经 06 战争篇", None),
    ]
    for i, (color, tag, desc, link_text, url) in enumerate(videos):
        y = Inches(1.18) + i * Inches(1.40)
        card(s, Inches(0.42), y, Inches(12.48), Inches(1.28))
        rect(s, Inches(0.42), y, Inches(0.10), Inches(1.28), color)
        add_textbox(s, Inches(0.70), y + Inches(0.10), Inches(3.1), Inches(1.05),
                    tag, 16, color, True, FONT_TITLE, anchor=MSO_ANCHOR.MIDDLE)
        add_textbox(s, Inches(3.85), y + Inches(0.10), Inches(8.7), Inches(0.55),
                    desc, 15, INK, False, FONT_BODY)
        box = s.shapes.add_textbox(Inches(3.85), y + Inches(0.62), Inches(8.7), Inches(0.48))
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        run = p.add_run()
        set_run(run, link_text, 14, YUE, True, FONT_BODY, url=url)
    add_notes(s, (
        "伯兮另有一集：https://www.bilibili.com/video/BV1zf421f7yb?p=62\n"
        "駱玉明系列另一上傳：https://www.bilibili.com/video/BV1F44y1N7Vy 第19集戰城南、第22集十五從軍徵。\n"
        "紀錄片由河北廣播電視台製作，約三十分鐘，適合作詩經戰爭詩的背景，不是這四首的逐句講解。"
    ))

    register_notes_master(prs)
    total = len(slides)
    for i, (slide, kind) in enumerate(slides, start=1):
        if i == 1:
            continue
        add_footer(slide, i, total)
    prs.save(OUT)
    print(f"saved {OUT} slides={total}")


if __name__ == "__main__":
    build()
