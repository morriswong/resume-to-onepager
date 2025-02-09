require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama3-8b-8192',
    maxTokens: 500,
    temperature: 0.7
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}; 