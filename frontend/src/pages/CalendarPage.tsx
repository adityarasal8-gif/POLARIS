import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Calendar, FileText, ArrowLeft, Plus } from 'lucide-react';
import { fetchContentCalendar } from '../api';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const CalendarPage: React.FC = () => {
  const [scheduledItems, setScheduledItems] = useState<any[]>([]);

  useEffect(() => {
    fetchContentCalendar().then(setScheduledItems).catch(console.error);
  }, []);

  const DAYS = [
    { day: 'Monday', date: 'Oct 12' },
    { day: 'Tuesday', date: 'Oct 13' },
    { day: 'Wednesday', date: 'Oct 14' },
    { day: 'Thursday', date: 'Oct 15' },
    { day: 'Friday', date: 'Oct 16' },
  ];


  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'x': return <TwitterIcon className="w-3.5 h-3.5 text-[#111111]" />;
      case 'linkedin': return <LinkedinIcon className="w-3.5 h-3.5 text-[#0077B5]" />;
      case 'youtube': return <YoutubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />;
      default: return <FileText className="w-3.5 h-3.5 text-[#111111]" />;
    }
  };

  const processedItems = scheduledItems.map((item, i) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['10:00 AM', '02:30 PM', '11:15 AM', '04:00 PM', '06:00 PM'];
    const platforms = ['instagram', 'website', 'linkedin', 'x', 'youtube'];
    return {
      id: item.id,
      day: days[i % 5],
      time: times[i % 5],
      title: item.title,
      platform: platforms[i % 5],
      status: item.status,
      source: item.source_type
    };
  });

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <Link href="/studio" className="inline-flex items-center gap-2 text-xs font-mono text-[#555558] hover:text-[#111111] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Content Studio</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6E0] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#555558] bg-[#F4F2EE] px-3 py-1 rounded-full border border-[#E8E6E0] font-medium tracking-wide uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#111111]" />
              <span>Dissemination Governance</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-medium">
              Public Release Calendar
            </h1>
            <p className="text-xs sm:text-sm text-[#555558] font-light">
              Verified scheduled public communications across social feeds and web releases.
            </p>
          </div>

          <Link
            href="/studio"
            className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Post</span>
          </Link>
        </div>

        {/* 5-Day Editorial Board Grid (Mon - Fri) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map((d) => {
            const itemsForDay = processedItems.filter((item) => item.day === d.day);
            return (
              <div key={d.day} className="border border-[#E8E6E0] rounded-2xl bg-white p-4 flex flex-col justify-between min-h-[380px] shadow-sm">
                <div>
                  <div className="border-b border-[#E8E6E0] pb-2 mb-3">
                    <h3 className="text-xs font-bold text-[#111111] uppercase font-mono tracking-wider">{d.day}</h3>
                    <p className="text-xs text-[#8E8E91] font-mono">{d.date}</p>
                  </div>

                  <div className="space-y-2.5">
                    {itemsForDay.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E6E0] space-y-2 hover:border-[#111111]/30 transition-all"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#8E8E91]">{item.time}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${
                            item.status === 'Approved' ? 'bg-[#F4F2EE] text-[#16A34A] border-[#16A34A]/20' : 'bg-[#F4F2EE] text-[#111111] border-[#E8E6E0]'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 shrink-0">{getPlatformIcon(item.platform)}</div>
                          <h4 className="text-xs font-semibold text-[#111111] leading-snug">{item.title}</h4>
                        </div>

                        <div className="text-[10px] text-[#8E8E91] font-mono truncate uppercase">
                          Ref: {item.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E6E0] text-center">
                  <span className="text-[10px] font-mono text-[#8E8E91]">
                    {itemsForDay.length} Scheduled Dispatches
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
