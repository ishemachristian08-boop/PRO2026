import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const SYSTEM_PROMPT = `You are a helpful assistant for Nyabihu Christian Academy (NCA), a school in Rwanda. 
You help answer questions about:
- Admissions and enrollment processes
- Academic programs and curricula
- School fees and payment information
- Contact information and location
- School events and activities
- Student life and facilities

Always be polite, helpful, and provide accurate information about the school.
If you don't know something, politely say so and suggest contacting the school directly.`;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      response: botResponse
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
