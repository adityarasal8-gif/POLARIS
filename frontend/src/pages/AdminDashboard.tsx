import React, { useState } from 'react';
import { ShieldAlert, ListChecks, CheckCircle, Clock, Zap, Bot } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const PENDING_QUEUE = [
  { id: '1', title: 'Rapid retreat of Thwaites Glacier observed', scientist: 'Dr. S. Rajan', date: '2 hours ago', status: 'pending' },
  { id: '2', title: 'New atmospheric anomaly detected over Svalbard', scientist: 'Dr. M. Ravichandran', date: '5 hours ago', status: 'pending' },
];

export const AdminDashboard: React.FC = () => {
  const { persona } = usePersona();
  const [queue, setQueue] = useState(PENDING_QUEUE);
  const [isGenerating, setIsGenerating] = useState(false);

  if (persona !== 'MoES Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#111111] p-4">
        <div className="text-center p-12 bg-white border border-[#E8E6E0] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in-95">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <ShieldAlert className="w-16 h-16 text-[#DC2626] mx-auto mb-5 relative z-10 animate-pulse" />
          <h2 className="text-2xl font-serif font-bold mb-3 relative z-10">Restricted Area</h2>
          <p className="text-xs font-mono text-[#8E8E91] relative z-10 leading-relaxed">MoES Admin / PR Officer clearance required to access the central dispatch queue.</p>
        </div>
      </div>
    );
  }

  const handleApprove = (id: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setQueue(queue.filter(q => q.id !== id));
      setIsGenerating(false);
      // In a real app, this would route to /studio or show a success toast
      alert("Sent to AI Dissemination Studio. Press Release generated.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#111111]">PR & Admin Operations</h1>
            <p className="text-sm font-mono text-[#555558] mt-1">Review Scientist submissions and trigger AI Outreach.</p>
          </div>
          <div className="bg-[#FCE7F3] text-[#BE185D] px-3 py-1.5 rounded-full text-xs font-mono border border-[#BE185D]/20 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Clearance Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E8E6E0] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full -translate-y-1/2 -translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <h2 className="text-xl font-serif font-semibold text-[#111111] mb-8 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
                  <ListChecks className="w-5 h-5" />
                </div>
                Approval Queue
              </h2>
              
              {queue.length === 0 ? (
                <div className="text-center py-12 text-[#8E8E91]">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-mono uppercase tracking-widest">Queue Empty</p>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {queue.map(item => (
                    <div key={item.id} className="border border-[#E8E6E0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-[#FAFAF8] hover:bg-white transition-all shadow-sm hover:shadow-md cursor-default">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E8E91] uppercase mb-1.5 tracking-wider">
                          <Clock className="w-3.5 h-3.5" /> {item.date}
                        </div>
                        <h4 className="text-base font-serif font-medium text-[#111111]">{item.title}</h4>
                        <p className="text-xs font-sans text-[#555558] mt-1.5">Submitted by <span className="font-semibold text-[#111111]">{item.scientist}</span></p>
                      </div>
                      <button 
                        onClick={() => handleApprove(item.id)}
                        disabled={isGenerating}
                        className="px-5 py-2.5 bg-[#0D2735] hover:bg-[#1a3d52] disabled:bg-[#8E8E91] text-white rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer hover:shadow-md"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        Send to AI Studio
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-[#E8E6E0] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F59E0B]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              
              <h3 className="text-xs font-mono font-bold text-[#111111] uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <Zap className="w-4 h-4 text-[#F59E0B]" /> Quick Actions
              </h3>
              <div className="space-y-3 relative z-10">
                <a href="/studio" className="block w-full px-5 py-3.5 bg-[#FAFAF8] hover:bg-[#F4F2EE] border border-[#E8E6E0] rounded-xl text-[11px] font-mono font-bold text-[#111111] text-center transition-all shadow-sm hover:shadow-md cursor-pointer uppercase tracking-wider">
                  Open Gemini Studio
                </a>
                <button className="block w-full px-5 py-3.5 bg-[#FAFAF8] hover:bg-[#F4F2EE] border border-[#E8E6E0] rounded-xl text-[11px] font-mono font-bold text-[#111111] text-center transition-all shadow-sm hover:shadow-md cursor-pointer uppercase tracking-wider">
                  View Published Metrics
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
