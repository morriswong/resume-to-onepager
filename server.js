const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const { generateOnepager } = require('./services/groqService');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);

    const onepager = await generateOnepager(data.text);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    return res.json({ onepager });
  } catch (error) {
    console.error('Upload processing error:', error);
    return res.status(500).json({ message: 'An error occurred while processing the file.' });
  }
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});