/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   FloatingChat.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 15:30:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 09:25:50 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { useMessages } from "../context/MessagesContext";

export default function FloatingChat({ onClose }) {
	const { t } = useTranslation();
	const { 
		conversations, 
		selectedConversation, 
		messages, 
		selectConversation, 
		sendMessage 
	} = useMessages();
	
	const [isMinimized, setIsMinimized] = useState(false);
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (newMessage.trim() && selectedConversation) {
			try {
				await sendMessage(selectedConversation.id, newMessage);
				setNewMessage("");
			} catch (error) {
				console.error("Erreur envoi message:", error);
			}
		}
	};

	const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : [];

	return (
		<div className="fixed bottom-0 right-8 w-80 bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transition-colors">
			{/* HEADER */}
			<div className="flex items-center justify-between p-3 border-b dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
				<h3 className="font-semibold">
					{selectedConversation ? selectedConversation.user : t('messages.title')}
				</h3>
				<div className="flex gap-2">
					<button
						onClick={() => setIsMinimized(!isMinimized)}
						className="hover:bg-blue-700 p-1 rounded transition"
					>
						{isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
					</button>
					<button
						onClick={onClose}
						className="hover:bg-blue-700 p-1 rounded transition"
					>
						<FiX />
					</button>
				</div>
			</div>

			{/* BODY */}
			{!isMinimized && (
				<>
					{!selectedConversation ? (
						/* LISTE DES CONVERSATIONS */
						<div className="h-96 overflow-y-auto">
							{conversations.length === 0 ? (
								<div className="p-8 text-center text-gray-500 dark:text-gray-400">
									<p>{t('messages.noConversations')}</p>
								</div>
							) : (
								conversations.map((conv) => (
									<div
										key={conv.id}
										onClick={() => selectConversation(conv)}
										className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 transition"
									>
										<div className="relative">
											<img
												src={conv.avatar}
												alt={conv.user}
												className="w-12 h-12 rounded-full object-cover"
											/>
											{conv.online && (
												<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-gray-900 dark:text-white">{conv.user}</p>
											<p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
										</div>
										{conv.unread > 0 && (
											<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
												{conv.unread}
											</span>
										)}
									</div>
								))
							)}
						</div>
					) : (
						/* CONVERSATION ACTIVE */
						<>
							<div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
								{currentMessages.length === 0 ? (
									<div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
										<p className="text-sm">{t('messages.startConversation')}</p>
									</div>
								) : (
									currentMessages.map((msg) => (
										<div
											key={msg.id}
											className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
										>
											<div
												className={`max-w-xs px-4 py-2 rounded-lg ${
													msg.isMine
														? "bg-blue-500 text-white"
														: "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-700"
												}`}
											>
												<p className="text-sm">{msg.content}</p>
												<p className={`text-xs mt-1 ${msg.isMine ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
													{msg.time}
												</p>
											</div>
										</div>
									))
								)}
							</div>

							{/* INPUT MESSAGE */}
							<form onSubmit={handleSendMessage} className="p-3 border-t dark:border-gray-700 flex gap-2">
								<input
									type="text"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder={t('messages.typeMessage')}
									className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
								/>
								<button
									type="submit"
									className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
									disabled={!newMessage.trim()}
								>
									<FiSend />
								</button>
							</form>

							{/* BOUTON RETOUR */}
							<button
								onClick={() => selectConversation(null)}
								className="w-full p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
							>
								← {t('messages.backToConversations') || 'Retour aux conversations'}
							</button>
						</>
					)}
				</>
			)}
		</div>
	);
}
