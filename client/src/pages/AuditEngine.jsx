import React, { useState } from 'react';
import { PlayCircle, StopCircle, Layers, Sparkles } from 'lucide-react';

export default function AuditEngine({ darkMode }) {
  const [model, setModel] = useState('gemini-1.5-flash');
  const [scenarioLimit, setScenarioLimit] = useState(50);
  const [languages, setLanguages] = useState({ English: true, Hindi: true, Hinglish: true });
  const [evalMode, setEvalMode] = useState('both');
  const [systemInstruction, setSystemInstruction] = useState('');

  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [logs, setLogs] = useState([]);

  const toggleLanguage = (lang) => {
    setLanguages(prev => ({ ...prev, [lang]: !prev[lang] }));
  };

  const handleRunAudit = async () => {
    const selectedLangs = Object.keys(languages).filter(l => languages[l]);
    if (selectedLangs.length === 0) {
      alert('Please select at least one language condition.');
      return;
    }

    setIsExecuting(true);
    setLogs([`[SYSTEM] Initializing research audit engine...`]);

    try {
      const response = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          languages: selectedLangs,
          scenario_limit: scenarioLimit,
          system_instruction: systemInstruction
        })
      });

      const data = await response.json();
      if (data.success) {
        setProgress({ completed: 0, total: data.totalTestCases });
        setLogs(prev => [
          ...prev,
          `[INFO] Audit Run #${data.runId} launched (${data.totalTestCases} total test cases).`,
          `[MODE] ${data.isDemo ? 'DEMO MODE (Simulated execution)' : 'REAL GEMINI API EXECUTION'}`,
          `[START] Executing scenarios across selected language conditions...`
        ]);

        pollAuditProgress(data.runId, data.totalTestCases);
      } else {
        setLogs(prev => [...prev, `[ERROR] ${data.error}`]);
        setIsExecuting(false);
      }
    } catch (err) {
      setLogs(prev => [...prev, `[ERROR] Network or server error: ${err.message}`]);
      setIsExecuting(false);
    }
  };

  const pollAuditProgress = (runId, totalCount) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit/runs/${runId}`);
        const data = await res.json();
        if (data.success) {
          const run = data.run;
          const completed = run.completed_count || 0;
          setProgress({ completed, total: totalCount });

          if (data.responses && data.responses.length > 0) {
            const lastResp = data.responses[data.responses.length - 1];
            setLogs(prev => [
              ...prev.slice(-30),
              `[SUCCESS] Scenario ${lastResp.scenario_id} (${lastResp.language}): Output logged in ${lastResp.execution_time_ms}ms.`
            ]);
          }

          if (run.status === 'completed' || run.status === 'cancelled' || completed >= totalCount) {
            clearInterval(interval);
            setIsExecuting(false);
            setLogs(prev => [
              ...prev,
              `[COMPLETE] Audit run #${runId} finished with status: ${run.status.toUpperCase()}.`
            ]);
          }
        }
      } catch (e) {
        console.error('Progress poll error:', e);
      }
    }, 1200);
  };

  const handleStopAudit = async () => {
    try {
      await fetch('/api/audit/cancel', { method: 'POST' });
      setLogs(prev => [...prev, `[CANCEL] Cancellation request sent to server.`]);
      setIsExecuting(false);
    } catch (e) {
      console.error(e);
    }
  };

  const percentComplete = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          EXPERIMENTAL PIPELINE
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          AI Audit Execution Console
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Execute controlled multilingual prompt scenarios against the target AI model and preserve raw outputs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Controls Panel */}
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-4 lg:col-span-1 shadow-sm ${cardBg}`}>
          <h2 className="text-xs font-extrabold uppercase tracking-wider font-cinzel border-b-2 pb-2 border-[#b8a68d] dark:border-[#524434] text-[#000000] dark:text-[#ffffff]">
            Experiment Setup
          </h2>

          <div className="space-y-1.5 text-xs font-serif">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Target Model Endpoint</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono font-bold text-xs ${inputBg}`}
            >
              <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
            </select>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <div className="flex justify-between font-bold text-[#000000] dark:text-[#ffffff]">
              <span>Batch Scenario Size</span>
              <span className="font-mono text-[#b45309]">{scenarioLimit} Scenarios</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={scenarioLimit}
              onChange={(e) => setScenarioLimit(parseInt(e.target.value))}
              className="w-full accent-[#b45309]"
            />
            <span className={`text-xs block font-mono font-bold ${textMuted}`}>
              Total test cases: {scenarioLimit * Object.keys(languages).filter(l => languages[l]).length}
            </span>
          </div>

          <div className="space-y-2 text-xs font-serif">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Language Conditions</label>
            <div className="space-y-1.5">
              {['English', 'Hindi', 'Hinglish'].map((lang) => (
                <label key={lang} className={`flex items-center gap-2.5 p-2.5 rounded-md border cursor-pointer font-bold ${inputBg}`}>
                  <input
                    type="checkbox"
                    checked={languages[lang]}
                    onChange={() => toggleLanguage(lang)}
                    className="accent-[#b45309] rounded"
                  />
                  <span className="text-xs">{lang} prompt condition</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Evaluation Pipeline</label>
            <select
              value={evalMode}
              onChange={(e) => setEvalMode(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono font-bold text-xs ${inputBg}`}
            >
              <option value="both">Hybrid (LLM-Assisted + Human Review)</option>
              <option value="human">Human Evaluation Only</option>
              <option value="auto">Automated LLM Rubric Only</option>
            </select>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <label className="font-bold block text-[#000000] dark:text-[#ffffff]">Optional System Guardrail</label>
            <textarea
              rows="3"
              placeholder="Leave empty for baseline audit, or enter system instruction for fairness mitigation..."
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              className={`w-full p-2.5 rounded-md border font-mono text-xs font-medium ${inputBg}`}
            ></textarea>
          </div>

          <div className="pt-2">
            {!isExecuting ? (
              <button
                onClick={handleRunAudit}
                className="w-full flex items-center justify-center gap-2 bg-[#990000] hover:bg-[#800020] text-white font-serif font-extrabold py-3 rounded-md text-xs tracking-wide transition shadow-md"
              >
                <PlayCircle className="w-4 h-4" />
                Execute Multilingual Audit
              </button>
            ) : (
              <button
                onClick={handleStopAudit}
                className="w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-600 text-white font-serif font-extrabold py-3 rounded-md text-xs tracking-wide transition shadow-md"
              >
                <StopCircle className="w-4 h-4" />
                Halt Audit Execution
              </button>
            )}
          </div>
        </div>

        {/* Live Terminal Progress */}
        <div className={`p-5 rounded-xl border-2 ornate-border flex flex-col justify-between space-y-4 lg:col-span-2 shadow-sm ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between border-b-2 pb-2.5 border-[#b8a68d] dark:border-[#524434] mb-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider font-cinzel flex items-center gap-2 text-[#000000] dark:text-[#ffffff]">
                <Layers className="w-4 h-4 text-[#b45309]" />
                Audit Execution Terminal Output
              </h2>
              <span className="text-xs font-mono font-extrabold text-[#000000] dark:text-[#ffffff]">
                {progress.completed} / {progress.total} Test Cases
              </span>
            </div>

            <div className="space-y-1.5 mb-4 font-mono text-xs font-bold text-[#000000] dark:text-[#ffffff]">
              <div className="flex justify-between">
                <span>Progress: {percentComplete}%</span>
                <span>{isExecuting ? 'Processing...' : 'Ready'}</span>
              </div>
              <div className={`w-full h-3.5 rounded border ${inputBg}`}>
                <div
                  className="h-full bg-[#b45309] transition-all duration-300 rounded-xs"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-4 rounded-md border h-80 overflow-y-auto font-mono text-xs space-y-1.5 font-bold ${
              darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]'
            }`}>
              {logs.length === 0 ? (
                <div className="italic text-[#785a3c]">Terminal idle. Click "Execute Multilingual Audit" to launch experiment.</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={
                    log.includes('[ERROR]') ? 'text-rose-600 font-extrabold' :
                    log.includes('[SUCCESS]') ? 'text-emerald-600 font-extrabold' :
                    log.includes('[INFO]') ? 'text-[#b45309] font-extrabold' : ''
                  }>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`p-3 rounded-md border text-xs font-bold italic flex items-center gap-2 ${
            darkMode ? 'bg-[#12100e] border-[#524434] text-[#e5e7eb]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#27272a]'
          }`}>
            <Sparkles className="w-4 h-4 text-[#b45309] shrink-0" />
            <span>
              Identical model sampling parameters (temperature = 0.7, max_tokens = 800) are enforced across English, Hindi, and Hinglish.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
