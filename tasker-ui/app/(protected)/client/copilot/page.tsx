"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowRight } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { useCopilotChatMutation } from "@/tanstack/useCopilot";
import { ExpertCard } from "@/block-ui/expert/marketplace/components/expert-card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  intent?: "CREATE_PROJECT" | "SEARCH_EXPERTS" | "CREATE_QUICK_TASK" | "UNKNOWN";
  data?: any;
};

const STORAGE_KEY = "copilot_chat_session";

export default function CopilotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chat session", e);
      }
    } else {
      setMessages([
        {
          id: "init",
          sender: "ai",
          text: "Hello! I'm your AI Assistant. You can ask me to create a project with specific requirements, or ask me to find experts for a particular skill or industry. How can I help you today?",
        }
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever messages change (only after initial load)
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isLoaded]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const copilotMutation = useCopilotChatMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, copilotMutation.isPending]);

  const handleSend = () => {
    if (!input.trim() || copilotMutation.isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    copilotMutation.mutate(userMsg.text, {
      onSuccess: (res: any) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "ai",
            text: res.message || "I processed your request.",
            intent: res.intent,
            data: res.project ? { project: res.project } : res.task ? { task: res.task } : res.experts ? { experts: res.experts } : null,
          },
        ]);
      },
      onError: (err: any) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "ai",
            text: "Oops, something went wrong: " + (err.response?.data?.message || err.message),
            intent: "UNKNOWN",
          },
        ]);
      },
    });
  };

  const handleClearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: "init",
        sender: "ai",
        text: "Hello! I'm your AI Assistant. You can ask me to create a project with specific requirements, or ask me to find experts for a particular skill or industry. How can I help you today?",
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="max-w-5xl mx-auto w-full p-6 md:p-8 shrink-0 flex items-center justify-between">
        <NeoPageHeader
          containerClassName="p-0"
          title="AI Copilot"
          icon={<Bot className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
          description="Describe what you need in natural language. I can create projects or find the perfect experts for you."
        />
        <NeoButton variant="outline" onClick={handleClearChat} className="shrink-0">
          New Chat
        </NeoButton>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 w-full",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="w-10 h-10 shrink-0 bg-primary border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] lg:max-w-[75%] border-2 p-4",
                  msg.sender === "user"
                    ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_var(--primary)]"
                    : "bg-card border-border shadow-[4px_4px_0px_0px_var(--border)]"
                )}
              >
                <div className="text-sm font-semibold whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {/* AI Intent Rendering */}
                {msg.intent === "CREATE_PROJECT" && msg.data?.project && (
                  <div className="mt-4 p-4 border-2 border-foreground bg-secondary/20">
                    <h4 className="font-heading font-black text-xl mb-1 uppercase tracking-wider">
                      {msg.data.project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {msg.data.project.description}
                    </p>
                    <NeoButton
                      onClick={() => router.push(`/client/projects/${msg.data.project.id}`)}
                      className="w-full sm:w-auto h-10"
                    >
                      View Project <ArrowRight className="w-4 h-4 ml-2" />
                    </NeoButton>
                  </div>
                )}

                {msg.intent === "CREATE_QUICK_TASK" && msg.data?.task && (
                  <div className="mt-4 p-4 border-2 border-foreground bg-primary/10">
                    <h4 className="font-heading font-black text-xl mb-1 uppercase tracking-wider text-primary">
                      {msg.data.task.title}
                    </h4>
                    <div className="text-sm text-muted-foreground mb-4 font-bold tracking-widest uppercase">
                      Budget: ${msg.data.task.budget}
                    </div>
                    <NeoButton
                      onClick={() => router.push(`/client/quick-tasks/${msg.data.task.id}`)}
                      className="w-full sm:w-auto h-10"
                    >
                      View Quick Task <ArrowRight className="w-4 h-4 ml-2" />
                    </NeoButton>
                  </div>
                )}

                {msg.intent === "SEARCH_EXPERTS" && msg.data?.experts && (
                  <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {msg.data.experts.map((expert: any) => (
                      <ExpertCard
                        key={expert.id}
                        expert={expert}
                        isSaved={false}
                        onToggleSave={() => {}}
                        onInvite={() => router.push(`/expert/${expert.id}`)}
                      />
                    ))}
                    {msg.data.experts.length === 0 && (
                      <div className="col-span-full p-4 border-2 border-dashed border-border text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                        No experts found matching your criteria.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-10 h-10 shrink-0 bg-secondary border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <User className="w-5 h-5 text-foreground" />
                </div>
              )}
            </div>
          ))}

          {copilotMutation.isPending && (
            <div className="flex gap-4 w-full justify-start animate-pulse">
              <div className="w-10 h-10 shrink-0 bg-primary border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)]">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="max-w-[75%] border-2 p-4 bg-card border-border shadow-[4px_4px_0px_0px_var(--border)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 p-4 md:p-6 bg-background border-t-2 border-border relative z-10">
        <div className="max-w-5xl mx-auto flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your requirements here... (Shift+Enter for new line)"
            className="flex-1 min-h-[60px] max-h-[120px] bg-card border-2 border-foreground p-3 outline-none focus:ring-2 focus:ring-primary font-semibold text-sm shadow-[4px_4px_0px_0px_var(--foreground)] resize-none"
            rows={2}
          />
          <NeoButton
            onClick={handleSend}
            disabled={!input.trim() || copilotMutation.isPending}
            className="h-auto px-6 shrink-0"
          >
            <Send className="w-5 h-5" />
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
