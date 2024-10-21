import React from 'react';
import { MessageSquare, Brain, Zap, Users } from 'lucide-react';
import AINeuronNetwork from './AINeuronNetwork';

const LandingPage = () => {
  const handleAddToDiscord = () => {
    window.location.href = 'http://localhost:8000/discord/login';
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AINeuronNetwork />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <header className="flex justify-between items-center mb-4 shadow-lg">
          <h1 className="text-2xl font-bold">AICompanion</h1>
          <button 
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddToDiscord}
          >
            Add to Discord
          </button>
        </header>

        <main className="flex-grow flex flex-col md:flex-row gap-4 items-start">
          <div className="md:w-2/3 flex flex-col justify-start h-full">
            <div>
              <h2 className="text-2xl font-extrabold mb-2">Your AI Companion for Discord</h2>
              <p className="text-sm text-gray-400 mb-4">Engage in intelligent conversations, get assistance, and enhance your Discord experience with our AI-powered chatbot.</p>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <h3 className="text-3xl font-bold text-blue-400">Oracle, your AI Companion</h3>
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold mb-2">Experience AI Conversation</h3>
            <div className="space-y-2 flex-grow overflow-auto">
              <ChatBubble user="User" message="Hey AICompanion, what's the weather like today?" />
              <ChatBubble bot message="I'm sorry, but I don't have real-time access to weather information. However, I can suggest checking a weather app or website for the most up-to-date forecast in your area. Is there anything else I can help you with?" />
              <ChatBubble user="User" message="Can you tell me a joke instead?" />
              <ChatBubble bot message="Sure! Here's one for you: Why don't scientists trust atoms? Because they make up everything! 😄" />
            </div>
          </div>
        </main>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FeatureCard icon={<MessageSquare size={16} />} title="Conversations" value="1M+" description="Engaging chats daily" />
          <FeatureCard icon={<Brain size={16} />} title="AI Model" value="Llama 3.1 & 3.2" description="Cutting-edge language AI" />
          <FeatureCard icon={<Zap size={16} />} title="Response Time" value="<1s" description="Lightning-fast replies" />
          <FeatureCard icon={<Users size={16} />} title="Active Users" value="100k+" description="Growing community" />
        </div>

        <footer className="text-center text-gray-500 text-xs mt-4">
          <p>&copy; 2024 AICompanion. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, value, description }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-750">
    <div className="text-blue-400 mr-4 icon-pulse">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const ChatBubble = ({ user, message, bot }) => (
  <div className={`chat-bubble ${bot ? 'text-gray-300' : 'text-blue-300'}`}>
    <strong>{user}:</strong> {message}
  </div>
);

export default LandingPage;
