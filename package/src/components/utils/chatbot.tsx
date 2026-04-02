// src/components/Chatbox.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  text: string | React.ReactNode;
  sender: 'user' | 'agent';
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [step, setStep] = useState<'initial' | 'collecting_info' | 'submitted'>('initial');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Let me know if you have any questions!',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.message as HTMLInputElement;
    const userMessage = input.value.trim();
    if (!userMessage) return;
    setInitialQuestion(userMessage);
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMessage },
      { sender: 'agent', text: <InfoCollectionForm /> },
    ]);
    setStep('collecting_info');
    input.value = '';
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const mobile = (e.currentTarget.elements.namedItem('mobile') as HTMLInputElement).value;
    if (!name || !mobile) return;
    console.log('Submitting lead:', { name, mobile, initialMessage: initialQuestion });
    setMessages(prev => [
      ...prev.slice(0, prev.length - 1),
      {
        sender: 'agent',
        text: (
          <div>
            <p>Thanks! Your message has been submitted.</p>
            <p>We'll get back to you here or via mobile number.</p>
            <p className="mt-2 text-gray-500">"We'll respond as soon as we can."</p>
          </div>
        )
      }
    ]);
    setStep('submitted');
  };

  const InfoCollectionForm = () => (
    <div className="p-4 rounded-lg bg-white shadow-sm">
      <p className="text-sm text-gray-700 mb-3">We just need some more information from you to proceed:</p>
      <form onSubmit={handleInfoSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</label>
          <input type="tel" name="mobile" required pattern="[0-9]{10,}" className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your mobile number" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Send
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* ── Dismissible Popup above chat bubble ── */}
      {showPopup && !isOpen && (
        <div className="fixed bottom-28 sm:bottom-24 right-4 sm:right-6 z-50 animate-fade-in-up">
          <div className="relative bg-white rounded-2xl shadow-xl px-4 py-3 max-w-[220px] border border-gray-100">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => { setIsOpen(true); setShowPopup(false); }}
              className="text-left w-full"
            >
              <p className="text-sm font-semibold text-gray-800">👋 Hi there!</p>
              <p className="text-xs text-gray-500 mt-0.5">Have a question? We're here to help.</p>
            </button>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />
          </div>
        </div>
      )}

      {/* ── Chat Bubble — raised above bottom nav on mobile ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowPopup(false); }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-sm sm:w-96 h-[60vh] sm:h-[500px] bg-gray-50 rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in-up">

          {/* Header */}
          <div className="bg-blue-600 p-4 rounded-t-xl text-white text-center relative">
            <h3 className="font-bold">Contact Us</h3>
            <p className="text-sm opacity-90">"We'll respond as soon as we can."</p>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                    {typeof msg.text === 'string' ? <p>{msg.text}</p> : msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            {step === 'initial' && (
              <form onSubmit={handleMessageSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  name="message"
                  placeholder="Enter your question here"
                  autoComplete="off"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            )}
            {step !== 'initial' && (
              <p className="text-center text-sm text-gray-400">
                {step === 'collecting_info' ? 'Please fill out the form above.' : 'Our team will get back to you shortly.'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}