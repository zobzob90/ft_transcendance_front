/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   passport.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:15:38 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 12:27:14 by eric             ###   ########.fr       */
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
			
			let user = await prisma.user.findUnique({
				where: { ftId: ftData.id }
			});

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
						cursus: ftData.cursus_users?.[0]?.cursus?.name || null,
						level: ftData.cursus_users?.[0]?.level || 0,
					}
				});
			} else {
				user = await prisma.user.update({
					where: { id: user.id },
					data: {
						level: ftData.cursus_users?.[0]?.level || user.level,
						avatar: ftData.image?.link || user.avatar,
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