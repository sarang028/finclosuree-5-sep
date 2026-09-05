import React, { useState } from 'react';
import { Bot, Send, Mic, Sparkles, Globe, RefreshCw } from 'lucide-react';
import { aiApi } from '../services/apiServices';
import { TalkingAgentModal } from './TalkingAgentModal';

export const AIAssistantPanel: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: '👋 Namaste! Main aapka FinClosure Assistant hoon. Main aapki language me aapki madad kar sakta hoon. Aaj main aapke liye kya kar sakta hoon?',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [assistantLang, setAssistantLang] = useState<'hi' | 'en'>('hi');

  const suggestedPrompts = [
    'Mere father ke kya kya assets hain?',
    'Life insurance claim ka process kya hai?',
    'Kaunse documents pending hain?',
    'Kitna loan outstanding hai?',
    'Mujhe next kya karna hai?',
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setInputQuery('');
    setIsSending(true);

    try {
      const res = await aiApi.chat(q, undefined, assistantLang);
      const replyObj = res.response;
      const replyText = typeof replyObj === 'string' ? replyObj : replyObj?.reply || JSON.stringify(replyObj);

      setMessages((prev) => [...prev, { sender: 'assistant', text: replyText }]);
    } catch (err) {
      console.error('[AI Assistant Error]', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xs p-4 flex flex-col justify-between h-full min-h-[420px]">
      {/* Header matching Reference Screen */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-tight">FinClosure Assistant</h3>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Online • Your multilingual financial guide
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <select
            value={assistantLang}
            onChange={(e) => setAssistantLang(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="hi">Hindi 🌐</option>
            <option value="en">English 🌐</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 py-3 overflow-y-auto space-y-2.5 max-h-[260px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-800 text-white rounded-br-none shadow-2xs font-bold'
                  : 'bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
              <span>FinClosure Assistant is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips matching Reference Screen */}
      <div className="pt-2 pb-2 space-y-1.5">
        <div className="flex flex-wrap gap-1">
          {suggestedPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-left px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-colors truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar matching Reference Screen */}
      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700"
        />

        <button
          onClick={() => setIsVoiceOpen(true)}
          className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
          title="Speak"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isSending}
          className="p-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl disabled:opacity-40 transition-all shadow-2xs"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <TalkingAgentModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
