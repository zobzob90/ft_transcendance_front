/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:34:11 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 13:25:01 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
	getUsers,
	getUserByUsername,
	updateProfile,
	getUserPosts
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Liste tous les utilisateurs (recherche + pagination)
router.get('/', optionalAuth, getUsers);

// GET /api/users/:username - Récupère un profil par username
router.get('/:username', optionalAuth, getUserByUsername);

// PATCH /api/users/me - Met à jour le profil (protégé)
router.patch('/me', authenticateToken, updateProfile);

// GET /api/users/:username/posts - Posts d'un utilisateur
router.get('/:username/posts', optionalAuth, getUserPosts);

export default router;