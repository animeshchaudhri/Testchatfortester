"use client";

import { FiLock } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

import { db } from "@/database";
import MessageBox from "./MessageBox";
import GroupMsgBox from "./GroupMsgBox";
import useAuthStore from "@/store/useAuth";
import { showNotification } from "@/utils";
import { pusherClient } from "@/config/pusher";
import usePrivateApi from "@/hooks/usePrivateApi";
import useConversation from "@/hooks/useConversation";
import { FullMessageType, User } from "@/shared/types";

interface BodyProps {
  initialMessages: FullMessageType[];
  chatType: string;
}

const Body: React.FC<BodyProps> = ({ initialMessages, chatType }) => {
  const api = usePrivateApi();
  const { session } = useAuthStore();
  const { conversationId } = useConversation();

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/chats/${conversationId}/seen`);
    setMessages(initialMessages);
  }, [api, conversationId, initialMessages]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = async (data: {
      id: string;
      chatId: string;
      isGroup: boolean;
      message: FullMessageType;
    }) => {
      api.get(`/chats/${conversationId}/seen`);

      setMessages((current) => {
        // Find and remove the instant message by its id
        const filteredMessages = current.filter(
          (msg) => !(msg.isInstant && msg.id === data.id)
        );

        if (filteredMessages.some((msg) => msg.id === data.message.id)) {
          return filteredMessages;
        }

        const updatedMessages = [...filteredMessages, data.message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        bottomRef?.current?.scrollIntoView();

        return updatedMessages;
      });

      try {
        const table = data.isGroup ? db.groupchat : db.chats;
        const conversation = await table.get(data.chatId);

        if (conversation) {
          const uniqueMessageIds = new Set(
            conversation.messages.map((msg) => msg.id)
          );

          if (!uniqueMessageIds.has(data.message.id)) {
            conversation.messages.push(data.message);
            await table.put(conversation);
          }
        }
      } catch (error) {
        console.error("Failed to update conversation in IndexedDB:", error);
      }
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    const instantUpdate = (data: {
      id: string;
      sender: User;
      message: string;
    }) => {
      const message: FullMessageType = {
        id: data.id,
        body: data.message,
        createdAt: new Date().toISOString(),
        isInstant: true,
        seenIds: [],
        seen: [],
        sender: data.sender,
      };

      //send notificatioin 
      if (data?.sender.id !== session?.id) {
        if (!navigator.onLine || document.hidden) {
          const message = {
            body: data.message,
            icon: data?.sender?.profile || "",
          };
          showNotification(message);
        }
      }

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        bottomRef?.current?.scrollIntoView();

        return updatedMessages;
      });
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    pusherClient.bind("instant:message", instantUpdate);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
      pusherClient.unbind("instant:message", instantUpdate);
    };
  }, [api, conversationId, session]);

  return (
    <div className="flex-1 overflow-y-scroll body-scroll bg-[url(/background.jpg)]">
      <div className="flex flex-col items-center mt-3">
        <div className="bg-sky-500 text-white font-normal text-xs p-1.5 rounded-md tracking-tighter text-center h-14">
          <p className="flex ">
            <FiLock />
            Messages and calls are end-to-end encrypted.
          </p>
          <p>No one outside of this chat,not even boom,</p>
          <p>can read or listen to them.</p>
        </div>
      </div>
      {chatType === "chat" ? (
        <>
          {messages.map((message, i) => (
            <MessageBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
            />
          ))}
        </>
      ) : (
        <>
          {messages.map((message, i) => (
            <GroupMsgBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
            />
          ))}
        </>
      )}

      <div ref={bottomRef} className="pt-20" />
    </div>
  );
};

export default Body;
