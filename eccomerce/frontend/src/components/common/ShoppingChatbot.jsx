import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendShoppingMessage } from '../../services/chatService';

const suggestedQuestions = [
  'Show me men’s shoes under 4,000 Birr',
  'I’m looking for a traditional dress',
  'What can I buy for kids?',
  'How do I place an order?',
];

function getCategoryLabel(category) {
  const labels = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    accessories: 'Accessories',
  };
  return labels[category] || 'Shop';
}

function getCategoryKey(category) {
  const normalizedCategory = String(category || '').toLowerCase();
  if (normalizedCategory.includes('men') && !normalizedCategory.includes('women')) return 'men';
  if (normalizedCategory.includes('women')) return 'women';
  if (normalizedCategory.includes('kid')) return 'kids';
  if (normalizedCategory.includes('accessor')) return 'accessories';
  return null;
}

export default function ShoppingChatbot({ onAddToCart, onBrowseCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Ethio Shop! I can help you find clothing, shoes, accessories, prices, and the right products for you. What are you shopping for today?',
    },
  ]);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (isOpen && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [isOpen, messages, isSending]);

  const sendMessage = async (value) => {
    const message = value.trim();
    if (!message || message.length > 500 || isSending) return;

    const nextMessages = [...messages, { id: `${Date.now()}-user`, role: 'user', content: message }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const history = messages
        .filter((entry) => entry.id !== 'welcome' && !entry.isError)
        .slice(-8)
        .map(({ role, content }) => ({ role, content }));
      const result = await sendShoppingMessage(message, history);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: result.message,
          recommendations: result.recommendations || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          isError: true,
          content: error.response?.data?.message || 'I could not connect just now. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <>
      <style>{`
        .ethio-chat-launcher {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 1080;
          width: 60px;
          height: 60px;
          border: 0;
          border-radius: 50%;
          color: #fff !important;
          background: #ffc107;
          box-shadow: 0 6px 22px rgba(0, 0, 0, .2);
          font-size: 1.35rem;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .ethio-chat-launcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 26px rgba(0, 0, 0, .24);
        }
        .ethio-chat-launcher i { color: #fff; }
        .ethio-chat-launcher:focus-visible {
          outline: 3px solid #212529;
          outline-offset: 3px;
        }
        .ethio-chat-panel {
          position: fixed;
          right: 24px;
          bottom: 98px;
          z-index: 1080;
          display: flex;
          flex-direction: column;
          width: min(390px, calc(100vw - 32px));
          height: min(620px, calc(100dvh - 126px));
          min-height: 360px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 14px 45px rgba(25, 30, 40, .2);
        }
        .ethio-chat-header {
          flex: 0 0 auto;
          background: #ffc107;
          color: #212529;
        }
        .ethio-chat-messages {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          padding: 1rem;
          background: #f8f9fa;
          scroll-behavior: smooth;
        }
        .ethio-chat-message {
          max-width: 91%;
          padding: .7rem .85rem;
          border-radius: 14px;
          font-size: .9rem;
          line-height: 1.45;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .ethio-chat-message-assistant {
          align-self: flex-start;
          border: 1px solid #eceff1;
          border-bottom-left-radius: 4px;
          background: #fff;
          color: #343a40;
        }
        .ethio-chat-message-user {
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          background: #ffe082;
          color: #212529;
        }
        .ethio-chat-suggestion {
          white-space: normal;
          text-align: left;
          font-size: .78rem;
          border-color: #e5c34f;
        }
        .ethio-chat-product {
          border: 1px solid #eceff1;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
        }
        .ethio-chat-product-image {
          width: 64px;
          height: 68px;
          flex: 0 0 64px;
          object-fit: contain;
          background: #fff;
        }
        .ethio-chat-composer {
          flex: 0 0 auto;
          border-top: 1px solid #eceff1;
          background: #fff;
        }
        .ethio-chat-composer textarea {
          resize: none;
          max-height: 96px;
        }
        @media (max-width: 575.98px) {
          .ethio-chat-launcher { right: 16px; bottom: 16px; }
          .ethio-chat-panel {
            right: 10px;
            bottom: 88px;
            width: calc(100vw - 20px);
            height: min(72dvh, 620px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ethio-chat-launcher { transition: none; }
          .ethio-chat-messages { scroll-behavior: auto; }
        }
      `}</style>

      {isOpen && (
        <section className="ethio-chat-panel" aria-label="Ethio Shop shopping assistant">
          <header className="ethio-chat-header d-flex align-items-center justify-content-between px-3 py-3">
            <div className="d-flex align-items-center gap-2">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white"
                style={{ width: 40, height: 40 }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#212529" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                  <path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4Zm16 0h-3v6h1a2 2 0 0 0 2-2v-4Z" />
                  <path d="M17 19a5 5 0 0 1-5 3h-1" />
                </svg>
              </span>
              <div>
                <div className="fw-bold">Ethio Shop Assistant</div>
                <div className="small">Here to help you find the right fit</div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => setIsOpen(false)}
              aria-label="Close shopping assistant"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="ethio-chat-messages d-flex flex-column gap-3" ref={messageListRef} aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className="d-flex flex-column gap-2">
                <div
                  className={`ethio-chat-message ${message.role === 'user' ? 'ethio-chat-message-user' : 'ethio-chat-message-assistant'}${message.isError ? ' text-danger' : ''}`}
                >
                  {message.content}
                </div>
                {message.recommendations?.map((product) => (
                  <article className="ethio-chat-product d-flex align-items-center gap-2 p-2" key={product._id}>
                    <img
                      className="ethio-chat-product-image rounded"
                      src={product.imageUrl}
                      alt=""
                      onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                    />
                    <div className="min-w-0 flex-grow-1">
                      <div className="fw-semibold small text-truncate" title={product.name}>{product.name}</div>
                      <div className="small text-muted">{Number(product.price).toLocaleString()} ETB</div>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {getCategoryKey(product.category) && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark py-0 px-2"
                            onClick={() => onBrowseCategory(getCategoryKey(product.category))}
                          >
                            {getCategoryLabel(getCategoryKey(product.category))} collection
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm py-0 px-2"
                          style={{ background: '#ffc107' }}
                          onClick={() => onAddToCart({
                            ...product,
                            id: product._id,
                            productId: product._id,
                            path: product.imageUrl,
                            img: product.imageUrl,
                            desc: product.description,
                            quantity: 1,
                          })}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="d-flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning text-dark rounded-pill ethio-chat-suggestion"
                    key={question}
                    disabled={isSending}
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isSending && (
              <div className="ethio-chat-message ethio-chat-message-assistant d-flex align-items-center gap-2" role="status">
                <span className="spinner-border spinner-border-sm text-warning" aria-hidden="true" />
                Finding the right products...
              </div>
            )}
          </div>

          <div className="ethio-chat-composer p-3">
            <form className="d-flex align-items-end gap-2" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="ethio-chat-input">Your message</label>
              <textarea
                id="ethio-chat-input"
                className="form-control"
                rows="1"
                maxLength="500"
                placeholder="Ask about products or ordering..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              />
              <button
                type="submit"
                className="btn text-dark fw-semibold"
                style={{ background: '#ffc107' }}
                disabled={isSending || !input.trim()}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">{input.length}/500</small>
              <Link to="/cart" className="small text-dark text-decoration-none fw-semibold">
                View cart
              </Link>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        className="ethio-chat-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Minimize Ethio Shop shopping assistant' : 'Open Ethio Shop shopping assistant'}
        aria-expanded={isOpen}
        title={isOpen ? 'Minimize assistant' : 'Chat with us'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="27" height="27" fill="white" aria-hidden="true">
            <path d="M12 3c-5.24 0-9.5 3.67-9.5 8.2 0 2.35 1.19 4.45 3.1 5.94L4.5 21l4.53-2.35c.94.25 1.94.39 2.97.39 5.24 0 9.5-3.67 9.5-8.2S17.24 3 12 3Zm-4.3 9.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.3 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.3 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
          </svg>
        )}
      </button>
    </>
  );
}
