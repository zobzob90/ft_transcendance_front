/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   messages.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:34:05 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:10 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
	getConversations,
	getMessages,
	sendMessage,
	markAsRead
} from '../controllers/messageController.js';

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.get('/:userId', authenticateToken, getMessages);
router.post('/:userId', authenticateToken, sendMessage);
router.patch('/:messageId/read', authenticateToken, markAsRead);

export default router;
