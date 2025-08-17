import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

const EmailSharer = ({ onShare }) => {
  const [emails, setEmails] = useState(['']);
  const [subject, setSubject] = useState('Meeting Summary');
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState(null); // null, 'success', 'error'

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter(email => email.trim() && emailRegex.test(email.trim()));
    return validEmails;
  };

  const handleShare = async () => {
    const validEmails = validateEmails();
    
    if (validEmails.length === 0) {
      alert('Please enter at least one valid email address');
      return;
    }

    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    setIsSharing(true);
    setShareStatus(null);

    try {
      await onShare(validEmails, subject);
      setShareStatus('success');
      // Reset form after successful share
      setTimeout(() => {
        setEmails(['']);
        setSubject('Meeting Summary');
        setShareStatus(null);
      }, 3000);
    } catch (error) {
      setShareStatus('error');
      setTimeout(() => setShareStatus(null), 5000);
    } finally {
      setIsSharing(false);
    }
  };

  const quickEmailTemplates = [
    'john@company.com',
    'sarah@company.com', 
    'manager@company.com'
  ];

  const subjectTemplates = [
    'Meeting Summary - [Date]',
    'Action Items from Today\'s Meeting',
    'Key Decisions and Next Steps',
    'Meeting Notes and Follow-ups'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card h-fit"
    >
      <div className="flex items-center mb-6">
        <Mail className="w-5 h-5 mr-2 text-green-500" />
        <h3 className="text-xl font-bold text-gray-800">Share via Email</h3>
      </div>

      {/* Subject Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
          placeholder="Enter email subject..."
        />
        
        {/* Subject Templates */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-2">Quick templates:</p>
          <div className="flex flex-wrap gap-1">
            {subjectTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => setSubject(template)}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Recipients */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipients
        </label>
        
        <AnimatePresence>
          {emails.map((email, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-2 mb-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                className="input-field flex-1"
                placeholder="recipient@company.com"
              />
              {emails.length > 1 && (
                <button
                  onClick={() => removeEmailField(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Email Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addEmailField}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add another recipient</span>
        </motion.button>

        {/* Quick Email Templates */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-1">
            {quickEmailTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  const emptyIndex = emails.findIndex(email => !email.trim());
                  if (emptyIndex !== -1) {
                    updateEmail(emptyIndex, template);
                  } else {
                    setEmails([...emails, template]);
                  }
                }}
                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Email Preview:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>To:</strong> {validateEmails().join(', ') || 'No valid recipients'}</div>
          <div><strong>Subject:</strong> {subject || 'No subject'}</div>
          <div><strong>Body:</strong> Meeting summary will be included in the email body</div>
        </div>
      </div>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        disabled={isSharing || validateEmails().length === 0 || !subject.trim()}
        className={`btn-secondary w-full flex items-center justify-center space-x-2 ${
          (isSharing || validateEmails().length === 0 || !subject.trim()) 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
      >
        {isSharing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Summary</span>
          </>
        )}
      </motion.button>

      {/* Status Messages */}
      <AnimatePresence>
        {shareStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
              shareStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {shareStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">
              {shareStatus === 'success' 
                ? 'Summary sent successfully!' 
                : 'Failed to send summary. Please try again.'
              }
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">📧 Email Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Summary will be formatted nicely in the email body</li>
          <li>• Recipients will receive the edited version of your summary</li>
          <li>• Email will include timestamp and meeting details</li>
          <li>• You can add multiple recipients and customize the subject</li>
        </ul>
      </div>

      {/* Validation Info */}
      {emails.some(email => email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700 flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Some email addresses appear to be invalid</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmailSharer;
