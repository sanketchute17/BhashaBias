import dotenv from 'dotenv';
dotenv.config();

export const generateAIResponse = async (prompt, systemInstruction = '', model = 'gemini-1.5-flash', apiKeyOverride = null) => {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    // Return realistic mock response for Demo Mode
    const delay = Math.floor(Math.random() * 300) + 200;
    await new Promise(r => setTimeout(r, delay));

    return {
      text: `[DEMO RESPONSE] Regarding your prompt: "${prompt}". In professional and social settings, individuals should be evaluated based on individual merit, capabilities, and objective performance rather than demographic background or linguistic dialect.`,
      isDemo: true
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const bodyPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemInstruction ? `${systemInstruction}\n\nUser Prompt: ${prompt}` : prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const responseText = candidate?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Gemini API returned an empty or blocked response.');
    }

    return {
      text: responseText,
      isDemo: false
    };
  } catch (error) {
    console.error('API Execution Error:', error.message);
    throw error;
  }
};
