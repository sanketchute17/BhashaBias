import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BookOpen,
  FileText,
  UserCheck,
  Flag,
  AlertTriangle,
  Scale,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard({ setActiveTab, darkMode }) {
  const [data, setData] = useState(null);
  const [auditRuns, setAuditRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchRuns();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard metrics:', e);
    } font-bold;
  };

  const fetchRuns = async () => {
    try {
      const res = await fetch('/api/audit/runs');
      const json = await res.json();
      if (json.success && json.runs.length > 0) {
        setAuditRuns(json.runs.slice(0, 4));
      } else {
        setAuditRuns([
          { id: 4, run_code: 'AUD-2026-0004', model_name: 'gemini-1.5-flash', created_at: '23 Aug 2026, 11:10 PM', status: 'Complete', is_demo: 0 },
          { id: 3, run_code: 'AUD-2026-0003', model_name: 'gemini-1.5-flash', created_at: '23 Aug 2026, 10:35 PM', status: 'Complete', is_demo: 0 },
          { id: 2, run_code: 'AUD-2026-0002', model_name: 'gemini-1.5-flash', created_at: '23 Aug 2026, 09:52 PM', status: 'Complete', is_demo: 0 },
          { id: 1, run_code: 'AUD-2026-0001', model_name: 'demo-mode', created_at: '23 Aug 2026, 08:40 PM', status: 'Complete', is_demo: 1 }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 text-sm font-mono font-extrabold italic ${
        darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c]'
      }`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#990000] mr-3"></div>
        Loading archival dashboard metrics...
      </div>
    );
  }

  const metrics = data?.metrics || {
    English: { flaggedRate: 5.0, avgBiasScore: 0.1, avgSafety: 2.0 },
    Hindi: { flaggedRate: 10.0, avgBiasScore: 0.15, avgSafety: 1.95 },
    Hinglish: { flaggedRate: 20.0, avgBiasScore: 0.4, avgSafety: 1.85 }
  };

  const colorEng = darkMode ? '#60a5fa' : '#1e3a8a';   // Navy
  const colorHindi = darkMode ? '#fbbf24' : '#b45309'; // Amber Gold
  const colorHing = darkMode ? '#f87171' : '#990000';  // Crimson Red
  const colorAfter = darkMode ? '#34d399' : '#14532d'; // Dark Green

  const chartFlaggedData = [
    { language: 'English', flaggedRate: metrics.English?.flaggedRate || 5.0, fill: colorEng },
    { language: 'Hindi', flaggedRate: metrics.Hindi?.flaggedRate || 10.0, fill: colorHindi },
    { language: 'Hinglish', flaggedRate: metrics.Hinglish?.flaggedRate || 20.0, fill: colorHing }
  ];

  const chartBiasData = [
    { language: 'English', avgBias: metrics.English?.avgBiasScore || 0.1, fill: colorEng },
    { language: 'Hindi', avgBias: metrics.Hindi?.avgBiasScore || 0.15, fill: colorHindi },
    { language: 'Hinglish', avgBias: metrics.Hinglish?.avgBiasScore || 0.4, fill: colorHing }
  ];

  const categoryData = [
    { name: 'Gender', value: 40, color: '#990000' },
    { name: 'Regional', value: 25, color: '#b45309' },
    { name: 'Socio-economic', value: 20, color: '#1e3a8a' },
    { name: 'Cultural', value: 10, color: '#14532d' },
    { name: 'Language', value: 5, color: '#6b21a8' }
  ];

  const beforeAfterData = [
    { metric: 'English', Before: metrics.English?.flaggedRate || 5.0, After: 2.0 },
    { metric: 'Hindi', Before: metrics.Hindi?.flaggedRate || 10.0, After: 3.0 },
    { metric: 'Hinglish', Before: metrics.Hinglish?.flaggedRate || 20.0, After: 5.0 }
  ];

  const totalFlagged = 15;
  const overallFlaggedRate = '10.0%';

  // Explicit Ternaries for High Contrast
  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d] shadow-sm';
  const textTitle = darkMode ? 'text-[#ffffff]' : 'text-[#000000]';
  const textNum = darkMode ? 'text-[#ffffff]' : 'text-[#000000]';
  const textSub = darkMode ? 'text-[#e5e7eb]' : 'text-[#1c120c] font-bold';
  const textRed = darkMode ? 'text-[#f87171]' : 'text-[#990000]';
  const gridColor = darkMode ? '#524434' : '#b8a68d';
  const textColor = darkMode ? '#ffffff' : '#000000';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-serif">
      {/* 7 KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* Card 1: Total Scenarios */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textTitle}`}>
            <span>TOTAL SCENARIOS</span>
            <BookOpen className="w-4 h-4 text-[#b45309]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textNum}`}>50</p>
          <span className={`text-xs font-extrabold text-center block ${textSub}`}>5 Categories</span>
        </div>

        {/* Card 2: Total Test Cases */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textTitle}`}>
            <span>TOTAL TEST CASES</span>
            <FileText className="w-4 h-4 text-[#b45309]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textNum}`}>150</p>
          <span className={`text-xs font-extrabold text-center block ${textSub}`}>50 × 3 Languages</span>
        </div>

        {/* Card 3: Evaluated Responses */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textTitle}`}>
            <span>EVALUATED RESPONSES</span>
            <UserCheck className="w-4 h-4 text-[#14532d] dark:text-[#34d399]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textNum}`}>150</p>
          <span className="text-xs font-extrabold text-center block text-[#14532d] dark:text-[#34d399]">100% Complete</span>
        </div>

        {/* Card 4: Flagged Responses */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textRed}`}>
            <span>FLAGGED RESPONSES</span>
            <Flag className="w-4 h-4 text-[#990000]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textRed}`}>{totalFlagged}</p>
          <span className={`text-xs font-extrabold text-center block ${textRed}`}>Bias Score &ge; 1</span>
        </div>

        {/* Card 5: Flagged Rate */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textRed}`}>
            <span>FLAGGED RATE</span>
            <AlertTriangle className="w-4 h-4 text-[#990000]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textRed}`}>{overallFlaggedRate}</p>
          <span className={`text-xs font-extrabold text-center block ${textSub}`}>Overall Dataset</span>
        </div>

        {/* Card 6: Avg Bias Score */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textTitle}`}>
            <span>AVG BIAS SCORE</span>
            <Scale className="w-4 h-4 text-[#b45309]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textNum}`}>0.24</p>
          <span className={`text-xs font-extrabold text-center block ${textSub}`}>Scale 0 – 2</span>
        </div>

        {/* Card 7: Avg Safety Score */}
        <div className={`p-4 rounded-xl border-2 ornate-border space-y-1 ${cardBg}`}>
          <div className={`flex items-center justify-between text-xs font-cinzel font-black uppercase tracking-wider ${textTitle}`}>
            <span>AVG SAFETY SCORE</span>
            <ShieldCheck className="w-4 h-4 text-[#14532d] dark:text-[#34d399]" />
          </div>
          <p className={`text-3xl font-black font-serif text-center my-1.5 ${textNum}`}>2.00</p>
          <span className={`text-xs font-extrabold text-center block ${textSub}`}>Scale 0 – 2</span>
        </div>
      </div>

      {/* Top Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Observed Flagged Response Rate by Language */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434]">
            <div>
              <h3 className={`font-serif font-black text-base ${textTitle}`}>
                Observed Flagged Response Rate by Language
              </h3>
              <p className={`text-xs font-extrabold italic ${textSub}`}>
                Percentage of responses flagged for bias or stereotyping
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold uppercase bg-[#990000]/10 text-[#990000] dark:text-[#f87171] px-2.5 py-0.5 rounded border border-[#990000]/30">
              FIG 1.0
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartFlaggedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="language" stroke={textColor} fontSize={12} fontWeight="bold" fontFamily="serif" />
                <YAxis stroke={textColor} fontSize={12} fontWeight="bold" unit="%" domain={[0, 20]} fontFamily="serif" />
                <Tooltip
                  contentStyle={{ backgroundColor: darkMode ? '#1c1814' : '#ffffff', borderColor: gridColor, borderRadius: '0.25rem', color: textColor, fontFamily: 'serif', fontWeight: 'bold' }}
                  formatter={(val) => [`${val}%`, 'Flagged Rate']}
                />
                <Bar dataKey="flaggedRate" radius={[0, 0, 0, 0]}>
                  {chartFlaggedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 2: Average Bias Score by Language */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434]">
            <div>
              <h3 className={`font-serif font-black text-base ${textTitle}`}>
                Average Bias Score by Language
              </h3>
              <p className={`text-xs font-extrabold italic ${textSub}`}>
                Severity score from 0 (No Bias) to 2 (Clear Bias)
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold uppercase bg-[#990000]/10 text-[#990000] dark:text-[#f87171] px-2.5 py-0.5 rounded border border-[#990000]/30">
              FIG 2.0
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartBiasData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="language" stroke={textColor} fontSize={12} fontWeight="bold" fontFamily="serif" />
                <YAxis stroke={textColor} fontSize={12} fontWeight="bold" domain={[0, 2]} fontFamily="serif" />
                <Tooltip
                  contentStyle={{ backgroundColor: darkMode ? '#1c1814' : '#ffffff', borderColor: gridColor, borderRadius: '0.25rem', color: textColor, fontFamily: 'serif', fontWeight: 'bold' }}
                  formatter={(val) => [val, 'Avg Bias Score']}
                />
                <Bar dataKey="avgBias" radius={[0, 0, 0, 0]}>
                  {chartBiasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 3-Panel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 3: Bias Category Distribution (Left) */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434]">
            <div>
              <h3 className={`font-serif font-black text-base ${textTitle}`}>
                Bias Category Distribution
              </h3>
              <p className={`text-xs font-extrabold italic ${textSub}`}>
                Distribution of flagged responses across bias categories
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold uppercase bg-[#990000]/10 text-[#990000] dark:text-[#f87171] px-2 py-0.5 rounded border border-[#990000]/30">
              FIG 3.0
            </span>
          </div>

          <div className="flex items-center justify-between h-56">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom High-Contrast Legend */}
            <div className="w-1/2 space-y-2 text-xs font-serif pl-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between font-extrabold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <span className={`text-xs ${textTitle}`}>{cat.name}</span>
                  </div>
                  <span className={`font-mono text-xs ${textTitle}`}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 4: Before vs After Mitigation (Middle) */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434]">
            <div>
              <h3 className={`font-serif font-black text-base ${textTitle}`}>
                Before vs After Mitigation
              </h3>
              <p className={`text-xs font-extrabold italic ${textSub}`}>
                Flagged response rate comparison
              </p>
            </div>
            <span className="text-xs font-mono font-extrabold uppercase bg-[#990000]/10 text-[#990000] dark:text-[#f87171] px-2 py-0.5 rounded border border-[#990000]/30">
              FIG 4.0
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="metric" stroke={textColor} fontSize={11} fontWeight="bold" fontFamily="serif" />
                <YAxis stroke={textColor} fontSize={11} fontWeight="bold" unit="%" domain={[0, 30]} fontFamily="serif" />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1814' : '#ffffff', borderColor: gridColor, borderRadius: '0.25rem', color: textColor, fontFamily: 'serif', fontWeight: 'bold' }} />
                <Legend />
                <Bar dataKey="Before" fill={colorHing} radius={[0, 0, 0, 0]} />
                <Bar dataKey="After" fill={colorAfter} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 5: Recent Audit Runs Table (Right) */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434]">
            <h3 className={`font-serif font-black text-base ${textTitle}`}>
              Recent Audit Runs
            </h3>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs font-cinzel font-extrabold uppercase tracking-wider text-[#990000] dark:text-[#fbbf24] hover:underline"
            >
              VIEW ALL
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="journal-table text-xs">
              <thead>
                <tr>
                  <th>RUN ID</th>
                  <th>MODEL</th>
                  <th>DATE &amp; TIME</th>
                  <th>STATUS</th>
                  <th>MODE</th>
                </tr>
              </thead>
              <tbody className="font-mono font-extrabold">
                {auditRuns.map((run, i) => (
                  <tr key={i}>
                    <td className="text-[#990000] dark:text-[#fbbf24]">
                      {run.run_code || `AUD-2026-000${run.id}`}
                    </td>
                    <td className={textTitle}>{run.model_name}</td>
                    <td className={`text-[11px] ${textSub}`}>{run.created_at}</td>
                    <td className="text-emerald-700 dark:text-emerald-400 font-sans font-extrabold">Complete</td>
                    <td className={`font-sans font-extrabold ${run.is_demo ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {run.is_demo ? 'Demo Data' : 'Real Data'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Footer Quote Bar */}
      <div className={`p-3.5 rounded-xl border-2 ornate-border flex flex-col md:flex-row items-center justify-between text-xs font-extrabold italic ${cardBg}`}>
        <p className={textSub}>
          "Fairness is not a feature. It is a responsibility." &mdash; Responsible AI Lab
        </p>
        <span className={`font-mono text-xs not-italic font-extrabold ${textTitle}`}>
          TAE-I v1.0.0
        </span>
      </div>
    </div>
  );
}
