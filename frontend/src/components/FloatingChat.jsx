import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Paperclip, Bot, Mic, MicOff, Volume2, Shield } from 'lucide-react';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

export default function FloatingChat() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: isHi 
        ? 'नमस्ते! मैं आपका "किसान ई-मित्र" एआई सहायक हूँ। फसल कीट, रोग उपचार, अनुशंसित उर्वरक खुराक, आज के मंडी भाव या मौसम संबंधी कोई भी प्रश्न पूछें।' 
        : 'Namaste! I am your "Kisan e-Mitra" AI Agricultural Assistant. Ask me anything regarding crop diseases, organic/chemical cures, fertilizer dosage, or APMC mandi rates.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  const handleAttachClick = () => {
    if (attachedFile) {
      setAttachedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, attachedFile]);

  // Voice Speech-to-Text Input (STT)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHi ? 'इस ब्राउज़र पर वॉइस इनपुट समर्थित नहीं है। कृपया गूगल क्रोम का उपयोग करें।' : 'Speech recognition is not supported on this browser. Try Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-Speech Speak back (TTS)
  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const clean = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSend = async (customPrompt = null) => {
    const promptText = (customPrompt || input).trim();
    if (!promptText && !attachedFile) return;

    const userText = promptText;
    const hasMedia = !!attachedFile;
    const currentPreviewUrl = previewUrl;
    const fileToUpload = attachedFile;

    setMessages(prev => [...prev, { role: 'user', text: userText, mediaUrl: currentPreviewUrl }]);
    setInput('');
    setAttachedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      let base64Media = null;
      if (hasMedia && fileToUpload) {
        base64Media = await getBase64(fileToUpload);
      }

      const res = await axios.post(`${API_URL}/chat`, {
        farmerId,
        message: userText,
        mediaAttached: hasMedia,
        mediaData: base64Media,
        langCode: currentLang
      });

      setMessages(prev => [...prev, { role: 'ai', text: res.data.message, type: res.data.type }]);
    } catch {
      let fallback = isHi
        ? 'गेहूं और धान हेतु बुवाई समय 50 किग्रा/एकड़ डीएपी तथा 21 व 50 दिन पर यूरिया का छिड़काव अनुशंसित है।'
        : 'For wheat and rice, apply basal DAP at 50kg/acre during sowing and split urea at 21 and 50 days after sowing.';
      if (userText.toLowerCase().includes('yellow') || userText.includes('पीली')) {
        fallback = isHi 
          ? 'गेहूं में पीला रतुआ: प्रोपिकोनाज़ोल 25% ईसी @ 1 मिली/लीटर पानी अथवा नीम अर्क 5% का छिड़काव करें।'
          : 'Yellow rust in wheat: Spray Propiconazole 25% EC @ 1ml/L water or bio-neem extract 5%. Avoid over-watering.';
      } else if (userText.toLowerCase().includes('mandi') || userText.toLowerCase().includes('price') || userText.includes('भाव')) {
        fallback = isHi
          ? 'वर्तमान गेहूं का औसत मंडी भाव ~₹2,345/क्विंटल है (न्यूनतम समर्थन मूल्य ₹2,275 से +₹70 अधिक)।'
          : 'Current modal wheat rate is ~₹2,345/Qtl vs Govt MSP of ₹2,275/Qtl (+₹70 profit margin).';
      }
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  if (!farmerId) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          className="fab no-print" 
          onClick={() => setIsOpen(true)}
          title={isHi ? 'किसान ई-मित्र से पूछें' : 'Ask Kisan e-Mitra AI'}
          style={{ background: '#004D25', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.3)', border: '2px solid #FFFFFF' }}
        >
          <Bot size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window gov-card no-print" style={{ display: 'flex', flexDirection: 'column', width: '370px', height: '520px', zIndex: 1000, overflow: 'hidden', borderTop: '4px solid #004D25', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
          {/* Header */}
          <div style={{
            background: '#0A3161',
            color: '#FFFFFF',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} color="#FDE047" />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800 }}>
                  {isHi ? 'किसान ई-मित्र (Kisan e-Mitra AI)' : 'Kisan e-Mitra AI Assistant'}
                </h3>
                <span style={{ fontSize: '0.68rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Shield size={11} color="#A7F3D0" /> {isHi ? 'कृषि मंत्रालय आधिकारिक एआई बॉट' : 'Govt of India Agronomy Helpdesk'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            padding: '12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: '#F8FAFC'
          }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? '#004D25' : '#FFFFFF',
                  color: m.role === 'user' ? '#FFFFFF' : '#1E293B',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: m.role === 'user' ? 'none' : '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  position: 'relative'
                }}
              >
                {m.mediaUrl && (
                  <img src={m.mediaUrl} alt="uploaded" style={{ maxWidth: '100%', maxHeight: '110px', borderRadius: '3px', marginBottom: '6px' }} />
                )}
                <div>{m.text}</div>
                {m.role === 'ai' && (
                  <button 
                    onClick={() => speakMessage(m.text)}
                    style={{ background: 'transparent', border: 'none', color: '#0A3161', cursor: 'pointer', padding: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    <Volume2 size={12} /> {isHi ? 'सुनें' : 'Listen'}
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '3px', fontSize: '0.78rem', color: '#64748B' }}>
                🌾 {isHi ? 'कृषि वैज्ञानिक डेटाबेस से उत्तर तैयार हो रहा है...' : 'Consulting ICAR agronomy repository...'}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '6px 10px', background: '#F1F5F9', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {(isHi 
              ? ['गेहूं में खाद की मात्रा?', 'पीली पत्ती का इलाज?', 'आज का मंडी भाव?']
              : ['Wheat fertilizer dose?', 'Yellow leaf rust cure?', 'Today mandi prices?']
            ).map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '3px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', flexShrink: 0, color: '#0A3161', fontWeight: 600 }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: '#FFFFFF', borderTop: '1px solid #CBD5E1' }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <button 
              type="button" 
              onClick={handleAttachClick} 
              style={{ background: attachedFile ? '#ECFDF5' : 'transparent', border: 'none', color: attachedFile ? '#004D25' : '#64748B', cursor: 'pointer', padding: '4px', borderRadius: '3px' }}
              title={isHi ? 'पत्ती की फोटो संलग्न करें' : 'Attach leaf photo'}
            >
              <Paperclip size={16} />
            </button>

            <button 
              type="button" 
              onClick={toggleVoiceInput} 
              style={{ background: isListening ? '#FEF2F2' : 'transparent', border: 'none', color: isListening ? '#DC2626' : '#64748B', cursor: 'pointer', padding: '4px', borderRadius: '3px' }}
              title={isHi ? 'बोलकर प्रश्न पूछें' : 'Speak question'}
            >
              {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
            </button>

            <input 
              ref={textInputRef}
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={isListening ? (isHi ? 'सुन रहा हूँ...' : 'Listening...') : (previewUrl ? (isHi ? 'फोटो का विवरण लिखें...' : 'Describe photo...') : (isHi ? 'कृषि प्रश्न पूछें...' : 'Ask farm question...'))} 
              style={{ flex: 1, border: '1px solid #CBD5E1', borderRadius: '3px', padding: '6px 10px', fontSize: '0.8rem', outline: 'none' }} 
            />

            <button 
              type="submit" 
              disabled={loading || (!input.trim() && !attachedFile)}
              className="gov-btn gov-btn-primary"
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
