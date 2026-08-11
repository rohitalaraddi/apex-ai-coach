'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FileText, Mail, Download, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const [emailData, setEmailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMorningEmail = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/morning-email');
      const json = await res.json();
      setEmailData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMorningEmail();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Mail className="w-6 h-6 text-cyan-400" />
              <span>Automated Daily Morning Email & Reports</span>
            </h1>
            <p className="text-xs text-slate-400">Scheduled 6:00 AM readiness reports and weekly performance reviews</p>
          </div>

          <button
            onClick={fetchMorningEmail}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate Today's 6:00 AM Email</span>
          </button>
        </div>

        {/* Email Preview Container */}
        {emailData?.htmlContent ? (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Target Delivery: 6:00 AM Local Time
                </span>
                <h3 className="text-sm font-bold text-white">{emailData.emailSubject}</h3>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800">
              <iframe
                srcDoc={emailData.htmlContent}
                title="Morning Email Preview"
                className="w-full h-[650px] bg-slate-900"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm">
            Click "Generate Today's 6:00 AM Email" to preview the email payload.
          </div>
        )}
      </main>
    </div>
  );
}
