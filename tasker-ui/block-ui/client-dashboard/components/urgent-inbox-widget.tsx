import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoWidgetHeader } from "@/components/ui-custom/neo-widget-header";
import { NeoAvatar } from "@/components/ui-custom/neo-avatar";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface UrgentInboxWidgetProps {
  messages: any[];
}

export function UrgentInboxWidget({ messages }: UrgentInboxWidgetProps) {
  return (
    <NeoCard className="p-6">
      <NeoWidgetHeader
        title="Unread Messages"
        icon={<MessageSquare className="w-5 h-5 text-primary" />}
        href="/client/messages"
        linkText="Open Inbox"
      />

      <div className="space-y-3">
        {messages.map((chat) => (
          <Link key={chat.context} href="/client/messages" className="block">
            <div className="border-2 border-border bg-background p-3 flex gap-3 hover:bg-secondary/10 transition-colors group">
              <NeoAvatar name={chat.name} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm uppercase truncate group-hover:text-primary">
                    {chat.name}
                  </span>
                  <NeoBadge variant="destructive" className="shrink-0">
                    {chat.unread}
                  </NeoBadge>
                </div>
                <div className="text-xs font-semibold text-muted-foreground truncate mt-0.5">
                  {chat.msg}
                </div>
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1 flex justify-between">
                  <span>{chat.context}</span>
                  <span>{chat.time}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/client/messages">
        <NeoButton variant="outline" className="w-full mt-4 h-10">
          View All Conversations
        </NeoButton>
      </Link>
    </NeoCard>
  );
}
