# Meeting Summarizer

An AI-powered meeting notes summarizer and sharer built with React and Flask.

## Features

🤖 **AI-Powered Summarization**
- Upload text transcripts or paste meeting notes
- Custom prompts for different summary styles
- Powered by Google's Gemini AI (gemini-1.5-flash)

✨ **Modern UI/UX**
- Beautiful, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Progressive step-by-step workflow
- Real-time editing capabilities

📧 **Email Sharing**
- Share summaries via email to multiple recipients
- Customizable email subjects and formatting
- HTML email templates with professional styling

🎨 **Advanced Features**
- Multiple summary templates (Executive, Action Items, Technical, etc.)
- Real-time text editing with preview modes
- Copy to clipboard functionality
- Word count and statistics
- Drag-and-drop file upload

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

### Backend
- **Flask** - Python web framework
- **Google Generative AI** - Gemini AI integration
- **Flask-CORS** - Cross-origin resource sharing
- **SMTP** - Email sending functionality

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Google AI API key (for Gemini)
- Gmail account (for email features)

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd "c:\Users\SOHAM GHOSH\Desktop\Summarizer"

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cd backend
copy .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Get your API key from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail configuration (use App Password for security)
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# SMTP settings (default for Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

### 3. Run the Application

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Configuration Guide

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### Setting up Gmail for Email Sharing
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this App Password (not your regular password) in the `.env` file

## Usage

### 1. Upload Transcript
- Paste text directly or upload a .txt file
- Supports drag-and-drop functionality
- Minimum 50 characters required

### 2. Customize Summary
Choose from templates:
- **Executive Summary** - High-level overview for leadership
- **Action Items Focus** - Extract tasks and responsibilities
- **Key Decisions** - Focus on decisions made
- **Technical Summary** - Technical details and specifications
- **Follow-up Required** - Items requiring follow-up
- **Custom Prompt** - Write your own instructions

### 3. Generate & Edit
- AI generates summary based on your prompt
- Edit the summary in real-time
- Preview formatted version or raw text
- Copy to clipboard functionality

### 4. Share via Email
- Add multiple recipients
- Customize email subject
- Professional HTML email formatting
- Real-time email validation

## API Endpoints

### Health Check
```
GET /api/health
```

### Summarize Transcript
```
POST /api/summarize
Content-Type: application/json

{
  "transcript": "Meeting transcript text...",
  "prompt": "Custom summarization instructions"
}
```

### Share via Email
```
POST /api/share-email
Content-Type: application/json

{
  "summary": "Generated summary text...",
  "emails": ["recipient1@email.com", "recipient2@email.com"],
  "subject": "Meeting Summary"
}
```

### Configuration Status
```
GET /api/config
```

## Project Structure

```
Summarizer/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── TranscriptUploader.js
│   │   │   ├── CustomPromptInput.js
│   │   │   ├── SummaryDisplay.js
│   │   │   ├── EmailSharer.js
│   │   │   └── LoadingAnimation.js
│   │   ├── App.js           # Main application component
│   │   ├── index.js         # Application entry point
│   │   └── index.css        # Tailwind CSS styles
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── backend/                 # Flask application
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── .github/
│   └── copilot-instructions.md
└── README.md               # This file
```

## Features in Detail

### AI Summarization
- Uses Google's Gemini 1.5 Flash model for fast, accurate summaries
- Supports custom prompts for different summary styles
- Intelligent parsing of meeting content
- Handles various transcript formats

### Modern UI/UX
- Glass morphism design effects
- Smooth page transitions
- Loading animations with progress indication
- Responsive design for all screen sizes
- Interactive form validation

### Email Integration
- HTML email templates with professional styling
- Support for multiple recipients
- Customizable subjects and content
- Error handling and retry logic
- Plain text fallback for compatibility

### Security & Best Practices
- Environment variable configuration
- Input validation and sanitization
- Error handling and logging
- CORS configuration for secure API access
- App passwords for email security

## Troubleshooting

### Common Issues

1. **"Gemini AI not configured"**
   - Ensure GEMINI_API_KEY is set in backend/.env
   - Check API key is valid at Google AI Studio

2. **"Email not configured"**
   - Set EMAIL_ADDRESS and EMAIL_PASSWORD in backend/.env
   - Use Gmail App Password, not regular password
   - Enable 2-factor authentication first

3. **CORS errors**
   - Ensure backend is running on port 5000
   - Check frontend is making requests to correct URL

4. **Dependencies not installing**
   - Update Node.js to version 16+
   - Update Python to version 3.8+
   - Try clearing npm/pip cache

### Development Tips

- Use browser dev tools to monitor API requests
- Check backend logs for detailed error messages
- Test API endpoints directly with curl or Postman
- Verify environment variables are loaded correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check backend logs for error details
4. Ensure all environment variables are configured correctly

---

Built with ❤️ using React, Flask, and Google's Gemini AI
