import React, { useState } from 'react';
import { FileUp, Send, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { useConnectivity } from '../context/ConnectivityContext';
import { saveToOutbox } from '../utils/offlineStore';
export const ExpeditionLogSubmitter: React.FC = () => {
  const { persona } = usePersona();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  if (persona !== 'MoES Scientist') {
    return null;
  }

  const [outboxMessage, setOutboxMessage] = useState(false);
  const { mode, isOnline, pendingSyncCount, setPendingSyncCount } = useConnectivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const payload = {
      expeditionName: 'Expedition',
      coordinates: '-70.76, 11.73',
      notes: 'Sample notes'
    };

    if (mode === 'HIGH_BANDWIDTH' && isOnline) {
      setTimeout(() => {
        setOutboxMessage(false);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      }, 1500);
    } else {
      // Save to outbox
      try {
        await saveToOutbox('expedition_log', payload);
        const newCount = pendingSyncCount + 1;
        setPendingSyncCount(newCount);
        setOutboxMessage(true);
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setOutboxMessage(false);
        }, 4000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E6E0] shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="p-6 sm:p-8 border-b border-[#E8E6E0] bg-gradient-to-r from-[#FAFAF8] to-white">
        <h3 className="text-xl font-serif font-medium text-[#111111]">Scientist Log Submitter</h3>
        <p className="text-sm text-[#555558] mt-1">Submit field notes to the Admin for PR/Outreach synthesis.</p>
      </div>

      <div className="p-6 sm:p-8">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#16A34A]" />
            </div>
            <div>
              {outboxMessage ? (
                <>
                  <h4 className="text-lg font-serif font-medium text-[#111111]">Log saved locally in Polar Field Outbox.</h4>
                  <p className="text-sm text-[#555558]">Will auto-sync once satellite link is restored.</p>
                </>
              ) : (
                <>
                  <h4 className="text-lg font-serif font-medium text-[#111111]">Sent to Admin for PR Approval</h4>
                  <p className="text-sm text-[#555558]">Your log will be reviewed and transformed into outreach material.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-[#555558] uppercase tracking-wider">
                  Expedition Name
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91]" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. 44th ISEA"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-[#555558] uppercase tracking-wider">
                  Location Coordinates
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91]" />
                  <input
                    required
                    type="text"
                    placeholder="-70.76, 11.73 (Maitri)"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#E8E6E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-[#555558] uppercase tracking-wider">
                Upload Field Notes
              </label>
              <div className="border-2 border-dashed border-[#E8E6E0] rounded-xl p-8 text-center hover:bg-[#FAFAF8] transition-colors cursor-pointer flex flex-col items-center justify-center">
                <FileUp className="w-8 h-8 text-[#8E8E91] mb-3" />
                <p className="text-sm font-medium text-[#111111]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#8E8E91] mt-1">TXT, DOCX, or PDF (Max 10MB)</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-[#E8E6E0]">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary flex items-center space-x-2 px-6 py-3"
              >
                {status === 'submitting' ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{status === 'submitting' ? 'Submitting...' : 'Submit to Admin'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
