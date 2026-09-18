#!/usr/bin/env python3
"""
Generate Tobias_Strauss_Resume.pdf from a single source of truth.

The PDF is the download behind "Download CV" on tostrauss.github.io, so it has
to agree with the site and with LinkedIn. Edit the data blocks below and run:

    python3 tools/generate_cv.py

Requires: reportlab  (pip install reportlab)
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

OUT = Path(__file__).resolve().parent.parent / "Tobias_Strauss_Resume.pdf"

INK = colors.HexColor("#1a1a1a")
MUTED = colors.HexColor("#4a4a4a")
ACCENT = colors.HexColor("#a87400")
RULE = colors.HexColor("#c9c9c9")

NAME = "Tobias Strauss"
HEADLINE = "Software Engineer &amp; Co-Founder — Vienna, Austria"
CONTACT = (
    '<a href="mailto:tobias.p.strauss@gmail.com">tobias.p.strauss@gmail.com</a> · '
    '<a href="https://tostrauss.github.io">tostrauss.github.io</a> · '
    '<a href="https://github.com/tostrauss">github.com/tostrauss</a> · '
    '<a href="https://www.linkedin.com/in/tobias-strauss-7425012b6/">linkedin.com/in/tobias-strauss</a>'
)

PROFILE = (
    "Software engineer who takes products from zero to production. Co-founder and lead engineer of "
    "<b>JAMIE</b> — a social app live on the App Store and Google Play across six European markets with "
    "1,200+ registered users — and <b>Gastropoly</b>, a multi-tenant restaurant operations platform in "
    "daily production use since July 2026. Currently completing an MSc in Artificial Intelligence at JKU "
    "Linz with a focus on deep learning and explainable AI. Equally at home in the parts that decide "
    "whether a product survives real users: moderation, rate limiting, GDPR flows, tested backups."
)

EXPERIENCE = [
    (
        "Co-Founder &amp; Lead Software Engineer",
        "Gastropoly — Vienna",
        "Jun 2026 – present",
        [
            "Architected and shipped a multi-tenant SaaS on Next.js 16, React 19, TypeScript, Supabase and "
            "Vercel: 158 pages, 63 API routes, 155 database migrations, ~1,800 commits.",
            "Built six modules from scratch: shift planning with an offline PIN time-clock kiosk, inventory "
            "and supplier ordering, HACCP compliance logging, an accountant cockpit with DATEV export, "
            "reporting, and an AI assistant with a voice mode.",
            "Integrated ready2order POS, Open-Meteo and AXESS turnstile data into a weather-based demand "
            "model that drives both purchase suggestions and shift planning.",
            "Enforced tenant isolation in the database through Postgres Row Level Security rather than in "
            "the application layer; offline-first PWA with a sync queue for unreliable venue Wi-Fi.",
            "Set the engineering process for a three-person team — one slice per branch, mandatory PR "
            "review, coordinated migration numbering; 370+ automated test files gate every merge.",
        ],
    ),
    (
        "Co-Founder &amp; Lead Developer",
        "JAMIE.groups — Vienna",
        "Mar 2026 – present",
        [
            "Took the product from zero to both app stores: a React/Vite PWA shipped as a Trusted Web "
            "Activity on Android and via Capacitor on iOS, so one deploy updates web and Android at once.",
            "Built the real-time layer — Socket.IO chat with voice messages, photos, replies, read receipts "
            "and reactions — plus a push pipeline on Web Push and APNs.",
            "Node.js/Express and PostgreSQL on Railway with moderation and reporting, rate limiting, GDPR "
            "data export and deletion, and encrypted off-site backups with a rehearsed restore.",
            "1,200+ registered users across AT, DE, CH, IT, FR and ES, localised in five languages.",
        ],
    ),
    (
        "Freelance Web Developer",
        "Therapiezentrum Blumau &amp; others — Austria",
        "2025 – present",
        [
            "Responsive, accessible and SEO-optimised websites with online booking for Austrian healthcare "
            "practices and small businesses.",
        ],
    ),
    (
        "Co-Founder &amp; Lead Developer",
        "CollegeRecruit — Waterbury, CT",
        "Feb 2024 – May 2025",
        [
            "Built and launched a standalone Angular/TypeScript application connecting international "
            "student-athletes with US college programs — profiles, college matching, document management "
            "and real-time messaging — shipped to the App Store and Google Play.",
        ],
    ),
    (
        "Software Developer",
        "TigerEyeTechnology",
        "Mar 2024 – May 2025",
        ["Application development alongside my degree."],
    ),
    (
        "Data Analytics Intern",
        "eEvolution GmbH — Linz",
        "Jun – Aug 2023",
        [
            "Built Power BI dashboards on business KPIs for executive decision-making, cleaned and modelled "
            "data in Python, and presented findings to stakeholders.",
        ],
    ),
]

EDUCATION = [
    (
        "MSc Artificial Intelligence",
        "Johannes Kepler University (JKU) Linz",
        "Oct 2025 – present",
        "Focus on deep learning, with coursework in explainable AI: saliency maps, LIME and SHAP.",
    ),
    (
        "BS Computer Information Systems, summa cum laude",
        "Post University — Waterbury, CT, USA",
        "Graduated May 2025",
        "Concentration in Software Development, minor in Data Analytics. GPA 3.7/4.0, Honors Program. "
        "International student-athlete: vice-captain of the NCAA Division II men's tennis team.",
    ),
    (
        "High school diploma with honors",
        "Khevenhüller Gymnasium Linz",
        "2021",
        "Science and mathematics focus. Cambridge Certificate B2 First.",
    ),
]

SKILLS = [
    ("Languages", "TypeScript, JavaScript, Python, SQL, Swift, HTML/CSS"),
    ("Frontend", "React 18/19, Next.js 16, Vite, Angular/Ionic, Tailwind CSS, PWA &amp; service workers"),
    ("Backend", "Node.js/Express, PostgreSQL, Supabase (Row Level Security), Socket.IO, Flask, SQLAlchemy, REST/JWT"),
    ("Mobile", "Capacitor (iOS), Trusted Web Activity (Android), Web Push, APNs, App Store &amp; Play releases"),
    ("AI &amp; data", "PyTorch, TensorFlow, pandas/NumPy, LIME · SHAP · saliency maps, LLM integration, Power BI"),
    ("Platform", "Vercel, Railway, Stripe, CI/CD, automated testing, Git/PR review, GDPR flows, encrypted backups"),
]

LANGUAGES = "German (native) · English (fluent) · Austrian Sign Language (native)"


def styles():
    return {
        "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=21, leading=24,
                               textColor=INK, spaceAfter=2),
        "headline": ParagraphStyle("headline", fontName="Helvetica", fontSize=10.5, leading=13,
                                   textColor=ACCENT, spaceAfter=3),
        "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.6, leading=11,
                                  textColor=MUTED, spaceAfter=10),
        "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9, leading=11,
                                  textColor=ACCENT, spaceBefore=11, spaceAfter=3),
        "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10, leading=12.5,
                               textColor=INK, spaceBefore=6),
        "meta": ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=8.8, leading=11,
                               textColor=MUTED, spaceAfter=3),
        "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.1, leading=11.6,
                                 textColor=INK),
        "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.3, leading=12.4,
                               textColor=INK, alignment=TA_JUSTIFY),
        "small": ParagraphStyle("small", fontName="Helvetica", fontSize=9.1, leading=11.8,
                                textColor=INK),
    }


def rule():
    return HRFlowable(width="100%", thickness=0.6, color=RULE,
                      spaceBefore=1, spaceAfter=5, lineCap="round")


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT), pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm,
        topMargin=15 * mm, bottomMargin=13 * mm,
        title="Tobias Strauss — CV", author="Tobias Strauss",
        subject="Curriculum Vitae",
    )

    flow = [
        Paragraph(NAME, s["name"]),
        Paragraph(HEADLINE, s["headline"]),
        Paragraph(CONTACT, s["contact"]),
        Paragraph("PROFILE", s["section"]), rule(),
        Paragraph(PROFILE, s["body"]),
        Paragraph("EXPERIENCE", s["section"]), rule(),
    ]

    for role, org, dates, bullets in EXPERIENCE:
        flow.append(Paragraph(role, s["role"]))
        flow.append(Paragraph(f"{org}  |  {dates}", s["meta"]))
        flow.append(ListFlowable(
            [ListItem(Paragraph(b, s["bullet"]), leftIndent=10, value="circle") for b in bullets],
            bulletType="bullet", bulletFontSize=5, bulletOffsetY=-1.5,
            leftIndent=10, start="circle",
        ))

    flow.append(Paragraph("EDUCATION", s["section"]))
    flow.append(rule())
    for degree, school, dates, detail in EDUCATION:
        flow.append(Paragraph(degree, s["role"]))
        flow.append(Paragraph(f"{school}  |  {dates}", s["meta"]))
        flow.append(Paragraph(detail, s["small"]))

    flow.append(Paragraph("TECHNICAL SKILLS", s["section"]))
    flow.append(rule())
    for label, items in SKILLS:
        flow.append(Paragraph(f"<b>{label}:</b> {items}", s["small"]))
        flow.append(Spacer(1, 2))

    flow.append(Paragraph("LANGUAGES", s["section"]))
    flow.append(rule())
    flow.append(Paragraph(LANGUAGES, s["small"]))

    doc.build(flow)
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    build()
