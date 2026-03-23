import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { ReportData } from "./reportData";

// ─── Register fonts ───────────────────────────────────────────────────────────
// Using built-in Helvetica — no network fetch needed at render time.
// Swap to custom fonts by registering a public URL with Font.register().

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:        "#09090F",
  surface:   "#10121A",
  border:    "#1E2030",
  accent:    "#7FBDAF",
  accentDim: "#3D6E67",
  text:      "#F0EEE8",
  muted:     "#6B7280",
  dimmed:    "#374151",
  gold:      "#C4965A",
  pink:      "#C47FA0",
  purple:    "#7B6FA8",
  low:       "#C85C30",
  optimal:   "#2E8A5E",
  moderate:  "#4A6A8A",
  elevated:  "#B87830",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    fontFamily: "Helvetica",
    paddingBottom: 48,
  },

  // Cover
  cover: { padding: 48, minHeight: "100%", justifyContent: "space-between" },
  coverTop: { marginBottom: 40 },
  coverBadge: {
    borderWidth: 1, borderColor: C.accentDim, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 4, alignSelf: "flex-start",
    marginBottom: 48,
  },
  coverBadgeText: { color: C.accent, fontSize: 8, letterSpacing: 2, textTransform: "uppercase" },
  coverTitle: { color: C.text, fontSize: 38, fontFamily: "Helvetica-Bold", lineHeight: 1.15, marginBottom: 12 },
  coverItalic: { color: C.accent },
  coverSub: { color: C.muted, fontSize: 12, lineHeight: 1.7, maxWidth: 380 },
  coverDivider: { height: 1, backgroundColor: C.border, marginVertical: 36 },
  coverMeta: { flexDirection: "row", gap: 32 },
  coverMetaItem: {},
  coverMetaLabel: { color: C.muted, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  coverMetaValue: { color: C.text, fontSize: 14, fontFamily: "Helvetica-Bold" },
  coverFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  coverFooterLeft: {},
  coverFooterLogo: { color: C.text, fontSize: 16, fontFamily: "Helvetica-Bold" },
  coverFooterLogoDot: { color: C.accent },
  coverFooterDate: { color: C.muted, fontSize: 9, marginTop: 4 },
  coverScore: { alignItems: "center" },
  coverScoreNum: { color: C.accent, fontSize: 42, fontFamily: "Helvetica-Bold", lineHeight: 1 },
  coverScoreLabel: { color: C.muted, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 },

  // Section pages
  pageInner: { paddingHorizontal: 40, paddingTop: 36 },
  sectionHeader: {
    flexDirection: "row", alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingBottom: 12, marginBottom: 20,
  },
  sectionIcon: { color: C.accent, fontSize: 18, marginRight: 10 },
  sectionTitle: { color: C.text, fontSize: 18, fontFamily: "Helvetica-Bold" },
  sectionSub: { color: C.muted, fontSize: 9, marginTop: 2, letterSpacing: 0.5 },
  pageNum: { color: C.dimmed, fontSize: 8, marginLeft: "auto" },

  // Cards
  card: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, padding: 16, marginBottom: 10,
  },
  cardRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  cardIconBox: {
    width: 32, height: 32, borderRadius: 6,
    backgroundColor: "#1A1C26",
    alignItems: "center", justifyContent: "center",
  },
  cardIconText: { fontSize: 14 },
  cardBody: { flex: 1 },
  cardTitle: { color: C.text, fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  cardDesc: { color: C.muted, fontSize: 10, lineHeight: 1.6 },
  cardMeta: { color: C.accentDim, fontSize: 9, marginTop: 4, letterSpacing: 0.5 },

  // Biomarker grid
  bioGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  bioCard: {
    width: "47%", backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
  },
  bioName: { color: C.muted, fontSize: 9, marginBottom: 6 },
  bioVal: { color: C.text, fontSize: 18, fontFamily: "Helvetica-Bold" },
  bioUnit: { color: C.muted, fontSize: 9 },
  bioOpt: { color: C.dimmed, fontSize: 8, marginTop: 3 },
  bioStatus: { borderRadius: 100, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start", marginTop: 4 },
  bioStatusText: { fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 0.5, textTransform: "uppercase" },

  // Supplement
  suppCat: {
    borderLeftWidth: 3, borderLeftColor: C.accent,
    paddingLeft: 12, marginBottom: 8,
  },
  suppCatTitle: { color: C.accent, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  suppRow: { flexDirection: "row", marginBottom: 10, gap: 10 },
  suppPill: {
    backgroundColor: "#1A2822", borderWidth: 1, borderColor: C.accentDim,
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start",
  },
  suppPillText: { color: C.accent, fontSize: 8 },
  suppName: { color: C.text, fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  suppDose: { color: C.accent, fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  suppBenefit: { color: C.muted, fontSize: 9, lineHeight: 1.55 },
  suppTiming: { color: C.dimmed, fontSize: 8, marginTop: 2 },

  // Priority
  prioCard: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, padding: 16, marginBottom: 10, flexDirection: "row", gap: 14,
  },
  prioNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.accentDim,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  prioNumText: { color: C.text, fontSize: 11, fontFamily: "Helvetica-Bold" },
  prioTitle: { color: C.text, fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  prioDesc: { color: C.muted, fontSize: 10, lineHeight: 1.6 },

  // Moon
  moonCard: {
    backgroundColor: "#0D0F1A", borderWidth: 1, borderColor: "#1A1C30",
    borderRadius: 10, padding: 20, marginBottom: 10,
  },
  moonEmoji: { fontSize: 32, marginBottom: 10 },
  moonTitle: { color: C.text, fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  moonBody: { color: C.muted, fontSize: 10, lineHeight: 1.75 },
  moonTip: {
    backgroundColor: "#0D1F1B", borderWidth: 1, borderColor: C.accentDim,
    borderRadius: 6, padding: 12, marginTop: 12,
  },
  moonTipText: { color: C.accent, fontSize: 10, lineHeight: 1.65 },

  // Footer
  footer: {
    position: "absolute", bottom: 18, left: 40, right: 40,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10,
  },
  footerLeft: { color: C.dimmed, fontSize: 8 },
  footerRight: { color: C.dimmed, fontSize: 8 },

  // Profile summary
  profileGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  profileItem: {
    width: "47%", backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 10,
  },
  profileLabel: { color: C.muted, fontSize: 8, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
  profileValue: { color: C.text, fontSize: 11, fontFamily: "Helvetica-Bold" },

  // CTA
  ctaBox: {
    backgroundColor: "#0D1F1B", borderWidth: 1, borderColor: C.accentDim,
    borderRadius: 10, padding: 24, marginTop: 20, alignItems: "center",
  },
  ctaTitle: { color: C.text, fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 8, textAlign: "center" },
  ctaBody: { color: C.muted, fontSize: 10, lineHeight: 1.7, textAlign: "center", maxWidth: 360 },
  ctaUrl: { color: C.accent, fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 12 },
});

// ─── Helper components ────────────────────────────────────────────────────────
function Footer({ name, pageLabel }: { name: string; pageLabel: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerLeft}>bio.protocol · {name}&apos;s Personal Report · Confidential</Text>
      <Text style={s.footerRight}>{pageLabel}</Text>
    </View>
  );
}

function SectionHeader({ icon, title, sub, page }: { icon: string; title: string; sub: string; page: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionIcon}>{icon}</Text>
      <View>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.sectionSub}>{sub}</Text>
      </View>
      <Text style={s.pageNum}>{page}</Text>
    </View>
  );
}

const STATUS_COLOR: Record<string, string> = {
  low:      C.low,
  elevated: C.elevated,
  optimal:  C.optimal,
  moderate: C.moderate,
};

// ─── Main document ────────────────────────────────────────────────────────────
function BioReport({ data }: { data: ReportData }) {
  const { score, name } = data;

  return (
    <Document
      title={`bio.protocol Report — ${name}`}
      author="bio.protocol"
      subject="Personalized Anti-Aging Protocol"
    >
      {/* ── PAGE 1: COVER ─────────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.coverTop}>
            <View style={s.coverBadge}>
              <Text style={s.coverBadgeText}>✦ Precision Anti-Aging Protocol</Text>
            </View>
            <Text style={s.coverTitle}>
              Your personal{"\n"}
              <Text style={s.coverItalic}>bio.protocol</Text>
            </Text>
            <Text style={s.coverSub}>
              This report is generated exclusively from your 50-question biological assessment.
              Every recommendation is calibrated to your unique bio type, hormonal stage,
              lifestyle patterns, and longevity goals.
            </Text>
            <View style={s.coverDivider} />
            <View style={s.coverMeta}>
              {[
                ["Bio Type", score.type],
                ["Code",     score.typeCode],
                ["Hormone",  data.hormoneStatus.split(" ").slice(0, 2).join(" ")],
                ["Age Range",data.ageRange],
              ].map(([label, value]) => (
                <View key={label} style={s.coverMetaItem}>
                  <Text style={s.coverMetaLabel}>{label}</Text>
                  <Text style={s.coverMetaValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.coverFooter}>
            <View style={s.coverFooterLeft}>
              <Text style={s.coverFooterLogo}>
                bio<Text style={s.coverFooterLogoDot}>.</Text>protocol
              </Text>
              <Text style={s.coverFooterDate}>Generated {data.generatedAt}</Text>
              <Text style={[s.coverFooterDate, { marginTop: 2 }]}>{data.email}</Text>
            </View>
            <View style={s.coverScore}>
              <Text style={s.coverScoreNum}>{score.score}</Text>
              <Text style={s.coverScoreLabel}>Wellness Score</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ── PAGE 2: BIO TYPE + PRIORITIES ────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          <SectionHeader icon="⬡" title="Your Bio Human Type" sub="Biological archetype & priority interventions" page="01" />

          <View style={[s.card, { marginBottom: 20 }]}>
            <Text style={[s.cardTitle, { fontSize: 15, marginBottom: 6 }]}>{score.type}</Text>
            <Text style={s.cardDesc}>{score.typeDesc}</Text>
            <View style={[s.cardRow, { marginTop: 12 }]}>
              {[
                { label: "Wellness Score", val: `${score.score}/100` },
                { label: "Primary Goal", val: data.primaryGoal.split(" ").slice(0, 3).join(" ") },
                { label: "Diet Pattern", val: data.dietPattern.split(",")[0] },
                { label: "Exercise",     val: data.exerciseDays },
              ].map(({ label, val }) => (
                <View key={label} style={{ flex: 1 }}>
                  <Text style={s.coverMetaLabel}>{label}</Text>
                  <Text style={[s.coverMetaValue, { fontSize: 10 }]}>{val}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={[s.suppCatTitle, { marginBottom: 12 }]}>Top 3 Priority Interventions</Text>
          {score.priorities.map((p, i) => (
            <View key={i} style={s.prioCard}>
              <View style={s.prioNum}>
                <Text style={s.prioNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.prioTitle}>{p.title}</Text>
                <Text style={s.prioDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <Footer name={name} pageLabel="Bio Type · 01" />
      </Page>

      {/* ── PAGE 3: BIOMARKERS + PROFILE ─────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          <SectionHeader icon="◈" title="Biomarker Reference Panel" sub="Key markers for your anti-aging protocol" page="02" />

          <Text style={[s.cardDesc, { marginBottom: 14 }]}>
            The following markers are your primary tracking targets. Values shown are research-informed
            optimal ranges for your age bracket and hormonal stage. Enter your lab results in the
            bio.protocol platform to track trends over time.
          </Text>

          <View style={s.bioGrid}>
            {[
              { name: "Cortisol AM",       unit: "μg/dL",  opt: "10–15",    note: "Adrenal axis & stress response" },
              { name: "Estradiol (E2)",     unit: "pg/mL",  opt: "50–150",   note: "Hormonal vitality & bone density" },
              { name: "Vitamin D3",         unit: "ng/mL",  opt: "40–60",    note: "Immune, mood & longevity marker" },
              { name: "Free Testosterone",  unit: "ng/dL",  opt: "20–70",    note: "Energy, libido & lean mass" },
              { name: "NAD+ Cellular",      unit: "%",      opt: "> 70%",    note: "Sirtuin activity & DNA repair" },
              { name: "hs-CRP",             unit: "mg/L",   opt: "< 1.0",    note: "Systemic inflammation marker" },
              { name: "HRV (Resting)",      unit: "ms",     opt: "50–100",   note: "Nervous system resilience" },
              { name: "Fasting Insulin",    unit: "μIU/mL", opt: "< 8",      note: "Metabolic & longevity predictor" },
            ].map((m) => (
              <View key={m.name} style={s.bioCard}>
                <Text style={s.bioName}>{m.name}</Text>
                <Text style={s.bioVal}>— <Text style={s.bioUnit}>{m.unit}</Text></Text>
                <Text style={s.bioOpt}>Target: {m.opt}</Text>
                <Text style={[s.bioOpt, { marginTop: 4, color: C.dimmed }]}>{m.note}</Text>
              </View>
            ))}
          </View>

          <View style={[s.card, { marginTop: 4 }]}>
            <Text style={[s.cardTitle, { marginBottom: 4 }]}>How to get your labs</Text>
            <Text style={s.cardDesc}>
              Request a full longevity panel from your doctor, or use at-home services like
              Everlywell, InsideTracker, or Function Health. Once you have results, log them
              in bio.protocol to unlock personalized trend analysis and protocol adjustments.
            </Text>
          </View>
        </View>
        <Footer name={name} pageLabel="Biomarkers · 02" />
      </Page>

      {/* ── PAGE 4: MORNING PROTOCOL ──────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          <SectionHeader icon="≡" title="Morning Ritual Protocol" sub="Daily anti-aging foundation — calibrated for your bio type" page="03" />

          {data.morningProtocol.map((item, i) => (
            <View key={i} style={s.card}>
              <View style={s.cardRow}>
                <View style={s.cardIconBox}>
                  <Text style={s.cardIconText}>{["💧","☀️","🌬️","❄️","🍫"][i] ?? "•"}</Text>
                </View>
                <View style={s.cardBody}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={s.cardTitle}>{item.action}</Text>
                    <Text style={[s.cardMeta, { marginTop: 0 }]}>{item.time}</Text>
                  </View>
                  <Text style={s.cardDesc}>{item.desc}</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={[s.card, { backgroundColor: "#0D1F1B", borderColor: C.accentDim }]}>
            <Text style={[s.cardTitle, { color: C.accent, marginBottom: 4 }]}>
              Why this sequence matters
            </Text>
            <Text style={[s.cardDesc, { color: "#9BBCB6" }]}>
              The order of your morning ritual is not arbitrary — it is designed around your
              cortisol awakening response (CAR). Hydration before caffeine, light before screens,
              cold before food. Each step primes the next. Executed consistently, this sequence
              recalibrates your circadian clock and reduces biological age markers within 90 days.
            </Text>
          </View>
        </View>
        <Footer name={name} pageLabel="Protocol · 03" />
      </Page>

      {/* ── PAGE 5: SUPPLEMENTS ───────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          <SectionHeader icon="◐" title="Priority Supplement Stack" sub="Compounds selected for your bio type & hormonal stage" page="04" />

          <Text style={[s.cardDesc, { marginBottom: 16 }]}>
            These are your highest-priority compounds based on your {score.type} profile
            {data.score.isMenopause ? " and perimenopause/menopause stage" : ""}. Start with
            priority items first. Introduce one new supplement per week to track individual responses.
          </Text>

          {data.topSupplements.map((supp, i) => (
            <View key={i} style={[s.card, { marginBottom: 8 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <View style={s.suppPill}>
                  <Text style={s.suppPillText}>★ Priority {i + 1}</Text>
                </View>
                <Text style={[s.cardMeta, { marginTop: 0 }]}>{supp.timing}</Text>
              </View>
              <Text style={s.suppName}>{supp.name}</Text>
              <Text style={s.suppDose}>{supp.dose}</Text>
              <Text style={s.suppBenefit}>{supp.benefit}</Text>
            </View>
          ))}
        </View>
        <Footer name={name} pageLabel="Supplements · 04" />
      </Page>

      {/* ── PAGE 6: MOON + CTA ────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          <SectionHeader icon="◎" title="Moon Cycle Sync" sub="Aligning your protocol with lunar rhythms" page="05" />

          <View style={s.moonCard}>
            <Text style={s.moonEmoji}>🌑 · 🌒 · 🌓 · 🌔 · 🌕 · 🌖 · 🌗 · 🌘</Text>
            <Text style={s.moonTitle}>The Lunar Protocol Principle</Text>
            <Text style={s.moonBody}>
              Emerging research in chronobiology shows that the 29.5-day lunar cycle correlates
              with measurable hormonal fluctuations — particularly in cortisol secretion, melatonin
              patterns, and fluid retention. For those with heightened lunar sensitivity (a defining
              trait of the {score.type} bio type), synchronizing key interventions with the moon
              can amplify results by 20–40%.
            </Text>
            <View style={s.moonTip}>
              <Text style={s.moonTipText}>
                {data.moonPhaseNote}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            {[
              { phase: "🌑 New Moon", tip: "Begin fasting protocols, detox, and new supplement cycles. Cellular autophagy is enhanced." },
              { phase: "🌕 Full Moon", tip: "Peak physical vitality. Ideal for intense training, lymphatic drainage, and breathwork." },
              { phase: "🌓 First Quarter", tip: "Building phase — increase training intensity, prioritize protein synthesis." },
              { phase: "🌗 Last Quarter", tip: "Release phase — reduce stimulants, prioritize restorative practices and sleep." },
            ].map((m) => (
              <View key={m.phase} style={[s.card, { flexDirection: "row", gap: 12, paddingVertical: 10 }]}>
                <Text style={{ fontSize: 18, width: 28 }}>{m.phase.split(" ")[0]}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.cardTitle, { fontSize: 10 }]}>{m.phase.split(" ").slice(1).join(" ")}</Text>
                  <Text style={s.cardDesc}>{m.tip}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={s.ctaBox}>
            <Text style={s.ctaTitle}>Unlock your complete platform</Text>
            <Text style={s.ctaBody}>
              This report is your free preview. The full bio.protocol platform connects every
              element — your live biomarker dashboard, habit tracker with moon calendar overlay,
              menopause stage tracker, and personalized supplement scheduler — all synced to your
              biology in real time.
            </Text>
            <Text style={s.ctaUrl}>app.bio.protocol</Text>
          </View>
        </View>
        <Footer name={name} pageLabel="Moon Cycle · 05" />
      </Page>
    </Document>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export async function generateReportPdf(data: ReportData): Promise<Buffer> {
  const buffer = await renderToBuffer(<BioReport data={data} />);
  return Buffer.from(buffer);
}
