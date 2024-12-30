# Resume to One-Pager Generator

This project is a resume parser and one-pager generator that extracts relevant information from a user's uploaded resume and generates a formatted one-pager in Markdown. The one-pager is then sent to the user's email address using the provided email addresses extracted from the resume.

## Features

- Upload a resume in PDF format.
- Extract email addresses from the resume.
- Generate a formatted one-pager in Markdown using the Groq API and a custom prompt.
- Send the generated one-pager to the user's email address.

## Technologies Used

- Front-end: HTML, CSS, JavaScript (Marked.js for Markdown parsing)
- Back-end: Node.js, Express.js, Multer, PDF-parse, Groq SDK, Nodemailer

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A Groq API key.
- Nodemailer configuration for sending emails.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/resume-to-onepager.git
cd resume-to-onepager
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your environment variables:

```
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

### Usage

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`.

3. Upload a resume in PDF format and click the "Upload and get your career-fit one pager" button.

4. The extracted emails and generated one-pager will be displayed on the page.

5. Click the "Email yourself the one-pager!" button to send the one-pager to your email address.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the creators of Multer, PDF-parse, Groq SDK, and Nodemailer for their excellent libraries.
- Special thanks to the developers of Marked.js for the Markdown parsing functionality.