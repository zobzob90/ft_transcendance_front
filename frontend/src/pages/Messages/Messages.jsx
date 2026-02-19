/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Messages.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:04:31 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:36:30 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Messages()
{
	const { t } = useTranslation();
	const [conversations, setConversations] = useState([]);
	const [selectedConv, setSelectedConv] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);

	// TODO: Récupérer les conversations depuis l'API
	useEffect(() => {
		const fetchConversations = async () => {
			try {
				// const convs = await messagesAPI.getConversations();
				// setConversations(convs);
				// if (convs.length > 0) {
				//     setSelectedConv(convs[0]);
				// }
				setLoading(false);
			} catch (error) {
				console.error(t('messages.errorLoadingConversations'), error);
				setLoading(false);
			}
		};
		
		fetchConversations();
	}, []);

	// TODO: Récupérer les messages d'une conversation
	useEffect(() => {
		const fetchMessages = async () => {
			if (!selectedConv) return;
			
			try {
				// const msgs = await messagesAPI.getMessages(selectedConv.id);
				// setMessages(msgs);
			} catch (error) {
				console.error(t('messages.errorLoadingMessages'), error);
			}
		};
		
		fetchMessages();
	}, [selectedConv]);

	const handleSelectConv = (conv) => {
		setSelectedConv(conv);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (newMessage.trim() === "" || !selectedConv)
			return;
		
		// TODO: Envoyer le message à l'API
		// const message = await messagesAPI.send({
		//     receiverId: selectedConv.userId,
		//     content: newMessage
		// });
		// setMessages([...messages, message]);
		
		console.log("Envoi message:", newMessage);
		setNewMessage("");
	};

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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('messages.title')}</h2>
                </div>

                <div className="overflow-y-auto h-full">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => handleSelectConv(conv)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
                                selectedConv.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src={conv.avatar}
                                        alt={conv.user}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    {conv.unread > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-900">{conv.user}</h3>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de chat (droite) */}
            <div className="flex-1 flex flex-col">
                
                {/* En-tête de la conversation */}
                <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3">
                    <img
                        src={selectedConv.avatar}
                        alt={selectedConv.user}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConv.user}</h3>
                        <p className="text-xs text-green-500">● {t('messages.online')}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                    {messages.map(msg => (
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
                    ))}
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
                            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            {t('messages.send')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );			
}
