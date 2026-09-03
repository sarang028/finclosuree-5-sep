import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { aiApi } from '../services/apiServices';
import { Language } from '../types/translations';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Globe,
  Send,
} from 'lucide-react';

interface TalkingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deceasedId?: string;
}

type AgentState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export interface VoiceLanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  bcp47: string;
  isFullySupported: boolean;
}

export const TALKING_AGENT_LANGUAGES: VoiceLanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-IN', isFullySupported: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', isFullySupported: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', isFullySupported: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', isFullySupported: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', isFullySupported: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', isFullySupported: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', isFullySupported: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', isFullySupported: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', isFullySupported: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', isFullySupported: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-PK', isFullySupported: false },
];

export const TalkingAgentModal: React.FC<TalkingAgentModalProps> = ({
  isOpen,
  onClose,
  deceasedId,
}) => {
  const { language: mainAppLanguage } = useLanguage();

  const [voiceLang, setVoiceLang] = useState<Language>(() => {
    const saved = localStorage.getItem('finclosure_voice_language');
    if (saved && ['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'pa', 'ur'].includes(saved)) {
      return saved as Language;
    }
    return mainAppLanguage || 'en';
  });

  const [agentState, setAgentState] = useState<AgentState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const getLanguageMeta = (langCode: Language): VoiceLanguageMeta => {
    return (
      TALKING_AGENT_LANGUAGES.find((l) => l.code === langCode) || {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        bcp47: 'en-IN',
        isFullySupported: true,
      }
    );
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (agentState === 'SPEAKING') {
      setAgentState('IDLE');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (agentState === 'LISTENING') {
      setAgentState('IDLE');
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    stopSpeaking();
    stopListening();
    localStorage.setItem('finclosure_voice_language', newLang);
    setVoiceLang(newLang);
    setErrorMessage(null);
  };

  const speakText = (text: string, targetLang: Language) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const meta = getLanguageMeta(targetLang);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = meta.bcp47;

    utterance.onstart = () => setAgentState('SPEAKING');
    utterance.onend = () => setAgentState('IDLE');
    utterance.onerror = () => setAgentState('IDLE');

    try {
      synthRef.current.speak(utterance);
    } catch (err) {
      setAgentState('IDLE');
    }
  };

  const handleSendToAI = async (queryText: string) => {
    if (!queryText.trim()) return;

    setAgentState('PROCESSING');
    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    setTranscript('');
    setTypedInput('');
    setErrorMessage(null);

    try {
      const res = await aiApi.chat(queryText, deceasedId, voiceLang);
      const replyText =
        typeof res.response === 'string'
          ? res.response
          : res.response?.reply || JSON.stringify(res.response);

      setMessages((prev) => [...prev, { sender: 'agent', text: replyText }]);
      speakText(replyText, voiceLang);
    } catch (err: any) {
      console.error('[Talking Agent AI Error]', err);
      setErrorMessage('Failed to connect to FinClosure AI assistant.');
      setAgentState('ERROR');
    }
  };

  const startListening = () => {
    setErrorMessage(null);
    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Voice input isn't supported in your browser. Please type your question.");
      setAgentState('ERROR');
      return;
    }

    const meta = getLanguageMeta(voiceLang);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = meta.bcp47;

      recognition.onstart = () => {
        setAgentState('LISTENING');
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        setAgentState('ERROR');
      };

      recognition.onend = () => {
        if (transcript.trim()) {
          handleSendToAI(transcript);
        } else {
          setAgentState((prev) => (prev === 'LISTENING' ? 'IDLE' : prev));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setAgentState('ERROR');
    }
  };

  if (!isOpen) return null;

  const currentMeta = getLanguageMeta(voiceLang);

  const samplePrompts = [
    'What is my overall progress?',
    'List all my bank accounts',
    'Show pending claims',
    'Guide me on next steps',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        {/* Header matching Reference Screen 8 */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-slate-900">Talking Agent</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMessages([])}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-600 flex items-center">
            <Globe className="w-3.5 h-3.5 mr-1 text-finclosure-800" />
            <span>Language:</span>
          </label>
          <select
            value={voiceLang}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="px-3 py-1 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-lg appearance-none cursor-pointer focus:outline-none"
          >
            {TALKING_AGENT_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Main Conversation Feed matching Reference Screen 8 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 min-h-[200px]">
          {/* Default Greeting matching Reference Screen 8 */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs leading-relaxed shadow-2xs">
            <p className="font-bold text-slate-900 mb-1">👋 Hello Rohan! I'm your FinClosure assistant. How can I help you today?</p>
          </div>

          {/* Suggested Prompts matching Reference Screen 8 */}
          {messages.length === 0 && (
            <div className="space-y-2 pt-2">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendToAI(prompt)}
                  className="w-full text-left p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center shadow-2xs"
                >
                  <span className="mr-2">📋</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Messages List */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-finclosure-800 text-white rounded-br-none'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {agentState === 'PROCESSING' && (
            <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-finclosure-800 animate-spin" />
              <span>FinClosure Assistant is thinking...</span>
            </div>
          )}

          {transcript && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 italic">
              "{transcript}"
            </div>
          )}
        </div>

        {/* Bottom Input Bar matching Reference Screen 8 */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && typedInput.trim()) {
                handleSendToAI(typedInput);
              }
            }}
            placeholder="Tap to speak..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-finclosure-800"
          />

          <button
            onClick={agentState === 'LISTENING' ? stopListening : startListening}
            className={`p-2.5 rounded-full text-white transition-all shadow-sm ${
              agentState === 'LISTENING' ? 'bg-rose-600 animate-pulse' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            title="Microphone"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSendToAI(typedInput)}
            disabled={!typedInput.trim() || agentState === 'PROCESSING'}
            className="w-9 h-9 bg-finclosure-800 hover:bg-finclosure-900 text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all shadow-sm shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
