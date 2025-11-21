import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSession } from 'next-auth/react';
import type { Message, Conversation } from '@/types/chat';

export function useChat() {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback((receiverId: string, message: string, conversationId: string) => {
    if (!socket || !session?.user) return;

    socket.emit('send_message', {
      receiverId,
      message,
      conversationId,
    });
  }, [socket, session]);

  const joinConversation = useCallback((conversationId: string) => {
    if (!socket) return;
    socket.emit('join_conversation', conversationId);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message_sent', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [socket]);

  return {
    conversations,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    joinConversation,
  };
}