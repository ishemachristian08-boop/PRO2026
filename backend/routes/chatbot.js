const express = require('express');
const router = express.Router();
require('dotenv').config();

// Initialize OpenAI client
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for the chatbot
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

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Build messages array with history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get response from AI'
    });
  }
});

module.exports = router;
