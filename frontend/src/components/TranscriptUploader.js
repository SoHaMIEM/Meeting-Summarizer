import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Clipboard, AlertCircle } from 'lucide-react';

const TranscriptUploader = ({ onUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const [text, setText] = useState('');
  const [uploadMethod, setUploadMethod] = useState('paste'); // 'paste' or 'file'
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setText(content);
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a text file (.txt)');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setText(content);
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a text file (.txt)');
      }
    }
  };

  const handleSubmit = () => {
    if (text.trim().length < 50) {
      alert('Please provide a transcript with at least 50 characters');
      return;
    }
    onUpload(text);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Transcript</h2>
          <p className="text-gray-600">
            Upload a meeting transcript or paste your text to get started with AI-powered summarization
          </p>
        </div>

        {/* Upload Method Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setUploadMethod('paste')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                uploadMethod === 'paste'
                  ? 'bg-white shadow-md text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clipboard className="w-4 h-4 inline mr-2" />
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                uploadMethod === 'file'
                  ? 'bg-white shadow-md text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {uploadMethod === 'paste' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your meeting transcript here...

Example:
Meeting Date: August 17, 2025
Attendees: John, Sarah, Mike

John: Let's discuss the quarterly goals...
Sarah: I think we should focus on increasing user engagement...
Mike: The analytics show we need to improve our onboarding process..."
              className="input-field h-64 resize-none"
            />
            <div className="mt-2 text-sm text-gray-500">
              Character count: {text.length} {text.length < 50 && text.length > 0 && '(minimum 50 characters)'}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <motion.div
                animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your text file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports .txt files up to 10MB
                </p>
              </motion.div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileSelect}
              className="hidden"
            />

            {text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">File loaded successfully</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {text.length} characters loaded
                  </div>
                  <div className="mt-2 max-h-32 overflow-y-auto text-sm text-gray-600 bg-white p-2 rounded">
                    {text.substring(0, 200)}...
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={text.trim().length < 50}
            className={`btn-primary flex items-center space-x-2 ${
              text.trim().length < 50 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Continue to Prompt</span>
          </motion.button>
        </div>

        {text.trim().length > 0 && text.trim().length < 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center text-amber-600"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">Please provide at least 50 characters for better summarization</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TranscriptUploader;
