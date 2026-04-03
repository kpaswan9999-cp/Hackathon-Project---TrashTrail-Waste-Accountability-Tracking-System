import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    // Extract base64 part
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `Analyze this waste image and provide:
1. Waste categories found (Plastic, Paper, Metal, Glass, Organic, E-waste, Textile, Hazardous)
2. Recommended bin type (Dry/Wet/Hazardous)
3. Is the waste properly segregated? (Yes/No)
4. Recycling tips for this waste
Return EXACTLY a JSON format like this, and nothing else (no markdown wrappers):
{
  "categories": ["Plastic", "Paper"],
  "binType": "Dry",
  "isSegregated": true,
  "tips": "Remove labels from plastic bottles before recycling"
}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API Error');
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedObj = JSON.parse(textResponse);

    return NextResponse.json(parsedObj);
  } catch (err) {
    console.error('AI Classification Error:', err);
    return NextResponse.json({ 
      categories: ['Mixed'], 
      binType: 'Mixed', 
      isSegregated: false, 
      tips: 'AI Classification failed or returned unreliable mapping. Please sort manually.' 
    }, { status: 200 }); // Returns gracefully in case Keys limit out during demo
  }
}
