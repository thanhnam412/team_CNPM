"use client";

import { MessageSquarePlus } from "lucide-react";
import { ConversationList } from "./components/conversation-list";
import { ChatAreaBlock } from "./components/chat-area";
import { ContextSidebar } from "./components/context-sidebar";
import { cn } from "@/lib/utils";
import { ReactFormExtendedApi } from "@tanstack/react-form";

export interface MessagesBlockProps {
  conversations: any[];
  isConversationsLoading: boolean;
  messages: any[];
  isMessagesLoading: boolean;
  selectedChat: string | null;
  onSelectChat: (chatId: string | null) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
  currentUserId: string;
  form: ReactFormExtendedApi<any>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessagesBlock({
  conversations,
  isConversationsLoading,
  messages,
  isMessagesLoading,
  selectedChat,
  onSelectChat,
  filter,
  onFilterChange,
  isInfoOpen,
  onToggleInfo,
  currentUserId,
  form,
  messagesEndRef,
}: MessagesBlockProps) {
  const activeConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <ConversationList
        conversations={conversations}
        isLoading={isConversationsLoading}
        selectedChat={selectedChat}
        onSelectChat={(id) => onSelectChat(id)}
        filter={filter}
        onFilterChange={onFilterChange}
      />

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
            <ChatAreaBlock
              activeConversation={activeConversation}
              messages={messages}
              isMessagesLoading={isMessagesLoading}
              currentUserId={currentUserId}
              form={form}
              messagesEndRef={messagesEndRef}
              isInfoOpen={isInfoOpen}
              onToggleInfo={onToggleInfo}
              onClearSelection={() => onSelectChat(null)}
            />

            {/* Right Info Sidebar (Toggleable) */}
            {isInfoOpen && activeConversation.contextType !== "direct" && (
              <ContextSidebar activeConversation={activeConversation} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
