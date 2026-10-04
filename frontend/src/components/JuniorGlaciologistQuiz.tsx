import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ChevronRight, RefreshCw, GraduationCap } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the name of India's first permanent research station in Antarctica, commissioned in 1983?",
    options: ["Maitri", "Dakshin Gangotri", "Bharati", "Himadri"],
    correctIndex: 1,
    explanation: "Dakshin Gangotri was established during the 3rd Indian Antarctic Expedition. It was later decommissioned after being buried in ice."
  },
  {
    id: 2,
    text: "Where is India's only Arctic research station, Himadri, located?",
    options: ["Greenland", "Svalbard, Norway", "Baffin Island, Canada", "Siberia, Russia"],
    correctIndex: 1,
    explanation: "Himadri is located at Ny-Ålesund in Spitsbergen, Svalbard (Norway), which is the northernmost permanent civilian settlement in the world."
  },
  {
    id: 3,
    text: "Which research vessel is commonly chartered by India for its Southern Ocean and Antarctic expeditions?",
    options: ["RV Sagar Kanya", "MV Vasiliy Golovnin", "SA Agulhas II", "INS Sagardhwani"],
    correctIndex: 1,
    explanation: "The Russian ice-class vessel MV Vasiliy Golovnin has been frequently chartered by NCPOR for resupplying Maitri and Bharati stations."
  }
];

export const JuniorGlaciologistQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === QUIZ_QUESTIONS[currentQuestion].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  };

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="bg-white rounded-3xl border border-[#E8E6E0] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="p-6 sm:p-8 border-b border-[#E8E6E0] bg-gradient-to-r from-[#FAFAF8] to-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif font-medium text-[#111111] flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-[#2563EB]" />
            <span>Polar Knowledge Challenge</span>
          </h3>
          <p className="text-sm text-[#555558] mt-1 font-mono">Test your knowledge of India's polar expeditions.</p>
        </div>
        {!isComplete && (
          <div className="hidden sm:block text-xs font-mono font-bold text-[#8E8E91] bg-[#F4F2EE] px-3 py-1.5 rounded-full border border-[#E8E6E0]">
            QUESTION {currentQuestion + 1} OF {QUIZ_QUESTIONS.length}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
            {score === QUIZ_QUESTIONS.length ? (
              <div className="space-y-6 flex flex-col items-center">
                {/* CSS Badge for Perfect Score */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-[#111111] to-[#2a2a2a] rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center p-4 transform transition-transform group-hover:scale-105">
                    <Award className="w-10 h-10 text-yellow-400 mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center leading-tight">
                      MoES Junior
                      <br/>Polar Scientist
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-2xl font-serif font-medium text-[#111111]">Outstanding!</h4>
                  <p className="text-[#555558] mt-2 max-w-sm mx-auto">
                    You scored {score}/{QUIZ_QUESTIONS.length}. You have demonstrated excellent knowledge of India's polar scientific endeavors.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#F4F2EE] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-[#111111]">{score}/{QUIZ_QUESTIONS.length}</span>
                </div>
                <div>
                  <h4 className="text-xl font-serif font-medium text-[#111111]">Good Effort!</h4>
                  <p className="text-[#555558] mt-2 max-w-sm mx-auto">
                    Keep exploring the POLARIS archives to learn more about the cryosphere.
                  </p>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleRestart}
              className="btn-primary flex items-center space-x-2 px-6 py-2.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <h4 className="text-lg font-medium text-[#111111] leading-relaxed">
              {question.text}
            </h4>

            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correctIndex;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`
                      w-full text-left px-5 py-4 rounded-xl border text-sm transition-all flex items-center justify-between
                      ${!isAnswered ? 'bg-[#FAFAF8] border-[#E8E6E0] hover:border-[#111111] hover:bg-white text-[#555558]' : ''}
                      ${showCorrect ? 'bg-[#F0FDF4] border-[#16A34A] text-[#166534] font-medium shadow-sm' : ''}
                      ${showWrong ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]' : ''}
                      ${isAnswered && !isSelected && !isCorrect ? 'bg-[#FAFAF8] border-[#E8E6E0] text-[#8E8E91] opacity-50' : ''}
                    `}
                  >
                    <span>{opt}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />}
                    {showWrong && <XCircle className="w-5 h-5 text-[#DC2626]" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="pt-6 border-t border-[#E8E6E0] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-in fade-in duration-300">
                <div className="flex-1 pr-4">
                  <p className="text-xs text-[#555558] leading-relaxed">
                    <strong className="font-semibold text-[#111111]">Fact: </strong> 
                    {question.explanation}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center space-x-2 shrink-0 px-6 py-2.5"
                >
                  <span>{currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
