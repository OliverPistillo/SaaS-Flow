import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Paperclip, 
  Smile,
  MoreVertical,
  Trash2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/enhancedApiService';
import '../App.css';

const ChatAI = ({ isOpen, onClose, className = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize chat with welcome message
      setMessages([
        {
          id: 'welcome',
          message: '👋 Ciao! Sono il tuo assistente finanziario AI. Posso aiutarti con:\n\n💰 **Gestione Transazioni**\n• Aggiungere entrate e uscite\n• Categorizzare le spese\n• Tracciare i pagamenti\n\n📊 **Report e Analisi**\n• Generare report finanziari\n• Analizzare trend di spesa\n• Monitorare cash flow\n\n👥 **Gestione Clienti**\n• Aggiungere nuovi clienti\n• Gestire contatti\n• Tracciare pagamenti clienti\n\n🏦 **Account Management**\n• Gestire conti bancari\n• Monitorare saldi\n• Riconciliare transazioni\n\nCosa posso fare per te oggi?',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          messageType: 'welcome'
        }
      ]);
      
      // Focus input when chat opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(inputMessage, sessionId);
      
      if (response.success) {
        setMessages(prev => [...prev, response.data.aiResponse]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback AI response
      const fallbackResponse = generateFallbackResponse(inputMessage);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        message: fallbackResponse.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        messageType: fallbackResponse.type,
        context: fallbackResponse.context
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('spesa') || message.includes('expense')) {
      return {
        message: 'Perfetto! 😊 Per cosa è questa spesa?',
        type: 'expense_flow',
        context: { step: 'category' }
      };
    }
    
    if (message.includes('entrata') || message.includes('income')) {
      return {
        message: 'Fantastico! 💰 Da dove proviene questa entrata?',
        type: 'income_flow',
        context: { step: 'source' }
      };
    }
    
    if (message.includes('report') || message.includes('rapporto')) {
      return {
        message: '📊 Che tipo di report vorresti generare? Posso creare report per:\n• Entrate e uscite mensili\n• Analisi delle categorie\n• Bilancio annuale\n• Cash flow',
        type: 'report',
        context: { action: 'report_selection' }
      };
    }
    
    if (message.includes('cliente') || message.includes('client')) {
      return {
        message: '👥 Gestione clienti attiva! Posso aiutarti a:\n• Aggiungere un nuovo cliente\n• Cercare un cliente esistente\n• Modificare i dettagli di un cliente',
        type: 'client',
        context: { action: 'client_management' }
      };
    }
    
    return {
      message: '🤔 Non sono sicuro di aver capito. Puoi dirmi cosa vorresti fare? Ad esempio:\n• "Aggiungi una spesa"\n• "Mostra il report mensile"\n• "Gestisci clienti"\n• "Aiuto" per vedere tutte le opzioni',
      type: 'clarification'
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'it-IT';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Il riconoscimento vocale non è supportato dal tuo browser');
    }
  };

  const copyMessage = (message) => {
    navigator.clipboard.writeText(message);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (message) => {
    // Convert markdown-like formatting to HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="w-full max-w-2xl h-[80vh] mx-4 bg-white rounded-lg shadow-xl flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Assistente AI Do-Flow
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Online • Sempre disponibile
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="btn btn-ghost btn-sm"
              title="Cancella chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-100'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border'
                }`} style={{
                  backgroundColor: message.sender === 'user' ? 'var(--primary-600)' : 'var(--card-bg)',
                  borderColor: message.sender === 'ai' ? 'var(--border-primary)' : 'transparent',
                  color: message.sender === 'user' ? 'white' : 'var(--text-primary)'
                }}>
                  <div 
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.message) }}
                  />
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    
                    {message.sender === 'ai' && (
                      <button
                        onClick={() => copyMessage(message.message)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                        title="Copia messaggio"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="border rounded-lg p-3" style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center space-x-2">
            <button className="btn btn-ghost btn-sm">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="input resize-none pr-20"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="btn btn-ghost btn-sm">
                  <Smile className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleVoiceInput}
                  className={`btn btn-ghost btn-sm ${isListening ? 'text-red-600' : ''}`}
                  title={isListening ? 'Registrazione in corso...' : 'Registra messaggio vocale'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn btn-primary"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Premi Invio per inviare, Shift+Invio per andare a capo</span>
            {isListening && (
              <span className="text-red-600 animate-pulse">🔴 Registrazione in corso...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;

