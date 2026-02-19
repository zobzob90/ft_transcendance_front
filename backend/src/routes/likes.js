/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   likes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:08 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
	likePost,
	unlikePost,
	getUserLikes
} from '../controllers/likeController.js';

const router = express.Router();

// POST /api/likes/:postId - Liker un post (protégé)
router.post('/:postId', authenticateToken, likePost);

// DELETE /api/likes/:postId - Unliker un post (protégé)
router.delete('/:postId', authenticateToken, unlikePost);

// GET /api/likes/user/:username - Posts likés par un user
router.get('/user/:username', getUserLikes);

export default router;
