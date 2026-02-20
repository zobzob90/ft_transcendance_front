/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MessagesContext.jsx                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/20 09:19:09 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 09:25:50 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createContext, useContext, useState, useEffect } from "react";

const MessagesContext = createContext();

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error("useMessages must be used within MessagesProvider");
    }
    return context;
};

export const MessagesProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(false);

    // TODO: Charger les conversations depuis l'API
    useEffect(() => {
        const loadConversations = async () => {
            setLoading(true);
            try {
                // const response = await messagesAPI.getConversations();
                // setConversations(response);
                setLoading(false);
            } catch (error) {
                console.error("Erreur chargement conversations:", error);
                setLoading(false);
            }
        };

        loadConversations();
    }, []);

    // TODO: Charger les messages d'une conversation
    const loadMessages = async (conversationId) => {
        if (messages[conversationId]) return; // Déjà chargés

        try {
            // const response = await messagesAPI.getMessages(conversationId);
            // setMessages(prev => ({ ...prev, [conversationId]: response }));
        } catch (error) {
            console.error("Erreur chargement messages:", error);
        }
    };

    // Envoyer un message
    const sendMessage = async (conversationId, content) => {
        if (!content.trim()) return;

        try {
            // TODO: Appel API
            // const newMessage = await messagesAPI.sendMessage({
            //     conversationId,
            //     content
            // });

            // Mise à jour locale optimiste
            const newMessage = {
                id: Date.now(),
                content,
                isMine: true,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                createdAt: new Date().toISOString(),
            };

            setMessages(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), newMessage]
            }));

            // Mettre à jour le dernier message de la conversation
            setConversations(prev => prev.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, lastMessage: content, time: newMessage.time }
                    : conv
            ));

            return newMessage;
        } catch (error) {
            console.error("Erreur envoi message:", error);
            throw error;
        }
    };

    // Sélectionner une conversation
    const selectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        if (conversation) {
            await loadMessages(conversation.id);
        }
    };

    const value = {
        conversations,
        selectedConversation,
        messages,
        loading,
        selectConversation,
        sendMessage,
        loadMessages,
    };

    return (
        <MessagesContext.Provider value={value}>
            {children}
        </MessagesContext.Provider>
    );
};
