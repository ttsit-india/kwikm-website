import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, MapPin, Phone } from "lucide-react";
import kwikMLogo from "@assets/k_logo_1771871712690.jpg";
import { apiClient } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface CustomerInfo {
  name: string;
  state: string;
  mobile: string;
}

const states = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    state: "",
    mobile: ""
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! 👋 I'm KwikM AI. How can I help you today with solar subsidies, installation, or savings?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async () => {
    if (!customerInfo.name.trim() || !customerInfo.state || !customerInfo.mobile.trim()) {
      return;
    }

    try {
      const chatLeadData = {
        name: customerInfo.name,
        mobile: customerInfo.mobile,
        state: customerInfo.state,
        chatSessionId: sessionId,
        source: 'website',
        initialMessage: 'User started chat interaction'
      };

      await fetch('/api/leads/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatLeadData)
      });
    } catch (error) {
      console.error('Failed to create chat lead:', error);
    }

    setShowForm(false);
    setFormCompleted(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "assistant",
      content: `Thank you ${customerInfo.name}! 👋 I see you're from ${customerInfo.state}. I can now help you with solar subsidies, installation costs, and savings calculations specific to your state. How can I assist you?`
    }]);
  };

  const isFormValid = customerInfo.name.trim() && customerInfo.state && customerInfo.mobile.trim() && customerInfo.mobile.length >= 10;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!formCompleted) {
      const userMessage = input.trim();
      setInput("");
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "user",
        content: userMessage
      }, {
        id: Date.now() + 1,
        role: "assistant",
        content: "Before I can help you, please fill in your details below so I can provide personalized assistance."
      }]);
      setShowForm(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    
    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userMessage
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: sessionId
        })
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantId = Date.now() + 1;

      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantId 
                      ? { ...m, content: assistantMessage }
                      : m
                  )
                );
              }
            } catch (e) {
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or contact us at info@kwikm.in"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            data-testid="chat-widget-panel"
          >
            <div className="bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img src={kwikMLogo} alt="KwikM Solar" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">KwikM AI</h3>
                  <p className="text-[10px] text-white/80">Solar Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                data-testid="button-close-chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`${showForm ? 'h-[180px]' : 'h-[240px]'} sm:h-auto overflow-y-auto p-3 bg-gray-50 space-y-2`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                    }`}
                    data-testid={`message-${message.role}-${message.id}`}
                  >
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showForm ? (
              <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Name *"
                      className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-customer-name"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="tel"
                      value={customerInfo.mobile}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="Mobile *"
                      className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-customer-mobile"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <select
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      data-testid="select-customer-state"
                    >
                      <option value="">State *</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleFormSubmit}
                    disabled={!isFormValid}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-start-chat"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                    data-testid="input-chat-message"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Chat with KwikM AI
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          data-testid="button-open-chat"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </motion.button>
      </div>
    </>
  );
}
