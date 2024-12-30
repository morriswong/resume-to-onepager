const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const cors = require('cors');
const Groq = require('groq-sdk'); // Import Groq SDK
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname)));

// Explicitly serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Access the API key from environment variables
});

// Route to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
  
    try {
      // Read the uploaded PDF file
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);
  
      // Log the extracted text for debugging
      console.log('Extracted PDF Text:', data.text);
  
      // Extract email addresses using regex
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = data.text.match(emailRegex);
  
      // Log the extracted emails for debugging
      console.log('Extracted Emails:', emails);
  
      // Generate the one-pager using Groq
      const onepager = await generateOnepager(data.text);
  
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
  
      // Return both emails and the one-pager
      return res.json({ emails: emails || [], onepager });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'An error occurred while processing the file.' });
    }
  });

// Function to generate the one-pager using Groq
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
      model: 'llama3-8b-8192', // Use the Groq model
      max_tokens: 500, // Adjust based on the desired length
      temperature: 0.7, // Adjust for creativity vs. precision
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate one-pager using Groq API.');
  }
}

app.post('/send-email', async (req, res) => {
    const { emails, subject, onepager } = req.body;
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emails,
        subject: subject,
        text: onepager,
      });
  
      res.json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'An error occurred while sending the email.' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});