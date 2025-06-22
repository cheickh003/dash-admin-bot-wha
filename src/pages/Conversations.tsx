import React, { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import type { Conversation, Message } from '../types';
import { MessageSquare, User, Search, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CONVERSATIONS,
        [
          Query.orderDesc('lastMessageAt'),
          Query.limit(100),
        ]
      );
      setConversations(response.documents as unknown as Conversation[]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.equal('conversationId', conversationId),
          Query.orderDesc('timestamp'),
          Query.limit(50),
        ]
      );
      setMessages(response.documents.reverse() as unknown as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.$id);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.phoneNumber.includes(searchTerm)
  );

  const formatPhoneNumber = (phone: string) => {
    // Format: +225 XX XX XX XX XX
    if (phone.length >= 10) {
      return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)} ${phone.slice(11)}`;
    }
    return phone;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM/yyyy', { locale: fr });
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:block' : ''} w-full md:w-1/3 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par numéro..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune conversation trouvée
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.$id}
                onClick={() => setSelectedConversation(conversation)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedConversation?.$id === conversation.$id ? 'bg-whatsapp-light' : ''
                }`}
              >
                <div className="bg-gray-200 rounded-full p-3 mr-3">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 truncate">
                      {formatPhoneNumber(conversation.phoneNumber)}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Cliquez pour voir les messages
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages View */}
      <div className={`${selectedConversation ? '' : 'hidden md:block'} flex-1 flex flex-col`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <button
                onClick={() => setSelectedConversation(null)}
                className="mr-4 md:hidden"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 rotate-180" />
              </button>
              <div className="bg-gray-200 rounded-full p-2 mr-3">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {formatPhoneNumber(selectedConversation.phoneNumber)}
                </h3>
                <p className="text-sm text-gray-600">
                  Conversation depuis {format(new Date(selectedConversation.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.$id}
                    className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-gray-100 text-gray-900'
                          : message.role === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-whatsapp-light text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-end mt-1">
                        <Clock className="w-3 h-3 mr-1 opacity-60" />
                        <span className="text-xs opacity-60">
                          {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez une conversation pour voir les messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};