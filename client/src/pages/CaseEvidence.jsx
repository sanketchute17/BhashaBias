import React, { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';

export default function CaseEvidence({ darkMode }) {
  const [responses, setResponses] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('G01');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [langFilter, setLangFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchFlaggedCases();
    fetchScenariosList();
  }, [langFilter, categoryFilter]);

  useEffect(() => {
    if (selectedScenarioId) {
      fetchComparison(selectedScenarioId);
    }
  }, [selectedScenarioId]);

  const fetchScenariosList = async () => {
    try {
      const res = await fetch('/api/scenarios');
      const data = await res.json();
      if (data.success) setScenarios(data.scenarios);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFlaggedCases = async () => {
    try {
      let url = `/api/responses?flagged_only=true&language=${langFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        let list = data.responses;
        if (categoryFilter !== 'All') {
          list = list.filter(r => r.category === categoryFilter);
        }
        setResponses(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchComparison = async (scId) => {
    try {
      const res = await fetch(`/api/responses/compare/${scId}`);
      const data = await res.json();
      if (data.success) setComparisonData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          EVIDENCE ARCHIVE
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Case Evidence &amp; Multilingual Comparison
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Archival research case files documenting flagged outputs and side-by-side multilingual evidence.
        </p>
      </div>

      {/* Multilingual Side-by-Side Comparator Section */}
      <div className={`p-5 rounded-xl border-2 ornate-border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 pb-3 border-[#b8a68d] dark:border-[#524434]">
          <div>
            <h2 className="font-cinzel text-base font-bold tracking-tight flex items-center gap-2 text-[#000000] dark:text-[#ffffff]">
              <GitCompare className="w-4 h-4 text-[#b45309]" />
              Compare Same Scenario Across Languages
            </h2>
            <p className={`text-xs font-bold italic ${textMuted}`}>Side-by-side behavioral comparison for empirical verification</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#000000] dark:text-[#ffffff]">
            <span>Select Case:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className={`px-3 py-2 rounded-md border-2 font-bold ${inputBg}`}
            >
              {scenarios.map(sc => (
                <option key={sc.scenario_id} value={sc.scenario_id}>
                  {sc.scenario_id} ({sc.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3-Column Side-by-Side Case File View */}
        {comparisonData && comparisonData.comparisons && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['English', 'Hindi', 'Hinglish'].map((lang) => {
              const item = comparisonData.comparisons.find(c => c.language === lang);
              const isFlagged = item && (item.bias_score >= 1 || item.stereotype_present === 1);
              return (
                <div
                  key={lang}
                  className={`p-4 rounded-lg border-2 space-y-3 ${
                    isFlagged ? 'border-[#990000] bg-[#990000]/5' : inputBg
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-[#b8a68d] dark:border-[#524434] font-mono text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-[#000000] dark:text-[#ffffff]">{lang}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                      isFlagged ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/40' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                    }`}>
                      {isFlagged ? `Flagged (Bias ${item.bias_score})` : 'Clean'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-serif">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Prompt</span>
                      <p className="italic font-bold text-[#000000] dark:text-[#ffffff]">{item ? item.prompt : 'N/A'}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">AI Response Output</span>
                      <p className={`p-3 rounded-md border font-mono text-xs leading-relaxed whitespace-pre-wrap font-medium ${inputBg}`}>
                        {item ? item.raw_response : 'No response logged.'}
                      </p>
                    </div>

                    {item && (
                      <div className="text-xs border-t pt-1 border-[#b8a68d] dark:border-[#524434] text-[#000000] dark:text-[#ffffff]">
                        <span className="font-bold">Reason:</span> {item.reason || 'None provided'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Flagged Cases Grid */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#b8a68d] dark:border-[#524434] pb-2">
          <h2 className="font-cinzel text-lg font-bold tracking-tight text-[#000000] dark:text-[#ffffff]">
            All Flagged Case Files ({responses.length})
          </h2>

          <div className="flex items-center gap-3 font-mono text-xs font-bold text-[#000000] dark:text-[#ffffff]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-md border ${inputBg}`}
            >
              <option value="All">All Categories</option>
              <option value="Gender">Gender</option>
              <option value="Regional">Regional</option>
              <option value="Socio-economic">Socio-economic</option>
              <option value="Education / Career">Education</option>
              <option value="Cultural / Social">Cultural</option>
            </select>

            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-md border ${inputBg}`}
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading case files...</div>
          ) : responses.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">No flagged cases found for selected filter.</div>
          ) : (
            responses.map((resp) => (
              <div key={resp.id} className={`p-5 rounded-xl border-2 ornate-border space-y-3 shadow-sm ${cardBg}`}>
                <div className="flex items-center justify-between border-b pb-2 border-[#b8a68d] dark:border-[#524434] font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#990000] dark:text-[#fbbf24]">CASE FILE: {resp.scenario_id}</span>
                    <span className={`px-2 py-0.5 rounded border font-bold ${inputBg}`}>
                      {resp.language}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#990000] bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30">
                    Bias Score: {resp.bias_score} ({resp.bias_category || 'General'})
                  </span>
                </div>

                <div className="space-y-2 text-xs font-serif text-[#000000] dark:text-[#ffffff]">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Prompt Given</span>
                    <p className="font-medium">{resp.prompt}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Flagged Output</span>
                    <p className={`p-3 rounded-md border font-mono text-xs leading-relaxed font-medium ${inputBg}`}>
                      {resp.raw_response}
                    </p>
                  </div>

                  <div className={`p-3 rounded-md border text-xs font-bold ${inputBg}`}>
                    <span className="text-[#b45309]">Evaluator Reason:</span> {resp.reason || 'No detailed reason.'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
