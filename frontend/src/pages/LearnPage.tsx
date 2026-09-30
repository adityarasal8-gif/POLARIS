import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Compass, HelpCircle, CheckCircle2, 
  XCircle, ArrowRight, RotateCcw, Sparkles, Layers, 
  Thermometer, Wind, Mountain, ChevronRight, Globe, Award, Search
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Why do melting ice sheets accelerate global warming via the 'Ice-Albedo Feedback' loop?",
    options: [
      "Ice produces greenhouse gases when exposed to sunlight",
      "White ice reflects ~80-90% of solar radiation, whereas dark open water absorbs ~90%, heating the ocean further",
      "Melting ice increases atmospheric pressure at the poles",
      "Cold water prevents cloud formation, allowing more solar rays to strike Earth"
    ],
    correctIndex: 1,
    explanation: "Albedo measures surface reflectivity. Fresh snow/ice reflects up to 90% of solar energy back into space. When it melts into dark seawater, reflectivity plummets to ~10%, causing the ocean to absorb massive amounts of solar heat."
  },
  {
    id: 2,
    question: "Where is India's Arctic research station 'Himadri' situated?",
    options: [
      "Schirmacher Oasis, Antarctica",
      "Larsemann Hills, East Antarctica",
      "Ny-Ålesund, Svalbard archipelago, Norway (78°55' N)",
      "Chandra Basin, Spiti Valley, Himachal Pradesh"
    ],
    correctIndex: 2,
    explanation: "Himadri was inaugurated in 2008 at the international research base in Ny-Ålesund, Spitsbergen, Svalbard (Norway) at 78°55' N latitude."
  },
  {
    id: 3,
    question: "How does deep Antarctic Bottom Water (AABW) influence global climate and the Indian Monsoon?",
    options: [
      "It drives the global Thermohaline Circulation ('ocean conveyor belt'), transporting heat, oxygen, and nutrients across planetary oceans",
      "It creates high-pressure cyclones that strike Mumbai annually",
      "It dissolves carbon dioxide and releases it directly into the Bay of Bengal",
      "It freezes the Southern Ocean to block maritime trade routes"
    ],
    correctIndex: 0,
    explanation: "Antarctic Bottom Water is the densest water mass on Earth. Its formation drives the lower branch of the global Thermohaline Circulation, regulating planetary heat distribution and deeply coupling with monsoon teleconnections."
  },
  {
    id: 4,
    question: "What is an 'ice core' and what unique paleoclimate record does it preserve?",
    options: [
      "A rock sample found beneath the continental shelf",
      "A vertical cylinder of ice drilled from glaciers that traps ancient atmospheric air bubbles and isotopic signatures dating back hundreds of thousands of years",
      "A synthetic ice structure created in laboratory cleanrooms",
      "Frozen sea ice collected each winter to measure salt salinity"
    ],
    correctIndex: 1,
    explanation: "As snow falls and compacts into glacier ice over millennia, atmospheric air bubbles become hermetically sealed. Ice core drilling allows paleoclimatologists to measure ancient greenhouse gases (CO2, CH4) and isotopes dating back up to 800,000 years."
  },
  {
    id: 5,
    question: "Which international treaty guarantees that Antarctica is preserved solely for peaceful scientific research?",
    options: [
      "The Kyoto Protocol",
      "The Antarctic Treaty System (ATS, 1959)",
      "The Law of the Sea Convention (UNCLOS)",
      "The Geneva Climate Accord"
    ],
    correctIndex: 1,
    explanation: "Signed in 1959 and entered into force in 1961, the Antarctic Treaty System sets aside the entire continent south of 60° S latitude as a scientific preserve, banning military activity, mineral extraction, and nuclear testing."
  }
];

const GLOSSARY_TERMS = [
  { term: "Albedo", definition: "The fraction of solar radiation reflected by a surface. Fresh snow has an albedo of ~0.90 (reflects 90%), while open sea water has an albedo of ~0.06 (absorbs 94%)." },
  { term: "Katabatic Winds", definition: "Extremely fierce, high-density gravity winds formed when chilled, dense air rushes down steep ice sheets toward the coast, frequently exceeding 150 km/h." },
  { term: "Cryosphere", definition: "The portions of Earth's surface where water is in solid form, including sea ice, lake ice, river ice, snow cover, glaciers, ice caps, ice sheets, and frozen ground (permafrost)." },
  { term: "Thermohaline Circulation", definition: "Large-scale oceanic circulation driven by global density gradients created by surface heat and freshwater fluxes, often termed the global ocean conveyor belt." },
  { term: "Nunatak", definition: "An exposed, often rocky element of a ridge, mountain, or peak not covered with ice or snow within (or at the edge of) an ice sheet or glacier." },
  { term: "Mass Balance", definition: "The difference between accumulation (snowfall, avalanching) and ablation (melting, sublimation, iceberg calving) on a glacier over a defined balance year." },
  { term: "Ablation Stake", definition: "A calibrated bamboo or aluminum pole drilled several meters into glacier ice to measure annual melt rates by observing exposed pole length changes." },
  { term: "Firn", definition: "Partially compacted granular snow that has survived at least one summer season without melting, representing the intermediate transitional stage before turning into solid glacier ice." }
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary' | 'quiz'>('lessons');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [glossarySearch, setGlossarySearch] = useState('');
  
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const filteredGlossary = GLOSSARY_TERMS.filter(item => 
    item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] font-sans selection:bg-[#111111] selection:text-white pb-20">
      {/* Light Editorial Education Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F4F2EE] border-b border-[#E8E6E0]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6E0] text-xs font-mono uppercase tracking-wide text-[#555558] font-medium shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-[#111111]" />
            <span>Open Science Education & Public Discovery</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-medium leading-tight">
            Polar Science, <span className="italic">Demystified.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#555558] max-w-3xl leading-relaxed font-light">
            Understand how Earth's cryosphere regulates the Indian monsoon, how scientists extract 800,000-year paleoclimate records from Antarctic ice cores, and how human outposts survive polar blizzards.
          </p>

          {/* Navigation Tabs */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'lessons'
                  ? 'bg-[#111111] text-white font-medium shadow-sm'
                  : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Modules</span>
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'glossary'
                  ? 'bg-[#111111] text-white font-medium shadow-sm'
                  : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cryospheric Lexicon</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-[#111111] text-white font-medium shadow-sm'
                  : 'bg-white text-[#555558] hover:text-[#111111] border border-[#E8E6E0]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Science Challenge</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Educational Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TAB 1: INTERACTIVE LESSONS */}
        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Module Picker Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-3 sticky top-20">
              <span className="text-xs font-mono uppercase text-[#8E8E91] tracking-wider px-1">
                Course Modules
              </span>

              {[
                { id: 1, mod: 'MODULE 01', time: '8 min read', title: "Why Polar Regions Govern Earth's Climate", desc: "Planetary albedo, oceanic conveyor belts, and monsoon teleconnections." },
                { id: 2, mod: 'MODULE 02', time: '10 min read', title: "How Scientists Decode Glaciers & Ice Cores", desc: "Mass-balance stake networks, isotopic paleoclimatology, and radar sounding." },
                { id: 3, mod: 'MODULE 03', time: '7 min read', title: "Anatomy of an Antarctic Station: Maitri & Bharati", desc: "Aerodynamic container architecture, microgrids, and zero-discharge protocols." },
              ].map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setActiveLesson(m.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    activeLesson === m.id
                      ? 'bg-white border-[#111111] shadow-sm ring-1 ring-[#111111]'
                      : 'bg-white border-[#E8E6E0] hover:border-[#111111]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#111111] font-bold">{m.mod}</span>
                    <span className="text-[#8E8E91]">{m.time}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#111111] font-medium leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#555558] leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>
              ))}

              {/* Quiz Callout Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8E6E0] shadow-sm space-y-2.5 mt-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#111111] font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Test Your Comprehension</span>
                </div>
                <p className="text-xs text-[#555558] leading-relaxed font-light">
                  Validate your learning across albedo, ice cores, and treaty protocols in our 5-question challenge.
                </p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-mono text-xs font-medium rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  Take Science Quiz →
                </button>
              </div>
            </div>

            {/* Lesson Reader (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-[#E8E6E0] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
              {activeLesson === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E6E0] pb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8E8E91] font-semibold">
                      Lesson 01 · Planetary Energetics
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium mt-1 leading-tight">
                      Why Polar Regions Govern Earth's Climate
                    </h2>
                  </div>

                  {/* Educational Feedback Diagram */}
                  <div className="p-5 bg-[#FAFAF8] rounded-2xl border border-[#E8E6E0] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono border-b border-[#E8E6E0] pb-2 text-[#111111]">
                      <span className="font-semibold">THE ICE-ALBEDO POSITIVE FEEDBACK LOOP</span>
                      <span className="text-[#8E8E91] font-semibold">AMPLIFICATION CYCLE</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#E8E6E0]">
                        <span className="text-[10px] text-[#8E8E91] block">STEP 1</span>
                        <span className="font-semibold text-[#111111]">Rising Global Temperature</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E8E6E0]">
                        <span className="text-[10px] text-[#8E8E91] block">STEP 2</span>
                        <span className="font-semibold text-[#111111]">Sea Ice Surface Melts</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E8E6E0]">
                        <span className="text-[10px] text-[#8E8E91] block">STEP 3</span>
                        <span className="font-semibold text-[#111111]">Dark Ocean Absorbs Heat</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#111111] text-white">
                        <span className="text-[10px] text-white/70 block">STEP 4</span>
                        <span className="font-semibold">Accelerated Cryosphere Loss</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-base text-[#555558] leading-relaxed space-y-5 font-light">
                    <p>
                      The polar regions function as Earth's primary heat radiators. Because incoming solar radiation strikes the poles at steep oblique angles while pristine ice sheets reflect most sunlight back into space, the poles maintain immense thermal gradients that drive planetary jet streams and ocean conveyor systems.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      1. Surface Albedo & Planetary Radiation Balance
                    </h3>
                    <p>
                      Albedo describes how effectively a surface reflects solar radiation. Fresh snow has an albedo of 0.85 to 0.90—reflecting up to 90% of incoming solar energy. In contrast, dark open ocean water has an albedo of approximately 0.06 to 0.10, absorbing over 90% of solar radiation. When sea ice retreats, the newly exposed seawater absorbs vastly more heat, driving <em>polar amplification</em>.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      2. The Planetary Thermohaline Conveyor
                    </h3>
                    <p>
                      Along the Antarctic coast, winter freezing excludes salt from sea ice crystals, creating hypersaline, frigid brine. This exceptionally dense water plunges thousands of meters downward to form <strong>Antarctic Bottom Water (AABW)</strong>. AABW flows northward along the seafloor across all ocean basins, oxygenating the deep ocean and powering the global thermohaline circulation.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      3. Teleconnection with the Indian Monsoon
                    </h3>
                    <p>
                      NCPOR research demonstrates that thermodynamic shifts in the Southern Ocean directly modulate the intensity of the Mascarene High—the high-pressure ridge off Madagascar that funnels moisture toward the Indian subcontinent during the Southwest Monsoon. What transpires in Antarctica directly impacts rainfall and agriculture across India.
                    </p>
                  </div>
                </div>
              )}

              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E6E0] pb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8E8E91] font-semibold">
                      Lesson 02 · Glaciological Methodologies
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium mt-1 leading-tight">
                      How Scientists Decode Glaciers & Ice Cores
                    </h2>
                  </div>

                  <div className="text-base text-[#555558] leading-relaxed space-y-5 font-light">
                    <p>
                      Glaciers are natural time capsules. By analyzing ancient snow deposited over millennia without melting, scientists reconstruct historical atmospheric compositions, temperature swings, and volcanic eruptions.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      1. Mass Balance Monitoring Networks
                    </h3>
                    <p>
                      Glacier mass balance represents the net change in glacier mass over a hydrologic year. At India's high-altitude research station <strong>Himansh (4,080m)</strong> in the Himalayas, scientists maintain networks of ablation stakes drilled across glaciers such as Sutri Dhaka and Batal to measure snow accumulation versus summer melting.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      2. Ice Core Paleoclimatology
                    </h3>
                    <p>
                      In East Antarctica, snow compacts into firn and solid ice under increasing pressure. Tiny atmospheric air bubbles become permanently sealed inside the ice matrix. By analyzing stable water isotopes (δ18O and δD), paleoclimatologists quantify ambient temperatures when that snow fell hundreds of thousands of years ago, establishing pre-industrial baselines for CO2 and methane.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      3. Ground Penetrating Radar (GPR) & Satellites
                    </h3>
                    <p>
                      To gauge glacier thickness without drilling thousands of core meters, researchers drag GPR antennas across ice surfaces. Radar reflections at bedrock boundaries reveal ice thickness, while satellite missions like NASA/ISRO SAR and GRACE-FO measure regional gravitational fluctuations to calculate planetary ice loss.
                    </p>
                  </div>
                </div>
              )}

              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E6E0] pb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8E8E91] font-semibold">
                      Lesson 03 · Polar Engineering
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium mt-1 leading-tight">
                      Anatomy of an Antarctic Station: Maitri & Bharati
                    </h2>
                  </div>

                  <div className="text-base text-[#555558] leading-relaxed space-y-5 font-light">
                    <p>
                      Maintaining a permanent scientific outpost on the Antarctic continent requires specialized life-support engineering that can withstand -40°C blizzards, 150 km/h katabatic winds, and eight months of continuous winter darkness.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      1. Bharati's Aerodynamic Container Architecture
                    </h3>
                    <p>
                      Commissioned in 2012 in the Larsemann Hills, India's <strong>Bharati</strong> station was built from 134 prefabricated shipping containers encased inside an aerodynamic thermal envelope. Elevated on steel stilts, its airfoil profile prevents snowdrift accumulation beneath the structure and dramatically lowers structural wind resistance.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      2. Combined Heat and Power (CHP) Microgrid
                    </h3>
                    <p>
                      Bharati operates clean diesel-electric generator sets coupled to exhaust and coolant heat exchangers. This harvested waste thermal energy melts glacial ice into potable water and drives hydronic underfloor heating throughout all living quarters, achieving remarkable thermal efficiency.
                    </p>

                    <h3 className="font-serif text-2xl text-[#111111] font-medium pt-2">
                      3. Zero-Discharge Environmental Protocols
                    </h3>
                    <p>
                      In strict compliance with the Antarctic Treaty's Madrid Protocol, gray water and black water undergo multi-stage biological digestion and filtration. All solid refuse, packaging, and non-biodegradable waste are containerized and repatriated back to the Indian mainland each summer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: POLAR GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-6">
              <div>
                <h2 className="font-serif text-3xl text-[#111111] font-medium">
                  Cryospheric & Polar Science Lexicon
                </h2>
                <p className="text-sm text-[#555558] mt-1 font-light">
                  Standard scientific terminology used across NCPOR expedition archives and NPDC research records.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E91]" />
                <input
                  type="text"
                  placeholder="Search glossary terms..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E6E0] rounded-full text-xs text-[#111111] placeholder-[#8E8E91] focus:outline-none focus:border-[#111111] font-sans shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-[#E8E6E0] hover:border-[#111111]/30 rounded-2xl p-6 space-y-2 transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#111111] group-hover:text-black transition-colors font-medium">
                      {item.term}
                    </h3>
                    <span className="text-[10px] font-mono text-[#8E8E91]">
                      LEX #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm text-[#555558] leading-relaxed font-light">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ CHALLENGE */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white border border-[#E8E6E0] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8E8E91] font-semibold">
                    Interactive Assessment
                  </span>
                  <h2 className="font-serif text-3xl text-[#111111] font-medium mt-1">
                    Polar Science Knowledge Challenge
                  </h2>
                </div>

                {quizSubmitted ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#8E8E91] block">FINAL SCORE</span>
                      <span className="text-2xl font-bold font-mono text-[#111111]">
                        {calculateScore()} / {QUIZ_QUESTIONS.length}
                      </span>
                    </div>
                    <button
                      onClick={resetQuiz}
                      className="p-2.5 rounded-full bg-[#FAFAF8] border border-[#E8E6E0] text-[#111111] hover:bg-white transition-colors cursor-pointer"
                      title="Reset Quiz"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-[#8E8E91]">
                    Answer all 5 questions
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {QUIZ_QUESTIONS.map((q) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isAnswered = userAnswer !== undefined;

                  return (
                    <div key={q.id} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs font-mono flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {q.id}
                        </span>
                        <h3 className="text-base font-medium text-[#111111] leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      <div className="space-y-2.5 pl-10">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          let optionClass = "bg-[#FAFAF8] border-[#E8E6E0] text-[#111111] hover:border-[#111111]/30";

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optionClass = "bg-emerald-50 border-emerald-500 text-emerald-900 font-medium";
                            } else if (isSelected && optIdx !== q.correctIndex) {
                              optionClass = "bg-red-50 border-red-500 text-red-900";
                            } else {
                              optionClass = "bg-[#FAFAF8] border-[#E8E6E0] text-[#8E8E91] opacity-50";
                            }
                          } else if (isSelected) {
                            optionClass = "bg-[#111111] border-[#111111] text-white font-medium shadow-sm";
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3.5 rounded-2xl border text-sm transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                              )}
                              {quizSubmitted && isSelected && optIdx !== q.correctIndex && (
                                <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="ml-10 p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E6E0] text-xs space-y-1.5 font-light">
                          <span className="font-mono text-[#111111] font-bold uppercase text-[10px] block">
                            Scientific Rationale
                          </span>
                          <p className="text-[#555558] leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-6 border-t border-[#E8E6E0] flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E8E91]">
                  {Object.keys(selectedAnswers).length} of {QUIZ_QUESTIONS.length} selected
                </span>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs font-medium rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Evaluate Responses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2.5 bg-white border border-[#E8E6E0] hover:bg-[#FAFAF8] text-[#111111] font-mono text-xs font-medium rounded-full transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Assessment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
