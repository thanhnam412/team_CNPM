import { Search, MessageSquarePlus, User, Users } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { cn } from "@/lib/utils";

export interface ConversationListProps {
  conversations: any[];
  isLoading: boolean;
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  selectedChat,
  onSelectChat,
  filter,
  onFilterChange,
}: ConversationListProps) {
  return (
    <div
      className={cn(
        "w-full md:w-80 lg:w-96 flex flex-col shrink-0 border-r-2 border-border bg-card transition-transform z-20",
        selectedChat ? "hidden md:flex" : "flex",
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
              onClick={() => onFilterChange(f)}
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
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-xs uppercase animate-pulse">
            Loading chats...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-xs uppercase">
            No conversations found
          </div>
        ) : (
          conversations.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
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
                  {chat.contextType === "DIRECT"
                    ? "Direct"
                    : chat.contextRef || chat.contextType}
                </span>
                <span className="text-[0.625rem] font-bold text-muted-foreground uppercase">
                  {new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                  <p className="text-xs truncate font-semibold flex items-center gap-1 text-muted-foreground">
                    {chat.messages?.[0]?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
