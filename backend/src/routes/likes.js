/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   likes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/03/25 15:58:41 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import prisma from '../config/database.js';
import {
	likePost,
	unlikePost,
	getUserLikes
} from '../controllers/likeController.js';

const router = express.Router();

// GET /api/likes/me - Récupérer les IDs des posts likés par l'user authentifié
router.get('/me', authenticateToken, async (req, res) => {
	try {
		const likes = await prisma.like.findMany({
			where: { userId: req.user.id },
			select: { postId: true }
		});
		res.json({ likedPostIds: likes.map(l => l.postId) });
	} catch (error) {
		console.error('Erreur récupération likes:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

// POST /api/likes/:postId - Liker un post (protégé)
router.post('/:postId', authenticateToken, likePost);

// DELETE /api/likes/:postId - Unliker un post (protégé)
router.delete('/:postId', authenticateToken, unlikePost);

// GET /api/likes/user/:username - Posts likés par un user
router.get('/user/:username', getUserLikes);

export default router;
