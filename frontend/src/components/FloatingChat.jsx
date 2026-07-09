import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Paperclip, Bot } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste! I am your KrishiMitraaz assistant. Ask me anything about your crop, weather, or farming tips.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

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
    }
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, attachedFile]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Only keep the base64 part, strip the data:image/jpeg;base64, prefix
      reader.onerror = error => reject(error);
    });
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !attachedFile) return;

    const userText = input.trim();
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
        mediaData: base64Media
      });

      setMessages(prev => [...prev, { role: 'ai', text: res.data.message, type: res.data.type }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the network right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!farmerId) return null; // Don't show chat if not logged in

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          className="fab" 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-green)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 16px rgba(46, 125, 50, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-card" style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          animation: 'fade-in-up 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary-green)',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>KrishiMitra AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'rgba(255,255,255,0.8)'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--primary-green-light)' : '#E0E0E0',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                  padding: '12px',
                  borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}>
                  {msg.mediaUrl && (
                    <div style={{ marginBottom: '8px', padding: '4px', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={msg.mediaUrl} alt="Attached" style={{ width: '100%', borderRadius: '4px', display: 'block' }} />
                    </div>
                  )}
                  {msg.role === 'ai' ? (
                    // Parse markdown-like bold for all AI outputs
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '12px', background: '#E0E0E0', borderRadius: '16px 16px 16px 0', color: 'var(--text-muted)' }}>
                Thinking...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '12px',
            borderTop: '1px solid var(--glass-border)',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*" 
            />
            <button 
              type="button" 
              onClick={handleAttachClick}
              style={{
                background: attachedFile ? 'var(--primary-green-light)' : 'transparent',
                color: attachedFile ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              title={attachedFile ? "Remove attached media" : "Attach media for diagnosis"}
            >
              <Paperclip size={20} />
            </button>
            
            <div style={{ flex: 1, position: 'relative' }}>
              {previewUrl && (
                <div style={{ position: 'absolute', bottom: '100%', left: '0', marginBottom: '8px', padding: '4px', background: 'white', borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <img src={previewUrl} alt="Preview" style={{ height: '60px', borderRadius: '4px', display: 'block' }} />
                  <button 
                    type="button" 
                    onClick={handleAttachClick} 
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent-urgent)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={attachedFile ? "Add a description..." : "Ask KrishiMitra..."}
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            
            <button type="submit" disabled={loading} style={{
              background: 'transparent',
              color: 'var(--primary-green)',
              border: 'none',
              padding: '8px',
              cursor: 'pointer'
            }}>
              <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
