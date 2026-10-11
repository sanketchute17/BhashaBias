import React, { useState, useEffect } from 'react';

export default function IntroSequence({ onComplete }) {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [line4, setLine4] = useState('');
  const [line5, setLine5] = useState('');
  const [stage, setStage] = useState(1);

  const fullLine1 = "RESPONSIBLE AI RESEARCH LAB";
  const fullLine2 = "BHASHABIAS";
  const fullLine3 = "H I N G L I S H   B I A S   A U D I T";
  const fullLine4 = "OF AN AI ASSISTANT";
  const fullLine5 = '"Comparing AI Behaviour Across English, Hindi and Hinglish"';

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    let isMounted = true;

    const runTypewriter = async () => {
      // Line 1
      for (let i = 0; i <= fullLine1.length; i++) {
        if (!isMounted) return;
        setLine1(fullLine1.slice(0, i));
        await new Promise(r => setTimeout(r, 45));
      }
      await new Promise(r => setTimeout(r, 300));
      setStage(2);

      // Line 2
      for (let i = 0; i <= fullLine2.length; i++) {
        if (!isMounted) return;
        setLine2(fullLine2.slice(0, i));
        await new Promise(r => setTimeout(r, 60));
      }
      await new Promise(r => setTimeout(r, 400));
      setStage(3);

      // Line 3
      for (let i = 0; i <= fullLine3.length; i++) {
        if (!isMounted) return;
        setLine3(fullLine3.slice(0, i));
        await new Promise(r => setTimeout(r, 40));
      }
      await new Promise(r => setTimeout(r, 300));
      setStage(4);

      // Line 4
      for (let i = 0; i <= fullLine4.length; i++) {
        if (!isMounted) return;
        setLine4(fullLine4.slice(0, i));
        await new Promise(r => setTimeout(r, 45));
      }
      await new Promise(r => setTimeout(r, 300));
      setStage(5);

      // Line 5
      for (let i = 0; i <= fullLine5.length; i++) {
        if (!isMounted) return;
        setLine5(fullLine5.slice(0, i));
        await new Promise(r => setTimeout(r, 30));
      }
      await new Promise(r => setTimeout(r, 1200));

      if (isMounted) onComplete();
    };

    runTypewriter();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#12100e] text-[#f5f2eb] flex flex-col items-center justify-center p-6 z-50 font-serif select-none">
      {/* Background vignette & subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      
      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-xs text-[#9e9484] hover:text-[#f5f2eb] border border-[#38322b] px-3.5 py-1.5 rounded uppercase tracking-widest transition"
      >
        Skip Intro &rarr;
      </button>

      {/* Terminal Terminal Paper Box */}
      <div className="max-w-2xl w-full text-center space-y-6 relative z-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[#b45309] font-mono font-bold h-6">
          {line1}
          {stage === 1 && <span className="inline-block w-2 h-4 bg-[#b45309] ml-1 animate-blink"></span>}
        </div>

        <div className="text-3xl font-extrabold tracking-widest text-[#f5f2eb] font-mono h-10 border-b border-[#38322b] pb-2">
          {line2}
          {stage === 2 && <span className="inline-block w-2.5 h-6 bg-[#f5f2eb] ml-1 animate-blink"></span>}
        </div>

        <div className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#d97706] h-12 uppercase">
          {line3}
          {stage === 3 && <span className="inline-block w-2.5 h-6 bg-[#d97706] ml-1 animate-blink"></span>}
        </div>

        <div className="text-lg font-semibold tracking-wider text-[#d6d0c4] h-8">
          {line4}
          {stage === 4 && <span className="inline-block w-2 h-5 bg-[#d6d0c4] ml-1 animate-blink"></span>}
        </div>

        <div className="text-sm italic text-[#9e9484] h-6 pt-2 font-serif">
          {line5}
          {stage === 5 && <span className="inline-block w-2 h-4 bg-[#9e9484] ml-1 animate-blink"></span>}
        </div>
      </div>

      <div className="absolute bottom-8 text-[11px] font-mono text-[#78716c] uppercase tracking-widest">
        Archive System Initialization • Responsible AI Lab
      </div>
    </div>
  );
}
