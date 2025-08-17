import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, Copy, CheckCircle, FileText, Eye, EyeOff } from 'lucide-react';

const SummaryDisplay = ({ summary, editedSummary, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleEdit = (e) => {
    onEdit(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card h-fit"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Your Summary
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Preview/Edit Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              previewMode ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
            title={previewMode ? 'Switch to raw text' : 'Switch to preview'}
          >
            {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Edit/Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isEditing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </motion.button>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            value={editedSummary}
            onChange={handleEdit}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Edit your summary here..."
          />
          <div className="mt-2 text-sm text-gray-500">
            {editedSummary.length} characters • Click Save when you're done editing
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="summary-content"
        >
          {previewMode ? (
            <div 
              className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 min-h-96 whitespace-pre-wrap"
              style={{ lineHeight: '1.6' }}
            >
              {editedSummary.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                
                // Check for bullet points
                if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                  return (
                    <div key={index} className="flex items-start mb-2">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>{paragraph.trim().substring(1).trim()}</span>
                    </div>
                  );
                }
                
                // Check for headers (lines ending with :)
                if (paragraph.trim().endsWith(':') && paragraph.length < 100) {
                  return (
                    <h4 key={index} className="font-semibold text-gray-800 mt-4 mb-2 text-lg">
                      {paragraph.trim()}
                    </h4>
                  );
                }
                
                // Regular paragraphs
                return (
                  <p key={index} className="mb-3 text-gray-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-96 font-mono text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
              {editedSummary}
            </div>
          )}
        </motion.div>
      )}

      {/* Word Count and Stats */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center text-sm">
          <div className="text-blue-700">
            <span className="font-medium">Words:</span> {editedSummary.split(' ').filter(word => word.length > 0).length}
          </div>
          <div className="text-blue-700">
            <span className="font-medium">Characters:</span> {editedSummary.length}
          </div>
          <div className="text-blue-700">
            <span className="font-medium">Lines:</span> {editedSummary.split('\n').length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onEdit(editedSummary + '\n\n**Key Takeaways:**\n• ')}
          className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
        >
          + Add Takeaways
        </button>
        <button
          onClick={() => onEdit(editedSummary + '\n\n**Action Items:**\n• ')}
          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
        >
          + Add Actions
        </button>
        <button
          onClick={() => onEdit(editedSummary + '\n\n**Next Steps:**\n• ')}
          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
        >
          + Add Next Steps
        </button>
      </div>
    </motion.div>
  );
};

export default SummaryDisplay;
