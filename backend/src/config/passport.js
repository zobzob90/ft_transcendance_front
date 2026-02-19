/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   passport.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:15:38 by eric              #+#    #+#             */
/*   Updated: 2026/02/17 14:28:04 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import passport from "passport";
import { Strategy as FortyTwoStrategy } from 'passport-42';
import prisma from './database.js';

passport.use(new FortyTwoStrategy(
	{
		clientID: process.env.FT_CLIENT_ID,
		clientSecret: process.env.FT_CLIENT_SECRET,
		callbackURL: process.env.FT_CALLBACK_URL,
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const ftData = profile._json;
			
			// Trouve le cursus principal (42cursus ou Web3)
			const mainCursus = ftData.cursus_users?.find(
				cu => cu.cursus?.slug === '42cursus' || cu.cursus?.slug === 'web3'
			) || ftData.cursus_users?.[0];
			
			let user = await prisma.user.findUnique({
				where: { ftId: ftData.id }
			});

			const isNewUser = !user;

			if (!user) {
				user = await prisma.user.create({
					data: {
						ftId: ftData.id,
						username: ftData.login,
						email: ftData.email,
						firstName: ftData.first_name,
						lastName: ftData.last_name,
						avatar: ftData.image?.link || null,
						campus: ftData.campus?.[0]?.name || null,
						cursus: mainCursus?.cursus?.name || null,
						level: mainCursus?.level || 0,
					}
				});

				// Créer une notification de bienvenue pour les nouveaux utilisateurs
				await prisma.notification.create({
					data: {
						userId: user.id,
						type: 'system',
						content: `Bienvenue sur 42Hub, ${user.firstName} ! 🎉 Commence à partager tes projets et à connecter avec la communauté 42.`,
						isRead: false,
					}
				});
			} else {
				user = await prisma.user.update({
					where: { id: user.id },
					data: {
						level: mainCursus?.level || user.level,
						avatar: ftData.image?.link || user.avatar,
						cursus: mainCursus?.cursus?.name || user.cursus,
					}
				});
			}
			return done(null, user);
		} catch (error) {
			return done (error, null);
		}
	}
));

export default passport;