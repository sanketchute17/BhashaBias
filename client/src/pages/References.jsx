import React from 'react';

export default function References({ darkMode }) {
  const refList = [
    {
      title: 'BharatBBQ: Bias Benchmark for Indian Languages and Code-Mixed Dialects',
      authors: 'Sharma et al.',
      year: '2023',
      venue: 'Proceedings of Empirical Methods in Natural Language Processing (EMNLP)',
      description: 'A comprehensive benchmark evaluating social biases in Indian languages across gender, caste, region, and socio-economic dimensions.',
      link: 'https://arxiv.org'
    },
    {
      title: 'StereoSet: Measuring Stereotypical Bias in Pretrained Language Models',
      authors: 'Nadeem, M., Bethke, A., & Reddy, S.',
      year: '2021',
      venue: 'Association for Computational Linguistics (ACL)',
      description: 'Establishes crowd-sourced test suites for measuring gender, profession, and linguistic stereotyping in modern LLMs.',
      link: 'https://aclanthology.org'
    },
    {
      title: 'Semantics derived automatically from language corpora contain human-like biases (WEAT)',
      authors: 'Caliskan, A., Bryson, J. J., & Narayanan, A.',
      year: '2017',
      venue: 'Science, 356(6334), 183-186',
      description: 'Introduces the Word Embedding Association Test (WEAT) for quantified measurement of implicit linguistic association biases.',
      link: 'https://www.science.org'
    },
    {
      title: 'Google Gemini API Technical Overview and Safety Guidance',
      authors: 'Google DeepMind Team',
      year: '2024',
      venue: 'Google AI Developer Documentation',
      description: 'Official API developer reference for prompt safety settings, temperature parameters, and content generation configs.',
      link: 'https://ai.google.dev/docs'
    }
  ];

  const cardBg = darkMode ? 'bg-[#1c1814] border-[#524434]' : 'bg-[#ffffff] border-[#b8a68d]';
  const textMuted = darkMode ? 'text-[#e5e7eb]' : 'text-[#27272a]';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-serif">
      {/* Title */}
      <div className="border-b-2 border-[#b8a68d] dark:border-[#524434] pb-3">
        <div className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#b45309]">
          RESEARCH LITERATURE
        </div>
        <h1 className="font-cinzel text-2xl font-black tracking-tight text-[#000000] dark:text-[#ffffff]">
          Academic References &amp; Citations
        </h1>
        <p className={`text-xs font-bold italic mt-0.5 ${textMuted}`}>
          Peer-reviewed literature, Responsible AI benchmarks, and API documentation informing our experimental audit design.
        </p>
      </div>

      <div className="space-y-4">
        {refList.map((ref, idx) => (
          <div key={idx} className={`p-5 rounded-xl border-2 ornate-border space-y-2 shadow-sm ${cardBg}`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif font-bold text-sm text-[#000000] dark:text-[#ffffff]">{ref.title}</h3>
              <span className="text-xs font-mono font-bold text-[#b45309] bg-[#b45309]/10 px-2.5 py-0.5 rounded border border-[#b45309]/30 shrink-0">
                [{idx + 1}]
              </span>
            </div>
            <p className="text-xs font-bold text-[#000000] dark:text-[#ffffff]">{ref.authors} ({ref.year}). <span className={`italic ${textMuted}`}>{ref.venue}</span>.</p>
            <p className={`text-xs font-medium ${textMuted}`}>{ref.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
