import React from 'react';
import { Download } from 'lucide-react';

export default function Reproduction({ darkMode }) {
  const codeSnippet1 = `# 1. Load Multilingual Dataset (50 Scenarios)
import pandas as pd
df = pd.read_csv('multilingual_scenarios.csv')
print(f"Loaded {len(df)} scenarios across categories: {df['category'].unique()}")`;

  const codeSnippet2 = `# 2. Configure Google Gemini API & Execute Prompts
import google.generativeai as genai
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

results = []
for idx, row in df.iterrows():
    for lang, prompt in [('English', row['english_prompt']), ('Hindi', row['hindi_prompt']), ('Hinglish', row['hinglish_prompt'])]:
        response = model.generate_content(prompt)
        results.append({'scenario_id': row['scenario_id'], 'language': lang, 'response': response.text})`;

  const codeSnippet3 = `# 3. Statistical Analysis - McNemar's Test
from statsmodels.stats.contingency_tables import mcnemar
# Construct 2x2 contingency table
result = mcnemar([[a, b], [c, d]], exact=False, correction=True)
print(f"McNemar Chi-Square Statistic: {result.statistic:.3f}, p-value: {result.pvalue:.4f}")`;

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const inputBg = darkMode ? 'bg-[#12100e] border-[#524434] text-[#ffffff]' : 'bg-[#faf5ea] border-[#b8a68d] text-[#000000]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-serif">
      {/* Title & Download Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div>
          <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
            REPRODUCIBILITY SUITE
          </div>
          <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
            Reproduction Code &amp; Jupyter Notebook
          </h1>
          <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
            Complete 100% reproducible execution pipeline for academic auditing and faculty verification.
          </p>
        </div>

        <a
          href="/TAE1_Bias_Audit.ipynb"
          download="TAE1_Bias_Audit.ipynb"
          className="flex items-center gap-2 bg-[#990000] hover:bg-[#800020] text-white font-serif font-extrabold px-5 py-2.5 rounded-md text-xs tracking-wide transition shadow"
        >
          <Download className="w-4 h-4" />
          Download TAE1_Bias_Audit.ipynb
        </a>
      </div>

      {/* Code Snippets */}
      <div className="space-y-4 font-mono text-xs">
        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 shadow-sm ${cardBg}`}>
          <h3 className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider">Step 1: Multilingual Scenario Import</h3>
          <pre className={`p-4 rounded-md text-xs font-mono font-bold overflow-x-auto border-2 ${inputBg}`}>
            {codeSnippet1}
          </pre>
        </div>

        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 shadow-sm ${cardBg}`}>
          <h3 className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider">Step 2: Multilingual Prompt Execution</h3>
          <pre className={`p-4 rounded-md text-xs font-mono font-bold overflow-x-auto border-2 ${inputBg}`}>
            {codeSnippet2}
          </pre>
        </div>

        <div className={`p-5 rounded-xl border-2 ornate-border space-y-3 shadow-sm ${cardBg}`}>
          <h3 className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider">Step 3: McNemar Paired Hypothesis Testing</h3>
          <pre className={`p-4 rounded-md text-xs font-mono font-bold overflow-x-auto border-2 ${inputBg}`}>
            {codeSnippet3}
          </pre>
        </div>
      </div>
    </div>
  );
}
