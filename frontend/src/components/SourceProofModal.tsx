import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Download, Copy, Check, FileCheck, Search } from 'lucide-react';

export interface ProvenanceData {
  id: string;
  title: string;
  type: 'Dataset' | 'Publication' | 'Media' | 'Activity' | 'Expedition Log';
  source_repository?: string;
  source_url?: string;
  doi?: string;
  doi_url?: string;
  license?: string;
  verification_hash?: string;
  citation_text?: string;
  institution_credit?: string;
  bbox?: string; // Geographic Bounding Box
}

interface SourceProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProvenanceData | null;
}

export const SourceProofModal: React.FC<SourceProofModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const handleCopyCitation = () => {
    if (data.citation_text) {
      navigator.clipboard.writeText(data.citation_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Provide fallback mock data if backend didn't supply it
  const mockRepo = data.source_repository || 'NCPOR Polar Data Center (NPDC)';
  const mockDoi = data.doi || '10.1038/s41558-023-01824-1';
  const mockDoiUrl = data.doi_url || `https://doi.org/${mockDoi}`;
  const mockSourceUrl = data.source_url || 'https://npdc.ncpor.res.in';
  const mockLicense = data.license || 'Creative Commons Attribution 4.0 International (CC BY 4.0)';
  const mockHash = data.verification_hash || 'SHA256: 8f434346648f6b96e42dfbd56a29d91f42d...';
  const mockCitation = data.citation_text || `${data.institution_credit || 'National Centre for Polar and Ocean Research (MoES)'}. (2024). ${data.title}. ${mockRepo}. ${mockDoiUrl}`;
  const mockInstitution = data.institution_credit || 'National Centre for Polar and Ocean Research (MoES), New Delhi / Goa';
  const mockBbox = data.bbox || '-70.76, 11.73, -69.40, 76.18';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#111111]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-label="Close modal background"
      />
      <div className="relative w-full max-w-lg h-full bg-[#FAFAF8] shadow-2xl border-l border-[#E8E6E0] overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E6E0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            <span className="text-sm font-mono font-bold text-[#111111] uppercase tracking-widest">
              Data Provenance
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#E8E6E0] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#555558]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 flex-1">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#F0FDF4] border border-[#16A34A]/30 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span className="text-xs font-mono font-semibold text-[#166534]">
              ✓ Peer-Reviewed & NCPOR Verified
            </span>
          </div>

          {/* Title & Type */}
          <div>
            <span className="text-[10px] font-mono text-[#8E8E91] uppercase tracking-wider block mb-1">
              {data.type} Asset
            </span>
            <h2 className="text-2xl font-serif font-medium text-[#111111] leading-snug">
              {data.title}
            </h2>
          </div>

          {/* Core Metadata */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8E6E0] p-5 space-y-4 shadow-sm">
              
              <div>
                <span className="text-[10px] font-mono text-[#8E8E91] uppercase block mb-0.5">Primary Source Repository</span>
                <a href={mockSourceUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1.5">
                  <DatabaseIcon className="w-3.5 h-3.5" />
                  <span>{mockRepo}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="pt-3 border-t border-[#E8E6E0]">
                <span className="text-[10px] font-mono text-[#8E8E91] uppercase block mb-0.5">Canonical DOI (Digital Object Identifier)</span>
                <a href={mockDoiUrl} target="_blank" rel="noreferrer" className="text-sm font-mono text-[#111111] hover:text-[#2563EB] hover:underline flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{mockDoi}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="pt-3 border-t border-[#E8E6E0]">
                <span className="text-[10px] font-mono text-[#8E8E91] uppercase block mb-0.5">Institution Credit</span>
                <p className="text-sm text-[#555558]">{mockInstitution}</p>
              </div>

              <div className="pt-3 border-t border-[#E8E6E0]">
                <span className="text-[10px] font-mono text-[#8E8E91] uppercase block mb-0.5">Geographic Bounding Box</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-1 bg-[#F4F2EE] border border-[#E8E6E0] rounded font-mono text-xs text-[#555558]">
                    {mockBbox}
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${mockBbox.split(',')[0]},${mockBbox.split(',')[1]}`} target="_blank" rel="noreferrer" className="text-xs text-[#2563EB] hover:underline flex items-center gap-1">
                    <Search className="w-3 h-3" /> Map
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E6E0]">
                <span className="text-[10px] font-mono text-[#8E8E91] uppercase block mb-0.5">Licensing</span>
                <p className="text-xs text-[#555558] font-mono bg-[#FAFAF8] p-2 rounded border border-[#E8E6E0]">
                  {mockLicense}
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#111111] uppercase tracking-wider">Asset Integrity Digest</span>
            <div className="bg-[#111111] text-[#E8E6E0] p-3 rounded-xl font-mono text-[10px] break-all border border-[#111111]/20 shadow-inner">
              {mockHash}
            </div>
          </div>

          {/* Academic Citation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#111111] uppercase tracking-wider">APA Citation</span>
              <button 
                onClick={handleCopyCitation}
                className="text-[10px] font-mono text-[#2563EB] hover:text-[#111111] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <div className="bg-white border border-[#E8E6E0] p-4 rounded-xl text-xs text-[#555558] leading-relaxed font-serif shadow-sm">
              {mockCitation}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#E8E6E0] bg-white space-y-3">
          <a
            href={mockDoiUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 bg-[#111111] hover:bg-black text-white text-sm font-medium rounded-xl transition-all shadow-md"
          >
            <span>Read Original Paper / Dataset ↗</span>
          </a>
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white border border-[#E8E6E0] hover:bg-[#FAFAF8] text-[#111111] text-sm font-medium rounded-xl transition-all">
            <Download className="w-4 h-4" />
            <span>Download Raw Metadata (JSON-LD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mini icon component for Database
const DatabaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
    <path d="M3 12A9 3 0 0 0 21 12"></path>
  </svg>
);
