import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendChatMessage } from '../services/api';


function SupportWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm BuyEasy's assistant. Ask me about products, orders, shipping, or returns." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(1); // skip the initial greeting

      const res = await sendChatMessage(trimmed, history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble responding right now. Please try again or use the Contact Us page." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="support-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span>💬 BuyEasy Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} aria-label="Send message">
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="support-fab" onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat'}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default SupportWidget;