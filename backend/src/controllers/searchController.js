import axios from 'axios';

// Récupérer le token d'accès à l'API 42
const get42AccessToken = async () => {
	try {
		const response = await axios.post('https://api.intra.42.fr/oauth/token', {
			grant_type: 'client_credentials',
			client_id: process.env.FT_CLIENT_ID,
			client_secret: process.env.FT_CLIENT_SECRET,
		});
		return response.data.access_token;
	} catch (error) {
		console.error('Erreur get42AccessToken:', error.response?.data || error.message);
		throw new Error('Impossible de récupérer le token 42');
	}
};

// Rechercher des utilisateurs sur l'API 42
export const search42Users = async (req, res) => {
	try {
		const { query } = req.query;
		
		if (!query || query.trim() === '') {
			return res.status(400).json({ error: 'La recherche ne peut pas être vide' });
		}

		// Récupérer un token d'accès
		const accessToken = await get42AccessToken();

		// Rechercher les utilisateurs sur l'API 42
		const response = await axios.get('https://api.intra.42.fr/v2/users', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params: {
				'search[login]': query,
				per_page: 10,
			},
		});

		// Formatter les résultats
		const users = response.data.map((user) => {
			// Récupérer le cursus 42
			const cursus42 = user.cursus_users?.find(c => c.cursus.slug === '42cursus');
			
			return {
				id: user.id,
				login: user.login,
				displayName: user.displayname || user.usual_full_name,
				avatar: user.image?.versions?.medium || user.image?.link,
				campus: user.campus?.[0]?.name || 'Unknown',
				cursus: cursus42?.cursus?.name || '42',
				level: cursus42?.level || 0,
			};
		});

		res.json({ users });
	} catch (error) {
		console.error('Erreur search42Users:', error.response?.data || error.message);
		res.status(500).json({ error: 'Erreur lors de la recherche' });
	}
};
