import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePersona, Persona } from '../context/PersonaContext';
import { X, ShieldCheck, UserCog, Beaker, LogIn, Key, Mail, Fingerprint } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setPersona } = usePersona();
  const [activeTab, setActiveTab] = useState<'scientist' | 'admin' | 'signup'>('scientist');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay for authentication
    setTimeout(() => {
      setIsLoading(false);
      const newRole: Persona = activeTab === 'admin' ? 'MoES Admin' : 'MoES Scientist';
      setPersona(newRole);
      onClose();
    }, 1200);
  };

  const handleDemoLogin = (role: 'scientist' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPersona(role === 'admin' ? 'MoES Admin' : 'MoES Scientist');
      onClose();
    }, 800);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex p-4 sm:p-6 bg-[#0D2735]/40 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="m-auto w-full max-w-4xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row border border-white/20 animate-in zoom-in-[0.97] duration-300 relative overflow-hidden bg-white">
        
        {/* Left Panel - Official Branding */}
        <div className="md:w-[40%] bg-[#0D2735] px-8 py-8 md:py-12 flex flex-col relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#5BB7A5] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center space-x-2 mb-6 md:mb-12">
                <ShieldCheck className="w-6 h-6 text-[#5BB7A5]" />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#5BB7A5] uppercase">Parichay SSO</span>
              </div>
              
              {/* Mobile Close Button */}
              <button 
                onClick={onClose}
                className="md:hidden text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer -mr-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide leading-tight">MoES Authentication Gateway</h2>
              <p className="text-xs md:text-sm text-[#8E8E91] font-medium mt-4 leading-relaxed">
                Secure access portal for the Ministry of Earth Sciences, Govt. of India. Verify your institutional credentials to proceed.
              </p>
            </div>
            
            <div className="hidden md:block mt-auto pt-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#5BB7A5] animate-pulse"></div>
                <span className="text-[10px] font-mono text-white/70 tracking-wide uppercase">Gateway Online & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Flow */}
        <div className="flex-1 flex flex-col bg-white relative">
          
          {/* Desktop Close Button */}
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 text-[#8E8E91] hover:text-[#111111] p-2 rounded-xl hover:bg-[#F4F2EE] transition-colors cursor-pointer z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tabs */}
          <div className="flex bg-[#F4F2EE] p-1.5 mx-6 md:mx-8 mt-6 md:mt-10 md:mr-16 rounded-xl relative z-10 shadow-inner">
            <button
              onClick={() => setActiveTab('scientist')}
              className={`flex-1 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 rounded-lg transition-all ${
                activeTab === 'scientist' 
                  ? 'text-[#111111] bg-white shadow-sm' 
                  : 'text-[#8E8E91] hover:text-[#555558] hover:bg-white/50'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              <span>Scientist</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 rounded-lg transition-all ${
                activeTab === 'admin' 
                  ? 'text-[#111111] bg-white shadow-sm' 
                  : 'text-[#8E8E91] hover:text-[#555558] hover:bg-white/50'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 rounded-lg transition-all ${
                activeTab === 'signup' 
                  ? 'text-[#111111] bg-white shadow-sm' 
                  : 'text-[#8E8E91] hover:text-[#555558] hover:bg-white/50'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Form Body */}
          <div className="px-6 md:px-8 pb-6 md:pb-10 pt-6 relative z-10 flex flex-col justify-center h-full">
            <div className="mb-6 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 flex items-start space-x-3 shadow-inner">
              <Fingerprint className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-xs text-[#1E3A8A] leading-relaxed font-medium">
                {activeTab === 'signup' 
                  ? "Register for MoES access. Requires valid institutional email (.res.in, .gov.in) and PI approval."
                  : "Secure Government of India system. Login via NIC Email, ORCID, or Parichay ID."}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#555558] font-sans uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                    <UserCog className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91] group-focus-within:text-[#0D2735] transition-colors" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Jane Doe"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E0] rounded-xl text-sm focus:outline-none focus:border-[#0D2735] focus:ring-2 focus:ring-[#0D2735]/10 transition-all text-[#111111] shadow-sm hover:border-[#0D2735]/40"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#555558] font-sans uppercase tracking-wider">
                  {activeTab === 'admin' ? 'Administrator ID' : 'Gov.in Email / ORCID'}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91] group-focus-within:text-[#0D2735] transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={activeTab === 'admin' ? "admin.id@moes.gov.in" : "scientist@ncpor.res.in"}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E0] rounded-xl text-sm focus:outline-none focus:border-[#0D2735] focus:ring-2 focus:ring-[#0D2735]/10 transition-all text-[#111111] shadow-sm hover:border-[#0D2735]/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#555558] font-sans uppercase tracking-wider">Password</label>
                  {activeTab !== 'signup' && (
                    <a href="#" className="text-[11px] text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold transition-colors">Forgot Password?</a>
                  )}
                </div>
                <div className="relative group">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E91] group-focus-within:text-[#0D2735] transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6E0] rounded-xl text-sm focus:outline-none focus:border-[#0D2735] focus:ring-2 focus:ring-[#0D2735]/10 transition-all text-[#111111] shadow-sm hover:border-[#0D2735]/40 tracking-[0.2em]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full mt-8 bg-[#0D2735] hover:bg-[#1a3d52] disabled:bg-[#E8E6E0] disabled:text-[#8E8E91] text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{activeTab === 'signup' ? 'Registering...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{activeTab === 'signup' ? 'Submit Registration' : 'Secure Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for easier testing */}
            <div className="mt-6 pt-6 border-t border-[#E8E6E0]">
              <p className="text-[10px] text-center text-[#8E8E91] mb-4 uppercase tracking-widest font-bold">1-Click Demo Login</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => handleDemoLogin('scientist')}
                  className="py-2.5 px-3 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  Simulate Scientist
                </button>
                <button 
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="py-2.5 px-3 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  Simulate Admin
                </button>
              </div>
            </div>

            <div className="mt-8 text-center mt-auto md:mt-8">
              <p className="text-[11px] font-mono font-medium text-[#8E8E91]">
                Powered by National Informatics Centre (NIC)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
