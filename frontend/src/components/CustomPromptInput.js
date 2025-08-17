import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Lightbulb, ArrowRight, FileText } from 'lucide-react';

const CustomPromptInput = ({ onSubmit, transcript }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const promptTemplates = [
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level overview for leadership',
      prompt: 'Create an executive summary with key decisions, action items, and next steps. Focus on strategic implications and outcomes.'
    },
    {
      id: 'actionItems',
      title: 'Action Items Focus',
      description: 'Extract tasks and responsibilities',
      prompt: 'Extract all action items, tasks, and responsibilities mentioned in the meeting. Include who is responsible and any deadlines mentioned.'
    },
    {
      id: 'decisions',
      title: 'Key Decisions',
      description: 'Focus on decisions made',
      prompt: 'Summarize all key decisions made during the meeting, including the rationale behind each decision and any dissenting opinions.'
    },
    {
      id: 'technical',
      title: 'Technical Summary',
      description: 'Technical details and specifications',
      prompt: 'Provide a technical summary focusing on technical decisions, specifications, architecture discussions, and implementation details.'
    },
    {
      id: 'followup',
      title: 'Follow-up Required',
      description: 'Items requiring follow-up',
      prompt: 'Identify all items that require follow-up, including unanswered questions, pending decisions, and items tabled for future meetings.'
    },
    {
      id: 'custom',
      title: 'Custom Prompt',
      description: 'Write your own instructions',
      prompt: ''
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setPrompt(template.prompt);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt or select a template');
      return;
    }
    onSubmit(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Customize Your Summary</h2>
          <p className="text-gray-600">
            Choose a template or write custom instructions for how you want your transcript summarized
          </p>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promptTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <h4 className="font-semibold text-gray-800 mb-1">{template.title}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div className="mb-6">
          <label className="flex text-lg font-semibold text-gray-800 mb-3 items-center">
            <Edit3 className="w-5 h-5 mr-2 text-blue-500" />
            Your Instructions
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your custom summarization instructions here...

Examples:
- 'Summarize in bullet points with action items highlighted'
- 'Create a formal meeting minutes format'
- 'Focus on technical decisions and implementation timeline'
- 'Extract key quotes and participant contributions'"
            className="input-field h-32 resize-none"
          />
          <div className="mt-2 text-sm text-gray-500">
            Be specific about the format, focus areas, and level of detail you want in your summary.
          </div>
        </div>

        {/* Transcript Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-500" />
            Transcript Preview
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-700">
              {transcript.substring(0, 500)}
              {transcript.length > 500 && '...'}
            </p>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {transcript.length} characters • Will be processed with your custom instructions
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className={`btn-primary flex items-center space-x-2 ${
              !prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Generate Summary</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for better summaries:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific about the format you want (bullet points, paragraphs, etc.)</li>
            <li>• Mention if you want to focus on specific aspects (decisions, actions, technical details)</li>
            <li>• Specify the intended audience (executives, team members, stakeholders)</li>
            <li>• Include any particular style or tone preferences</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomPromptInput;
