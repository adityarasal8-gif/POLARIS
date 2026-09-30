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

  const SCHEDULED_DEMO = [
    {
      id: 'sch_1',
      day: 'Monday',
      time: '10:00 AM',
      title: '45th ISEA Mission Kickoff Press Release',
      platform: 'website',
      status: 'Approved',
      source: 'Expedition Charter'
    },
    {
      id: 'sch_2',
      day: 'Tuesday',
      time: '02:30 PM',
      title: 'IndArc Arctic Mooring Telemetry Highlights',
      platform: 'instagram',
      status: 'Scheduled',
      source: 'NPDC-ARCT-2025-01'
    },
    {
      id: 'sch_3',
      day: 'Wednesday',
      time: '11:15 AM',
      title: 'Chhota Shigri Mass Balance Annual Report',
      platform: 'linkedin',
      status: 'Scheduled',
      source: 'Himalayan Cryosphere Wing'
    },
    {
      id: 'sch_4',
      day: 'Thursday',
      time: '04:00 PM',
      title: 'Southern Ocean Bio-Argo Float Deployments',
      platform: 'x',
      status: 'Approved',
      source: '12th SOE Voyage'
    },
    {
      id: 'sch_5',
      day: 'Friday',
      time: '06:00 PM',
      title: 'Wintering Over at Himadri: Polar Documentary',
      platform: 'youtube',
      status: 'Scheduled',
      source: 'NCPOR Outreach Video'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />;
      case 'x': return <TwitterIcon className="w-3.5 h-3.5 text-[#1DA1F2]" />;
      case 'linkedin': return <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />;
      case 'youtube': return <YoutubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />;
      default: return <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#071A2B] text-white py-10 px-4 sm:px-6 lg:px-8 polar-grid-bg text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <Link href="/studio" className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AI Content Studio</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#6EC5E9]/15 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#38BDF8] font-bold tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <span>EDITORIAL GOVERNANCE</span>
            </div>
            <h1 className="text-3xl font-black text-white">Outreach Dissemination Calendar</h1>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Verified scheduled public communications across social feeds and web press releases.
            </p>
          </div>

          <Link
            href="/studio"
            className="px-4 py-2 rounded-xl bg-[#22C7A8] hover:bg-[#1fb396] text-[#071A2B] font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Post</span>
          </Link>
        </div>

        {/* 5-Day Editorial Board Grid (Mon - Fri) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map((d) => {
            const itemsForDay = SCHEDULED_DEMO.filter((item) => item.day === d.day);
            return (
              <div key={d.day} className="polar-panel p-4 border border-[#6EC5E9]/15 flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="border-b border-[#6EC5E9]/15 pb-2 mb-3">
                    <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">{d.day}</h3>
                    <p className="text-[11px] text-[#38BDF8] font-mono">{d.date}</p>
                  </div>

                  <div className="space-y-3">
                    {itemsForDay.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-[#071A2B] border border-[#6EC5E9]/20 space-y-2 hover:border-[#38BDF8]/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#94A3B8]">{item.time}</span>
                          <span className="badge-live px-1.5 py-0.2 rounded font-semibold">
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="mt-0.5">{getPlatformIcon(item.platform)}</div>
                          <h4 className="text-xs font-semibold text-white leading-snug">{item.title}</h4>
                        </div>

                        <div className="text-[10px] text-[#647887] font-mono truncate">
                          Ref: {item.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#6EC5E9]/10 text-center">
                  <span className="text-[10px] font-mono text-[#647887]">
                    {itemsForDay.length} Scheduled
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
