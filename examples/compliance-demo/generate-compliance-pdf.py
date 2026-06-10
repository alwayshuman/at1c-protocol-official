#!/usr/bin/env python3
"""
AT1C Compliance Report PDF Generator
Called by index.ts via: python3 generate-compliance-pdf.py <output_path> <json_data>
"""

import sys
import json
from datetime import datetime, timezone

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas

# ── Brand colours ─────────────────────────────────────────────────────────────
AT1C_DARK   = colors.HexColor("#0F1923")
AT1C_BLUE   = colors.HexColor("#1A6BFF")
AT1C_LIGHT  = colors.HexColor("#F4F7FF")
AT1C_GREEN  = colors.HexColor("#00B96B")
AT1C_RED    = colors.HexColor("#E53E3E")
AT1C_GREY   = colors.HexColor("#64748B")
AT1C_BORDER = colors.HexColor("#DDE3EF")

# ── Page header/footer ────────────────────────────────────────────────────────
class AT1CPageTemplate:
    def __init__(self, doc_id, generated_at):
        self.doc_id = doc_id
        self.generated_at = generated_at

    def __call__(self, canvas_obj, doc):
        canvas_obj.saveState()
        w, h = A4

        # Top bar
        canvas_obj.setFillColor(AT1C_DARK)
        canvas_obj.rect(0, h - 18*mm, w, 18*mm, fill=1, stroke=0)
        canvas_obj.setFillColor(colors.white)
        canvas_obj.setFont("Helvetica-Bold", 13)
        canvas_obj.drawString(15*mm, h - 12*mm, "AT1C")
        canvas_obj.setFont("Helvetica", 9)
        canvas_obj.setFillColor(colors.HexColor("#8DA4C8"))
        canvas_obj.drawString(34*mm, h - 12*mm, "AI Transparency & Compliance Certificate")
        canvas_obj.setFont("Helvetica", 7.5)
        canvas_obj.drawRightString(w - 15*mm, h - 12*mm, f"DOC ID: {self.doc_id}")

        # Bottom bar
        canvas_obj.setFillColor(AT1C_BORDER)
        canvas_obj.rect(0, 0, w, 10*mm, fill=1, stroke=0)
        canvas_obj.setFillColor(AT1C_GREY)
        canvas_obj.setFont("Helvetica", 7)
        canvas_obj.drawString(15*mm, 3.5*mm,
            f"Generated: {self.generated_at}   |   AT1C Protocol v0.1   |   EU AI Act Enforcement Target: August 2026")
        canvas_obj.drawRightString(w - 15*mm, 3.5*mm, f"Page {doc.page}")

        canvas_obj.restoreState()

# ── Styles ────────────────────────────────────────────────────────────────────
def styles():
    return {
        "section": ParagraphStyle("S", fontName="Helvetica-Bold", fontSize=9,
            textColor=AT1C_BLUE, spaceBefore=6, spaceAfter=4),
        "label":   ParagraphStyle("L", fontName="Helvetica-Bold", fontSize=8,
            textColor=AT1C_GREY, spaceAfter=1),
        "value":   ParagraphStyle("V", fontName="Helvetica", fontSize=9,
            textColor=AT1C_DARK, spaceAfter=4, leading=13),
        "mono":    ParagraphStyle("M", fontName="Courier", fontSize=7.5,
            textColor=AT1C_DARK, leading=11, backColor=AT1C_LIGHT,
            leftIndent=4, rightIndent=4, spaceAfter=4),
        "pass":    ParagraphStyle("P", fontName="Helvetica-Bold", fontSize=9,
            textColor=AT1C_GREEN),
        "fail":    ParagraphStyle("F", fontName="Helvetica-Bold", fontSize=9,
            textColor=AT1C_RED),
        "legal":   ParagraphStyle("LE", fontName="Helvetica-Oblique", fontSize=7.5,
            textColor=AT1C_GREY, leading=11),
    }

def divider():
    return HRFlowable(width="100%", thickness=0.5, color=AT1C_BORDER,
                      spaceBefore=4, spaceAfter=4)

def field_table(rows, col1=50):
    t = Table(rows, colWidths=[col1*mm, (180 - col1)*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
        ("LEFTPADDING",  (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING",   (0,0), (-1,-1), 1),
        ("BOTTOMPADDING",(0,0), (-1,-1), 1),
    ]))
    return t

# ── Main ──────────────────────────────────────────────────────────────────────
def generate(output_path, data):
    now      = datetime.now(timezone.utc)
    gen_at   = now.strftime("%Y-%m-%d %H:%M:%S UTC")
    doc_id   = data.get("receiptId", "AT1C-" + now.strftime("%Y%m%d-%H%M%S"))
    st       = styles()

    page_tmpl = AT1CPageTemplate(doc_id, gen_at)

    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=24*mm, bottomMargin=18*mm,
        leftMargin=15*mm, rightMargin=15*mm,
        title="AT1C Compliance Report", author="AT1C Protocol")

    story = []
    story.append(Spacer(1, 4*mm))

    # ── Hero ──────────────────────────────────────────────────────────────────
    hero = Table([[Paragraph(
        "<b>AI Transparency &amp; Compliance Certificate</b>",
        ParagraphStyle("H", fontName="Helvetica-Bold", fontSize=16,
            textColor=AT1C_DARK, leading=20)
    )]], colWidths=[180*mm])
    hero.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), AT1C_LIGHT),
        ("LEFTPADDING",  (0,0), (-1,-1), 8*mm),
        ("TOPPADDING",   (0,0), (-1,-1), 6*mm),
        ("BOTTOMPADDING",(0,0), (-1,-1), 6*mm),
    ]))
    story.append(hero)
    story.append(Spacer(1, 3*mm))

    # ── Info strip ────────────────────────────────────────────────────────────
    cell = lambda b, v: Paragraph(f"<b>{b}</b><br/>{v}",
        ParagraphStyle("IC", fontName="Helvetica", fontSize=8,
            textColor=AT1C_DARK, leading=12))

    info = Table([[
        cell("Receipt ID",        doc_id),
        cell("Generated",         gen_at),
        cell("Protocol",          "AT1C v0.1"),
        cell("Regulation",        "EU AI Act (Art. 13)"),
    ]], colWidths=[50*mm, 55*mm, 35*mm, 40*mm])
    info.setStyle(TableStyle([
        ("BOX",          (0,0), (-1,-1), 0.5, AT1C_BORDER),
        ("INNERGRID",    (0,0), (-1,-1), 0.5, AT1C_BORDER),
        ("LEFTPADDING",  (0,0), (-1,-1), 4*mm),
        ("TOPPADDING",   (0,0), (-1,-1), 3*mm),
        ("BOTTOMPADDING",(0,0), (-1,-1), 3*mm),
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
    ]))
    story.append(info)
    story.append(Spacer(1, 5*mm))

    # ── Section 1: Receipt ────────────────────────────────────────────────────
    story.append(Paragraph("1. COMPLIANCE RECEIPT", st["section"]))
    story.append(divider())
    rows = []
    for label, key in [
        ("Receipt ID",  "receiptId"),
        ("Nonce",       "nonce"),
        ("User",        "userId"),
        ("Agent",       "agentId"),
        ("Action",      "action"),
        ("Status",      "status"),
        ("Approved at", "timestamp"),
        ("Expires at",  "expiresAt"),
    ]:
        if data.get(key):
            rows.append([Paragraph(label, st["label"]),
                         Paragraph(str(data[key]), st["value"])])
    if rows:
        story.append(field_table(rows))

    # Signature on its own line (it's long)
    if data.get("signature"):
        story.append(Paragraph("Signature", st["label"]))
        story.append(Paragraph(data["signature"], st["mono"]))

    story.append(Spacer(1, 4*mm))

    # ── Section 2: Verification ───────────────────────────────────────────────
    story.append(Paragraph("2. CRYPTOGRAPHIC VERIFICATION", st["section"]))
    story.append(divider())

    passed = data.get("valid", True)
    badge_bg  = colors.HexColor("#EDFAF3") if passed else colors.HexColor("#FEF2F2")
    badge_bdr = AT1C_GREEN if passed else AT1C_RED
    badge_txt = "VERIFIED — Cryptographically Proven" if passed else "INVALID — " + data.get("reason", "Verification failed")
    badge_sty = st["pass"] if passed else st["fail"]

    badge_rows = [[Paragraph(("✓  " if passed else "✗  ") + badge_txt, badge_sty)]]
    if data.get("reason") and not passed:
        badge_rows.append([Paragraph(data["reason"], st["value"])])

    badge = Table(badge_rows, colWidths=[180*mm])
    badge.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), badge_bg),
        ("BOX",          (0,0), (-1,-1), 1.5, badge_bdr),
        ("LEFTPADDING",  (0,0), (-1,-1), 6*mm),
        ("TOPPADDING",   (0,0), (-1,-1), 4*mm),
        ("BOTTOMPADDING",(0,0), (-1,-1), 4*mm),
    ]))
    story.append(badge)
    story.append(Spacer(1, 5*mm))

    # ── Legal footer ──────────────────────────────────────────────────────────
    story.append(divider())
    story.append(Paragraph(
        "This document is an automated compliance artifact generated by the AT1C Protocol. "
        "It records the AI system action and cryptographic proof of human approval. "
        "Retain for audit purposes under the EU AI Act (Regulation 2024/1689).",
        st["legal"]))

    doc.build(story, onFirstPage=page_tmpl, onLaterPages=page_tmpl)
    print(f"PDF written to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 generate-compliance-pdf.py <output_path> <json_data>")
        sys.exit(1)
    generate(sys.argv[1], json.loads(sys.argv[2]))
