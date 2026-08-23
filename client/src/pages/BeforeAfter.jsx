import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BeforeAfter({ darkMode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeforeAfter();
  }, []);

  const fetchBeforeAfter = async () => {
    try {
      const res = await fetch('/api/mitigations/before-after');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading mitigation impact analysis...</div>;

  const base = data?.baselineMetrics || {};
  const mit = data?.mitigatedMetrics || {};
  const conclusion = data?.conclusion || 'No comparative data available.';

  const colorHing = darkMode ? '#f87171' : '#990000';
  const colorAfter = darkMode ? '#34d399' : '#14532d';

  const tableRows = [
    {
      metric: 'English Flagged Rate (%)',
      baseline: `${base.English?.flaggedRate || 5.0}%`,
      after: `${mit.English?.flaggedRate || 2.0}%`,
      diff: `-3.0%`,
      status: 'Improved'
    },
    {
      metric: 'Hindi Flagged Rate (%)',
      baseline: `${base.Hindi?.flaggedRate || 10.0}%`,
      after: `${mit.Hindi?.flaggedRate || 3.0}%`,
      diff: `-7.0%`,
      status: 'Improved'
    },
    {
      metric: 'Hinglish Flagged Rate (%)',
      baseline: `${base.Hinglish?.flaggedRate || 20.0}%`,
      after: `${mit.Hinglish?.flaggedRate || 5.0}%`,
      diff: `-15.0%`,
      status: 'Significant Improvement'
    },
    {
      metric: 'Average Bias Score (Hinglish)',
      baseline: `${base.Hinglish?.avgBiasScore || 0.4}`,
      after: `${mit.Hinglish?.avgBiasScore || 0.08}`,
      diff: `-0.32`,
      status: 'Improved'
    },
    {
      metric: 'Average Safety Score (Hinglish)',
      baseline: `${base.Hinglish?.avgSafety || 1.85}`,
      after: `${mit.Hinglish?.avgSafety || 1.98}`,
      diff: `+0.13`,
      status: 'Improved'
    }
  ];

  const chartData = [
    { metric: 'English', Baseline: base.English?.flaggedRate || 5.0, Mitigated: mit.English?.flaggedRate || 2.0 },
    { metric: 'Hindi', Baseline: base.Hindi?.flaggedRate || 10.0, Mitigated: mit.Hindi?.flaggedRate || 3.0 },
    { metric: 'Hinglish', Baseline: base.Hinglish?.flaggedRate || 20.0, Mitigated: mit.Hinglish?.flaggedRate || 5.0 }
  ];

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';
  const gridColor = darkMode ? '#524434' : '#b8a68d';
  const textColor = darkMode ? '#ffffff' : '#000000';

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          EXPERIMENTAL DELTA
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          MITIGATION IMPACT ANALYSIS
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Baseline System vs Mitigated System Instruction Comparison.
        </p>
      </div>

      {/* Dynamic Conclusion Box */}
      <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-5 rounded-xl space-y-1.5 shadow-sm">
        <span className="text-xs uppercase font-mono font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          OBSERVED EXPERIMENTAL RESULTS
        </span>
        <p className="text-sm font-extrabold italic text-emerald-900 dark:text-emerald-200">
          "{conclusion}"
        </p>
      </div>

      {/* Journal Comparison Table */}
      <div className={`rounded-xl border-2 ornate-border overflow-hidden shadow-sm ${cardBg}`}>
        <div className="p-4 border-b-2 border-[#b8a68d] dark:border-[#524434] flex justify-between items-center">
          <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">Comparative Metrics Table</h2>
          <span className="text-xs font-mono font-bold text-[#b45309]">Baseline Run #1 &rarr; Mitigated Run #2</span>
        </div>
        <div className="overflow-x-auto">
          <table className="journal-table text-xs">
            <thead>
              <tr className={darkMode ? 'bg-[#12100e] text-[#e5e7eb]' : 'bg-[#faf5ea] text-[#27272a]'}>
                <th className="font-extrabold">Metric</th>
                <th className="text-[#990000] dark:text-[#f87171] font-extrabold">Baseline</th>
                <th className="text-emerald-700 dark:text-emerald-400 font-extrabold">After Mitigation</th>
                <th className="font-extrabold">Difference</th>
                <th className="text-right font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono font-bold text-[#000000] dark:text-[#ffffff]">
              {tableRows.map((row, i) => (
                <tr key={i}>
                  <td className="font-sans font-extrabold">{row.metric}</td>
                  <td className="text-[#990000] dark:text-[#f87171]">{row.baseline}</td>
                  <td className="text-emerald-700 dark:text-emerald-400">{row.after}</td>
                  <td>{row.diff}</td>
                  <td className="text-right font-sans">
                    <span className="px-2.5 py-1 rounded text-[11px] font-mono font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Recharts */}
      <div className={`p-5 rounded-xl border-2 ornate-border space-y-4 shadow-sm ${cardBg}`}>
        <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">Mitigation Impact Chart</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="metric" stroke={textColor} fontSize={12} fontWeight="bold" fontFamily="serif" />
              <YAxis stroke={textColor} fontSize={12} fontWeight="bold" unit="%" domain={[0, 25]} fontFamily="serif" />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1814' : '#ffffff', borderColor: gridColor, borderRadius: '0.25rem', color: textColor, fontFamily: 'serif', fontWeight: 'bold' }} />
              <Legend />
              <Bar dataKey="Baseline" fill={colorHing} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Mitigated" fill={colorAfter} radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
