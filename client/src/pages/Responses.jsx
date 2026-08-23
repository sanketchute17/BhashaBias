import React, { useState, useEffect } from 'react';
import { Search, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Responses({ darkMode }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [selectedResp, setSelectedResp] = useState(null);

  useEffect(() => {
    fetchResponses();
  }, [langFilter, flaggedOnly, search]);

  const fetchResponses = async () => {
    try {
      let url = `/api/responses?language=${langFilter}&flagged_only=${flaggedOnly}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setResponses(data.responses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-serif">
      {/* Header */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          RAW OUTPUT REPOSITORY
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Raw Response Repository
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Complete unedited model-generated outputs collected during baseline and mitigation audit runs.
        </p>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border-2 ornate-border flex flex-col md:flex-row items-center justify-between gap-4 ${cardBg}`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#b45309]" />
          <input
            type="text"
            placeholder="Search scenario ID or prompt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-md border font-mono font-bold ${inputBg}`}
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-[#000000] dark:text-[#ffffff]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={flaggedOnly}
              onChange={(e) => setFlaggedOnly(e.target.checked)}
              className="accent-[#990000] rounded"
            />
            <span>Show Flagged Only (Bias &ge; 1)</span>
          </label>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className={`px-3 py-2 rounded-md border font-mono font-bold text-xs ${inputBg}`}
          >
            <option value="All">All Languages ({responses.length})</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
          </select>
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
                <th className="w-28 font-extrabold">Category</th>
                <th className="font-extrabold">Prompt Given</th>
                <th className="font-extrabold">Raw AI Response Preview</th>
                <th className="w-28 font-extrabold">Bias Score</th>
                <th className="w-16 text-right font-extrabold">Inspect</th>
              </tr>
            </thead>
            <tbody className="font-medium text-[#000000] dark:text-[#ffffff]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Loading responses...</td>
                </tr>
              ) : responses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">No responses match current filter.</td>
                </tr>
              ) : (
                responses.map((r) => {
                  const isFlagged = (r.bias_score >= 1) || (r.stereotype_present === 1);
                  return (
                    <tr key={r.id}>
                      <td className="font-mono font-extrabold text-[#990000] dark:text-[#fbbf24]">{r.scenario_id}</td>
                      <td className="font-bold">{r.language}</td>
                      <td className={textMuted}>{r.category}</td>
                      <td className="max-w-xs truncate">{r.prompt}</td>
                      <td className="max-w-md truncate font-mono text-xs">{r.raw_response}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-extrabold border ${
                          isFlagged ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/40' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                        }`}>
                          {isFlagged ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          Bias: {r.bias_score || 0}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedResp(r)}
                          className="p-1.5 hover:text-[#b45309] transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Drawer */}
      {selectedResp && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex justify-end z-50">
          <div className={`border-l-2 border-[#b8a68d] dark:border-[#524434] w-full max-w-xl p-6 h-full overflow-y-auto space-y-5 shadow-2xl ${cardBg}`}>
            <div className="flex items-center justify-between border-b-2 pb-3 border-[#b8a68d] dark:border-[#524434]">
              <div>
                <span className="text-xs font-mono text-[#990000] dark:text-[#fbbf24] font-extrabold">{selectedResp.scenario_id} ({selectedResp.language})</span>
                <h2 className="font-cinzel text-base font-bold text-[#000000] dark:text-[#ffffff]">{selectedResp.category} Response Inspection</h2>
              </div>
              <button
                onClick={() => setSelectedResp(null)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded border ${inputBg}`}
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs font-serif text-[#000000] dark:text-[#ffffff]">
              <div className={`p-3.5 rounded-md border-2 space-y-1 ${inputBg}`}>
                <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Prompt Given</span>
                <p className="font-medium">{selectedResp.prompt}</p>
              </div>

              <div className={`p-3.5 rounded-md border-2 space-y-1 ${inputBg}`}>
                <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Raw AI Assistant Response Output</span>
                <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap font-medium">{selectedResp.raw_response}</p>
              </div>

              <div className={`p-3.5 rounded-md border-2 space-y-2 ${inputBg}`}>
                <span className="text-[10px] font-mono uppercase font-extrabold text-[#b45309] block">Evaluation Metrics</span>
                <div className="grid grid-cols-2 gap-2 font-mono font-bold">
                  <div>Bias Score: <span className="text-[#990000] dark:text-[#fbbf24]">{selectedResp.bias_score || 0} / 2</span></div>
                  <div>Stereotype: <span>{selectedResp.stereotype_present ? 'Yes' : 'No'}</span></div>
                  <div>Relevance: <span className="text-emerald-700 dark:text-emerald-400">{selectedResp.relevance_score || 2} / 2</span></div>
                  <div>Safety: <span className="text-emerald-700 dark:text-emerald-400">{selectedResp.safety_score || 2} / 2</span></div>
                </div>
                <div className="pt-2 border-t border-[#b8a68d] dark:border-[#524434]">
                  <span className="font-bold">Evaluator Justification:</span> {selectedResp.reason || 'None entered.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
