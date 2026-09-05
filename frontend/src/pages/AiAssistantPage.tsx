import React, { useState } from 'react';
import { aiApi } from '../services/apiServices';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TalkingAgentModal } from '../components/TalkingAgentModal';
import { Bot, Send, Sparkles, Shield, Mic } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedActions?: string[];
  safetyNotice?: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { isDemoMode } = useAuth();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: isDemoMode
        ? 'Namaste! I am your FinClosure AI Assistant. I have loaded Late Rajesh Sharma\'s DEMO financial profile (6 Assets, 2 Liabilities, 3 Receivables, 9 Documents). Ask me anything about policy claim values, pending loans, or money to recover!'
        : 'Hello. I am your FinClosure AI Assistant. I am here to help you navigate financial asset discovery, document checklists, and claim steps. How can I assist you today?',
      suggestedActions: isDemoMode
        ? [
            'Life insurance ka claim kitna hai?',
            'Mere father ke kitne loans pending hain?',
            'Kaun kaun paise dena hai?',
            'Show total assets',
          ]
        : [
            'What should I focus on today?',
            'Which documents are missing?',
            'How do I prepare my insurance claim?',
            'Which assets have I not started claiming?',
          ],
      safetyNotice: isDemoMode
        ? 'DEMO MODE: Simulated AI guidance on sample portfolio records only.'
        : 'FinClosure AI is an intelligence assistant layer. Always verify exact policy guidelines with authorized officers at the concerned institution.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const res = await aiApi.chat(q, undefined, language);
      const replyObj = res.response;
      const replyText = typeof replyObj === 'string' ? replyObj : replyObj?.reply || JSON.stringify(replyObj);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        suggestedActions: replyObj?.suggestedActions,
        safetyNotice: replyObj?.safetyNotice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('[AI Chat Error]', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col glass-card rounded-2xl border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">{t('navAssistant')}</h2>
              {isDemoMode && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  DEMO MODE
                </span>
              )}
            </div>
            <p className="text-[11px] text-teal-400 font-medium">Context-Aware Financial Guidance</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3 py-1.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-xl text-xs font-semibold flex items-center shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            <span>{t('talkToAi')}</span>
          </button>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:flex items-center">
            <Shield className="w-3 h-3 mr-1 text-teal-400" /> Private & Contextual
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-2xl p-3.5 sm:p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none shadow-md font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-teal-300 font-semibold transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}

              {msg.safetyNotice && (
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  ⚠️ {msg.safetyNotice}
                </div>
              )}

              <span className="text-[10px] text-slate-500 block text-right">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin mr-2" />
              Analyzing your FinClosure context...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 sm:space-x-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isDemoMode
                ? "Try: 'Life insurance ka claim kitna hai?' or 'Mere father ke kitne loans pending hain?'"
                : "Ask about missing documents, claim steps, or what to focus on today..."
            }
            className="flex-1 px-3.5 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={isSending || !inputQuery.trim()}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center disabled:opacity-50"
          >
            <Send className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Talking Agent Modal */}
      <TalkingAgentModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};
