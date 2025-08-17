import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, Send, Edit3, CheckCircle, Copy, Mail } from 'lucide-react';
import TranscriptUploader from './components/TranscriptUploader';
import CustomPromptInput from './components/CustomPromptInput';
import SummaryDisplay from './components/SummaryDisplay';
import EmailSharer from './components/EmailSharer';
import LoadingAnimation from './components/LoadingAnimation';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  const steps = [
    { id: 1, title: 'Upload Transcript', icon: Upload, description: 'Upload your meeting transcript' },
    { id: 2, title: 'Custom Prompt', icon: Edit3, description: 'Enter your summarization instructions' },
    { id: 3, title: 'Generate Summary', icon: Sparkles, description: 'AI generates your summary' },
    { id: 4, title: 'Edit & Share', icon: Send, description: 'Edit and share your summary' }
  ];

  const handleTranscriptUpload = (text) => {
    setTranscript(text);
    setCurrentStep(2);
  };

  const handlePromptSubmit = (prompt) => {
    setCustomPrompt(prompt);
    setCurrentStep(3);
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript,
          prompt: customPrompt
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
        setEditedSummary(data.summary);
        setCurrentStep(4);
      } else {
        alert('Error generating summary: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailShare = async (emails, subject) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/share-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: editedSummary,
          emails: emails,
          subject: subject
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Summary shared successfully!');
      } else {
        alert('Error sharing summary: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sharing summary');
    }
  };

  const resetApp = () => {
    setCurrentStep(1);
    setTranscript('');
    setCustomPrompt('');
    setSummary('');
    setEditedSummary('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meeting Summarizer
                </h1>
                <p className="text-sm text-gray-600">AI-powered transcript analysis</p>
              </div>
            </div>
            
            <button
              onClick={resetApp}
              className="btn-primary flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>New Summary</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white shadow-lg' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition-colors duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TranscriptUploader onUpload={handleTranscriptUpload} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <CustomPromptInput onSubmit={handlePromptSubmit} transcript={transcript} />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {isLoading ? (
                <LoadingAnimation />
              ) : (
                <div className="card max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Generate Summary</h2>
                  <p className="text-gray-600 mb-6">
                    Click the button below to generate your AI-powered summary using Gemini AI.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateSummary}
                    className="btn-primary flex items-center space-x-2 mx-auto text-lg px-8 py-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Summary</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SummaryDisplay
                  summary={summary}
                  editedSummary={editedSummary}
                  onEdit={setEditedSummary}
                />
                <EmailSharer onShare={handleEmailShare} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
