import React, { useState } from 'react';
import { Upload, FileText, Anchor, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

export const ScientistDashboard: React.FC = () => {
  const { persona } = usePersona();
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    setTimeout(() => {
      setSubmissionStatus('success');
    }, 1500);
  };

  if (persona !== 'MoES Scientist') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#111111] p-4">
        <div className="text-center p-12 bg-white border border-[#E8E6E0] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in-95">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <ShieldCheck className="w-16 h-16 text-[#DC2626] mx-auto mb-5 relative z-10 animate-pulse" />
          <h2 className="text-2xl font-serif font-bold mb-3 relative z-10">Access Denied</h2>
          <p className="text-xs font-mono text-[#8E8E91] relative z-10 leading-relaxed">This secure portal requires authenticated MoES Scientist credentials for field log submission.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between border-b border-[#E8E6E0] pb-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#111111]">Scientist Dashboard</h1>
            <p className="text-sm font-mono text-[#555558] mt-1">Submit Field Logs & Datasets for PR Dissemination</p>
          </div>
          <div className="bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1.5 rounded-full text-xs font-mono border border-[#2563EB]/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Authenticated
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E6E0] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#2563EB]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
          
          <h2 className="text-xl font-serif font-semibold text-[#111111] mb-8 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
              <FileText className="w-5 h-5" />
            </div>
            New Expedition Log Entry
          </h2>
          
          {submissionStatus === 'success' ? (
            <div className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-xl p-8 text-center animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-[#16A34A] mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#166534] mb-2">Log Submitted Successfully</h3>
              <p className="text-sm font-mono text-[#16A34A] mb-6">Your field notes and data have been queued for PR approval.</p>
              <button 
                onClick={() => setSubmissionStatus('idle')}
                className="px-6 py-2 bg-white border border-[#16A34A]/30 rounded-full text-[#166534] text-xs font-mono hover:bg-[#DCFCE7] transition-colors"
              >
                Submit Another Entry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold text-[#555558] uppercase tracking-wider">Expedition / Station</label>
                  <select required className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl p-3 text-sm font-sans focus:outline-none focus:border-[#0D2735] focus:ring-1 focus:ring-[#0D2735] transition-all text-[#111111] cursor-pointer hover:bg-[#F4F2EE]">
                    <option>43rd ISEA (Antarctica)</option>
                    <option>Arctic Summer Campaign (Svalbard)</option>
                    <option>Himansh Glaciological Camp</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold text-[#555558] uppercase tracking-wider">Associated DOI (Optional)</label>
                  <input type="text" placeholder="10.1038/s41586..." className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-[#0D2735] focus:ring-1 focus:ring-[#0D2735] transition-all text-[#111111] hover:bg-[#F4F2EE]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-[#555558] uppercase tracking-wider">Field Notes / Summary</label>
                <textarea required rows={5} placeholder="Describe the findings, conditions, and scientific significance..." className="w-full bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl p-4 text-sm font-serif focus:outline-none focus:border-[#0D2735] focus:ring-1 focus:ring-[#0D2735] transition-all text-[#111111] hover:bg-[#F4F2EE] resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-[#555558] uppercase tracking-wider">Attach Media / Datasets</label>
                <div className="border-2 border-dashed border-[#E8E6E0] rounded-2xl p-10 text-center hover:bg-[#F4F2EE] hover:border-[#2563EB]/40 transition-all cursor-pointer group">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E6E0] shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#8E8E91] group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <p className="text-sm font-sans text-[#111111] font-medium mb-1.5">Click to upload or drag and drop</p>
                  <p className="text-[11px] font-mono text-[#8E8E91]">NetCDF, CSV, JPEG, MP4 (Max 5GB)</p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[#E8E6E0]">
                <button 
                  type="submit" 
                  disabled={submissionStatus === 'submitting'}
                  className="px-8 py-3 bg-[#0D2735] hover:bg-[#1a3d52] disabled:bg-[#8E8E91] text-white rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {submissionStatus === 'submitting' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4" />
                  )}
                  Submit to PR Queue
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
