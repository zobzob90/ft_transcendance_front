/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   likeController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:07 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

export const likePost = async (req, res) => {
	try {
		const { postId } = req.params;

		// Vérifier que le post existe
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) }
		});

		if (!post) {
			return res.status(404).json({ error: 'Post non trouvé' });
		}

		// Vérifier si déjà liké
		const existingLike = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId: req.user.id,
					postId: parseInt(postId)
				}
			}
		});

		if (existingLike) {
			return res.status(400).json({ error: 'Post déjà liké' });
		}

		// Créer le like
		await prisma.like.create({
			data: {
				userId: req.user.id,
				postId: parseInt(postId)
			}
		});

		res.status(201).json({ message: 'Post liké avec succès' });
	} catch (error) {
		console.error('Erreur likePost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const unlikePost = async (req, res) => {
	try {
		const { postId } = req.params;

		const like = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId: req.user.id,
					postId: parseInt(postId)
				}
			}
		});

		if (!like) {
			return res.status(404).json({ error: 'Like non trouvé' });
		}

		await prisma.like.delete({
			where: {
				userId_postId: {
					userId: req.user.id,
					postId: parseInt(postId)
				}
			}
		});

		res.json({ message: 'Like retiré avec succès' });
	} catch (error) {
		console.error('Erreur unlikePost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const getUserLikes = async (req, res) => {
	try {
		const { username } = req.params;
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const user = await prisma.user.findUnique({
			where: { username }
		});

		if (!user) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}

		const [likes, total] = await Promise.all([
			prisma.like.findMany({
				where: { userId: user.id },
				skip: parseInt(skip),
				take: parseInt(limit),
				include: {
					post: {
						include: {
							author: {
								select: {
									id: true,
									username: true,
									firstName: true,
									lastName: true,
									avatar: true,
								}
							},
							_count: {
								select: {
									likes: true,
								}
							}
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			}),
			prisma.like.count({ where: { userId: user.id } })
		]);

		const posts = likes.map(like => like.post);

		res.json({
			posts,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error('Erreur getUserLikes:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
