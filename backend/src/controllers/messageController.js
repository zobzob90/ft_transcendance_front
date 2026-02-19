/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   messageController.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:10 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

export const getConversations = async (req, res) => {
	try {
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{ senderId: req.user.id },
					{ receiverId: req.user.id }
				]
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				},
				receiver: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		// Grouper les messages par conversation
		const conversationsMap = new Map();
		
		messages.forEach(msg => {
			const otherUserId = msg.senderId === req.user.id ? msg.receiverId : msg.senderId;
			const otherUser = msg.senderId === req.user.id ? msg.receiver : msg.sender;
			
			if (!conversationsMap.has(otherUserId)) {
				conversationsMap.set(otherUserId, {
					user: otherUser,
					lastMessage: msg,
					unreadCount: 0
				});
			}
			
			// Compter les messages non lus
			if (msg.receiverId === req.user.id && !msg.read) {
				conversationsMap.get(otherUserId).unreadCount++;
			}
		});

		const conversations = Array.from(conversationsMap.values());

		res.json(conversations);
	} catch (error) {
		console.error('Erreur getConversations:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { userId } = req.params;
		const otherUserId = parseInt(userId);

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{ senderId: req.user.id, receiverId: otherUserId },
					{ senderId: otherUserId, receiverId: req.user.id }
				]
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				},
				receiver: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				}
			},
			orderBy: { createdAt: 'asc' }
		});

		// Marquer les messages reçus comme lus
		await prisma.message.updateMany({
			where: {
				senderId: otherUserId,
				receiverId: req.user.id,
				read: false
			},
			data: { read: true }
		});

		res.json(messages);
	} catch (error) {
		console.error('Erreur getMessages:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { userId } = req.params;
		const { content } = req.body;
		const receiverId = parseInt(userId);

		if (!content || content.trim().length === 0) {
			return res.status(400).json({ error: 'Le message ne peut pas être vide' });
		}

		const receiver = await prisma.user.findUnique({
			where: { id: receiverId }
		});

		if (!receiver) {
			return res.status(404).json({ error: 'Destinataire non trouvé' });
		}

		const message = await prisma.message.create({
			data: {
				content,
				senderId: req.user.id,
				receiverId
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				},
				receiver: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				}
			}
		});

		res.status(201).json(message);
	} catch (error) {
		console.error('Erreur sendMessage:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { messageId } = req.params;

		const message = await prisma.message.findUnique({
			where: { id: parseInt(messageId) }
		});

		if (!message) {
			return res.status(404).json({ error: 'Message non trouvé' });
		}

		if (message.receiverId !== req.user.id) {
			return res.status(403).json({ error: 'Non autorisé' });
		}

		await prisma.message.update({
			where: { id: parseInt(messageId) },
			data: { read: true }
		});

		res.json({ message: 'Message marqué comme lu' });
	} catch (error) {
		console.error('Erreur markAsRead:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
