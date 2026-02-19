import prisma from '../config/database.js';

// Récupérer tous les commentaires d'un post
export const getCommentsByPost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { page = 1, limit = 20 } = req.query;
		
		const skip = (page - 1) * limit;
		
		const comments = await prisma.comment.findMany({
			where: { postId: parseInt(postId) },
			include: {
				user: {
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
			skip: parseInt(skip),
			take: parseInt(limit),
		});
		
		const total = await prisma.comment.count({
			where: { postId: parseInt(postId) }
		});
		
		res.json({
			comments,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error('Erreur getCommentsByPost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

// Créer un commentaire
export const createComment = async (req, res) => {
	try {
		const { postId } = req.params;
		const { content } = req.body;
		const userId = req.user.id;
		
		if (!content || content.trim() === '') {
			return res.status(400).json({ error: 'Le contenu ne peut pas être vide' });
		}
		
		// Vérifier que le post existe
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) }
		});
		
		if (!post) {
			return res.status(404).json({ error: 'Post non trouvé' });
		}
		
		const comment = await prisma.comment.create({
			data: {
				content,
				userId,
				postId: parseInt(postId),
			},
			include: {
				user: {
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
		
		// Créer une notification pour l'auteur du post (si ce n'est pas lui qui commente)
		if (post.userId !== userId) {
			await prisma.notification.create({
				data: {
					type: 'comment',
					content: `a commenté votre post`,
					userId: post.userId,
				}
			});
		}
		
		res.status(201).json(comment);
	} catch (error) {
		console.error('Erreur createComment:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

// Modifier un commentaire
export const updateComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const { content } = req.body;
		const userId = req.user.id;
		
		const comment = await prisma.comment.findUnique({
			where: { id: parseInt(commentId) }
		});
		
		if (!comment) {
			return res.status(404).json({ error: 'Commentaire non trouvé' });
		}
		
		// Vérifier que c'est bien l'auteur
		if (comment.userId !== userId) {
			return res.status(403).json({ error: 'Non autorisé' });
		}
		
		const updatedComment = await prisma.comment.update({
			where: { id: parseInt(commentId) },
			data: { content },
			include: {
				user: {
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
		
		res.json(updatedComment);
	} catch (error) {
		console.error('Erreur updateComment:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

// Supprimer un commentaire
export const deleteComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const userId = req.user.id;
		
		const comment = await prisma.comment.findUnique({
			where: { id: parseInt(commentId) }
		});
		
		if (!comment) {
			return res.status(404).json({ error: 'Commentaire non trouvé' });
		}
		
		// Vérifier que c'est bien l'auteur
		if (comment.userId !== userId) {
			return res.status(403).json({ error: 'Non autorisé' });
		}
		
		await prisma.comment.delete({
			where: { id: parseInt(commentId) }
		});
		
		res.json({ message: 'Commentaire supprimé' });
	} catch (error) {
		console.error('Erreur deleteComment:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
