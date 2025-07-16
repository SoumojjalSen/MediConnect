import Link from 'next/link';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Hi! How can I help you today?',
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to chat history
    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const botReply = data.reply;
        setMessages((prev) => [...prev, botReply]);
      } else {
        console.error('Bot error:', data.error);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, something went wrong.' },
        ]);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please try again.' },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='relative border-2 inset-0 z-50 flex items-center justify-center'>
      <div className='fixed lg:bottom-[2vh] lg:right-[1vw] lg:w-[25vw] lg:h-[65vh] bg-gray-100 dark:bg-zinc-800 shadow-lg w-[86vw] bottom-[5vh] h-[60vh] rounded-lg overflow-hidden'>
        <div className='flex flex-col h-full'>
          <div className='px-3 py-3 border-b dark:border-zinc-700 flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-zinc-800 dark:text-white'>
              MediAid Bot
            </h2>
            <button
              onClick={onClose}
              className='text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
            >
              ✕
            </button>
          </div>
          <div
            className='flex-1 p-3 overflow-y-auto flex flex-col space-y-2'
            id='chatDisplay'
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message max-w-xs px-3 py-1.5 text-sm rounded-lg ${
                  msg.role === 'user'
                    ? 'self-end bg-blue-500 text-white'
                    : 'self-start bg-green-500 text-white'
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <Link
                        href={href}
                        scroll={true}
                        className='text-blue-200 hover:underline'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {children}
                      </Link>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
          </div>
          <div className='px-3 py-2 border-t dark:border-zinc-700'>
            <div className='flex gap-2'>
              <input
                type='text'
                className='flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm'
                placeholder='Type your message...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-sm transition'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
