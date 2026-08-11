'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import {
  Bot,
  Send,
  Zap,
  Sparkles,
  LineChart,
  X,
  CheckCircle2,
  Activity,
  Heart,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  groundedMetrics?: any;
}

/**
 * Markdown Formatter Component — Eliminates raw # and * symbols, rendering crisp styled HTML
 */
function FormattedMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={idx} className="h-1.5" />);
      return;
    }

    // 1. H3 (###)
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '');
      elements.push(
        <div key={idx} className="my-2.5 p-2.5 rounded-2xl bg-blue-50/90 border border-blue-200/80 flex items-center space-x-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <h3 className="text-xs font-black text-blue-900 tracking-wide uppercase">{headingText}</h3>
        </div>
      );
      return;
    }

    // 2. H4 (####)
    if (trimmed.startsWith('#### ')) {
      const headingText = trimmed.replace(/^####\s+/, '').replace(/\*\*/g, '');
      elements.push(
        <h4 key={idx} className="text-xs font-extrabold text-slate-800 my-2 pt-1 flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          <span>{headingText}</span>
        </h4>
      );
      return;
    }

    // 3. Blockquotes (> )
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s+/, '');
      elements.push(
        <div key={idx} className="my-2 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border-l-4 border-blue-600 text-xs text-blue-950 font-semibold shadow-sm">
          {parseInlineFormatting(quoteText)}
        </div>
      );
      return;
    }

    // 4. Bullet points (* or - or numbered 1.)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const bulletText = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start space-x-2 my-1 pl-1 text-xs text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
          <div className="flex-1">{parseInlineFormatting(bulletText)}</div>
        </div>
      );
      return;
    }

    // 5. Default Paragraph
    elements.push(
      <p key={idx} className="text-xs text-slate-700 leading-relaxed my-1">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
}

function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-extrabold text-slate-900 bg-blue-100/70 px-1.5 py-0.5 rounded text-[11px]">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

export default function AiCoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `### 👋 Welcome to Apex AI Coach

I am your personal 20-year veteran AI endurance coach. I have full access to your **Garmin health metrics**, **nightly HRV trends**, **training load balance (ACWR)**, **sleep composition**, and **27-week macrocycle roadmap**.

**How can I assist your training today?** You can ask me questions like:
- *"What is my training plan for today?"*
- *"Am I recovered enough for intervals tomorrow?"*
- *"Predict my marathon finish time based on my training."*
- *"How should I fuel for my 50k ultra in Lonavala?"*`,
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [selectedChartModal, setSelectedChartModal] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchContext = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setContext(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputMsg;
    if (!textToSend.trim() || isSending) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = { id: userMessageId, role: 'user', content: textToSend };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputMsg('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: data.messageId || `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        groundedMetrics: data.groundedMetrics,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while connecting to Apex AI reasoning engine.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    'What is my training plan for today?',
    'Am I ready for intervals tomorrow?',
    'How should I fuel for my 50k ultra in Lonavala?',
    'Predict my marathon finish time',
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE: QUICK PROMPTS & INGESTION */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Suggested Queries</span>
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isSending}
                  className="w-full text-left p-3 rounded-2xl bg-white hover:bg-blue-50/80 border border-slate-200/80 text-xs text-slate-800 font-semibold transition-all hover:border-blue-400 hover:shadow-sm"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Garmin Ingestion Status
            </h3>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Garmin Data Active (Synced)</span>
            </div>
          </div>
        </aside>

        {/* CENTER PANE: CHAT INTERFACE */}
        <section className="lg:col-span-6 flex flex-col h-[78vh] glass-card overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white/90 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">Apex AI Coach</h2>
                <p className="text-[10px] text-slate-500 font-medium">20-Year Master Ultra Coach • Grounded in Garmin Data</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedChartModal('hrv')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 transition-all"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Show me the data</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-3xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-semibold rounded-tr-none shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm rounded-tl-none space-y-2'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <FormattedMarkdown content={msg.content} />
                  )}

                  {msg.groundedMetrics && (
                    <div className="pt-2.5 border-t border-slate-100 mt-2 flex flex-wrap gap-2 text-[10px]">
                      {msg.groundedMetrics.readinessScore && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          Readiness: {msg.groundedMetrics.readinessScore}/100
                        </span>
                      )}
                      {msg.groundedMetrics.hrv && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          HRV: {msg.groundedMetrics.hrv}
                        </span>
                      )}
                      {msg.groundedMetrics.trainingLoad && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          {msg.groundedMetrics.trainingLoad}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center space-x-2 text-xs text-blue-600 p-2 font-semibold">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
                <span>Apex AI Coach is analyzing physiological context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 border-t border-slate-200/80 bg-white/90 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask your coach about training, recovery, HR, or marathon targets..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !inputMsg.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </section>

        {/* RIGHT PANE: LIVE CONTEXT DRAWER */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Live Coach Context</span>
            </h3>

            {context ? (
              <div className="space-y-3 text-xs">
                {/* Readiness Box */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] font-semibold">Readiness Score</div>
                    <div className="text-2xl font-black text-slate-900">{context.readiness?.score}/100</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px]">
                    {context.readiness?.status}
                  </span>
                </div>

                {/* Training Load */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="flex justify-between text-slate-500 text-[10px] font-semibold">
                    <span>ACWR Ratio</span>
                    <span className="text-amber-600 font-black">{context.trainingLoad?.acwr}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    ATL: {context.trainingLoad?.atl} | CTL: {context.trainingLoad?.ctl}
                  </div>
                </div>

                {/* Active Goal */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Active Target Goal</div>
                  <div className="font-extrabold text-slate-900">Tata Ultra Lonavala 50K</div>
                  <div className="text-[10px] text-blue-600 font-bold">
                    Target: Sub-6:00 Ultra (Feb 17, 2027)
                  </div>
                </div>

                {/* Recent Run */}
                {context.recentActivities?.[0] && (
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Latest Garmin Session</div>
                    <div className="font-extrabold text-slate-800">{context.recentActivities[0].title}</div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {(context.recentActivities[0].distance / 1000).toFixed(1)} km • Avg HR {context.recentActivities[0].avgHr} bpm
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500">Loading context...</div>
            )}
          </div>
        </aside>
      </main>

      {/* Chart Data Modal */}
      {selectedChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <LineChart className="w-4 h-4 text-blue-600" />
                <span>Physiological Trend Analysis (30-Day HRV & Readiness)</span>
              </h3>
              <button onClick={() => setSelectedChartModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={context?.healthHistory?.map((h: any) => ({
                    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    hrv: h.hrvNightlyAvg,
                    baseline: 68,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[50, 85]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '1rem' }} />
                  <Area type="monotone" dataKey="hrv" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
