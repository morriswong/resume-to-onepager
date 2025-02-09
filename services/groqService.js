const Groq = require('groq-sdk');
const config = require('../config');

const groq = new Groq({
  apiKey: config.groq.apiKey,
});

async function generateOnepager(resumeText) {
  const prompt = `
  Based on the following resume text, generate a one-pager using the Mnookin two-pager template. Format the output in Markdown. Include the following sections:

  # What I Love and Hate Doing
  **What I Love:** [Content here]  
  **What I Hate:** [Content here]  

  # Must-Haves
  - [Must-have 1]  
  - [Must-have 2]  
  - [Must-have 3]  

  # Must-Nots
  - [Must-not 1]  
  - [Must-not 2]  
  - [Must-not 3]  

  # Strengths and Weaknesses
  **Strengths:**  
  - [Strength 1]  
  - [Strength 2]  

  **Weaknesses:**  
  - [Weakness 1]  
  - [Weakness 2]  

  # Career Goals
  - [Short-term goal]  
  - [Long-term goal]  

  # Candidate Market Fit
  [Content here]  

  Resume Text:
  ${resumeText}
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: config.groq.model,
      max_tokens: config.groq.maxTokens,
      temperature: config.groq.temperature,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate one-pager using Groq API');
  }
}

module.exports = { generateOnepager }; 