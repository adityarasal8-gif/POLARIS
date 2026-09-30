import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Compass, HelpCircle, CheckCircle2, 
  XCircle, ArrowRight, RotateCcw, Award, Lightbulb, Sparkles, 
  Layers, Thermometer, Wind, Mountain, ChevronRight, Globe,
  ShieldCheck, AlertCircle
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
    explanation: "Albedo measures surface reflectivity. Ice reflects up to 90% of solar energy back into space. When it melts into dark seawater, reflectivity plummets to ~10%, causing the ocean to absorb massive amounts of solar heat."
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
    question: "How does deep Antarctic Bottom Water (AABW) influence global weather and the Indian Monsoon?",
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
    explanation: "As snow falls and compacts into glacial ice over millennia, it traps tiny bubbles of ambient atmosphere. Analyzing these bubbles allows paleoclimatologists to reconstruct greenhouse gas levels and temperatures over 800,000+ years."
  },
  {
    id: 5,
    question: "Under the Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol), what happens to solid waste generated at Indian stations like Bharati?",
    options: [
      "It is buried deep inside continental ice crevasses",
      "It is incinerated and the ash scattered into the sea",
      "All non-biodegradable and hazardous waste is segregated, compacted, containerized, and shipped back to the mainland for safe disposal",
      "It is left in open dumps outside the station perimeter"
    ],
    correctIndex: 2,
    explanation: "The Madrid Protocol strictly designates Antarctica as a natural reserve devoted to peace and science. Indian stations follow strict zero-discharge principles: waste is segregated, compacted, and repatriated back to the mainland."
  }
];

const GLOSSARY_TERMS = [
  { term: 'Albedo', definition: 'The fraction of solar radiation reflected by a surface. Fresh snow has an albedo of 0.8–0.9, while open ocean water has an albedo of ~0.06.' },
  { term: 'Calving', definition: 'The mechanical detachment and breaking off of massive ice blocks from a glacier or ice shelf terminus into open water, forming icebergs.' },
  { term: 'Cryosphere', definition: 'The components of the Earth System that contain water in frozen state, including snow, river and lake ice, sea ice, ice sheets, ice shelves, and permafrost.' },
  { term: 'Firn', definition: 'Partially compacted granular snow that has survived at least one summer season without melting, intermediate between snow and glacial ice.' },
  { term: 'Katabatic Wind', definition: 'Dense, cold drainage winds that flow down elevated Antarctic ice slopes under the force of gravity, reaching gale velocities over 150 km/h.' },
  { term: 'Nunatak', definition: 'An exposed, rocky ridge, mountain peak, or cliff that emerges above an ice field or glacier and is not covered with snow.' },
  { term: 'Permafrost', definition: 'Ground (soil or rock and included ice or organic material) that remains at or below 0°C for at least two consecutive years.' },
  { term: 'Polynya', definition: 'An area of persistent open water or thin ice surrounded by sea ice in polar regions, serving as critical biological oases and sea ice production factories.' },
  { term: 'Sea Ice Extent', definition: 'The total ocean area where ice concentration exceeds a threshold (typically 15%), measured continuously via satellite microwave radiometers.' },
  { term: 'Thermohaline Circulation', definition: 'Large-scale ocean density-driven circulation caused by global gradients in temperature (thermo) and freshwater salinity (haline).' }
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'glossary' | 'quiz'>('lessons');
  const [activeLesson, setActiveLesson] = useState(1);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <span>Smart Education</span>
            <span>/</span>
            <span>Science Outreach</span>
            <span>/</span>
            <span className="text-white">Polar Knowledge Hub</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Polar Science, Explained.
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl">
                An interactive educational portal for students, educators, and citizens to discover how India conducts research in the world's most extreme environments, why the cryosphere matters to the monsoon, and how polar stations survive.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-[#0B2538] border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-mono text-cyan-300">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>SIH 2026 Smart Education Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#0B2538] p-1.5 rounded-lg border border-white/10 max-w-md">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-2 px-3 rounded text-xs font-mono flex items-center justify-center gap-2 transition ${
              activeTab === 'lessons'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Core Lessons
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex-1 py-2 px-3 rounded text-xs font-mono flex items-center justify-center gap-2 transition ${
              activeTab === 'glossary'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Polar Glossary
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-3 rounded text-xs font-mono flex items-center justify-center gap-2 transition ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Interactive Quiz
          </button>
        </div>

        {/* TAB 1: INTERACTIVE LESSONS */}
        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lesson Selector Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider px-1">
                Select Interactive Module
              </h3>

              <div 
                onClick={() => setActiveLesson(1)}
                className={`p-4 rounded-lg border transition cursor-pointer space-y-1.5 ${
                  activeLesson === 1
                    ? 'bg-[#0B2538] border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                    : 'bg-[#0B2538]/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">MODULE 01</span>
                  <span className="text-slate-500">10 min read</span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Why Polar Regions Govern Earth's Climate
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Planetary albedo, oceanic thermohaline conveyor belts, and why Antarctic ice changes trigger monsoon swings in India.
                </p>
              </div>

              <div 
                onClick={() => setActiveLesson(2)}
                className={`p-4 rounded-lg border transition cursor-pointer space-y-1.5 ${
                  activeLesson === 2
                    ? 'bg-[#0B2538] border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                    : 'bg-[#0B2538]/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">MODULE 02</span>
                  <span className="text-slate-500">12 min read</span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  How Scientists Decode Glaciers & Ice Cores
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  From mass-balance stake networks in Spiti to deep ice drilling in East Antarctica, unlocking 800,000 years of paleoclimate records.
                </p>
              </div>

              <div 
                onClick={() => setActiveLesson(3)}
                className={`p-4 rounded-lg border transition cursor-pointer space-y-1.5 ${
                  activeLesson === 3
                    ? 'bg-[#0B2538] border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                    : 'bg-[#0B2538]/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400">MODULE 03</span>
                  <span className="text-slate-500">8 min read</span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Anatomy of an Antarctic Station: Maitri & Bharati
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Combined heat-and-power microgrids, snow-melting water treatment, zero-discharge waste repatriation under the Antarctic Treaty.
                </p>
              </div>

              {/* Quiz Callout */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-950/50 to-[#0B2538] border border-cyan-500/30 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Test Your Understanding
                </div>
                <p className="text-xs text-slate-300">
                  Ready to test your knowledge? Take our 5-question scientific quiz with instant scoring and explanations.
                </p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded text-xs transition"
                >
                  Start Quiz
                </button>
              </div>
            </div>

            {/* Lesson Detail Reader */}
            <div className="lg:col-span-8 bg-[#0B2538] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              {activeLesson === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase">Lesson 01 • Planetary Systems</span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      Why Polar Regions Govern Earth's Climate
                    </h2>
                  </div>

                  {/* Interactive Diagram Box */}
                  <div className="p-4 bg-[#071A2B] rounded-lg border border-cyan-500/20 space-y-3 font-mono text-xs text-slate-300">
                    <div className="flex items-center justify-between text-cyan-400 font-semibold border-b border-white/10 pb-2">
                      <span>THE ICE-ALBEDO POSITIVE FEEDBACK LOOP</span>
                      <span className="text-amber-400">AMPLIFICATION CYCLE</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center pt-2">
                      <div className="p-2.5 rounded bg-white/5 border border-white/10">
                        <span className="text-slate-400 block text-[10px]">STEP 1</span>
                        Global Warming Temp Rise
                      </div>
                      <div className="p-2.5 rounded bg-white/5 border border-white/10">
                        <span className="text-slate-400 block text-[10px]">STEP 2</span>
                        Sea Ice & Glaciers Melt
                      </div>
                      <div className="p-2.5 rounded bg-white/5 border border-white/10">
                        <span className="text-slate-400 block text-[10px]">STEP 3</span>
                        Dark Seawater Absorbs Heat
                      </div>
                      <div className="p-2.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                        <span className="text-cyan-400 block text-[10px]">STEP 4</span>
                        Accelerated Warming
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>
                      The polar regions act as the primary refrigerators of the Earth system. Because the poles receive incoming solar radiation at oblique angles and are insulated by high-albedo ice sheets, they maintain massive cold thermal sinks that drive planetary winds and oceanic currents.
                    </p>
                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      1. Planetary Albedo & Heat Reflection
                    </h3>
                    <p>
                      Fresh polar snow reflects upwards of 85% to 90% of incoming solar irradiance directly back into space. By contrast, open ocean water reflects less than 10%, absorbing the remaining 90% as thermal energy. When polar ice coverage decreases, the exposed darker ocean absorbs exponentially more heat, triggering a powerful positive feedback loop known as <em>polar amplification</em>.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      2. The Ocean Conveyor Belt (Thermohaline Circulation)
                    </h3>
                    <p>
                      Around the coasts of Antarctica and the Weddell/Ross Seas, the freezing of sea ice excludes salt, creating extremely dense, cold, saline water. This water sinks to the ocean floor to form <strong>Antarctic Bottom Water (AABW)</strong>. AABW flows northward across ocean basins, oxygenating the abyss and driving the global thermohaline circulation that distributes nutrients and stabilizes world climates.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      3. Teleconnection with the Indian Monsoon
                    </h3>
                    <p>
                      Research conducted by NCPOR scientists reveals significant teleconnections between Antarctic cryosphere variability and the Indian Summer Monsoon. Shifts in the Southern Ocean's Mascarene High pressure ridge directly modulate moisture transport toward the Indian subcontinent, demonstrating that changes in the Southern Ocean directly touch agriculture and livelihoods across India.
                    </p>
                  </div>
                </div>
              )}

              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase">Lesson 02 • Glaciological Methods</span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      How Scientists Decode Glaciers & Ice Cores
                    </h2>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>
                      Glaciers are continuous archives of Earth's atmospheric history. Indian scientists monitor both polar ice sheets in Antarctica and the "Third Pole" in the Himalayas (Chandra Basin, Spiti Valley) using complementary ground-based and remote sensing methodologies.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      1. Mass Balance Measurement Networks
                    </h3>
                    <p>
                      Glacier mass balance is the net change in glacier mass over a hydrologic year. At the Himalayan station <strong>Himansh (4080m a.s.l.)</strong>, researchers maintain extensive networks of stakes drilled into glaciers like Sutri Dhaka and Batal. By measuring stake exposure across accumulation (winter) and ablation (summer) zones, scientists quantify annual volumetric ice gain or loss.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      2. Ice Core Paleoclimatology
                    </h3>
                    <p>
                      In East Antarctica, snow compacts into firn and eventually solid ice without melting. Tiny air bubbles trapped during compaction preserve pristine samples of ancient atmospheric gas. By measuring stable water isotopes (δ18O and δD), scientists reconstruct historical temperatures, while methane and CO2 analysis reveals pre-industrial greenhouse gas baselines over past glacial-interglacial cycles.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      3. Ground Penetrating Radar (GPR) & Satellite Gravimetry
                    </h3>
                    <p>
                      To gauge ice thickness and internal stratigraphy without drilling, scientists drag GPR antennas across ice sheets. At planetary scales, satellite missions like GRACE and ICESat-2 measure subtle gravitational anomalies and laser surface altimetry to track total ice mass changes with sub-centimeter vertical accuracy.
                    </p>
                  </div>
                </div>
              )}

              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase">Lesson 03 • Station Engineering</span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      Anatomy of an Antarctic Station: Maitri & Bharati
                    </h2>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>
                      Operating a permanent human outpost in Antarctica requires self-contained life support engineering capable of withstanding -40°C blizzard temperatures, 150 km/h katabatic winds, and complete physical isolation during eight months of polar night.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      1. Bharati's Aerodynamic Container Architecture
                    </h3>
                    <p>
                      Commissioned in 2012 at Larsemann Hills, India's <strong>Bharati</strong> station was constructed using 134 prefabricated shipping containers wrapped in a high-efficiency aerodynamic thermal envelope. Elevated on stilts, its airfoil profile prevents drifting snow accumulation beneath the structure and reduces wind load resistance during winter blizzards.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      2. Combined Heat and Power (CHP) Microgrid
                    </h3>
                    <p>
                      Bharati operates automated diesel generators with heat exchangers that harvest waste engine heat to melt glacial ice for drinking water and provide radiant hydronic heating throughout living quarters, achieving exceptionally high fuel thermal efficiency.
                    </p>

                    <h3 className="text-lg font-serif font-semibold text-white pt-2">
                      3. Zero-Discharge Environmental Protocol
                    </h3>
                    <p>
                      In adherence to the Antarctic Treaty's Madrid Protocol, Indian stations enforce strict environmental compliance. Gray water and sewage undergo biological treatment and filtration. All solid waste, spent oil, packaging, and non-biodegradable refuse are compacted, sealed in maritime containers, and repatriated back to the Indian mainland each summer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: POLAR GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Polar & Cryospheric Lexicon
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authoritative scientific definitions of terms frequently used in NCPOR expedition reports and research datasets.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-[#0B2538] px-3 py-1.5 rounded border border-cyan-500/20">
                10 Curated Terms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOSSARY_TERMS.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0B2538] border border-white/10 hover:border-cyan-500/30 rounded-lg p-5 space-y-2 transition shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold text-cyan-300 group-hover:text-white transition">
                      {item.term}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      LEX #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 5-QUESTION QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-[#0B2538] border border-cyan-500/30 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Quiz Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>SMART EDUCATION ASSESSMENT</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Polar Science Knowledge Challenge
                  </h2>
                </div>
                
                {quizSubmitted ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">FINAL SCORE</span>
                      <span className="text-xl font-bold font-mono text-cyan-300">
                        {calculateScore()} / {QUIZ_QUESTIONS.length} ({Math.round((calculateScore() / QUIZ_QUESTIONS.length) * 100)}%)
                      </span>
                    </div>
                    <button
                      onClick={resetQuiz}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition"
                      title="Reset Quiz"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-400">
                    Answer all 5 questions to receive feedback
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-8">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === q.correctIndex;

                  return (
                    <div key={q.id} className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                          {q.id}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-white">
                          {q.question}
                        </h3>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pl-8">
                        {q.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          let optionClass = "bg-[#071A2B] border-white/10 text-slate-300 hover:border-cyan-500/30";

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optionClass = "bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-medium";
                            } else if (isSelected && optIdx !== q.correctIndex) {
                              optionClass = "bg-red-950/60 border-red-500/60 text-red-200";
                            } else {
                              optionClass = "bg-[#071A2B]/40 border-white/5 text-slate-500 opacity-60";
                            }
                          } else if (isSelected) {
                            optionClass = "bg-cyan-950/70 border-cyan-400 text-white font-medium shadow-md shadow-cyan-950";
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3 rounded-lg border text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${optionClass}`}
                            >
                              <span>{option}</span>
                              {quizSubmitted && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                              )}
                              {quizSubmitted && isSelected && optIdx !== q.correctIndex && (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {quizSubmitted && (
                        <div className="ml-8 p-3 rounded bg-[#071A2B] border border-white/10 text-xs space-y-1">
                          <span className="font-mono text-cyan-400 font-semibold uppercase text-[11px] block">
                            Scientific Explanation:
                          </span>
                          <p className="text-slate-300">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {Object.keys(selectedAnswers).length} of {QUIZ_QUESTIONS.length} questions answered
                </span>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded text-xs font-mono transition flex items-center gap-1.5 shadow-lg shadow-cyan-950"
                  >
                    <span>Submit Answers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded text-xs font-mono transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Quiz Again</span>
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
