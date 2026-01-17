
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Product } from '../types';
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon, SparklesIcon, MapPinIcon } from './Icons';
import { CONTACT_WHATSAPP } from '../constants';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  links?: { title: string; uri: string }[];
}

interface ChatbotProps {
  products: Product[];
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ products, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user location for better Maps grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.debug("Geolocation error:", error)
      );
    }

    if (messages.length === 0) {
      setMessages([{ role: 'model', content: 'مرحباً بك في مركز حلم الوزن والرشاقة! كيف يمكنني مساعدتك اليوم؟ يمكنني إرشادك لمنتجاتنا أو موقعنا في تبوك.' }]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productList = products.map(p => `${p.name}: ${p.salePrice || p.price} ريال`).join('\n');
      
      const contents = [
        ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: input }] }
      ];

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents as any,
        config: {
          systemInstruction: `أنت مساعد ذكي لمركز 'حلم الوزن والرشاقة'. أجب بالعربية بأسلوب ودود. المعلومات: ${productList}. نحن بتبوك (شارع أبو بكر الصديق، حي المروج). واتساب: ${CONTACT_WHATSAPP}. استخدم أداة Google Maps للبحث عن مواقع أو مطاعم صحية قريبة أو توفير خرائط للمركز عند الطلب.`,
          tools: [{ googleMaps: {} }],
          toolConfig: userLocation ? {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
              }
            }
          } : undefined
        },
      });

      const text = response.text || 'عذراً، لم أفهم ذلك.';
      const links: { title: string; uri: string }[] = [];

      // Extract grounding metadata for maps
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.maps) {
            links.push({
              title: chunk.maps.title || 'عرض على الخريطة',
              uri: chunk.maps.uri
            });
          }
        });
      }

      setMessages(prev => [...prev, { role: 'model', content: text, links: links.length > 0 ? links : undefined }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: 'حدث خطأ في الاتصال، حاول لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={onToggle} className="fixed bottom-24 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-gray-900 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-800 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[550px] sm:w-80 sm:rounded-xl shadow-2xl border border-gray-700">
          <header className="flex items-center justify-between bg-gray-900 p-4 sm:rounded-t-xl">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-yellow-500">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-bold">المساعد الذكي (Maps)</span>
            </div>
            <button onClick={onToggle}><XMarkIcon className="w-6 h-6 text-gray-400" /></button>
          </header>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>
                  {msg.content}
                </div>
                {msg.links && (
                  <div className="mt-2 flex flex-col gap-1 w-full max-w-[90%]">
                    {msg.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 hover:bg-blue-600/40 transition-colors"
                      >
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{link.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-xl text-xs animate-pulse">
                  جاري التفكير والبحث...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-900 flex space-x-2 rtl:space-x-reverse sm:rounded-b-xl">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="اسأل عن المنتجات أو موقعنا..." 
              className="flex-grow bg-gray-700 border-none rounded-full px-4 py-2 text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-500" 
              disabled={isLoading} 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="p-2 bg-yellow-500 text-gray-900 rounded-full disabled:opacity-50 hover:bg-yellow-400 transition-colors shadow-lg"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
