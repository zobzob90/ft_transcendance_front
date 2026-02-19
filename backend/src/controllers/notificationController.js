/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notificationController.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:11 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

export const getNotifications = async (req, res) => {
	try {
		const notifications = await prisma.notification.findMany({
			where: { userId: req.user.id },
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
					}
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 50
		});

		res.json(notifications);
	} catch (error) {
		console.error('Erreur getNotifications:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;

		const notification = await prisma.notification.findUnique({
			where: { id: parseInt(id) }
		});

		if (!notification) {
			return res.status(404).json({ error: 'Notification non trouvée' });
		}

		if (notification.userId !== req.user.id) {
			return res.status(403).json({ error: 'Non autorisé' });
		}

		await prisma.notification.update({
			where: { id: parseInt(id) },
			data: { read: true }
		});

		res.json({ message: 'Notification marquée comme lue' });
	} catch (error) {
		console.error('Erreur markAsRead:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const markAllAsRead = async (req, res) => {
	try {
		await prisma.notification.updateMany({
			where: {
				userId: req.user.id,
				read: false
			},
			data: { read: true }
		});

		res.json({ message: 'Toutes les notifications marquées comme lues' });
	} catch (error) {
		console.error('Erreur markAllAsRead:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const deleteNotification = async (req, res) => {
	try {
		const { id } = req.params;

		const notification = await prisma.notification.findUnique({
			where: { id: parseInt(id) }
		});

		if (!notification) {
			return res.status(404).json({ error: 'Notification non trouvée' });
		}

		if (notification.userId !== req.user.id) {
			return res.status(403).json({ error: 'Non autorisé' });
		}

		await prisma.notification.delete({
			where: { id: parseInt(id) }
		});

		res.json({ message: 'Notification supprimée' });
	} catch (error) {
		console.error('Erreur deleteNotification:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
