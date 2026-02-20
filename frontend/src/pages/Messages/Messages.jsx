/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Messages.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:04:31 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 09:25:50 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMessages } from "../../context/MessagesContext";
import { FiSearch } from "react-icons/fi";

export default function Messages()
{
	const { t } = useTranslation();
	const { 
		conversations, 
		selectedConversation, 
		messages, 
		loading,
		selectConversation,
		sendMessage
	} = useMessages();
	
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (newMessage.trim() === "" || !selectedConversation)
			return;
		
		try {
			await sendMessage(selectedConversation.id, newMessage);
			setNewMessage("");
		} catch (error) {
			console.error("Erreur envoi message:", error);
		}
	};

	const filteredConversations = conversations.filter(conv =>
		conv.user.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : [];

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (conversations.length === 0) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('messages.title')}</h1>
				<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
					<p className="text-lg mb-2">{t('messages.noConversations')}</p>
					<p className="text-sm">{t('messages.startConversation')}</p>
				</div>
			</div>
		);
	}
	return (
        <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
            
            {/* Liste des conversations (gauche) */}
            <div className="w-1/3 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('messages.title')}</h2>
                    
                    {/* Barre de recherche */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('messages.search')}
                            className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto h-full">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <p>{searchQuery ? t('messages.noResults') : t('messages.noConversations')}</p>
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => selectConversation(conv)}
                                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                                    selectedConversation?.id === conv.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img
                                            src={conv.avatar}
                                            alt={conv.user}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        {conv.online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                        )}
                                        {conv.unread > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {conv.unread}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{conv.user}</h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{conv.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Zone de chat (droite) */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                    
                    {/* En-tête de la conversation */}
                    <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3">
                        <img
                            src={selectedConversation.avatar}
                            alt={selectedConversation.user}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConversation.user}</h3>
                            {selectedConversation.online && (
                                <p className="text-xs text-green-500">● {t('messages.online')}</p>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                        {currentMessages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                <p>{t('messages.startConversation')}</p>
                            </div>
                        ) : (
                            currentMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                                            msg.isMine
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-700'
                                        }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className={`text-xs ${msg.isMine ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulaire d'envoi */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('messages.typeMessage')}
                                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={!newMessage.trim()}
                            >
                                {t('messages.send')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg">{t('messages.selectConversation') || 'Sélectionnez une conversation'}</p>
                    </div>
                </div>
            )}
        </div>
    );			
}
