import { Search, Users, User, ExternalLink, Pin, LayoutPanelTop, MoreVertical } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { MessageBubble } from "./message-bubble";
import { ComposeForm } from "./compose-form";
import { cn } from "@/lib/utils";
import { ReactFormExtendedApi } from "@tanstack/react-form";

export interface ChatAreaBlockProps {
  activeConversation: any;
  messages: any[];
  isMessagesLoading: boolean;
  currentUserId: string;
  form: ReactFormExtendedApi<any>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
  onClearSelection: () => void;
}

export function ChatAreaBlock({
  activeConversation,
  messages,
  isMessagesLoading,
  currentUserId,
  form,
  messagesEndRef,
  isInfoOpen,
  onToggleInfo,
  onClearSelection,
}: ChatAreaBlockProps) {
  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Chat Header */}
      <div className="p-4 border-b-2 border-border bg-card flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          {/* Mobile Back Button */}
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
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
            onClick={onToggleInfo}
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
          <div className="text-center p-8 text-muted-foreground uppercase text-xs">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground uppercase text-xs">
            No messages yet. Send the first one!
          </div>
        ) : (
          messages.map((msg: any) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose Area */}
      <ComposeForm form={form} />
    </div>
  );
}
