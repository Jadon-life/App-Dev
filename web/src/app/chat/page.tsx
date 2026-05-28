"use client";

/**
 * Crystal AI Chat — Premium-only immersive AI tutor page.
 * 
 * UX Concept: "Inside the brain of the AI"
 * - Dark neural network background with pulsing nodes
 * - Message bubbles float in from the void
 * - AI responses have a typing shimmer effect
 * - Premium gate: if not paid, shows locked state with preview
 * 
 * Uses Claude API via server route for educational Q&A.
 */

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Lock, Sparkles, Brain } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Premium gate — shown when user doesn't have access
function PremiumGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark relative overflow-hidden">
      {/* Neural network background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-surf/30 animate-pulse-glow"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
          <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#00b4d8" strokeWidth="0.5" />
          <line x1="60%" y1="15%" x2="30%" y2="60%" stroke="#6C3AE0" strokeWidth="0.5" />
          <line x1="80%" y1="40%" x2="50%" y2="80%" stroke="#00b4d8" strokeWidth="0.5" />
          <line x1="20%" y1="70%" x2="70%" y2="30%" stroke="#6C3AE0" strokeWidth="0.5" />
          <line x1="90%" y1="60%" x2="40%" y2="90%" stroke="#48cae4" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-md px-6">
        {/* Brain icon with glow */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-surf/20 border border-brand-surf/20 flex items-center justify-center mb-6 animate-pulse-glow">
          <Brain className="w-12 h-12 text-brand-aqua" strokeWidth={1.2} />
        </div>

        <h1 className="font-heading font-black text-3xl text-text-dark-primary">
          Crystal AI
        </h1>
        <p className="text-brand-frost/60 mt-3 leading-relaxed">
          Your personal AI tutor powered by advanced intelligence. Ask any educational question and get crystal-clear explanations.
        </p>

        {/* Feature preview */}
        <div className="mt-6 space-y-3 text-left">
          {[
            "Ask any UTME/WAEC question and get step-by-step solutions",
            "Explain complex topics in simple language",
            "Generate practice questions for any subject",
            "Available 24/7 — study anytime",
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-brand-surf flex-shrink-0 mt-0.5" />
              <span className="text-brand-frost/70">{feature}</span>
            </div>
          ))}
        </div>

        {/* Lock gate */}
        <div className="mt-8 p-4 rounded-section border border-brand-surf/20 bg-brand-navy/30">
          <Lock className="w-6 h-6 text-brand-aqua mx-auto mb-2" />
          <p className="text-sm text-brand-frost/60">
            Crystal AI is available for premium members only.
          </p>
          <Link
            href="/login"
            className="btn-primary mt-4 w-full justify-center text-sm"
          >
            Unlock Crystal AI
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main chat interface (shown after payment)
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I'm Crystal AI, your personal tutor. Ask me anything about UTME, WAEC, or any subject — I'll explain it step by step. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (in production, this calls /api/chat)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Great question! Let me break this down for you:\n\n${input.includes("physics") || input.includes("Physics") ? "In Physics, this concept relates to the fundamental principles of motion and energy. Here's the step-by-step explanation:\n\n1. First, identify the given values\n2. Apply the relevant formula\n3. Substitute and solve\n\nWould you like me to work through a specific example?" : "I'd be happy to help you understand this topic better. Could you tell me which subject this relates to (Mathematics, Physics, Chemistry, English, or Biology)? That way I can give you the most accurate and exam-relevant explanation."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark relative">
      {/* Neural background */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-surf/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulseGlow ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 px-6 py-4 border-b border-brand-surf/10 bg-background-dark/80 backdrop-blur-xl">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-purple to-brand-surf flex items-center justify-center shadow-glow">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-base text-text-dark-primary">Crystal AI</h1>
          <p className="text-[11px] text-brand-frost/50">Your AI tutor — always ready to help</p>
        </div>
        <div className="ml-auto">
          <Link href="/" className="text-xs text-brand-frost/40 hover:text-brand-surf transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple/30 to-brand-surf/30 flex items-center justify-center flex-shrink-0 border border-brand-surf/20">
                <Bot className="w-4 h-4 text-brand-aqua" />
              </div>
            )}
            <div
              className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-brand-teal to-brand-surf text-white rounded-br-sm"
                  : "bg-surface-dark-elevated border border-brand-surf/10 text-text-dark-primary rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-[10px] mt-1 block ${msg.role === "user" ? "text-white/50" : "text-brand-frost/30"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-brand-french/30 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-brand-frost" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple/30 to-brand-surf/30 flex items-center justify-center flex-shrink-0 border border-brand-surf/20">
              <Bot className="w-4 h-4 text-brand-aqua" />
            </div>
            <div className="bg-surface-dark-elevated border border-brand-surf/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-brand-surf/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 px-4 sm:px-6 py-4 border-t border-brand-surf/10 bg-background-dark/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Crystal AI anything..."
            className="flex-1 px-4 py-3 rounded-pill bg-surface-dark border border-brand-surf/15 text-text-dark-primary text-sm placeholder:text-brand-frost/30 focus:outline-none focus:border-brand-surf/40 focus:shadow-glow transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-teal to-brand-surf flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-40 disabled:hover:shadow-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-brand-frost/30 mt-2">
          Crystal AI is powered by advanced AI. Responses are for educational purposes.
        </p>
      </div>
    </div>
  );
}

export default function CrystalAIChatPage() {
  // In production: check if user has premium access
  // For now: show the premium gate (locked state)
  const hasPremiumAccess = false;

  if (!hasPremiumAccess) {
    return <PremiumGate />;
  }

  return <ChatInterface />;
}
