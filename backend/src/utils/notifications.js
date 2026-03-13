/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notifications.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/13 13:24:38 by eric              #+#    #+#             */
/*   Updated: 2026/03/13 13:24:42 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

/**
 * Crée une notification
 * @param {object} params
 * @param {number} params.userId     - ID du destinataire
 * @param {number} params.senderId   - ID de l'expéditeur
 * @param {'like'|'comment'|'follow'|'message'|'system'} params.type
 * @param {string} params.content    - Message de la notif
 */
export const createNotification = async ({ userId, senderId, type, content }) => {
	// Ne pas notifier quelqu'un de sa propre action
	if (userId === senderId) return;

	try {
		await prisma.notification.create({
			data: {
				type,
				content,
				userId,
				senderId,
			},
		});
	} catch (error) {
		// Ne jamais faire planter la route principale à cause d'une notif
		console.error('Erreur création notification:', error);
	}
};
