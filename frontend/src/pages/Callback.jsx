/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Callback.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/15 13:45:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 13:53:13 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Callback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const token = searchParams.get('token');
		const error = searchParams.get('error');

		if (error) {
			console.error('Erreur OAuth:', error);
			navigate('/login?error=auth_failed');
			return;
		}

		if (token) {
			// Stocke le token JWT
			localStorage.setItem('access_token', token);
			
			console.log('✅ Connexion réussie !');
			
			// Redirige vers le feed
			navigate('/feed');
		} else {
			console.error('Aucun token reçu');
			navigate('/login');
		}
	}, [searchParams, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-600">Connexion en cours...</p>
			</div>
		</div>
	);
}
