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
  MessageSquare,
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

  // Talking Agent dedicated language state (persisted independently in finclosure_voice_language)
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
  const [ttsWarning, setTtsWarning] = useState<string | null>(null);

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
      } catch (e) {
        // Safe catch if already stopped
      }
    }
    if (agentState === 'LISTENING') {
      setAgentState('IDLE');
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    // 1. Stop current speech if speaking
    stopSpeaking();
    // 2. Stop listening if listening
    stopListening();
    // 3. Save to localStorage
    localStorage.setItem('finclosure_voice_language', newLang);
    // 4. Update voice language state
    setVoiceLang(newLang);
    setErrorMessage(null);
    setTtsWarning(null);
  };

  const speakText = (text: string, targetLang: Language) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const meta = getLanguageMeta(targetLang);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = meta.bcp47;

    const voices = synthRef.current.getVoices();
    // Search for best matching voice (prefer Indian/regional voice or lang match)
    const matchingVoice = voices.find(
      (v) =>
        v.lang === meta.bcp47 ||
        v.lang.replace('_', '-').toLowerCase() === meta.bcp47.toLowerCase() ||
        v.lang.startsWith(targetLang)
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
      setTtsWarning(null);
    } else {
      setTtsWarning('Voice output for this language is unavailable in your current browser.');
    }

    utterance.onstart = () => setAgentState('SPEAKING');
    utterance.onend = () => setAgentState('IDLE');
    utterance.onerror = () => setAgentState('IDLE');

    try {
      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('[Speech Synthesis Error]', err);
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
      // Send queryText, deceasedId, and selected voiceLang to AI backend
      const res = await aiApi.chat(queryText, deceasedId, voiceLang);
      const replyText =
        typeof res.response === 'string'
          ? res.response
          : res.response?.reply || JSON.stringify(res.response);

      setMessages((prev) => [...prev, { sender: 'agent', text: replyText }]);
      speakText(replyText, voiceLang);
    } catch (err: any) {
      console.error('[Talking Agent AI Error]', err);
      setErrorMessage('Failed to connect to FinClosure AI. Please try again.');
      setAgentState('ERROR');
    }
  };

  const startListening = () => {
    setErrorMessage(null);
    setTtsWarning(null);
    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage(
        "Voice input for this language isn't supported by your current browser. You can still type your question."
      );
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
        console.warn('[Speech Recognition Error]', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permissions in browser settings.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please try tapping the microphone again.');
        } else if (event.error === 'language-not-supported') {
          setErrorMessage(
            `Voice input for ${meta.nativeName} isn't supported by your current browser. You can still type your question below.`
          );
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
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
      console.error('[Start Listening Error]', err);
      setErrorMessage('Could not initialize microphone listener.');
      setAgentState('ERROR');
    }
  };

  if (!isOpen) return null;

  const currentMeta = getLanguageMeta(voiceLang);

  // Sample prompts tailored to active language
  const getSamplePrompts = (lang: Language) => {
    switch (lang) {
      case 'hi':
        return [
          'मेरे पिता के दावों की स्थिति क्या है?',
          'मुझे कौन से दस्तावेज चाहिए?',
          'कितनी संपत्तियां पंजीकृत हैं?',
        ];
      case 'mr':
        return [
          'माझ्या दाव्यांची प्रगती काय आहे?',
          'मला कोणती कागदपत्रे लागतील?',
          'किती मालमत्ता नोंदणीकृत आहेत?',
        ];
      default:
        return [
          'What are my active claims?',
          'What documents do I need?',
          'How many assets are registered?',
        ];
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">FinClosure Talking Agent</h3>
              <p className="text-[11px] text-slate-400">Speak naturally in your preferred language.</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              stopListening();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close Talking Agent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Language Selector Row */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <label
            htmlFor="talking-agent-language-select"
            className="text-xs font-medium text-slate-300 flex items-center"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            <span>Language:</span>
          </label>
          <select
            id="talking-agent-language-select"
            aria-label="Talking Agent language"
            value={voiceLang}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors min-w-[110px]"
          >
            {TALKING_AGENT_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200 py-1">
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* State Banner / Status Indicator */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold">
            {agentState === 'IDLE' && <span className="w-2 h-2 rounded-full bg-slate-400" />}
            {agentState === 'LISTENING' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            {agentState === 'PROCESSING' && <RefreshCw className="w-3 h-3 text-teal-400 animate-spin" />}
            {agentState === 'SPEAKING' && <Volume2 className="w-3 h-3 text-teal-400 animate-bounce" />}
            {agentState === 'ERROR' && <AlertCircle className="w-3 h-3 text-rose-400" />}

            <span className="text-slate-200">
              Language: <strong className="text-teal-400 font-bold">{currentMeta.nativeName}</strong> •{' '}
              {agentState === 'IDLE' && 'Ready'}
              {agentState === 'LISTENING' && 'Listening...'}
              {agentState === 'PROCESSING' && 'Processing...'}
              {agentState === 'SPEAKING' && 'Speaking response aloud...'}
              {agentState === 'ERROR' && 'Action Required'}
            </span>
          </div>

          {transcript && (
            <p className="text-xs text-teal-300 italic mt-2 bg-slate-900/80 p-2 rounded-lg border border-teal-900/40">
              "{transcript}"
            </p>
          )}

          {errorMessage && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {ttsWarning && !errorMessage && (
            <div className="mt-2 p-2 rounded-lg bg-amber-950/50 border border-amber-800/50 text-amber-200 text-[11px] flex items-center justify-center">
              <span>{ttsWarning}</span>
            </div>
          )}
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[160px] bg-slate-950/20">
          {messages.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>No conversation yet. Tap the microphone below to start speaking in {currentMeta.nativeName}.</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {getSamplePrompts(voiceLang).map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSendToAI(sample)}
                    className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 rounded-md transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-br-none font-medium'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Text Input Fallback Bar */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typedInput.trim()) {
                handleSendToAI(typedInput);
              }
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={`Or type a question in ${currentMeta.nativeName}...`}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!typedInput.trim() || agentState === 'PROCESSING'}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 rounded-lg disabled:opacity-40 transition-colors"
              title="Send text question"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Voice Control Buttons Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-around">
          {agentState === 'SPEAKING' ? (
            <button
              onClick={stopSpeaking}
              className="py-2.5 px-6 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <VolumeX className="w-4 h-4" />
              <span>Stop Voice</span>
            </button>
          ) : agentState === 'LISTENING' ? (
            <button
              onClick={stopListening}
              className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 animate-pulse shadow-lg"
            >
              <MicOff className="w-4 h-4" />
              <span>Stop Listening</span>
            </button>
          ) : (
            <button
              onClick={startListening}
              disabled={agentState === 'PROCESSING'}
              className="py-3 px-8 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-2.5 shadow-lg shadow-teal-950 transition-all transform active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Speak in {currentMeta.nativeName}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
