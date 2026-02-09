/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   FloatingChat.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 15:30:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 15:30:00 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";

const mockConversations = [
	{
		id: 1,
		user: "Anony",
		avatar: "/avatars/anony.jpg",
		lastMessage: "Trop cool le projet !",
		online: true,
	},
	{
		id: 2,
		user: "Kearmand",
		avatar: "/avatars/kearmand.jpg",
		lastMessage: "On fait un pong ?",
		online: true,
	},
	{
		id: 3,
		user: "Vdeliere",
		avatar: "/avatars/vdeliere.jpg",
		lastMessage: "GG pour le rush !",
		online: false,
	},
];

const mockMessages = {
	1: [
		{ id: 1, text: "Salut !", sender: "other", time: "14:32" },
		{ id: 2, text: "Trop cool le projet !", sender: "other", time: "14:33" },
	],
	2: [
		{ id: 1, text: "Yo !", sender: "other", time: "15:12" },
		{ id: 2, text: "On fait un pong ?", sender: "other", time: "15:13" },
	],
	3: [
		{ id: 1, text: "GG pour le rush !", sender: "other", time: "12:45" },
		{ id: 2, text: "Merci bg !", sender: "me", time: "12:46" },
	],
};

export default function FloatingChat({ onClose }) {
	const [isMinimized, setIsMinimized] = useState(false);
	const [activeConv, setActiveConv] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [conversations] = useState(mockConversations);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (newMessage.trim()) {
			console.log("Message envoyé:", newMessage);
			setNewMessage("");
		}
	};

	return (
		<div className="fixed bottom-0 right-8 w-80 bg-white rounded-t-lg shadow-2xl border border-gray-200 z-50">
			{/* HEADER */}
			<div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
				<h3 className="font-semibold">
					{activeConv ? conversations.find(c => c.id === activeConv)?.user : "Messages"}
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
					{!activeConv ? (
						/* LISTE DES CONVERSATIONS */
						<div className="h-96 overflow-y-auto">
							{conversations.map((conv) => (
								<div
									key={conv.id}
									onClick={() => setActiveConv(conv.id)}
									className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b transition"
								>
									<div className="relative">
										<img
											src={conv.avatar}
											alt={conv.user}
											className="w-12 h-12 rounded-full object-cover"
										/>
										{conv.online && (
											<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900">{conv.user}</p>
										<p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
									</div>
								</div>
							))}
						</div>
					) : (
						/* CONVERSATION ACTIVE */
						<>
							<div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
								{(mockMessages[activeConv] || []).map((msg) => (
									<div
										key={msg.id}
										className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-xs px-4 py-2 rounded-lg ${
												msg.sender === "me"
													? "bg-blue-500 text-white"
													: "bg-white text-gray-800"
											}`}
										>
											<p className="text-sm">{msg.text}</p>
											<p className={`text-xs mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>
												{msg.time}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* INPUT MESSAGE */}
							<form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
								<input
									type="text"
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									placeholder="Écrire un message..."
									className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								/>
								<button
									type="submit"
									className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
								>
									<FiSend />
								</button>
							</form>

							{/* BOUTON RETOUR */}
							<button
								onClick={() => setActiveConv(null)}
								className="w-full p-2 text-sm text-blue-600 hover:bg-blue-50 transition"
							>
								← Retour aux conversations
							</button>
						</>
					)}
				</>
			)}
		</div>
	);
}
