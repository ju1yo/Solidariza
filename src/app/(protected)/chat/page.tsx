'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ChatInterface() {
  const { data: session } = useSession();
  const {
    conversations,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    joinConversation,
  } = useChat();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (convId: string, otherUserId: string) => {
    setSelectedConversation(convId);
    setReceiverId(otherUserId);
    fetchMessages(convId);
    joinConversation(convId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiverId || !selectedConversation) return;

    // Send via API
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId,
          content: newMessage,
        }),
      });

      // Refresh messages
      fetchMessages(selectedConversation);
      fetchConversations();
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      {/* Sidebar - Conversations */}
      <aside className="w-96 bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Conversas</h2>
          <Button size="icon" className="rounded-full bg-red-500 hover:bg-red-600">
            <Plus size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 && (
            <div className="p-6 text-center text-muted-foreground animate-pulse">
              Carregando conversas...
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              Nenhuma conversa ainda. Inicie uma conversa pelo feed!
            </div>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() =>
                handleSelectConversation(
                  conv.id,
                  conv.otherUser?.id || ''
                )
              }
              className={`flex items-center gap-4 p-4 cursor-pointer transition m-2 rounded-lg ${
                selectedConversation === conv.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600'
              }`}
            >
              <Avatar className="h-12 w-12 border-2 border-white/30">
                <AvatarImage src={conv.otherUser?.profileImage || ''} />
                <AvatarFallback className="bg-white text-gray-600 font-semibold">
                  {getInitials(conv.otherUser?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">
                  {conv.otherUser?.name || 'Usuário'}
                </h3>
                <p className="text-sm opacity-90 truncate">
                  {conv.lastMessage || 'Sem mensagens'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => {
                  const isMe = message.senderId === session?.user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-2xl px-6 py-4 rounded-3xl ${
                          isMe
                            ? 'bg-gradient-to-br from-blue-300 to-blue-400 text-gray-800'
                            : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                        }`}
                      >
                        <p className="text-justify leading-relaxed">
                          {message.message}
                        </p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto flex items-center gap-4">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Coloque sua Mensagem"
                  className="flex-1 px-6 py-6 rounded-full"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 shadow-lg"
                >
                  <Send size={24} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-lg">Selecione uma conversa para começar</p>
          </div>
        )}
      </main>
    </div>
  );
}