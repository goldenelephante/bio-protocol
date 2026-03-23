// ─── QUIZ DATA ────────────────────────────────────────────────────────────────

export interface QuizOption { label: string }
export interface QuizQuestion {
  id: string;
  text: string;
  type: "single" | "multi" | "scale";
  opts?: string[];
  min?: string;
  max?: string;
}
export interface QuizSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  questions: QuizQuestion[];
}

export const SECTIONS: QuizSection[] = [
  {
    id: "foundation", title: "Foundation", subtitle: "Your biological blueprint",
    icon: "⬡", color: "#7FBDAF",
    questions: [
      { id:"q1",  text:"What is your biological sex?",                           type:"single", opts:["Female","Male","Intersex / Other","Prefer not to say"] },
      { id:"q2",  text:"What is your age range?",                                type:"single", opts:["18–24","25–34","35–44","45–54","55–64","65+"] },
      { id:"q3",  text:"What best describes your current hormonal status?",      type:"single", opts:["Regular cycles","Irregular / shifting cycles","Perimenopause","Menopause (12+ months no period)","Post-menopause","Not applicable"] },
      { id:"q4",  text:"What is your general body composition tendency?",        type:"single", opts:["Naturally lean, hard to gain","Medium build, moderate gain/loss","Tends to hold weight easily","Changes frequently with lifestyle"] },
      { id:"q5",  text:"How would you describe your natural energy rhythm?",     type:"single", opts:["Morning person — peak energy early","Night owl — energy builds through day","Consistent across the day","Very variable / unpredictable"] },
      { id:"q6",  text:"Do you have any diagnosed chronic conditions?",          type:"multi",  opts:["Autoimmune condition","Thyroid disorder","PCOS","Metabolic / diabetes","Cardiovascular","None of the above"] },
    ],
  },
  {
    id: "sleep", title: "Sleep & Recovery", subtitle: "Your nightly restoration quality",
    icon: "◐", color: "#7B6FA8",
    questions: [
      { id:"q7",  text:"How many hours do you typically sleep per night?",       type:"single", opts:["Less than 5h","5–6h","6–7h","7–8h","8–9h","9h+"] },
      { id:"q8",  text:"How would you rate your sleep quality overall?",         type:"scale",  min:"Very poor", max:"Excellent" },
      { id:"q9",  text:"Do you experience any of these sleep disruptions?",      type:"multi",  opts:["Difficulty falling asleep","Waking during the night","Early waking (can't return to sleep)","Night sweats / hot flashes","Vivid or disturbing dreams","None — I sleep through"] },
      { id:"q10", text:"How do you typically feel upon waking?",                 type:"single", opts:["Refreshed and alert","Groggy but functional after 30min","Tired despite hours slept","It varies greatly day to day"] },
      { id:"q11", text:"Do you use any sleep aids?",                             type:"multi",  opts:["Magnesium / supplements","Melatonin","Prescription medication","Alcohol","Blue-light blocking glasses","None"] },
      { id:"q12", text:"What is your typical bedtime?",                          type:"single", opts:["Before 9pm","9–10pm","10–11pm","11pm–midnight","After midnight"] },
    ],
  },
  {
    id: "energy", title: "Energy & Vitality", subtitle: "Your cellular power output",
    icon: "⚡", color: "#C4965A",
    questions: [
      { id:"q13", text:"Rate your average daily energy level",                   type:"scale",  min:"Depleted", max:"Vibrant" },
      { id:"q14", text:"How often do you experience afternoon energy crashes?",  type:"single", opts:["Daily","Most days","A few times a week","Rarely","Never"] },
      { id:"q15", text:"What is your relationship with caffeine?",               type:"single", opts:["Need it to function","Enjoy it but can skip it","Sensitive — use sparingly","Avoid it entirely","Don't drink coffee / tea"] },
      { id:"q16", text:"Do you experience brain fog or mental fatigue?",         type:"single", opts:["Constantly","Often (most days)","Sometimes (weekly)","Rarely","Never"] },
      { id:"q17", text:"How does your energy change across your cycle or month?",type:"single", opts:["Significant highs and lows","Mild fluctuations","Fairly consistent","Post-menopausal / no cycle","Not sure"] },
      { id:"q18", text:"After a full night of sleep, how often do you still feel tired?", type:"single", opts:["Almost always","Often","Sometimes","Rarely","Never"] },
    ],
  },
  {
    id: "hormones", title: "Hormonal Landscape", subtitle: "Your endocrine system signals",
    icon: "◎", color: "#C47FA0",
    questions: [
      { id:"q19", text:"How frequently do you experience hot flashes or heat surges?", type:"single", opts:["Multiple times daily","Once a day","A few times a week","Rarely","Never"] },
      { id:"q20", text:"Rate your libido in the last 3 months",                  type:"scale",  min:"Very low", max:"High" },
      { id:"q21", text:"Do you experience mood volatility or emotional dysregulation?", type:"single", opts:["Frequently — major shifts","Sometimes — noticeable","Mildly — occasional","Rarely","Not at all"] },
      { id:"q22", text:"Which of these hormonal symptoms do you experience?",    type:"multi",  opts:["Vaginal dryness","Thinning hair","Skin dryness / loss of elasticity","Weight gain (especially mid-section)","Joint stiffness","Memory lapses","None"] },
      { id:"q23", text:"Have you done any hormonal bloodwork in the last 2 years?", type:"single", opts:["Yes — full panel","Yes — partial","No — but I want to","No — not interested"] },
      { id:"q24", text:"Are you currently using any hormonal support?",          type:"multi",  opts:["Hormone replacement therapy (HRT)","Birth control pill","Phytoestrogens (food or supplements)","Herbal support (vitex, maca, etc.)","None"] },
    ],
  },
  {
    id: "stress", title: "Stress & Nervous System", subtitle: "Your cortisol & resilience profile",
    icon: "〜", color: "#8FAA6B",
    questions: [
      { id:"q25", text:"Rate your average daily stress level",                   type:"scale",  min:"Very calm", max:"Overwhelmed" },
      { id:"q26", text:"How long does it take you to recover from a stressful event?", type:"single", opts:["Days to weeks","About a day","A few hours","An hour or less","I bounce back quickly"] },
      { id:"q27", text:"Do you have an active nervous system regulation practice?", type:"multi", opts:["Breathwork","Meditation / mindfulness","Yoga or somatic movement","Journaling","Cold exposure","None currently"] },
      { id:"q28", text:"How often do you feel anxious or wired but tired?",      type:"single", opts:["Daily","Often","Sometimes","Rarely","Never"] },
      { id:"q29", text:"What is your relationship with digital screens in the evening?", type:"single", opts:["Screens until I sleep","Off 30min before bed","Off 1–2h before bed","Minimal evening screen time"] },
      { id:"q30", text:"How many true rest days (no obligations, low stimulation) do you have per week?", type:"single", opts:["Zero","Half a day","One full day","Two or more days"] },
    ],
  },
  {
    id: "nutrition", title: "Nutrition & Gut", subtitle: "Your metabolic foundation",
    icon: "◈", color: "#5B8FA8",
    questions: [
      { id:"q31", text:"How would you describe your current diet pattern?",      type:"single", opts:["Whole foods, mostly home-cooked","Mixed — some whole foods, some processed","Mostly convenience / processed foods","Restrictive / therapeutic diet","Plant-based / vegan","Mediterranean style"] },
      { id:"q32", text:"Do you practice any form of intermittent fasting?",      type:"single", opts:["Yes — 16:8 or longer","Occasionally / loosely","No but interested","No and not interested"] },
      { id:"q33", text:"How is your digestive health?",                          type:"single", opts:["Very good — no issues","Occasional bloating or discomfort","Frequent digestive issues","Diagnosed condition (IBS, SIBO, etc.)"] },
      { id:"q34", text:"How often do you consume fermented or probiotic-rich foods?", type:"single", opts:["Daily","A few times a week","Occasionally","Rarely / never"] },
      { id:"q35", text:"Which inflammatory foods do you regularly consume?",     type:"multi",  opts:["Refined sugar","Ultra-processed foods","Seed / vegetable oils","Alcohol","Gluten","Dairy","None of the above"] },
      { id:"q36", text:"How much water do you drink daily?",                     type:"single", opts:["Less than 1L","1–1.5L","1.5–2L","2L+","I track precisely"] },
    ],
  },
  {
    id: "movement", title: "Movement & Body", subtitle: "Your physical vitality",
    icon: "▷", color: "#6E8A6E",
    questions: [
      { id:"q37", text:"How many days per week do you exercise?",                type:"single", opts:["0 days","1–2 days","3–4 days","5–6 days","Daily"] },
      { id:"q38", text:"What types of movement do you engage in?",               type:"multi",  opts:["Resistance / weight training","Zone 2 cardio (walking, cycling)","High-intensity (HIIT, sprints)","Yoga / Pilates / somatic","Functional movement","Swimming","Minimal / sedentary"] },
      { id:"q39", text:"Do you experience chronic pain or physical tension?",    type:"multi",  opts:["Lower back","Neck / shoulders","Joints (knees, hips)","Headaches / migraines","Pelvic floor tension","None"] },
      { id:"q40", text:"How many steps do you walk on average per day?",         type:"single", opts:["Under 3,000","3,000–5,000","5,000–8,000","8,000–12,000","12,000+"] },
      { id:"q41", text:"Do you practice any cold or heat therapy?",              type:"multi",  opts:["Cold showers","Ice bath / plunge","Sauna (dry or infrared)","Contrast therapy","None"] },
      { id:"q42", text:"How does your body feel after physical exertion?",       type:"single", opts:["Energized and strong","Normal — recovers in a day","Tired but manageable","Wiped out — takes days","I avoid intense exercise"] },
    ],
  },
  {
    id: "skin", title: "Skin & Aging", subtitle: "Your visible longevity markers",
    icon: "✦", color: "#B8855E",
    questions: [
      { id:"q43", text:"How would you describe your skin's current state?",      type:"single", opts:["Glowing and resilient","Generally good with some concerns","Noticeably dull or dehydrated","Significant changes recently","Sensitive / reactive"] },
      { id:"q44", text:"Which skin concerns are most relevant to you?",          type:"multi",  opts:["Fine lines / wrinkles","Loss of firmness","Hyperpigmentation","Dryness","Acne / breakouts","Redness / inflammation","None"] },
      { id:"q45", text:"Do you wear SPF daily?",                                 type:"single", opts:["Yes — SPF 50 every day","Yes — most days","Occasionally","Rarely / never"] },
      { id:"q46", text:"What is your current skincare commitment level?",        type:"single", opts:["Minimal — water and moisturizer","Basic routine — cleanser, SPF, moisturizer","Intermediate — serums, actives","Advanced — full protocol with actives"] },
      { id:"q47", text:"Do you smoke or vape?",                                  type:"single", opts:["Never","Former smoker","Occasionally","Daily"] },
      { id:"q48", text:"How much unprotected sun exposure do you get daily?",    type:"single", opts:["None","Under 15 min","15–30 min","30–60 min","More than 1 hour"] },
    ],
  },
  {
    id: "mindset", title: "Longevity Mindset", subtitle: "Your inner age & relationship with time",
    icon: "∞", color: "#8C7BA8",
    questions: [
      { id:"q49", text:"How motivated are you to actively work on your longevity right now?", type:"scale", min:"Not a priority", max:"Fully committed" },
      { id:"q50", text:"What is your primary goal with bio.protocol?",           type:"single", opts:["Reverse biological age","Hormonal balance & symptom relief","Energy and mental clarity","Skin and physical appearance","Preventative — staying ahead","Overall optimization & data"] },
    ],
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions);

// ─── APP DATA ─────────────────────────────────────────────────────────────────

export const BIOMARKERS = [
  { name:"Cortisol AM",         value:"18.2", unit:"μg/dL",  status:"elevated", opt:"10–15" },
  { name:"Estradiol (E2)",      value:"45",   unit:"pg/mL",  status:"low",      opt:"50–150" },
  { name:"Vitamin D3",          value:"42",   unit:"ng/mL",  status:"optimal",  opt:"40–60" },
  { name:"Free Testosterone",   value:"18",   unit:"ng/dL",  status:"low",      opt:"20–70" },
  { name:"NAD+ Cellular",       value:"62",   unit:"%",      status:"moderate", opt:"> 70%" },
  { name:"hs-CRP",              value:"1.8",  unit:"mg/L",   status:"moderate", opt:"< 1.0" },
];

export const PROTOCOLS: Record<string, Array<{t:string;i:string;a:string;d:string}>> = {
  "Morning Ritual": [
    { t:"06:00", i:"💧", a:"Hydration Activation",      d:"500ml warm water + Himalayan salt + lemon + shilajit. Electrolyte priming before any stimulants or food." },
    { t:"06:15", i:"☀️", a:"Morning Sunlight",           d:"10min barefoot, no sunglasses. Anchors cortisol AM peak & circadian clock entrainment via melanopsin." },
    { t:"06:30", i:"🌬️", a:"Breathwork Protocol",        d:"Wim Hof: 3 rounds × 30 breaths + retention hold. Mitochondrial stimulation & adrenal priming." },
    { t:"07:00", i:"❄️", a:"Cold Exposure",              d:"2–3 min cold shower or plunge. Norepinephrine surge, metabolic activation, dopamine elevation." },
    { t:"07:30", i:"🍫", a:"Ceremonial Cacao",           d:"15g raw cacao + 1 tsp maca + reishi powder in warm oat milk. Screen-free, intentional ritual." },
  ],
  "Nutrition": [
    { t:"10:00", i:"🥗", a:"Break Fast (eating window opens)", d:"Protein-forward first meal: wild salmon, eggs or tempeh. Avocado. Zero refined sugars or processed grains." },
    { t:"13:00", i:"🫙", a:"Main Nourishment Meal",      d:"Anti-inflammatory rainbow: cruciferous veg, fermented foods, EVOO, phytoestrogens (flax, soy tempeh)." },
    { t:"18:00", i:"🍵", a:"Eating Window Closes",       d:"Light easy-to-digest dinner: bone broth, steamed greens, small protein. 16:8 fasting begins." },
    { t:"All day",i:"🌱",a:"Phytoestrogen Rotation",     d:"Ground flaxseed 2tbsp, fermented soy, red clover tea daily. Estrogen receptor modulation support." },
  ],
  "Movement": [
    { t:"08:00", i:"🚶", a:"Zone 2 Cardio",              d:"30–45min at conversational pace (60–70% HRmax). AMPK pathway & mitochondrial biogenesis." },
    { t:"Alt days",i:"🏋️",a:"Resistance Training",       d:"4×/week compound lifts. Non-negotiable for bone density & insulin sensitivity in perimenopause." },
    { t:"Evening",i:"🧘",a:"Yin Yoga + Mobility",        d:"20–30min fascia release. Cortisol wind-down, joint fluid circulation, parasympathetic shift." },
    { t:"Daily",  i:"👟", a:"10,000 Step Floor",          d:"Non-negotiable movement baseline. Continuous lymphatic drainage & metabolic maintenance." },
  ],
  "Sleep & Recovery": [
    { t:"19:00", i:"🕯️", a:"Light Dimming Protocol",     d:"No overhead lights after 7pm. Salt lamps & candles only. Triggers melatonin cascade onset." },
    { t:"20:00", i:"💊", a:"Wind-Down Supplement Stack", d:"Magnesium glycinate 400mg + ashwagandha + L-theanine. All devices off or removed." },
    { t:"21:00", i:"🌡️", a:"Cold Room Preparation",      d:"18–19°C optimal. Supports sleep architecture depth & nocturnal growth hormone pulse." },
    { t:"21:30", i:"😴", a:"Sleep Onset Target",         d:"7.5–8.5 hours. Track HRV weekly. Deep REM cycles critical for hormonal reset & repair." },
  ],
  "Skin & Cellular": [
    { t:"AM",    i:"✨", a:"Peptide Serum",               d:"Matrixyl 3000 + Argireline on damp skin. Collagen signaling peptides + acetylcholine modulator." },
    { t:"AM",    i:"🛡️", a:"Mineral SPF 50",              d:"UV radiation is the #1 accelerant of skin aging. Reapply at noon. Non-negotiable." },
    { t:"PM",    i:"🌙", a:"Retinol + Bakuchiol Cycle",   d:"Retinol 3×/week (Tue/Thu/Sat) + bakuchiol other nights. Cellular turnover + collagen synthesis." },
    { t:"Weekly",i:"🔴", a:"Red Light Therapy",           d:"10–15min near-infrared 630–850nm. Cytochrome c oxidase stimulation & collagen production." },
  ],
};

export const SUPPLEMENTS = [
  {
    cat:"Adaptogens", icon:"🌿", col:"#5FA882", bg:"rgba(95,168,130,0.1)",
    items:[
      { n:"Ashwagandha KSM-66®",   d:"600mg",    t:"Evening",    b:"Cortisol regulation, deep sleep & anti-inflammatory cascade",                 hi:true  },
      { n:"Rhodiola Rosea",         d:"400mg",    t:"Morning",    b:"Adrenal support, mental clarity & fatigue resilience",                        hi:true  },
      { n:"Reishi Mushroom",        d:"1000mg",   t:"Evening",    b:"Immune modulation, hormonal balance & longevity adaptogen",                   hi:false },
      { n:"He Shou Wu (FO-TI)",     d:"500mg",    t:"Morning",    b:"Hormonal harmony, hair vitality & Jing essence restoration",                  hi:false },
    ],
  },
  {
    cat:"Plant Intelligence", icon:"🍫", col:"#8B5E3C", bg:"rgba(139,94,60,0.1)",
    items:[
      { n:"Ceremonial Raw Cacao",   d:"10–15g",   t:"Morning",    b:"Theobromine activation, PEA elevation & mitochondrial support",               hi:true  },
      { n:"Moringa Oleifera",       d:"3g powder",t:"Morning",    b:"Bioavailable iron, amino acids, quercetin & zeatin anti-aging",               hi:false },
      { n:"Tremella Mushroom",      d:"800mg",    t:"Anytime",    b:"Natural hyaluronic acid production & neural skin hydration",                  hi:false },
      { n:"Schisandra Berry",       d:"500mg",    t:"Morning",    b:"Liver detox support, estrogen metabolism & radiance compound",                hi:false },
    ],
  },
  {
    cat:"Cellular Longevity", icon:"⚡", col:"#7B6FA8", bg:"rgba(123,111,168,0.1)",
    items:[
      { n:"NMN (Nicotinamide Mononucleotide)", d:"500mg", t:"Fasted AM", b:"NAD+ precursor, sirtuin activation & DNA repair pathways",             hi:true  },
      { n:"CoQ10 Ubiquinol",        d:"200mg",   t:"With fat",   b:"Mitochondrial ATP, perimenopausal energy & cardiovascular",                   hi:true  },
      { n:"Fisetin",                d:"500mg",   t:"Morning",    b:"Senolytic — clears senescent zombie cells, neuroprotective",                   hi:false },
      { n:"Urolithin A",            d:"500mg",   t:"Morning",    b:"Mitophagy activation, muscle vitality & cellular cleanup",                    hi:false },
    ],
  },
  {
    cat:"Hormonal Harmony", icon:"🌸", col:"#C47FA0", bg:"rgba(196,127,160,0.1)",
    items:[
      { n:"DIM (Diindolylmethane)", d:"200mg",   t:"With food",  b:"Estrogen metabolism optimization & phase II detox support",                   hi:true  },
      { n:"Maca Root (gelatinized)",d:"2.5g",    t:"Morning",    b:"FSH/LH balance, libido & perimenopausal symptom modulation",                  hi:true  },
      { n:"Vitex Agnus-Castus",     d:"400mg",   t:"Morning",    b:"Progesterone support & perimenopause cycle modulation",                       hi:false },
      { n:"Black Cohosh Extract",   d:"40mg",    t:"Evening",    b:"Hot flash reduction, sleep & estrogen receptor modulation",                   hi:false },
    ],
  },
  {
    cat:"Foundation Stack", icon:"🔬", col:"#5B8FA8", bg:"rgba(91,143,168,0.1)",
    items:[
      { n:"Magnesium Glycinate",    d:"400mg",   t:"Evening",    b:"Sleep architecture, cortisol regulation & muscle recovery",                   hi:true  },
      { n:"Omega-3 EPA/DHA",        d:"2–3g",    t:"With food",  b:"Neuroinflammation, cardiovascular & skin barrier protection",                 hi:true  },
      { n:"Vitamin K2 MK-7 + D3",  d:"200μg + 5000IU", t:"With fat", b:"Bone density & cardiovascular calcification prevention",                hi:true  },
      { n:"Zinc Bisglycinate",      d:"25mg",    t:"Evening",    b:"Immune function, testosterone support & collagen synthesis",                  hi:false },
    ],
  },
];

export const MENOPAUSE_STAGES = [
  { id:0, name:"Pre",        full:"Premenopause",       sub:"Regular cycles",         col:"#5FA882" },
  { id:1, name:"Early Peri", full:"Early Perimenopause",sub:"Subtle shifts",           col:"#A8A85F" },
  { id:2, name:"Late Peri",  full:"Late Perimenopause", sub:"Your stage",             col:"#C4965A", current:true },
  { id:3, name:"Menopause",  full:"Menopause",          sub:"12mo no period",         col:"#C47FA0" },
  { id:4, name:"Post",       full:"Post-menopause",     sub:"New equilibrium",        col:"#7B6FA8" },
];

export const DEFAULT_HABITS = [
  { id:1, name:"Morning sunlight",    emoji:"☀️", col:"#F4A535", freq:"Daily" },
  { id:2, name:"Cold exposure",       emoji:"❄️", col:"#7EC8E3", freq:"3×/week" },
  { id:3, name:"16:8 fasting",        emoji:"⏱️", col:"#9DC4B8", freq:"Daily" },
  { id:4, name:"Breathwork",          emoji:"🌬️", col:"#C4B8E8", freq:"Daily" },
  { id:5, name:"Resistance training", emoji:"🏋️", col:"#E8B4C4", freq:"4×/week" },
  { id:6, name:"Supplement stack",    emoji:"💊", col:"#B8D4A8", freq:"Daily" },
];
