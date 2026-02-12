/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/12 10:35:59 by eric              #+#    #+#             */
/*   Updated: 2026/02/12 11:41:47 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// ===================================
// CONFIG
// ===================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ===================================
// HELPER POUR LES REQUETES AuTH
// ===================================

// Fonction qui centralise toutes les requetes HTTP
// Ajoute automatiquement le tokent JWT et gere les erreurs

const fetchWithAuth = async (endpoint, options = {}) => {
	//Recup le token stocke dans localstoragre
	const token = localStorage.getItem('access_token');

	const headers = {
		'Content-Type' : 'application/json',
		...options.headers,	
	};
	
	// Add le token si possible
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Faire la requete
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});
	
	// Si token perime ou invalide on redirige vers login
	if (response.status === 401) {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		window.location.href = '/login';
		throw new Error('Session expirée');
	}

	// Erreur HTTP
	if (!response.ok) {
		const error = await response.json().catch(() => ({
			detail: 'Une erreur est survenue'
		}));
		throw new Error(error.detail || error.message || 'Erreur réseau');
	}

	return response.json();
}

// ===================================
// API AUTH
// ===================================

export const authAPI = {
	// Connexion classique -> (login + password)
	login: async (login, password) => {
		return fetchWithAuth('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ login, password }),
		});
	},

	// Connexion OAuth 42
	// Redirige USER vers la page d'auth de 42
	login42: (redirectUri = window.location.origin + '/callback') => {
		const clientId = import.meta.env.VITE_42_CLIENT_ID;
		if (!clientId) {
			console.error('VITE_42_CLIENT_ID non défini dans .env');
			alert('Configuration Oauth 42 manquante');
			return ;
		}
		const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
		window.location.href = authUrl;
	},
	
	// Callback OAuth 42
	// Backend echange le code contre les infos utilisateur
	callback42: async (code) => {
		return fetchWithAuth('/auth/42/callback', {
			method: 'POST',
			body: JSON.stringify({ code }),
		});
	},

	// Inscription classique via formulaire
	register: async (userData) => {
		return fetchWithAuth('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	},

	// Deco
	logout: async () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		window.location.href = '/login';
	},

	// Recup USER actuellement connect
	getCurrentUser: async () => {
		return fetchWithAuth('/auth/me');
	},
};

// ===================================
// API PROFIL
// ===================================

export const profileAPI = {
	// Recup un profil par username
	getProfile: async (username) => {
		return fetchWithAuth(`/users/${username}`);
	},
	
	// Recuperer son profil
	getMyProfile: async () => {
		return fetchWithAuth('/users/me');
	},

	// MAJ son profil (bio, name, ...)
	updateProfile: async (profileData) => {
		return fetchWithAuth('/users/me', {
			method: 'PATCH',
			body: JSON.stringify(profileData),
		});
	},

	// Upload avatar (utilise FormData pour formater le fichier)
	uploadAvatar: async (file) => {
		const formData = new FormData();
		formData.append('avatar', file);

		const token = localStorage.getItem('access_token');
		const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
			method: 'POST',
			headers: {
				'Authorization' : `Bearer ${token}`,
			},
			body: formData,
		});
		
		if (!response.ok) {
			throw new Error('Erreur lors de l\'upload');
		}

		return response.json();
	},

	// Recup post d'un USER avec pagination
	getUserPosts: async (username, page = 1, limit = 10) => {
		return fetchWithAuth(`/users/${username}/posts?page=${page}&limit=${limit}`);
	},

	// Recup media utilisateur (images, PDFS)
	getUserMedia: async (username, page = 1, limit = 20) => {
		return fetchWithAuth(`/users/${username}/media?page=${page}&limit=${limit}`);
	},

	// Recup post like par un USER
	getUserLikes: async (username, page = 1, limit = 10) => {
		return fetchWithAuth(`/users/${username}/likes?page=${page}&limit=${limit}`);
	},
};

// ===================================
// API POST
// ===================================

export const postsAPI = {
	// Récupérer tous les posts (feed principal)
	getFeed: async (page = 1, limit = 10) => {
		return fetchWithAuth(`/posts?page=${page}&limit=${limit}`);
	},

	// Créer un nouveau post (avec ou sans média)
	createPost: async (content, media = null) => {
		const formData = new FormData();
		formData.append('content', content);
		if (media) {
			formData.append('media', media);
		}

		const token = localStorage.getItem('access_token');
		const response = await fetch(`${API_BASE_URL}/posts`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error('Erreur lors de la création du post');
		}

		return response.json();
	},

	// Supprimer un post (seulement si c'est le sien)
	deletePost: async (postId) => {
		return fetchWithAuth(`/posts/${postId}`, {
			method: 'DELETE',
		});
	},

	// Liker un post
	likePost: async (postId) => {
		return fetchWithAuth(`/posts/${postId}/like`, {
			method: 'POST',
		});
	},

	// Retirer son like d'un post
	unlikePost: async (postId) => {
        return fetchWithAuth(`/posts/${postId}/like`, {
            method: 'DELETE',
        });
    },

    // Récupérer les commentaires d'un post
	getComments: async (postId) => {
		return fetchWithAuth(`/posts/${postId}/comments`);
	},

	// Ajouter un commentaire sur un post
	addComment: async (postId, content) => {
		return fetchWithAuth(`/posts/${postId}/comments`, {
			method: 'POST',
			body: JSON.stringify({ content }),
		});
	},
};

// ===================================
// API FOLLOWERS
// ===================================

export const followersAPI = {
	// Récupérer les followers d'un utilisateur (qui le suit)
	getFollowers: async (username) => {
		return fetchWithAuth(`/users/${username}/followers`);
	},

	// Récupérer les abonnements d'un utilisateur (qui il suit)
	getFollowing: async (username) => {
		return fetchWithAuth(`/users/${username}/following`);
	},

	// Follow un USER
	follow: async (username) => {
		return fetchWithAuth(`/users/${username}/follow`, {
			method: 'POST',
		});
	},

    // Unfollow un USER
	unfollow: async (username) => {
		return fetchWithAuth(`/users/${username}/follow`, {
			method: 'DELETE',
		});
	},
};

// ===================================
// API NOTIF
// ===================================

export const notificationsAPI = {
	// Récupérer toutes les notifications
	getNotifications: async () => {
		return fetchWithAuth('/notifications');
	},

	// Marquer une notification comme lue
	markAsRead: async (notificationId) => {
		return fetchWithAuth(`/notifications/${notificationId}/read`, {
			method: 'PATCH',
		});
	},

	// Marquer toutes les notifications comme lues
	markAllAsRead: async () => {
		return fetchWithAuth('/notifications/read-all', {
			method: 'PATCH',
		});
	},
};

// ===================================
// API MSGS
// ===================================

export const messagesAPI = {
	 // Récupérer toutes les conversations
	getConversations: async () => {
		return fetchWithAuth('/messages/conversations');
	},

	// Récupérer les messages d'une conversation
	getMessages: async (conversationId) => {
		return fetchWithAuth(`/messages/conversations/${conversationId}`);
	},

	// Envoyer un message
	sendMessage: async (userId, content) => {
		return fetchWithAuth('/messages', {
			method: 'POST',
			body: JSON.stringify({ recipient_id: userId, content }),
		});
	},
};

export default {
	auth: authAPI,
	profile: profileAPI,
	posts: postsAPI,
	followers: followersAPI,
	notifications: notificationsAPI,
	messages: messagesAPI,
};