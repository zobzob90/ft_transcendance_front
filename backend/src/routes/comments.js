import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
	getCommentsByPost,
	createComment,
	updateComment,
	deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

// GET /api/comments/post/:postId - Récupérer les commentaires d'un post
router.get('/post/:postId', getCommentsByPost);

// POST /api/comments/post/:postId - Créer un commentaire
router.post('/post/:postId', authenticateToken, createComment);

// PATCH /api/comments/:commentId - Modifier un commentaire
router.patch('/:commentId', authenticateToken, updateComment);

// DELETE /api/comments/:commentId - Supprimer un commentaire
router.delete('/:commentId', authenticateToken, deleteComment);

export default router;
