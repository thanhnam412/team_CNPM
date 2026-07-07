import { Check, Terminal, Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface MessageBubbleProps {
  msg: any;
  currentUserId: string;
}

export function MessageBubble({ msg, currentUserId }: MessageBubbleProps) {
  const isMe = msg.senderId === currentUserId;

  // Render System Message
  if (msg.type === "SYSTEM") {
    return (
      <div className="flex justify-center my-8">
        <div className="border-2 border-dashed border-border px-4 py-2 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground bg-background max-w-sm text-center">
          {msg.content} <br />
          {""}
          <span className="text-foreground">
            {new Date(msg.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  }

  // Render Normal / Code / File Messages
  return (
    <div
      className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
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
                <NeoButton variant="ghost" size="icon" className="h-6 w-6">
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
                isMe ? "bg-primary/10 border-primary" : "bg-card",
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
            <span>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
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
}
