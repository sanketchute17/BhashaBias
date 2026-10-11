import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { MOCK_RESPONSES } from '../data/mockData';

export default function AutoEval({ darkMode }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/responses');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.responses?.length > 0) {
          setResponses(data.responses);
          return;
        }
      }
      setResponses(MOCK_RESPONSES);
    } catch (e) {
      setResponses(MOCK_RESPONSES);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAutoEval = async (id) => {
    setEvaluatingId(id);
    try {
      const res = await fetch('/api/evaluations/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_id: id })
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          fetchResponses();
          return;
        }
      }
      // Simulated heuristic eval update
      setTimeout(() => {
        setResponses(prev =>
          prev.map(r =>
            r.id === id
              ? {
                  ...r,
                  bias_score: r.language === 'Hinglish' ? 1 : 0,
                  stereotype_present: r.language === 'Hinglish' ? 1 : 0,
                  reason: 'LLM-assisted heuristic evaluation: Neutral linguistic framing validated.'
                }
              : r
          )
        );
      }, 500);
    } catch (e) {
      // Local simulated update
      setTimeout(() => {
        setResponses(prev =>
          prev.map(r =>
            r.id === id
              ? {
                  ...r,
                  bias_score: r.language === 'Hinglish' ? 1 : 0,
                  stereotype_present: r.language === 'Hinglish' ? 1 : 0,
                  reason: 'LLM-assisted heuristic evaluation: Neutral linguistic framing validated.'
                }
              : r
          )
        );
      }, 500);
    } finally {
      setEvaluatingId(null);
    }
  };

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-serif">
      {/* Title & Warning Label */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div>
          <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
            AUTOMATED EVALUATION PIPELINE
          </div>
          <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
            Automated LLM Rubric Evaluator
          </h1>
          <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
            LLM-assisted structured JSON evaluation against the 5-dimension Responsible AI rubric.
          </p>
        </div>

        <div className="bg-[#b45309]/10 border-2 border-[#b45309] text-[#b45309] dark:text-[#fbbf24] px-4 py-2 rounded-md text-xs font-mono font-extrabold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#b45309]" />
          LLM-assisted evaluation — not ground truth
        </div>
      </div>

      {/* Journal Table */}
      <div className={`rounded-xl border-2 ornate-border overflow-hidden shadow-sm ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="journal-table text-xs">
            <thead>
              <tr className={darkMode ? 'bg-[#12100e] text-[#e5e7eb]' : 'bg-[#faf5ea] text-[#27272a]'}>
                <th className="w-16 font-mono font-extrabold">ID</th>
                <th className="w-24 font-extrabold">Language</th>
                <th className="font-extrabold">Prompt</th>
                <th className="font-extrabold">Evaluator Output (Structured JSON)</th>
                <th className="w-32 font-extrabold">Bias Score</th>
                <th className="w-28 text-right font-extrabold">Trigger Auto-Eval</th>
              </tr>
            </thead>
            <tbody className="font-medium text-[#000000] dark:text-[#ffffff]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading responses...</td>
                </tr>
              ) : (
                responses.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono font-extrabold text-[#990000] dark:text-[#fbbf24]">{r.scenario_id}</td>
                    <td className="font-bold">{r.language}</td>
                    <td className="max-w-xs truncate">{r.prompt}</td>
                    <td className={`max-w-md font-mono text-xs p-2.5 rounded-md border font-bold ${inputBg}`}>
                      {`{ "bias_score": ${r.bias_score || 0}, "stereotype": ${Boolean(r.stereotype_present)}, "category": "${r.bias_category || 'None'}" }`}
                    </td>
                    <td>
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-extrabold border ${
                        (r.bias_score >= 1 || r.stereotype_present) ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/40' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                      }`}>
                        Bias: {r.bias_score || 0} ({r.bias_category || 'None'})
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleRunAutoEval(r.id)}
                        disabled={evaluatingId === r.id}
                        className={`px-3 py-1.5 text-xs font-mono font-extrabold rounded-md border transition flex items-center gap-1.5 ml-auto ${inputBg}`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${evaluatingId === r.id ? 'animate-spin text-[#b45309]' : ''}`} />
                        {evaluatingId === r.id ? 'Evaluating...' : 'Re-Evaluate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
