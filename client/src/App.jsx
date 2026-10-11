import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  Database,
  FileText,
  UserCheck,
  Bot,
  AlertTriangle,
  GitCompare,
  BarChart3,
  ShieldCheck,
  TrendingDown,
  Code,
  FileSpreadsheet,
  BookOpen,
  Settings as SettingsIcon,
  CheckSquare,
  Sun,
  Moon,
  Clock,
  Calendar,
  Sparkles,
  Plus,
  Home
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import Dashboard from './pages/Dashboard';
import AuditEngine from './pages/AuditEngine';
import Scenarios from './pages/Scenarios';
import Responses from './pages/Responses';
import HumanEval from './pages/HumanEval';
import AutoEval from './pages/AutoEval';
import CaseEvidence from './pages/CaseEvidence';
import LangComparison from './pages/LangComparison';
import Statistics from './pages/Statistics';
import Mitigation from './pages/Mitigation';
import BeforeAfter from './pages/BeforeAfter';
import Reproduction from './pages/Reproduction';
import ReportGenerator from './pages/ReportGenerator';
import References from './pages/References';
import Settings from './pages/Settings';
import Checklist from './pages/Checklist';

export default function App() {
  const [viewMode, setViewMode] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isDemo, setIsDemo] = useState(true);
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [latestAuditDate, setLatestAuditDate] = useState('23 Aug 2026, 11:10 PM');

  // Day / Night Mode state (defaults to Day mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('bhasha_theme');
    return saved ? saved === 'night' : false;
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setIsDemo(!data.settings.has_api_key);
        if (data.settings.model_name) setModelName(data.settings.model_name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = (isDark) => {
    setDarkMode(isDark);
    localStorage.setItem('bhasha_theme', isDark ? 'night' : 'day');
  };

  const navGroups = [
    {
      group: 'RESEARCH',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'audit', label: 'Audit Engine', icon: PlayCircle },
        { id: 'scenarios', label: 'Scenarios', icon: Database },
        { id: 'responses', label: 'Responses', icon: FileText },
        { id: 'evidence', label: 'Case Evidence', icon: AlertTriangle },
      ]
    },
    {
      group: 'EVALUATION',
      items: [
        { id: 'human-eval', label: 'Human Evaluation', icon: UserCheck },
        { id: 'auto-eval', label: 'Automated Evaluation', icon: Bot },
        { id: 'comparison', label: 'Language Comparison', icon: GitCompare },
        { id: 'statistics', label: 'Statistics', icon: BarChart3 },
      ]
    },
    {
      group: 'MITIGATION',
      items: [
        { id: 'mitigation', label: 'Mitigation', icon: ShieldCheck },
        { id: 'before-after', label: 'Before vs After', icon: TrendingDown },
      ]
    },
    {
      group: 'DOCUMENTATION',
      items: [
        { id: 'reproduction', label: 'Reproduction Code', icon: Code },
        { id: 'report', label: 'Academic Report', icon: FileSpreadsheet },
        { id: 'references', label: 'References', icon: BookOpen },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
        { id: 'checklist', label: 'Benchmark Checklist', icon: CheckSquare },
      ]
    }
  ];

  const themeClass = darkMode ? 'theme-night bg-[#12100e] text-[#ffffff]' : 'theme-day bg-[#f4eee1] text-[#000000]';

  return (
    <div className={`min-h-screen ${themeClass}`}>
      {/* Render Landing Page View or Dashboard View */}
      {viewMode === 'landing' ? (
        <LandingPage
          onProceed={() => setViewMode('dashboard')}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        /* EXISTING DASHBOARD WORKSPACE */
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-[#1c120c] text-[#e5c396] border-r border-[#524434] flex flex-col justify-between shrink-0 select-none shadow-2xl z-20">
            <div>
              {/* Logo Emblem */}
              <div className="p-4 text-center border-b border-[#524434] space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full border-2 border-[#e5c396] flex items-center justify-center bg-[#100a06] shadow-inner">
                  <svg className="w-7 h-7 text-[#e5c396]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 7v2h18V7l-9-5zm-7 9v8h2v-8H5zm4 0v8h2v-8H9zm4 0v8h2v-8h-2zm4 0v8h2v-8h-2zM2 20v2h20v-2H2z" />
                  </svg>
                </div>
                <h1 className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#e5c396] uppercase">
                  RESPONSIBLE AI LAB
                </h1>
              </div>

              {/* Grouped Navigation Links */}
              <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] text-xs font-serif">
                {navGroups.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="px-2 text-[11px] font-cinzel font-extrabold tracking-[0.15em] text-[#e5c396] uppercase">
                      {group.group}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition font-medium ${
                            isActive
                              ? 'bg-[#ffffff] text-[#1c120c] font-bold shadow-md border-2 border-[#e5c396]'
                              : 'text-[#f5e6d3] hover:bg-[#34251b] hover:text-[#ffffff]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#990000]' : 'text-[#e5c396]'}`} />
                          <span className="font-serif text-xs">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom DATA MODE Box */}
            <div className="p-3 border-t border-[#524434] bg-[#100a06]">
              <div className="border-2 border-[#e5c396] rounded p-2 text-center space-y-1 bg-[#1a120b]">
                <div className="text-[10px] font-cinzel font-extrabold uppercase tracking-[0.2em] text-[#e5c396]">
                  DATA MODE
                </div>
                <div className={`text-xs font-mono font-extrabold flex items-center justify-center gap-1.5 ${
                  isDemo ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  <span className="text-lg leading-none">•</span>
                  {isDemo ? 'DEMO DATA' : 'REAL DATA'}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Workplace */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header Container */}
            <header className={`px-6 py-4 border-b ${
              darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#faf5ea] border-[#b8a68d]'
            }`}>
              {/* Header Top Row */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-3">
                  {/* Return to Home / Landing Page Button */}
                  <button
                    onClick={() => setViewMode('landing')}
                    className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#b45309] hover:underline"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </button>
                  <span className="text-[#b8a68d]">|</span>
                  <span className="font-cinzel text-xs font-extrabold tracking-[0.15em] text-[#990000] uppercase">
                    RESPONSIBLE AI AUDIT SUITE
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* Date & Time */}
                  <div className={`flex items-center gap-4 text-xs font-extrabold ${
                    darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#b45309]" />
                      23 Aug 2026
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#b45309]" />
                      11:16 PM
                    </span>
                  </div>

                  {/* Day / Night Switcher */}
                  <div className="flex items-center border-2 border-[#785a3c] rounded-md overflow-hidden text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
                    <button
                      onClick={() => toggleTheme(false)}
                      className={`px-3 py-1 flex items-center gap-1 transition ${
                        !darkMode ? 'bg-[#1c120c] text-[#e5c396]' : 'bg-transparent text-[#27272a]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      DAY MODE
                    </button>
                    <button
                      onClick={() => toggleTheme(true)}
                      className={`px-3 py-1 flex items-center gap-1 transition ${
                        darkMode ? 'bg-[#1c120c] text-[#e5c396]' : 'bg-transparent text-[#27272a]'
                      }`}
                    >
                      NIGHT MODE
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Metadata Panel */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                <div>
                  <h1 className={`font-cinzel text-3xl md:text-4xl font-black tracking-tight uppercase ${
                    darkMode ? 'text-[#ffffff]' : 'text-[#000000]'
                  }`}>
                    BHASHA BIAS AUDIT
                  </h1>
                  <div className={`flex items-center gap-2 text-xs font-extrabold mt-1 font-serif ${
                    darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                  }`}>
                    <span>─── ∞ Multilingual AI Bias Audit ∞ ───</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-serif italic mt-0.5 font-black ${
                    darkMode ? 'text-[#fbbf24]' : 'text-[#990000]'
                  }`}>
                    <span>─── English • Hindi • Hinglish ───</span>
                  </div>
                </div>

                {/* Metadata Panel */}
                <div className={`p-3.5 rounded-lg border-2 text-xs font-serif min-w-[300px] space-y-1.5 shadow-sm ${
                  darkMode ? 'bg-[#12100e] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-extrabold flex items-center gap-1 ${
                      darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                    }`}>
                      <Plus className="w-3.5 h-3.5 text-[#b45309]" /> Model:
                    </span>
                    <span className={`font-mono font-extrabold ${
                      darkMode ? 'text-[#ffffff]' : 'text-[#000000]'
                    }`}>{modelName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-extrabold flex items-center gap-1 ${
                      darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                    }`}>
                      <FileText className="w-3.5 h-3.5 text-[#b45309]" /> Latest Audit:
                    </span>
                    <span className={`font-mono font-extrabold ${
                      darkMode ? 'text-[#ffffff]' : 'text-[#000000]'
                    }`}>{latestAuditDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-extrabold flex items-center gap-1 ${
                      darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                    }`}>
                      <Database className="w-3.5 h-3.5 text-[#b45309]" /> Dataset:
                    </span>
                    <span className={`font-mono font-extrabold ${
                      darkMode ? 'text-[#ffffff]' : 'text-[#000000]'
                    }`}>Default v1.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-extrabold flex items-center gap-1 ${
                      darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 text-[#b45309]" /> Evaluation:
                    </span>
                    <span className={`font-mono font-extrabold ${
                      darkMode ? 'text-[#ffffff]' : 'text-[#000000]'
                    }`}>Human + LLM Assisted</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dynamic Page Workspace */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} darkMode={darkMode} />}
              {activeTab === 'audit' && <AuditEngine darkMode={darkMode} />}
              {activeTab === 'scenarios' && <Scenarios darkMode={darkMode} />}
              {activeTab === 'responses' && <Responses darkMode={darkMode} />}
              {activeTab === 'human-eval' && <HumanEval darkMode={darkMode} />}
              {activeTab === 'auto-eval' && <AutoEval darkMode={darkMode} />}
              {activeTab === 'evidence' && <CaseEvidence darkMode={darkMode} />}
              {activeTab === 'comparison' && <LangComparison darkMode={darkMode} />}
              {activeTab === 'statistics' && <Statistics darkMode={darkMode} />}
              {activeTab === 'mitigation' && <Mitigation darkMode={darkMode} />}
              {activeTab === 'before-after' && <BeforeAfter darkMode={darkMode} />}
              {activeTab === 'reproduction' && <Reproduction darkMode={darkMode} />}
              {activeTab === 'report' && <ReportGenerator darkMode={darkMode} />}
              {activeTab === 'references' && <References darkMode={darkMode} />}
              {activeTab === 'settings' && <Settings onUpdateSettings={fetchSettings} darkMode={darkMode} />}
              {activeTab === 'checklist' && <Checklist darkMode={darkMode} />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
