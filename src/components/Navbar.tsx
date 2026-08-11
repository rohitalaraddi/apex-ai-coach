'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Activity,
  Bot,
  Calendar,
  HeartPulse,
  LineChart,
  Trophy,
  FileText,
  UploadCloud,
  LayoutDashboard,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BatteryCharging,
  SlidersHorizontal,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'syncing' | 'success' | 'error'; message: string } | null>(null);

  const handleLiveSync = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus({ type: 'syncing', message: '⚡ Fetching real-time Garmin Connect data...' });

      const res = await fetch('/api/garmin/live-sync', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setSyncStatus({ type: 'success', message: '✓ Garmin Data Synchronized! Reloading...' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSyncStatus({ type: 'error', message: `⚠️ Sync notice: ${data.error || 'Please retry in a moment'}` });
        setTimeout(() => setSyncStatus(null), 5000);
      }
    } catch (e) {
      console.error(e);
      setSyncStatus({ type: 'error', message: '⚠️ Connection timeout. Page will auto-refresh.' });
      setTimeout(() => setSyncStatus(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'AI Coach', href: '/coach', icon: Bot, badge: 'Flagship' },
    { label: 'Health Monitor', href: '/health', icon: HeartPulse },
    { label: 'Strain & Workouts', href: '/activities', icon: Activity },
    { label: 'Plan & Roadmap', href: '/training', icon: Calendar },
    { label: 'Performance & PRs', href: '/performance', icon: LineChart },
    { label: 'Goals', href: '/goals', icon: Trophy },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Sync Device', href: '/import', icon: UploadCloud },
  ];

  return (
    <header className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8 bg-[#121619]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* FLOATING SYNC TOAST NOTIFICATION */}
      {syncStatus && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-full shadow-2xl border flex items-center space-x-2 text-xs font-bold transition-all ${
            syncStatus.type === 'syncing'
              ? 'bg-blue-950 text-cyan-300 border-cyan-500/50 animate-pulse'
              : syncStatus.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
              : 'bg-amber-950 text-amber-300 border-amber-500/50'
          }`}
        >
          {syncStatus.type === 'syncing' && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
          {syncStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {syncStatus.type === 'error' && <AlertCircle className="w-4 h-4 text-amber-400" />}
          <span>{syncStatus.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Garmin Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#121619] rounded-[14px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-widest text-white font-mono">
                GARMIN
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-wider">
                APEX AI
              </span>
            </div>
            <p className="text-[9px] text-slate-400 tracking-wider font-semibold uppercase">
              Endurance & Health Intelligence
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#1c2126] p-1.5 rounded-full border border-slate-800">
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Battery & Sync Controls */}
        <div className="flex items-center space-x-3">
          {/* Garmin Connection Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1c2126] border border-slate-800 text-[11px] font-mono text-slate-300">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white">84%</span>
            <span className="text-emerald-400 text-[9px] font-bold">GARMIN SYNCED</span>
          </div>

          <button
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Fetch live authentic metrics directly from Garmin Connect"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-white' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Garmin Connect Now'}</span>
            <span className="sm:hidden">{isSyncing ? 'Syncing' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex lg:hidden items-center space-x-1 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80 mt-2 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
