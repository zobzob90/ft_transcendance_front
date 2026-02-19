/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   postController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:33:52 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 15:58:24 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

export const getPosts = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const [posts, total] = await Promise.all([
			prisma.post.findMany({
				skip: parseInt(skip),
				take: parseInt(limit),
				include: {
					user: {
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
				},
				orderBy: { createdAt: 'desc' }
			}),
			prisma.post.count()
		]);

		if (req.user) {
			const userLikes = await prisma.like.findMany({
				where: {
					userId: req.user.id,
					postId: { in: posts.map(p => p.id) }
				},
				select: { postId: true }
			});
			const likedPostIds = new Set(userLikes.map(l => l.postId));
			
			posts.forEach(post => {
				post.isLiked = likedPostIds.has(post.id);
			});
		}

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
		console.error('Erreur getPosts:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const getPostById = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await prisma.post.findUnique({
			where: { id: parseInt(id) },
			include: {
				user: {
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
		});

		if (!post) {
			return res.status(404).json({ error: 'Post non trouvé' });
		}

		if (req.user) {
			const like = await prisma.like.findUnique({
				where: {
					userId_postId: {
						userId: req.user.id,
						postId: post.id
					}
				}
			});
			post.isLiked = !!like;
		}

		res.json(post);
	} catch (error) {
		console.error('Erreur getPostById:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const createPost = async (req, res) => {
	try {
		const { content } = req.body;

		if (!content || content.trim().length === 0) {
			return res.status(400).json({ error: 'Le contenu est requis' });
		}

		if (content.length > 500) {
			return res.status(400).json({ error: 'Le contenu ne peut pas dépasser 500 caractères' });
		}

		const post = await prisma.post.create({
			data: {
				content,
				userId: req.user.id
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
				},
				_count: {
					select: {
						likes: true,
					}
				}
			}
		});

		res.status(201).json(post);
	} catch (error) {
		console.error('Erreur createPost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const updatePost = async (req, res) => {
	try {
		const { id } = req.params;
		const { content } = req.body;

		if (!content || content.trim().length === 0) {
			return res.status(400).json({ error: 'Le contenu est requis' });
		}

		const post = await prisma.post.findUnique({
			where: { id: parseInt(id) }
		});

		if (!post) {
			return res.status(404).json({ error: 'Post non trouvé' });
		}

		if (post.userId !== req.user.id) {
			return res.status(403).json({ error: 'Non autorisé' });
		}

		const updatedPost = await prisma.post.update({
			where: { id: parseInt(id) },
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
				},
				_count: {
					select: {
						likes: true,
					}
				}
			}
		});

		res.json(updatedPost);
	} catch (error) {
		console.error('Erreur updatePost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await prisma.post.findUnique({
			where: { id: parseInt(id) }
		});

		if (!post) {
			return res.status(404).json({ error: 'Post non trouvé' });
		}

		if (post.userId !== req.user.id) {
			return res.status(403).json({ error: 'Non autorisé' });
		}

		await prisma.post.delete({
			where: { id: parseInt(id) }
		});

		res.json({ message: 'Post supprimé avec succès' });
	} catch (error) {
		console.error('Erreur deletePost:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

