/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   followers.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:10 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
	followUser,
	unfollowUser,
	getFollowers,
	getFollowing
} from '../controllers/followerController.js';

const router = express.Router();

// POST /api/followers/:userId - Suivre un utilisateur (protégé)
router.post('/:userId', authenticateToken, followUser);

// DELETE /api/followers/:userId - Unfollow un utilisateur (protégé)
router.delete('/:userId', authenticateToken, unfollowUser);

// GET /api/followers/:username/followers - Liste des followers
router.get('/:username/followers', getFollowers);

// GET /api/followers/:username/following - Liste des abonnements
router.get('/:username/following', getFollowing);

export default router;
