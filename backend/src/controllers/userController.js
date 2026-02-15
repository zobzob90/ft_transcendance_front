/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:33:55 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 13:25:36 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

/**
 * Récupère tous les utilisateurs (avec pagination)
 */
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ]
            }
            : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: parseInt(skip),
                take: parseInt(limit),
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    campus: true,
                    level: true,
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erreur getUsers:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Récupère un utilisateur par son username
 */
export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                campus: true,
                cursus: true,
                level: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifie si l'utilisateur connecté suit cet utilisateur
        if (req.user) {
            const isFollowing = await prisma.follower.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: req.user.id,
                        followingId: user.id
                    }
                }
            });
            user.isFollowing = !!isFollowing;
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur getUserByUsername:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (req, res) => {
    try {
        const { bio, avatar } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(bio !== undefined && { bio }),
                ...(avatar !== undefined && { avatar }),
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                campus: true,
                cursus: true,
                level: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

/**
 * Récupère les posts d'un utilisateur
 */
export const getUserPosts = async (req, res) => {
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

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { authorId: user.id },
                skip: parseInt(skip),
                take: parseInt(limit),
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
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.post.count({ where: { authorId: user.id } })
        ]);

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
        console.error('Erreur getUserPosts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};