import React, { useState, useEffect } from 'react';
import { Copy, Printer, Check, AlertTriangle } from 'lucide-react';
import { MOCK_REPORT_MD } from '../data/mockData';

export default function ReportGenerator({ darkMode }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/report/generate');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.markdown) {
          setReport(data);
          return;
        }
      }
      setReport({ success: true, isDemo: true, markdown: MOCK_REPORT_MD });
    } catch (e) {
      setReport({ success: true, isDemo: true, markdown: MOCK_REPORT_MD });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (report?.markdown) {
      navigator.clipboard.writeText(report.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-12 text-[#27272a] dark:text-[#e5e7eb] italic font-bold">Compiling 22-section academic paper report...</div>;

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-serif">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3 print:hidden">
        <div>
          <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
            ACADEMIC PUBLICATION
          </div>
          <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
            Academic Bias Report
          </h1>
          <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
            22-Section Formal Research Paper &amp; Production Bias Audit Report.
          </p>
        </div>

        <div className="flex items-center gap-2 font-serif text-xs font-bold">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md border-2 font-extrabold transition ${
              darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#faf5ea] border-[#b8a68d]'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#b45309]" />}
            {copied ? 'Copied Markdown' : 'Copy Markdown'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#990000] hover:bg-[#800020] text-white px-4 py-2 rounded-md font-extrabold transition shadow"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Mode Warning */}
      {report?.isDemo && (
        <div className="bg-[#b45309]/10 border-2 border-[#b45309] text-[#b45309] dark:text-[#fbbf24] p-3.5 rounded-md text-xs font-mono font-extrabold flex items-center gap-2 print:hidden">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#b45309]" />
          <span>REPORT MODE: DEMO DATA — Numbers are derived from baseline demo dataset for demonstration.</span>
        </div>
      )}

      {/* Academic Paper Visual Frame */}
      <div className={`p-8 md:p-12 rounded-xl border-2 ornate-border shadow-2xl space-y-6 print:bg-white print:text-black print:p-0 print:border-none ${cardBg}`}>
        <article className="prose max-w-none text-xs leading-relaxed space-y-4 print:text-black">
          <div className="whitespace-pre-wrap font-serif leading-relaxed text-[#000000] dark:text-[#ffffff] print:text-black font-medium">
            {report?.markdown}
          </div>
        </article>
      </div>
    </div>
  );
}
