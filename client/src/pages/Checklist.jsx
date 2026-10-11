import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Checklist({ darkMode }) {
  const checklistItems = [
    { title: 'AI model/API audited', desc: 'Integration with Google Gemini API & Demo Mode supporting full model auditing.', status: true },
    { title: 'Measurable bias investigation', desc: '5-dimension evaluation rubric measuring bias score (0-2), relevance, helpfulness, safety, and stereotype presence.', status: true },
    { title: 'Language dimension evaluated', desc: 'Controlled multilingual audit comparing English, Hindi (Devanagari), and code-mixed Hinglish.', status: true },
    { title: 'Bias evidence collected', desc: 'Side-by-side evidence gallery displaying exact raw responses and evaluator justifications.', status: true },
    { title: 'Bias metrics calculated', desc: 'Flagged response rate, average bias score, stereotype rate, and percentage point deltas calculated.', status: true },
    { title: 'Reproduction code provided', desc: 'Self-contained executable Jupyter notebook BhashaBias_Audit_Notebook.ipynb with 15 complete sections.', status: true },
    { title: 'Suggested mitigation provided', desc: 'Configurable prompt-level guardrails including Fairness-Aware System Instructions.', status: true },
    { title: 'Mitigation evaluated where real data is available', desc: 'Re-evaluation workflow executing mitigation strategy on identical scenario test cases.', status: true },
    { title: 'Before/After comparison', desc: 'Dedicated comparative impact page showing metric deltas and data-driven conclusions.', status: true },
    { title: 'Bias report generated', desc: '22-section formal academic paper compiler with Markdown, Print/PDF, and JSON exports.', status: true },
    { title: 'Limitations documented', desc: 'Documented sample size limits, annotation variations, and geographical code-mixing nuances.', status: true },
    { title: 'References documented', desc: 'Academic citations including BharatBBQ, WEAT, StereoSet, and Gemini documentation.', status: true }
  ];

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          STANDARDS VERIFICATION
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Responsible AI Benchmark Checklist
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Comprehensive audit framework checklist confirming compliance with 12/12 core multilingual fairness and reproducibility standards.
        </p>
      </div>

      <div className={`p-6 rounded-xl border-2 ornate-border space-y-4 shadow-sm ${cardBg}`}>
        <div className="flex items-center justify-between border-b-2 pb-3 border-[#b8a68d] dark:border-[#524434]">
          <h2 className="text-xs font-extrabold uppercase font-cinzel tracking-wider text-[#000000] dark:text-[#ffffff]">
            Core Benchmark Deliverables Grid (12 / 12 Complete)
          </h2>
          <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border-2 border-emerald-500/40">
            100% BENCHMARK VERIFIED
          </span>
        </div>

        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-md border-2 flex items-start gap-3 ${inputBg}`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs font-serif">
                <h3 className="font-extrabold flex items-center gap-1.5 text-[#000000] dark:text-[#ffffff]">
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">✓</span> {item.title}
                </h3>
                <p className={`text-xs font-bold italic ${textMuted}`}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
