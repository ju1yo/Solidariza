import { useEffect, useState } from 'react';

interface SimpleSocket {
  connected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

export function useSocket(): SimpleSocket | null {
  const [socket, setSocket] = useState<SimpleSocket | null>(null);

  useEffect(() => {
    // Gera ID único para cada aba
    const tabId = sessionStorage.getItem('tabId') || Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('tabId', tabId);
    
    const simpleSocket: SimpleSocket = {
      connected: true,
      emit: (event: string, data: any) => {
        if (event === 'send-message') {
          const messageWithData = {
            ...data,
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            tabId: tabId // Adiciona ID da aba
          };
          
          // Salva no localStorage para sincronizar entre abas
          const messages = JSON.parse(localStorage.getItem('realTimeMessages') || '[]');
          messages.push(messageWithData);
          localStorage.setItem('realTimeMessages', JSON.stringify(messages));
          
          // Dispara evento customizado
          window.dispatchEvent(new CustomEvent('new-message', { detail: messageWithData }));
        }
      },
      on: (event: string, callback: (data: any) => void) => {
        if (event === 'connect') {
          setTimeout(() => callback({}), 100);
        } else if (event === 'receive-message') {
          const handler = (e: CustomEvent) => {
            const message = e.detail;
            // Se a mensagem é da mesma aba, mantém como 'user'
            // Se é de outra aba, muda para 'other'
            if (message.tabId !== tabId) {
              message.sender = 'other';
            }
            callback(message);
          };
          window.addEventListener('new-message', handler as EventListener);
          
          // Escuta mudanças no localStorage (outras abas)
          const storageHandler = (e: StorageEvent) => {
            if (e.key === 'realTimeMessages' && e.newValue) {
              const messages = JSON.parse(e.newValue);
              const lastMessage = messages[messages.length - 1];
              if (lastMessage && lastMessage.tabId !== tabId) {
                // Mensagem de outra aba = outro usuário
                lastMessage.sender = 'other';
                callback(lastMessage);
              }
            }
          };
          window.addEventListener('storage', storageHandler);
        }
      },
      off: () => {}
    };

    setSocket(simpleSocket);
  }, []);

  return socket;
}