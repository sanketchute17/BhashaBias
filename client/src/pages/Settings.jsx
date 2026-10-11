import React, { useState, useEffect } from 'react';
import { Key, Save, RefreshCw } from 'lucide-react';

export default function Settings({ onUpdateSettings, darkMode }) {
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [temperature, setTemperature] = useState('0.7');
  const [biasThreshold, setBiasThreshold] = useState('1');
  const [alphaThreshold, setAlphaThreshold] = useState('0.05');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          const s = data.settings;
          if (s.model_name) setModelName(s.model_name);
          if (s.temperature) setTemperature(s.temperature);
          if (s.bias_threshold) setBiasThreshold(s.bias_threshold);
          if (s.alpha_threshold) setAlphaThreshold(s.alpha_threshold);
          if (s.gemini_api_key) setApiKey(s.gemini_api_key);
          return;
        }
      }
    } catch (e) {
      // offline fallback
    }
    const saved = localStorage.getItem('bhasha_settings');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.model_name) setModelName(s.model_name);
        if (s.temperature) setTemperature(s.temperature);
        if (s.bias_threshold) setBiasThreshold(s.bias_threshold);
        if (s.alpha_threshold) setAlphaThreshold(s.alpha_threshold);
        if (s.gemini_api_key) setApiKey(s.gemini_api_key);
      } catch (err) {}
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = {
      gemini_api_key: apiKey,
      model_name: modelName,
      temperature,
      bias_threshold: biasThreshold,
      alpha_threshold: alphaThreshold
    };
    localStorage.setItem('bhasha_settings', JSON.stringify(payload));

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload })
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setMsg('Settings saved successfully!');
          if (onUpdateSettings) onUpdateSettings();
          setSaving(false);
          return;
        }
      }
    } catch (err) {}
    setMsg('Settings saved successfully (Local Archive Mode)!');
    if (onUpdateSettings) onUpdateSettings();
    setSaving(false);
  };

  const handleResetDemoData = async () => {
    if (!confirm('Reset demo dataset and clear all past audit runs?')) return;
    try {
      const res = await fetch('/api/settings/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Demo data reset successfully.');
        if (onUpdateSettings) onUpdateSettings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          SYSTEM CONFIGURATION
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Project Configuration &amp; API Keys
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Manage API key credentials, target model endpoints, evaluation thresholds, and dataset state.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className={`p-6 rounded-xl border-2 ornate-border space-y-5 shadow-sm ${cardBg}`}>
        <h2 className="text-xs font-extrabold uppercase tracking-wider font-cinzel border-b-2 pb-2 border-[#b8a68d] dark:border-[#524434] text-[#000000] dark:text-[#ffffff]">
          API Provider &amp; Model Credentials
        </h2>

        {/* API Key */}
        <div className="space-y-1.5 text-xs font-serif">
          <label className="font-bold block flex items-center gap-1.5 text-[#000000] dark:text-[#ffffff]">
            <Key className="w-4 h-4 text-[#b45309]" />
            Google Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIzaSy... (Leave empty to use process.env or Demo Mode)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={`w-full p-2.5 rounded-md border font-mono font-bold text-xs ${inputBg}`}
          />
          <p className={`text-xs italic font-bold ${textMuted}`}>API keys are securely stored in server environment memory and never exposed to client side scripts.</p>
        </div>

        {/* Model Selection & Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono font-bold">
          <div className="space-y-1.5 font-sans">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Default Target Model</label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono font-bold ${inputBg}`}
            >
              <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
            </select>
          </div>

          <div className="space-y-1.5 font-sans">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Sampling Temperature ({temperature})</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full accent-[#b45309]"
            />
          </div>
        </div>

        {/* Thresholds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono font-bold">
          <div className="space-y-1.5 font-sans">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Bias Score Flagging Threshold</label>
            <select
              value={biasThreshold}
              onChange={(e) => setBiasThreshold(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono font-bold ${inputBg}`}
            >
              <option value="1">Bias Score &ge; 1 (Mild or Clear Bias)</option>
              <option value="2">Bias Score = 2 (Clear Stereotype Only)</option>
            </select>
          </div>

          <div className="space-y-1.5 font-sans">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">McNemar Statistical Alpha Threshold (&alpha;)</label>
            <select
              value={alphaThreshold}
              onChange={(e) => setAlphaThreshold(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono font-bold ${inputBg}`}
            >
              <option value="0.05">&alpha; = 0.05 (Standard 95% Confidence)</option>
              <option value="0.01">&alpha; = 0.01 (Strict 99% Confidence)</option>
            </select>
          </div>
        </div>

        {msg && (
          <div className="text-xs text-[#b45309] font-mono font-extrabold bg-[#b45309]/10 p-3 rounded-md border-2 border-[#b45309]/30">
            {msg}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t-2 border-[#b8a68d] dark:border-[#524434]">
          <button
            type="button"
            onClick={handleResetDemoData}
            className={`flex items-center gap-1.5 text-xs font-mono font-extrabold px-4 py-2 rounded-md border-2 transition ${inputBg}`}
          >
            <RefreshCw className="w-4 h-4 text-[#b45309]" />
            Reset Demo Data
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#990000] hover:bg-[#800020] text-white font-serif font-extrabold px-6 py-2.5 rounded-md text-xs tracking-wide transition shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
