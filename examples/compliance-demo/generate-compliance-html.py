#!/usr/bin/env python3
"""

NPM_TOKEN = "REMOVED_SEE_ENV_VAR"

AT1C Compliance Report HTML Generator
Called by index.ts via: python3 generate-compliance-html.py <output_path> <json_data>
Produces a self-contained .html file — no external dependencies, opens in any browser.
"""

import sys
import json
from datetime import datetime, timezone

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AT1C Compliance Receipt — {doc_id}</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #F4F7FF;
    color: #0F1923;
    padding: 32px 16px;
  }}
  .page {{
    max-width: 780px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #DDE3EF;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(15,25,35,0.08);
  }}
  .topbar {{
    background: #0F1923;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}
  .topbar-left {{ display: flex; align-items: baseline; gap: 10px; }}
  .topbar-logo {{ color: #fff; font-size: 17px; font-weight: 700; }}
  .topbar-sub {{ color: #8DA4C8; font-size: 12px; }}
  .topbar-docid {{ color: #8DA4C8; font-size: 11px; }}
  .hero {{
    background: #F4F7FF;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #DDE3EF;
  }}
  .hero h1 {{ font-size: 20px; font-weight: 700; color: #0F1923; }}
  .info-strip {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid #DDE3EF;
  }}
  .info-cell {{
    padding: 12px 16px;
    border-right: 1px solid #DDE3EF;
  }}
  .info-cell:last-child {{ border-right: none; }}
  .info-label {{ font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 3px; }}
  .info-value {{ font-size: 12px; color: #0F1923; word-break: break-all; }}
  .body {{ padding: 24px; }}
  .section-title {{
    font-size: 11px;
    font-weight: 700;
    color: #1A6BFF;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
    margin-top: 20px;
  }}
  .section-title:first-child {{ margin-top: 0; }}
  hr.divider {{
    border: none;
    border-top: 1px solid #DDE3EF;
    margin-bottom: 12px;
  }}
  .fields {{ width: 100%; border-collapse: collapse; margin-bottom: 8px; }}
  .fields td {{ vertical-align: top; padding: 3px 0; }}
  .fields td.flabel {{
    width: 140px;
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    padding-right: 12px;
    white-space: nowrap;
  }}
  .fields td.fvalue {{ font-size: 13px; color: #0F1923; }}
  .mono {{
    font-family: "Courier New", Courier, monospace;
    font-size: 11px;
    background: #F4F7FF;
    padding: 8px 10px;
    border-radius: 4px;
    word-break: break-all;
    line-height: 1.6;
    color: #0F1923;
    margin-bottom: 8px;
  }}
  .badge {{
    border-radius: 6px;
    padding: 14px 18px;
    margin: 4px 0 12px;
    font-size: 14px;
    font-weight: 700;
  }}
  .badge.pass {{ background: #EDFAF3; border: 2px solid #00B96B; color: #00B96B; }}
  .badge.fail {{ background: #FEF2F2; border: 2px solid #E53E3E; color: #E53E3E; }}
  .legal {{
    font-size: 11px;
    color: #64748B;
    font-style: italic;
    line-height: 1.6;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #DDE3EF;
  }}
  .footbar {{
    background: #DDE3EF;
    padding: 8px 24px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #64748B;
  }}
  @media (max-width: 600px) {{
    .info-strip {{ grid-template-columns: 1fr 1fr; }}
    .info-cell:nth-child(2) {{ border-right: none; }}
    .topbar {{ flex-direction: column; align-items: flex-start; gap: 4px; }}
  }}
  @media print {{
    body {{ background: #fff; padding: 0; }}
    .page {{ box-shadow: none; border: none; }}
  }}
</style>
</head>
<body>
<div class="page">
  <div class="topbar">
    <div class="topbar-left">
      <span class="topbar-logo">AT1C</span>
      <span class="topbar-sub">AI Transparency &amp; Compliance Certificate</span>
    </div>
    <span class="topbar-docid">DOC ID: {doc_id}</span>
  </div>
  <div class="hero">
    <h1>AI Transparency &amp; Compliance Certificate</h1>
  </div>
  <div class="info-strip">
    <div class="info-cell">
      <div class="info-label">Receipt ID</div>
      <div class="info-value">{doc_id}</div>
    </div>
    <div class="info-cell">
      <div class="info-label">Generated</div>
      <div class="info-value">{gen_at}</div>
    </div>
    <div class="info-cell">
      <div class="info-label">Protocol</div>
      <div class="info-value">AT1C v0.1</div>
    </div>
    <div class="info-cell">
      <div class="info-label">Regulation</div>
      <div class="info-value">EU AI Act (Art. 13)</div>
    </div>
  </div>
  <div class="body">
    <div class="section-title">1. Compliance Receipt</div>
    <hr class="divider">
    {receipt_fields}
    {signature_block}
    <div class="section-title">2. Cryptographic Verification</div>
    <hr class="divider">
    {badge_block}
    <div class="legal">
      This document is an automated compliance artifact generated by the AT1C Protocol.
      It records the AI system action and cryptographic proof of human approval.
      Retain for audit purposes under the EU AI Act (Regulation 2024/1689).
    </div>
  </div>
  <div class="footbar">
    <span>Generated: {gen_at} &nbsp;|&nbsp; AT1C Protocol v0.1 &nbsp;|&nbsp; EU AI Act Enforcement Target: August 2026</span>
    <span>Page 1</span>
  </div>
</div>
</body>
</html>"""


def field_rows(data):
    fields = [
        ("Receipt ID",  "receiptId"),
        ("Nonce",       "nonce"),
        ("User",        "userId"),
        ("Agent",       "agentId"),
        ("Action",      "action"),
        ("Status",      "status"),
        ("Approved at", "timestamp"),
        ("Expires at",  "expiresAt"),
    ]
    rows = ""
    for label, key in fields:
        val = data.get(key)
        if val:
            rows += f'<tr><td class="flabel">{label}</td><td class="fvalue">{val}</td></tr>\n'
    return f'<table class="fields">{rows}</table>' if rows else ""


def signature_block(data):
    sig = data.get("signature")
    if not sig:
        return ""
    return (
        '<p style="font-size:11px;font-weight:700;color:#64748B;margin-bottom:4px;">Signature</p>'
        f'<div class="mono">{sig}</div>'
    )


def badge_block(data):
    passed = data.get("valid", True)
    if passed:
        return '<div class="badge pass">&#10003;&nbsp; VERIFIED — Cryptographically Proven</div>'
    reason = data.get("reason", "Verification failed")
    return f'<div class="badge fail">&#10007;&nbsp; INVALID — {reason}</div>'


def generate(output_path, data):
    now    = datetime.now(timezone.utc)
    gen_at = now.strftime("%Y-%m-%d %H:%M:%S UTC")
    doc_id = data.get("receiptId", "AT1C-" + now.strftime("%Y%m%d-%H%M%S"))

    html = HTML_TEMPLATE.format(
        doc_id          = doc_id,
        gen_at          = gen_at,
        receipt_fields  = field_rows(data),
        signature_block = signature_block(data),
        badge_block     = badge_block(data),
    )

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"HTML receipt written to: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 generate-compliance-html.py <output_path> <json_data>")
        sys.exit(1)
    generate(sys.argv[1], json.loads(sys.argv[2]))
    
    
    
     Hey alwayshuman!

We're reaching out to let you know that, as announced last year, we have officially begun requiring users who contribute code on GitHub.com to have two-factor authentication (2FA) enabled.

Your account meets this criteria, and you will need to enroll in 2FA within 45 days, by July 30th, 2026 at 00:00 (UTC). After this date, your access to GitHub.com will be limited until you enroll in 2FA. Enrolling is easy, and we support several options, starting with TOTP apps and text messages (SMS) and then adding on passkeys and the GitHub Mobile app.

Click here to enroll in 2FA.

Making the software supply chain more secure is a team effort, and we can't do it without you. Your enrollment in 2FA is an impactful step in keeping the world's software secure. If you want to learn more about this change, please take a look at our documentation about the program.

To see this and other security events for your account, visit your account security audit log.

If you run into problems, please contact support by visiting the GitHub support page.

Thanks,
The GitHub Team 


 302a300506032b6570032100ffee0a3f54eb32e5dec9120c23b449371aa5e74175c8bb00763ce9583cd23cd7 
 
 
 
 “/home/titanic1/registry.at1c.com”.
 
 New Document Root Update the directory where you want the files for this domain to exist.
/
Remove the Domain

Warning: If you remove the “registry.at1c.com” domain, it will permanently delete the domain from your account. You cannot undo this action. This will not remove “registry.at1c.com”’s document root (/home/titanic1/registry.at1c.com).
Domain Information

    Domain: registry.at1c.com
    Redirects To: Not Redirected
    Document Root: /registry.at1c.com

node -e "
const fs = require('fs');
const keys = JSON.parse(fs.readFileSync('/home/mora/at1c-protocol-official/.at1c_registry_key.json'));
console.log('PUBLIC:', keys.publicKey);
console.log('PRIVATE:', keys.privateKey);
"
PUBLIC: -----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAu237TnDouxCDfx3Rrqkoc+nY40n+1ca6YZfWE1GDZ/M=
-----END PUBLIC KEY-----

PRIVATE: -----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICuk/cpjtQLf0CAqSD1wieMMB9XcRukkwHIgx3NTNdrk
-----END PRIVATE KEY-----

3. Tier caller-supplied with no validation — STILL OPEN, still CLI-only risk.

register-agent.js still accepts --tier from whoever runs the command locally. Since registration is CLI-only and only you run it locally, this is low risk right now. But it's the one item that needs attention before you ever open registration to other users. Flag it in the README Known Limitations section so it doesn't get forgotten.
Short version: two of three resolved by what we built. One still open but not urgent.
Want to add the tier validation note to the README now while it's fresh, or move on to the next build step?
