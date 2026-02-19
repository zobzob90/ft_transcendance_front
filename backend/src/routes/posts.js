/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   posts.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:34:08 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:05 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost
} from '../controllers/postController.js';

const router = express.Router();

// GET /api/posts - Feed de posts (pagination)
router.get('/', optionalAuth, getPosts);

// GET /api/posts/:id - Récupère un post par ID
router.get('/:id', optionalAuth, getPostById);

// POST /api/posts - Créer un post (protégé)
router.post('/', authenticateToken, createPost);

// PATCH /api/posts/:id - Modifier un post (protégé)
router.patch('/:id', authenticateToken, updatePost);

// DELETE /api/posts/:id - Supprimer un post (protégé)
router.delete('/:id', authenticateToken, deletePost);

export default router;

