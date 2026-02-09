/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Messages.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:04:31 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 11:04:22 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";

export default function Messages()
{
	const [conversations] = useState([
		{
			id:1,
			user: "Anony",
			avatar: "/avatars/anony.jpg",
			lastMessage: "Paulo me manque vraiment ...",
			time: "Il y a 5 minutes",
			unread: 2
		},
		{
			id: 2,
			user: "Kearmand",
			avatar: "/avatars/kearmand.jpg",
			lastMessage: "On prend une pizza algerienne ?",
			time: "Il y a une 1 heure",
			unread: 0
		},
		{
			id: 3,
			user: "Vdeliere",
			avatar: "/avatars/vdeliere.jpg",
			lastMessage: "J'aime le peintre autrichien",
			time: "Il y a 3 heure",
			unread: 1
		}
	]);

	// Conv Selectionnee
	const [selectedConv, setSelectedConv] = useState(conversations[0]);

	// Msg de la conv (mockes)
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: "Anony",
			content: "Salut !",
			time: "14:30",
			isMine: false
		},
		{
			id: 2,
			sender: "Moi",
			content: "Pizza ou saucisse ?",
			time: "14:39",
			isMine: true
		},
		{
			id: 3,
			sender: "Anony",
			content: "Paulo me manque vraiment ...",
			time: "14:42",
			isMine: false
		}
	]);
	
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = (e) =>
	{
		e.preventDefault();
		if (newMessage.trim() === "")
			return;
		const message = {
			id: messages.length + 1,
			sender: "Moi",
			content: newMessage,
			time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}),
			isMine: true
		};
		setMessages([...messages, message]);
		setNewMessage("");
	};
	return (
        <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-md overflow-hidden">
            
            {/* Liste des conversations (gauche) */}
            <div className="w-1/3 border-r bg-gray-50">
                <div className="p-4 border-b bg-white">
                    <h2 className="text-xl font-bold">Messages</h2>
                </div>

                <div className="overflow-y-auto h-full">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedConv(conv)}
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
                <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <img
                        src={selectedConv.avatar}
                        alt={selectedConv.user}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{selectedConv.user}</h3>
                        <p className="text-xs text-green-500">● En ligne</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-2xl ${
                                    msg.isMine
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-900 border'
                                }`}
                            >
                                <p>{msg.content}</p>
                                <span className={`text-xs ${msg.isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulaire d'envoi */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez un message..."
                            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );			
}
