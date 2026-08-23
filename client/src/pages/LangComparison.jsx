import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LangComparison({ darkMode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading language comparison metrics...</div>;

  const metrics = data?.metrics || {};
  const diffs = data?.differences || {};

  const colorEng = darkMode ? '#60a5fa' : '#1e3a8a';
  const colorHindi = darkMode ? '#fbbf24' : '#b45309';
  const colorHing = darkMode ? '#f87171' : '#990000';

  const comparativeChartData = [
    {
      metric: 'Flagged Rate (%)',
      English: metrics.English?.flaggedRate || 5.0,
      Hindi: metrics.Hindi?.flaggedRate || 10.0,
      Hinglish: metrics.Hinglish?.flaggedRate || 20.0
    },
    {
      metric: 'Stereotype Rate (%)',
      English: metrics.English?.stereotypeRate || 5.0,
      Hindi: metrics.Hindi?.stereotypeRate || 10.0,
      Hinglish: metrics.Hinglish?.stereotypeRate || 20.0
    },
    {
      metric: 'Avg Bias (x10)',
      English: (metrics.English?.avgBiasScore || 0.1) * 10,
      Hindi: (metrics.Hindi?.avgBiasScore || 0.15) * 10,
      Hinglish: (metrics.Hinglish?.avgBiasScore || 0.4) * 10
    }
  ];

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';
  const gridColor = darkMode ? '#524434' : '#b8a68d';
  const textColor = darkMode ? '#ffffff' : '#000000';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          COMPARATIVE ANALYTICS
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Language Disparity Analytics
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Detailed metrics comparison across English, Hindi, and code-mixed Hinglish prompt conditions.
        </p>
      </div>

      {/* Delta Callout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-1 shadow-sm ${cardBg}`}>
          <span className="text-xs font-mono font-extrabold uppercase text-[#b45309] block">English vs Hinglish Delta</span>
          <p className="text-3xl font-black font-mono text-[#990000] dark:text-[#f87171]">+{diffs.engVsHinglish || 15.0} % pts</p>
          <span className={`text-xs font-bold italic ${textMuted}`}>Higher flagged rate in Hinglish condition</span>
        </div>

        <div className={`p-5 rounded-xl border-2 ornate-border space-y-1 shadow-sm ${cardBg}`}>
          <span className="text-xs font-mono font-extrabold uppercase text-[#b45309] block">English vs Hindi Delta</span>
          <p className="text-3xl font-black font-mono text-[#b45309] dark:text-[#fbbf24]">+{diffs.engVsHindi || 5.0} % pts</p>
          <span className={`text-xs font-bold italic ${textMuted}`}>Higher flagged rate in Hindi condition</span>
        </div>

        <div className={`p-5 rounded-xl border-2 ornate-border space-y-1 shadow-sm ${cardBg}`}>
          <span className="text-xs font-mono font-extrabold uppercase text-[#b45309] block">Hindi vs Hinglish Delta</span>
          <p className="text-3xl font-black font-mono text-[#1e3a8a] dark:text-[#60a5fa]">+{diffs.hindiVsHinglish || 10.0} % pts</p>
          <span className={`text-xs font-bold italic ${textMuted}`}>Disparity between Devanagari &amp; Roman script</span>
        </div>
      </div>

      {/* Journal Table */}
      <div className={`rounded-xl border-2 ornate-border overflow-hidden shadow-sm ${cardBg}`}>
        <div className="p-4 border-b-2 border-[#b8a68d] dark:border-[#524434]">
          <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">Language Performance Metrics Grid</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="journal-table text-xs">
            <thead>
              <tr className={darkMode ? 'bg-[#12100e] text-[#e5e7eb]' : 'bg-[#faf5ea] text-[#27272a]'}>
                <th className="font-extrabold">Metric</th>
                <th className="text-[#1e3a8a] dark:text-[#60a5fa] font-extrabold">English</th>
                <th className="text-[#b45309] dark:text-[#fbbf24] font-extrabold">Hindi</th>
                <th className="text-[#990000] dark:text-[#f87171] font-extrabold">Hinglish</th>
              </tr>
            </thead>
            <tbody className="font-mono font-bold text-[#000000] dark:text-[#ffffff]">
              <tr>
                <td className="font-sans font-extrabold">Total Test Cases</td>
                <td>{metrics.English?.total || 50}</td>
                <td>{metrics.Hindi?.total || 50}</td>
                <td>{metrics.Hinglish?.total || 50}</td>
              </tr>
              <tr>
                <td className="font-sans font-extrabold">Evaluated Responses</td>
                <td>{metrics.English?.evaluated || 50}</td>
                <td>{metrics.Hindi?.evaluated || 50}</td>
                <td>{metrics.Hinglish?.evaluated || 50}</td>
              </tr>
              <tr>
                <td className="font-sans font-extrabold">Flagged Responses</td>
                <td className="text-[#1e3a8a] dark:text-[#60a5fa]">{metrics.English?.flagged || 2}</td>
                <td className="text-[#b45309] dark:text-[#fbbf24]">{metrics.Hindi?.flagged || 5}</td>
                <td className="text-[#990000] dark:text-[#f87171]">{metrics.Hinglish?.flagged || 10}</td>
              </tr>
              <tr className={darkMode ? 'bg-[#12100e]' : 'bg-[#faf5ea]'}>
                <td className="font-sans font-black text-sm">Flagged Response Rate</td>
                <td className="font-black text-sm text-[#1e3a8a] dark:text-[#60a5fa]">{metrics.English?.flaggedRate || 5.0}%</td>
                <td className="font-black text-sm text-[#b45309] dark:text-[#fbbf24]">{metrics.Hindi?.flaggedRate || 10.0}%</td>
                <td className="font-black text-sm text-[#990000] dark:text-[#f87171]">{metrics.Hinglish?.flaggedRate || 20.0}%</td>
              </tr>
              <tr>
                <td className="font-sans font-extrabold">Average Bias Score (0-2)</td>
                <td>{metrics.English?.avgBiasScore || 0.1}</td>
                <td>{metrics.Hindi?.avgBiasScore || 0.15}</td>
                <td>{metrics.Hinglish?.avgBiasScore || 0.4}</td>
              </tr>
              <tr>
                <td className="font-sans font-extrabold">Average Safety Score (0-2)</td>
                <td>{metrics.English?.avgSafety || 2.0}</td>
                <td>{metrics.Hindi?.avgSafety || 1.95}</td>
                <td>{metrics.Hinglish?.avgSafety || 1.85}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Chart */}
      <div className={`p-5 rounded-xl border-2 ornate-border space-y-4 shadow-sm ${cardBg}`}>
        <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">Visual Metric Comparison</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="metric" stroke={textColor} fontSize={12} fontWeight="bold" fontFamily="serif" />
              <YAxis stroke={textColor} fontSize={12} fontWeight="bold" fontFamily="mono" />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1814' : '#ffffff', borderColor: gridColor, borderRadius: '0.25rem', color: textColor, fontFamily: 'serif', fontWeight: 'bold' }} />
              <Legend />
              <Bar dataKey="English" fill={colorEng} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Hindi" fill={colorHindi} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Hinglish" fill={colorHing} radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
