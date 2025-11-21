'use client';

import React, { useState, useEffect } from 'react';
import { Send, Plus, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  time: string;
}

export default function ChatInterface() {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [conversations] = useState<Conversation[]>([
    { id: 1, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 2, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 3, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 1 },
    { id: 4, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 5, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 6, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 7, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 8, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 9, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
    { id: 10, name: 'Nome do Usuario', lastMessage: 'Mensagens', time: 'Horário da mensagem', unread: 3 },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,',
      sender: 'other',
      time: 'Data e Hora da Mensagem'
    },
    {
      id: 2,
      text: 'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      sender: 'user',
      time: ''
    },
    {
      id: 3,
      text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,',
      sender: 'other',
      time: ''
    },
    {
      id: 4,
      text: 'making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,',
      sender: 'user',
      time: ''
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket conectado!');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket desconectado!');
        setIsConnected(false);
      });

      socket.on('receive-message', (message: Message) => {
        console.log('Mensagem recebida:', message);
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('receive-message');
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    console.log('Tentando enviar:', newMessage);
    console.log('Socket existe:', !!socket);
    console.log('Socket conectado:', socket?.connected);
    
    if (newMessage.trim()) {
      if (socket && socket.connected) {
        const newMsg = {
          text: newMessage,
          sender: 'user'
        };
        
        console.log('Enviando mensagem:', newMsg);
        socket.emit('send-message', newMsg);
        setNewMessage('');
      } else {
        console.log('Socket não conectado - adicionando localmente');
        const localMsg = {
          id: Date.now(),
          text: newMessage,
          sender: 'user' as const,
          time: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, localMsg]);
        setNewMessage('');
      }
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Conversations */}
      <aside className="w-96 bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Conversas</h2>
          <button className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition">
            <Plus size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition bg-gradient-to-r from-blue-400 to-blue-500 text-white m-2 rounded-lg"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{conv.name}</h3>
                <p className="text-sm opacity-90 truncate">{conv.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xs opacity-90 whitespace-nowrap">{conv.time}</span>
                {conv.unread > 0 && (
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="text-center mb-6">
            <h3 className="text-gray-500 mb-2">Data e Hora da Mensagem</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-3xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-300 to-blue-400 text-gray-800'
                      : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                  }`}
                >
                  <p className="text-justify leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Coloque sua Mensagem"
              className="flex-1 px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 text-white rounded-full flex items-center justify-center hover:from-red-500 hover:to-red-600 transition shadow-lg"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}