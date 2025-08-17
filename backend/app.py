from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import google.generativeai as genai
from datetime import datetime
import logging

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
def configure_gemini():
    """Configure Gemini AI with API key"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        logger.warning("GEMINI_API_KEY not found in environment variables")
        return False
    
    try:
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        logger.error(f"Failed to configure Gemini AI: {str(e)}")
        return False

# Email configuration
EMAIL_CONFIG = {
    'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('SMTP_PORT', '587')),
    'email': os.getenv('EMAIL_ADDRESS'),
    'password': os.getenv('EMAIL_PASSWORD')
}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'gemini_configured': configure_gemini(),
        'email_configured': bool(EMAIL_CONFIG['email'] and EMAIL_CONFIG['password'])
    })

@app.route('/api/summarize', methods=['POST'])
def summarize_transcript():
    """Summarize transcript using Gemini AI"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        transcript = data.get('transcript', '').strip()
        custom_prompt = data.get('prompt', '').strip()
        
        if not transcript:
            return jsonify({'success': False, 'error': 'Transcript is required'}), 400
        
        if len(transcript) < 50:
            return jsonify({'success': False, 'error': 'Transcript too short (minimum 50 characters)'}), 400
        
        # Configure Gemini AI
        if not configure_gemini():
            return jsonify({'success': False, 'error': 'Gemini AI not configured. Please set GEMINI_API_KEY environment variable.'}), 500
        
        try:
            # Initialize the model
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Create the prompt
            if custom_prompt:
                full_prompt = f"""
Please analyze the following meeting transcript and create a summary based on these specific instructions:

INSTRUCTIONS: {custom_prompt}

TRANSCRIPT:
{transcript}

Please provide a well-structured summary that follows the instructions above. Format the output with clear sections and bullet points where appropriate.
"""
            else:
                full_prompt = f"""
Please analyze the following meeting transcript and create a comprehensive summary including:

1. **Meeting Overview**: Brief description of the meeting's main purpose
2. **Key Discussion Points**: Main topics discussed
3. **Decisions Made**: Any decisions or conclusions reached
4. **Action Items**: Tasks assigned with responsible parties (if mentioned)
5. **Next Steps**: Follow-up actions or future meetings planned

TRANSCRIPT:
{transcript}

Please format the summary in a clear, professional manner with appropriate headings and bullet points.
"""
            
            # Generate the summary
            response = model.generate_content(full_prompt)
            summary = response.text
            
            logger.info(f"Successfully generated summary for transcript of length {len(transcript)}")
            
            return jsonify({
                'success': True,
                'summary': summary,
                'transcript_length': len(transcript),
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Gemini AI error: {str(e)}")
            return jsonify({'success': False, 'error': f'AI processing failed: {str(e)}'}), 500
            
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/share-email', methods=['POST'])
def share_via_email():
    """Share summary via email"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        summary = data.get('summary', '').strip()
        recipient_emails = data.get('emails', [])
        subject = data.get('subject', 'Meeting Summary').strip()
        
        if not summary:
            return jsonify({'success': False, 'error': 'Summary is required'}), 400
        
        if not recipient_emails:
            return jsonify({'success': False, 'error': 'At least one recipient email is required'}), 400
        
        # Validate email configuration
        if not EMAIL_CONFIG['email'] or not EMAIL_CONFIG['password']:
            return jsonify({
                'success': False, 
                'error': 'Email not configured. Please set EMAIL_ADDRESS and EMAIL_PASSWORD environment variables.'
            }), 500
        
        # Create email content
        email_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .header {{ background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .summary {{ background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }}
        .footer {{ margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #6c757d; }}
        h1 {{ color: #495057; margin: 0; }}
        h2 {{ color: #495057; border-bottom: 2px solid #007bff; padding-bottom: 5px; }}
        .timestamp {{ color: #6c757d; font-size: 14px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Meeting Summary</h1>
        <p class="timestamp">Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
    </div>
    
    <div class="summary">
        {summary.replace('\\n', '<br>').replace('**', '<strong>').replace('**', '</strong>')}
    </div>
    
    <div class="footer">
        <p>This summary was generated using AI-powered analysis. Please review for accuracy.</p>
        <p>Generated by Meeting Summarizer - AI-Powered Transcript Analysis</p>
    </div>
</body>
</html>
"""
        
        # Send email to each recipient
        success_count = 0
        failed_emails = []
        
        for email in recipient_emails:
            try:
                msg = MIMEMultipart('alternative')
                msg['From'] = EMAIL_CONFIG['email']
                msg['To'] = email
                msg['Subject'] = subject
                
                # Add HTML content
                html_part = MIMEText(email_body, 'html')
                msg.attach(html_part)
                
                # Add plain text version
                plain_text = summary
                text_part = MIMEText(f"Meeting Summary\\n\\nGenerated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}\\n\\n{plain_text}\\n\\nThis summary was generated using AI-powered analysis.", 'plain')
                msg.attach(text_part)
                
                # Send email
                with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
                    server.starttls()
                    server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
                    server.send_message(msg)
                
                success_count += 1
                logger.info(f"Successfully sent email to {email}")
                
            except Exception as e:
                logger.error(f"Failed to send email to {email}: {str(e)}")
                failed_emails.append(email)
        
        if success_count > 0:
            response_message = f"Successfully sent to {success_count} recipient(s)"
            if failed_emails:
                response_message += f". Failed to send to: {', '.join(failed_emails)}"
            
            return jsonify({
                'success': True,
                'message': response_message,
                'sent_count': success_count,
                'failed_emails': failed_emails
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to send email to any recipients',
                'failed_emails': failed_emails
            }), 500
            
    except Exception as e:
        logger.error(f"Email sharing error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current configuration status"""
    return jsonify({
        'gemini_configured': configure_gemini(),
        'email_configured': bool(EMAIL_CONFIG['email'] and EMAIL_CONFIG['password']),
        'smtp_server': EMAIL_CONFIG['smtp_server'],
        'smtp_port': EMAIL_CONFIG['smtp_port']
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Print configuration status on startup
    print("🚀 Starting Meeting Summarizer Backend...")
    print(f"📊 Gemini AI configured: {configure_gemini()}")
    print(f"📧 Email configured: {bool(EMAIL_CONFIG['email'] and EMAIL_CONFIG['password'])}")
    
    if not configure_gemini():
        print("⚠️  Warning: Gemini AI not configured. Set GEMINI_API_KEY environment variable.")
    
    if not EMAIL_CONFIG['email'] or not EMAIL_CONFIG['password']:
        print("⚠️  Warning: Email not configured. Set EMAIL_ADDRESS and EMAIL_PASSWORD environment variables.")
    
    # Get port from environment variable (Render sets this automatically)
    port = int(os.getenv('PORT', 5000))
    print(f"🌐 Server starting on port {port}")
    
    # Run the app (production-ready)
    app.run(debug=False, host='0.0.0.0', port=port)
