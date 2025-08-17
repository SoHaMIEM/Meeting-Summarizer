import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="card max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12"
      >
        {/* Main Loading Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          AI is Analyzing Your Transcript
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Gemini AI is processing your content and generating a customized summary...
        </motion.p>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {[
            { icon: Sparkles, text: "Reading transcript...", delay: 0.6 },
            { icon: Brain, text: "Understanding context...", delay: 1.2 },
            { icon: Zap, text: "Generating summary...", delay: 1.8 },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: step.delay }}
              className="flex items-center justify-center space-x-3 text-gray-700"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  delay: step.delay + 0.5, 
                  duration: 1.5, 
                  repeat: Infinity 
                }}
              >
                <step.icon className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span>{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-sm text-gray-500 italic"
        >
          💡 Did you know? AI can process thousands of words in seconds and identify key patterns humans might miss!
        </motion.div>

        {/* Floating Particles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 400, 
                y: Math.random() * 300,
                opacity: 0 
              }}
              animate={{
                x: Math.random() * 400,
                y: Math.random() * 300,
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
