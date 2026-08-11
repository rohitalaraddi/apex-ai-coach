'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/garmin/ingest', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Successfully ingested activity "${data.activity.title}"!` });
        setFile(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error uploading file' });
    } finally {
      setUploading(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      setIsSeeding(true);
      setMessage(null);
      const res = await fetch('/api/garmin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '30 Days of realistic synthetic Garmin health & activity data successfully generated!' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Seeding failed' });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <UploadCloud className="w-6 h-6 text-cyan-400" />
            <span>Garmin Data Ingestion & Import</span>
          </h1>
          <p className="text-xs text-slate-400">
            Legal & secure file import (.GPX, .TCX, .FIT, .JSON) or synthetic demo generator
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/10 text-red-300 border-red-500/30'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* File Uploader Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Upload Garmin Activity File</span>
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".gpx,.tcx,.json,.fit"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="garmin-file-input"
              />
              <label htmlFor="garmin-file-input" className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-200">
                  {file ? file.name : 'Click or Drag & Drop .GPX, .TCX, or .JSON files'}
                </div>
                <div className="text-[10px] text-slate-400">Supports Garmin Connect activity exports</div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <span>{uploading ? 'Parsing & Ingesting...' : 'Upload & Process Activity'}</span>
            </button>
          </form>
        </div>

        {/* Demo Seed Generator Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Instant Synthetic Demo Data Generator</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instantly populates 30 days of realistic Garmin data (sleep scores, nightly HRV baseline, resting HR, body battery, activities with lap splits, cadence, and running dynamics) for testing without waiting for Garmin file downloads.
          </p>
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-2 border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Synthesizing Data...' : 'Generate 30 Days of Synthetic Garmin Data'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
