"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import {
  useConversations,
  useMessages,
  useSendMessageMutation,
} from "@/tanstack/useMessages";
import { useGetMe } from "@/tanstack/useGetMe";
import { MessagesBlock } from "@/block-ui/messages";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: me } = useGetMe();
  const currentUserId = me?.id || "";

  // Fetch Conversations
  const { data: conversations = [], isLoading: isConversationsLoading } =
    useConversations(currentUserId);

  // Fetch Messages for Selected Chat
  const { data: messages = [], isLoading: isMessagesLoading } = useMessages(
    selectedChat ?? "",
  );

  // Send Message Mutation
  const sendMessageMutation = useSendMessageMutation();

  // TanStack Form for Chat Input
  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.content.trim() || !selectedChat) return;
      sendMessageMutation.mutate({
        conversationId: selectedChat,
        payload: {
          content: value.content,
          senderId: currentUserId,
          type: "TEXT",
        },
      });
      form.reset();
    },
  });

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MessagesBlock
      conversations={conversations}
      isConversationsLoading={isConversationsLoading}
      messages={messages}
      isMessagesLoading={isMessagesLoading}
      selectedChat={selectedChat}
      onSelectChat={setSelectedChat}
      filter={filter}
      onFilterChange={setFilter}
      isInfoOpen={isInfoOpen}
      onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
      currentUserId={currentUserId}
      form={form}
      messagesEndRef={messagesEndRef}
    />
  );
}
