/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 12:34:03 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 12:41:43 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from 'express';
import passport from '../config/passport.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleOAuthCallback, getMe, logout } from '../controllers/authController.js';

const router = express.Router();

// GET /api/auth/42 -> redirection vers OAuth 42

router.get('/42', passport.authenticate('42'));

router.get('/42/callback', 
	passport.authenticate('42', {
		failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed',
		session: false
	}),
	handleOAuthCallback
);

// GET /api/auth/me -> recupere l'utilisateur connecter (protected)
router.get('/me', authenticateToken, getMe);

// POST /api/auth/logout -> Deco (protected)
router.post('/logout', authenticateToken, logout);

export default router;
