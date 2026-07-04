"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { useConversations, useMessagesWithUser, useSendMessageMutation } from "@/tanstack/useMessages";
import {
  Search,
  MessageSquarePlus,
  Paperclip,
  Send,
  MoreVertical,
  ExternalLink,
  Check,
  CheckCheck,
  User,
  Users,
  Pin,
  LayoutPanelTop,
  Copy,
  Terminal,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn } from "@/lib/utils";

// Mock Data
const CONVERSATIONS = [
  {
    id: "c1",
    name: "Alex_Code",
    isGroup: false,
    online: true,
    lastMessage: "I've started setting up the proxy pool...",
    time: "10:42 AM",
    unread: 2,
    contextType: "quick_task", // quick_task, project, direct
    contextName: "Write a Python script for web...",
    contextRef: "QT-889",
    details: {
      budget: "$150.00",
      deadline: "Oct 15, 2026",
      status: "In Progress",
    },
  },
  {
    id: "c2",
    name: "Team AI - ERP System",
    isGroup: true,
    online: false,
    lastMessage: "Bạn: Can we schedule a meeting tomorrow?",
    time: "Yesterday",
    unread: 0,
    contextType: "project",
    contextName: "Hệ thống Quản lý Doanh nghiệp",
    contextRef: "PROJ-123",
    details: {
      budget: "$5,000.00",
      deadline: "Dec 31, 2026",
      status: "Active",
    },
  },
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    type: "text",
    senderId: "c1",
    senderName: "Alex_Code",
    text: "Hi! I've started setting up the proxy pool for the scraper.",
    time: "10:00 AM",
    isMe: false,
  },
  {
    id: "m2",
    type: "text",
    senderId: "me",
    senderName: "You",
    text: "Great! Let me know if you face any issues with Cloudflare. We need this to bypass their new JS challenge.",
    time: "10:15 AM",
    isMe: true,
    status: "read",
  },
  {
    id: "m3",
    type: "code",
    senderId: "c1",
    senderName: "Alex_Code",
    language: "python",
    code: "import undetected_chromedriver as uc\n\noptions = uc.ChromeOptions()\noptions.add_argument('--headless')\ndriver = uc.Chrome(options=options)\n\ndriver.get('https://target-site.com')",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "m4",
    type: "system",
    text: "Client đã nạp $150.00 vào Escrow thành công.",
    time: "10:35 AM",
  },
  {
    id: "m5",
    type: "text",
    senderId: "c1",
    senderName: "Alex_Code",
    text: "I'll have a sample CSV ready for you tomorrow morning based on this logic.",
    time: "10:42 AM",
    isMe: false,
  },
  {
    id: "m6",
    type: "file",
    senderId: "me",
    senderName: "You",
    fileName: "requirements_v2.pdf",
    fileSize: "2.4 MB",
    time: "10:50 AM",
    isMe: true,
    status: "sent",
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock User ID
  const currentUserId = "user-1";

  // Fetch Conversations
  const { data: conversations = [], isLoading: isConversationsLoading } = useConversations(currentUserId);

  // Fetch Messages for Selected Chat
  const { data: messages = [], isLoading: isMessagesLoading } = useMessagesWithUser(currentUserId, selectedChat);

  const activeConversation = conversations.find((c: any) => c.id === selectedChat);

  // Send Message Mutation
  const sendMessageMutation = useSendMessageMutation(currentUserId, selectedChat);

  // TanStack Form for Chat Input
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.content.trim()) return;
      sendMessageMutation.mutate(value.content);
      form.reset();
    },
  });

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 flex flex-col shrink-0 border-r-2 border-border bg-card transition-transform z-20",
          selectedChat ? "hidden md:flex" : "flex", // Hide on mobile if chat is selected
        )}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-border bg-secondary/10 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-heading font-black tracking-widest uppercase flex items-center gap-2">
            Inbox
            <span className="bg-primary text-primary-foreground text-[0.625rem] px-2 py-0.5 rounded-none">
              3
            </span>
          </h1>
          <NeoButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 border-transparent"
          >
            <MessageSquarePlus className="w-4 h-4 text-foreground" />
          </NeoButton>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b-2 border-border space-y-4 shrink-0 bg-background">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <NeoInput
              placeholder="Search chats..."
              className="pl-9 h-10 focus-visible: text-xs"
            />
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            {["all", "unread", "projects", "tasks", "direct"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 px-3 py-1.5 border-2 text-[0.625rem] font-bold uppercase tracking-widest transition-all",
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary shadow-[2px_2px_0px_0px_var(--primary)] -translate-y-[1px]"
                    : "bg-card border-border text-muted-foreground hover:bg-secondary/20 hover:border-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-secondary/5">
          {isConversationsLoading ? (
            <div className="p-4 text-center text-muted-foreground text-xs uppercase">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-xs uppercase">No conversations found</div>
          ) : (
            conversations.map((chat: any) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={cn(
                  "p-4 border-b-2 border-border cursor-pointer transition-all flex flex-col gap-2 relative group",
                  selectedChat === chat.id
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "bg-card hover:bg-secondary/20 border-l-4 border-l-transparent",
                )}
              >
                {/* Context Tag */}
                <div className="flex justify-between items-start">
                  <span
                    className={cn(
                      "text-[0.625rem] font-black uppercase tracking-widest px-2 py-0.5 border-2",
                      chat.contextType === "QUICK_TASK"
                        ? "bg-[#E1801E]/10 border-[#E1801E] text-[#E1801E]"
                        : chat.contextType === "PROJECT"
                          ? "bg-purple-500/10 border-purple-500 text-purple-600"
                          : "bg-secondary border-border text-muted-foreground",
                    )}
                  >
                    {chat.contextType === "DIRECT" ? "Direct" : chat.contextRef || chat.contextType}
                  </span>
                  <span className="text-[0.625rem] font-bold text-muted-foreground uppercase">
                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Chat Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-border bg-background flex items-center justify-center shrink-0">
                      {chat.isGroup ? (
                        <Users className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-sm uppercase truncate pr-2 group-hover:text-primary transition-colors">
                        {chat.name || "Conversation"}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate font-semibold flex items-center gap-1",
                        "text-muted-foreground",
                      )}
                    >
                      {chat.messages?.[0]?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: CHAT AREA + INFO SIDEBAR */}
      <div
        className={cn(
          "flex-1 flex bg-background h-full transition-transform z-10",
          !selectedChat ? "hidden md:flex" : "flex",
        )}
      >
        {!activeConversation ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-l-2 border-border border-dashed m-4 bg-secondary/5">
            <div className="w-24 h-24 border-4 border-border bg-card flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_var(--border)]">
              <MessageSquarePlus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-black tracking-widest uppercase mb-2">
              Select a Conversation
            </h2>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest max-w-md">
              Choose a chat from the left menu or start a new direct message to
              discuss with an expert.
            </p>
          </div>
        ) : (
          // Active Chat View (Main Chat + Sidebar)
          <div className="flex-1 flex h-full">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
              {/* Chat Header */}
              <div className="p-4 border-b-2 border-border bg-card flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                  {/* Mobile Back Button */}
                  <NeoButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden h-8 w-8 mr-2 shrink-0"
                  >
                    <Search className="w-4 h-4" />
                  </NeoButton>

                  <div className="relative shrink-0">
                    <div className="w-12 h-12 border-2 border-border bg-secondary flex items-center justify-center shrink-0">
                      {activeConversation.isGroup ? (
                        <Users className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    {activeConversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
                    )}
                  </div>

                  <div className="min-w-0 pr-4">
                    <h2 className="font-heading font-black text-lg uppercase tracking-wider truncate">
                      {activeConversation.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 truncate">
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest border-r-2 border-border pr-2 shrink-0">
                        {activeConversation.online ? "Online" : "Offline"}
                      </span>
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 hover:text-primary cursor-pointer transition-colors truncate">
                        {activeConversation.contextType !== "direct" && (
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate">
                          {activeConversation.contextName}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <NeoButton
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex h-10 w-10"
                    title="Pin Chat"
                  >
                    <Pin className="w-4 h-4" />
                  </NeoButton>
                  <NeoButton
                    variant={isInfoOpen ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className={cn(
                      "hidden lg:flex h-10 w-10",
                      isInfoOpen ? "-translate-x-[1px] -translate-y-[1px]" : "",
                    )}
                    title="Toggle Info"
                  >
                    <LayoutPanelTop className="w-4 h-4" />
                  </NeoButton>
                  <NeoButton
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    title="More Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </NeoButton>
                </div>
              </div>

              {/* Chat Messages Loop */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/5 space-y-6">
                {/* Date Separator */}
                <div className="flex justify-center my-6">
                  <span className="bg-card border-2 border-border px-3 py-1 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
                    Today, Oct 12
                  </span>
                </div>

                {isMessagesLoading ? (
                  <div className="text-center p-8 text-muted-foreground uppercase text-xs">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground uppercase text-xs">No messages yet. Send the first one!</div>
                ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    
                    // Render System Message
                    if (msg.type === "SYSTEM") {
                      return (
                        <div key={msg.id} className="flex justify-center my-8">
                          <div className="border-2 border-dashed border-border px-4 py-2 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground bg-background max-w-sm text-center">
                            {msg.content} <br />
                            {""}
                            <span className="text-foreground">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      );
                    }

                    // Render Normal / Code / File Messages
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex w-full",
                          isMe ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "flex gap-3 max-w-[90%] md:max-w-[80%]",
                            isMe ? "flex-row-reverse" : "flex-row",
                          )}
                        >
                          {/* Avatar (Only for others) */}
                          {!isMe && (
                            <div className="w-8 h-8 border-2 border-border bg-card flex items-center justify-center shrink-0 text-xs font-bold uppercase mt-1">
                              {msg.sender?.name?.charAt(0) || "?"}
                            </div>
                          )}

                          <div
                            className={cn(
                              "flex flex-col min-w-0",
                              isMe ? "items-end" : "items-start",
                            )}
                          >
                            {!isMe && (
                              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1 ml-1">
                                {msg.sender?.name || "Unknown"}
                              </span>
                            )}

                            {/* Text Bubble */}
                            {msg.type === "TEXT" && (
                              <div
                                className={cn(
                                  "p-3 md:p-4 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]",
                                  isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card text-foreground",
                                )}
                              >
                                <p className="text-sm font-semibold whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                            )}

                            {/* Code Block Mockup */}
                            {msg.type === "CODE" && (
                              <div className="border-2 border-foreground bg-foreground text-background shadow-[2px_2px_0px_0px_var(--foreground)] w-full max-w-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b-2 border-border/20 bg-muted/10">
                                  <span className="text-[0.625rem] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-3 h-3" />
                                    {""}
                                    {msg.metadata?.language || "code"}
                                  </span>
                                  <NeoButton
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </NeoButton>
                                </div>
                                <div className="p-4 overflow-x-auto text-xs font-mono whitespace-pre text-green-400">
                                  {msg.content}
                                </div>
                              </div>
                            )}

                            {/* File Attachment Mockup */}
                            {msg.type === "FILE" && (
                              <div
                                className={cn(
                                  "p-3 md:p-4 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] flex items-center gap-4 cursor-pointer hover:bg-secondary/20 transition-colors",
                                  isMe
                                    ? "bg-primary/10 border-primary"
                                    : "bg-card",
                                )}
                              >
                                <div className="w-10 h-10 border-2 border-foreground bg-background flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-foreground" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm truncate max-w-[200px]">
                                    {msg.metadata?.fileName || "Attachment"}
                                  </div>
                                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                                    {msg.metadata?.fileSize || "Unknown size"}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Meta Footer */}
                            <div className="flex items-center gap-1 mt-1 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && (
                                <span className="ml-1">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose Area */}
              <div className="p-4 bg-card border-t-2 border-border shrink-0 z-10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div className="flex items-end gap-2 md:gap-3 max-w-5xl mx-auto">
                    <div className="flex flex-col gap-2 shrink-0 pb-1 hidden sm:flex">
                      <NeoButton
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        title="Attach File"
                      >
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                      </NeoButton>
                    </div>

                    <div className="flex-1 relative">
                      <form.Field
                        name="content"
                        children={(field) => (
                          <NeoTextarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit();
                              }
                            }}
                            placeholder="Type a message... (Markdown supported)"
                            className="min-h-[52px] max-h-[200px] resize-y focus-visible: text-sm font-semibold p-3"
                          />
                        )}
                      />
                    </div>

                    <form.Subscribe
                      selector={(state) => [state.values.content, state.isSubmitting]}
                      children={([content, isSubmitting]) => (
                        <NeoButton
                          type="submit"
                          disabled={!content.trim() || isSubmitting}
                          className="h-[52px] px-4 md:px-6 shrink-0"
                        >
                          <Send className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Send</span>
                        </NeoButton>
                      )}
                    />
                  </div>
                </form>
                <div className="mt-2 text-center hidden sm:block">
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                    Pro Tip: Use{""}
                    <strong className="text-foreground">```</strong> for code
                    blocks or drop files directly here.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Info Sidebar (Toggleable) */}
            {isInfoOpen && activeConversation.contextType !== "direct" && (
              <div className="hidden lg:flex flex-col w-80 shrink-0 border-l-2 border-border bg-card animate-in slide-in-from-right-10 duration-200">
                <div className="p-4 border-b-2 border-border bg-secondary/10">
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Context Info
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Task/Project Summary */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                        {activeConversation.contextType === "quick_task"
                          ? "Quick Task"
                          : "Project"}
                      </span>
                      <h4 className="font-bold text-sm leading-tight hover:text-primary cursor-pointer transition-colors">
                        {activeConversation.contextName}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border-2 border-border bg-background">
                        <DollarSign className="w-4 h-4 text-primary mb-1" />
                        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block">
                          Budget
                        </span>
                        <span className="font-heading font-black text-sm">
                          {activeConversation.details?.budget}
                        </span>
                      </div>
                      <div className="p-3 border-2 border-border bg-background">
                        <Clock className="w-4 h-4 text-[#E1801E] mb-1" />
                        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block">
                          Deadline
                        </span>
                        <span className="font-heading font-black text-sm truncate">
                          {activeConversation.details?.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shared Files List */}
                  <div>
                    <h3 className="font-heading font-black text-sm uppercase tracking-widest mb-3 flex items-center justify-between border-b-2 border-border pb-2">
                      Shared Files
                      <span className="bg-secondary text-foreground text-[0.625rem] px-1.5 py-0.5">
                        1
                      </span>
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 border-2 border-border hover:bg-secondary/20 cursor-pointer transition-colors">
                        <div className="w-8 h-8 border-2 border-border bg-background flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[0.625rem] uppercase tracking-widest truncate text-foreground">
                            requirements_v2.pdf
                          </div>
                          <div className="text-[0.5rem] font-bold uppercase tracking-widest text-muted-foreground">
                            Today • 2.4 MB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-heading font-black text-sm uppercase tracking-widest mb-3 border-b-2 border-border pb-2">
                      Actions
                    </h3>
                    <div className="space-y-2">
                      <NeoButton
                        variant="outline"
                        className="w-full h-10 text-[0.625rem]"
                      >
                        Request Deliverable
                      </NeoButton>
                      <NeoButton
                        variant="outline"
                        className="w-full h-10 text-[0.625rem]"
                      >
                        View Full Details
                      </NeoButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
