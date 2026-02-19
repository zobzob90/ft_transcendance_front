/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   followerController.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 10:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:10 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import prisma from '../config/database.js';

export const followUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const followingId = parseInt(userId);

		if (followingId === req.user.id) {
			return res.status(400).json({ error: 'Vous ne pouvez pas vous suivre vous-même' });
		}

		const userToFollow = await prisma.user.findUnique({
			where: { id: followingId }
		});

		if (!userToFollow) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}

		const existingFollow = await prisma.follower.findUnique({
			where: {
				followerId_followingId: {
					followerId: req.user.id,
					followingId
				}
			}
		});

		if (existingFollow) {
			return res.status(400).json({ error: 'Vous suivez déjà cet utilisateur' });
		}

		await prisma.follower.create({
			data: {
				followerId: req.user.id,
				followingId
			}
		});

		res.status(201).json({ message: 'Utilisateur suivi avec succès' });
	} catch (error) {
		console.error('Erreur followUser:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const followingId = parseInt(userId);

		const follow = await prisma.follower.findUnique({
			where: {
				followerId_followingId: {
					followerId: req.user.id,
					followingId
				}
			}
		});

		if (!follow) {
			return res.status(404).json({ error: 'Vous ne suivez pas cet utilisateur' });
		}

		await prisma.follower.delete({
			where: {
				followerId_followingId: {
					followerId: req.user.id,
					followingId
				}
			}
		});

		res.json({ message: 'Utilisateur unfollow avec succès' });
	} catch (error) {
		console.error('Erreur unfollowUser:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const getFollowers = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await prisma.user.findUnique({
			where: { username }
		});

		if (!user) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}

		const followers = await prisma.follower.findMany({
			where: { followingId: user.id },
			include: {
				follower: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
						campus: true,
						level: true,
					}
				}
			}
		});

		res.json(followers.map(f => f.follower));
	} catch (error) {
		console.error('Erreur getFollowers:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

export const getFollowing = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await prisma.user.findUnique({
			where: { username }
		});

		if (!user) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}

		const following = await prisma.follower.findMany({
			where: { followerId: user.id },
			include: {
				following: {
					select: {
						id: true,
						username: true,
						firstName: true,
						lastName: true,
						avatar: true,
						campus: true,
						level: true,
					}
				}
			}
		});

		res.json(following.map(f => f.following));
	} catch (error) {
		console.error('Erreur getFollowing:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
