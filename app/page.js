// File: app/page.js
'use client';

import { useState } from 'react';

export default function HomePage() {
  // State variables to hold data and UI status
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in bullet points for executives');
  const [summary, setSummary] = useState('');
  const [recipients, setRecipients] = useState('');
  
  // Loading and feedback states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // --- Handler Functions ---

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setFeedbackMessage('Please provide a transcript.');
      return;
    }
    setIsGenerating(true);
    setFeedbackMessage('');
    setSummary('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setFeedbackMessage('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareEmail = async () => {
    if (!recipients.trim() || !summary.trim()) {
        setFeedbackMessage('Please enter recipient emails and generate a summary first.');
        return;
    }
    setIsSharing(true);
    setFeedbackMessage('');

    try {
        const response = await fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipients, summary }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Unknown error');
        }

        setFeedbackMessage('Summary sent successfully!');
        setRecipients(''); // Clear input after sending
    } catch (error) {
        console.error('Failed to send email:', error);
        setFeedbackMessage(`Failed to send email: ${error.message}`);
    } finally {
        setIsSharing(false);
    }
  };

  // --- JSX for the UI ---

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400">AI Meeting Summarizer 🤖</h1>
          <p className="text-gray-400 mt-2">Upload your transcript, provide a prompt, and get your summary!</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <div>
              <label htmlFor="transcript" className="block text-sm font-medium text-gray-300 mb-2">
                📝 Paste Meeting Transcript
              </label>
              <textarea
                id="transcript"
                rows="12"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                placeholder="Paste your full meeting notes or call transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                💡 Custom Instruction / Prompt
              </label>
              <input
                id="prompt"
                type="text"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Summary ✨'
              )}
            </button>
          </div>

          {/* Right Column: Output and Sharing */}
          <div className="space-y-6">
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
                📄 Generated Summary (Editable)
              </label>
              <textarea
                id="summary"
                rows="12"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                placeholder="Your AI-generated summary will appear here..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="recipients" className="block text-sm font-medium text-gray-300 mb-2">
                📨 Share via Email
              </label>
              <input
                id="recipients"
                type="email"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                placeholder="recipient1@example.com, recipient2@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
            </div>
            <button
              onClick={handleShareEmail}
              disabled={isSharing || !summary}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sharing...
                </>
              ) : (
                'Share Summary ✉️'
              )}
            </button>
          </div>
        </div>

        {/* Feedback Area */}
        {feedbackMessage && (
            <div className="text-center p-3 mt-4 rounded-lg bg-gray-700 text-cyan-300">
                <p>{feedbackMessage}</p>
            </div>
        )}

      </div>
    </div>
  );
}