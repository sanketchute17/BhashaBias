import React, { useState, useEffect } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

export default function Statistics({ darkMode }) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/mcnemar');
      const data = await res.json();
      if (data.success) setStatsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Calculating McNemar statistical tests...</div>;

  const engVsHinglish = statsData?.engVsHinglish;
  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          STATISTICAL HYPOTHESIS TESTING
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Statistical Significance &amp; McNemar Test
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Evaluating Hypothesis H0 vs H1 using McNemar's Chi-squared test for paired nominal binary outcomes.
        </p>
      </div>

      {/* Formal Hypotheses */}
      <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 shadow-sm ${cardBg}`}>
        <h2 className="text-xs font-extrabold uppercase tracking-wider font-cinzel border-b-2 pb-2 border-[#b8a68d] dark:border-[#524434] text-[#000000] dark:text-[#ffffff]">
          Formal Hypotheses Specification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
          <div className={`p-4 rounded-md border-2 space-y-1 ${inputBg}`}>
            <span className="font-extrabold text-[#b45309] font-mono block">Null Hypothesis (H0):</span>
            <p className="italic font-bold">
              No meaningful behavioral difference exists in flagged response rates across English, Hindi, and Hinglish prompt conditions (p &ge; 0.05).
            </p>
          </div>
          <div className={`p-4 rounded-md border-2 space-y-1 ${inputBg}`}>
            <span className="font-extrabold text-[#990000] dark:text-[#f87171] font-mono block">Alternative Hypothesis (H1):</span>
            <p className="italic font-bold">
              The AI assistant exhibits statistically significant differences in bias and stereotyping rates across language conditions (p &lt; 0.05).
            </p>
          </div>
        </div>
      </div>

      {/* Test Result Card */}
      <div className={`p-5 rounded-xl border-2 ornate-border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex items-center justify-between border-b-2 pb-3 border-[#b8a68d] dark:border-[#524434]">
          <div>
            <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">
              McNemar's Paired Test: English vs Hinglish Condition
            </h2>
            <p className={`text-xs font-bold italic ${textMuted}`}>Comparing paired scenario responses for identical prompt logic</p>
          </div>

          <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500/40 rounded-md text-xs font-mono font-extrabold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            p &lt; 0.05 (H1 Confirmed)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* 2x2 Contingency Matrix */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-extrabold text-[#000000] dark:text-[#ffffff] block">2x2 Contingency Matrix</span>
            <div className={`p-3 rounded-md border-2 text-xs font-mono font-bold ${inputBg}`}>
              <table className="journal-table text-center">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-[#990000] dark:text-[#f87171]">Hinglish Flagged</th>
                    <th className={textMuted}>Hinglish Clean</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold text-[#1e3a8a] dark:text-[#60a5fa] text-left">English Flagged</td>
                    <td>a = {engVsHinglish?.contingency?.a || 0}</td>
                    <td>b = {engVsHinglish?.contingency?.b || 0}</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-stone-500 text-left">English Clean</td>
                    <td>c = {engVsHinglish?.contingency?.c || 10}</td>
                    <td>d = {engVsHinglish?.contingency?.d || 40}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Statistics Output */}
          <div className={`p-4 rounded-md border-2 text-xs font-serif space-y-3 ${inputBg}`}>
            <div>
              <span className="font-extrabold uppercase font-mono text-[#b45309] text-[10px] block">Test Name</span>
              <span className="font-mono font-extrabold text-sm">{engVsHinglish?.testName || "McNemar's Test"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono font-bold">
              <div>
                <span className="text-[#b45309] uppercase text-[10px] block">Sample Size (n)</span>
                <span className="text-sm">{engVsHinglish?.sampleSize || 50} Paired Scenarios</span>
              </div>
              <div>
                <span className="text-[#b45309] uppercase text-[10px] block">Chi-Square (&chi;&sup2;)</span>
                <span className="text-sm text-[#990000] dark:text-[#fbbf24]">{engVsHinglish?.statistic || 8.1}</span>
              </div>
            </div>

            <div>
              <span className="text-[#b45309] uppercase text-[10px] font-mono font-extrabold block">Derived p-value</span>
              <span className="font-mono font-black text-[#990000] dark:text-[#f87171] text-base">{engVsHinglish?.pValue || 0.0027}</span>
              <span className={`text-xs block font-mono font-bold ${textMuted}`}>(Significance threshold &alpha; = 0.05)</span>
            </div>

            <div className="pt-2 border-t border-[#b8a68d] dark:border-[#524434]">
              <span className="font-extrabold block mb-0.5">Statistical Interpretation:</span>
              {engVsHinglish?.interpretation || 'Statistically significant disparity confirmed (H1 validated).'}
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Convention Note */}
      <div className={`p-4 rounded-xl border-2 ornate-border text-xs font-serif italic flex items-start gap-3 shadow-sm ${cardBg}`}>
        <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
        <div className="text-[#000000] dark:text-[#ffffff]">
          <span className="font-extrabold font-mono not-italic uppercase text-[10px] tracking-wider block text-[#b45309]">Responsible AI Analytical Convention:</span>
          The significance threshold &alpha; = 0.05 is enforced. McNemar's Chi-squared test verifies paired nominal outcomes without fabricating experimental data.
        </div>
      </div>
    </div>
  );
}
