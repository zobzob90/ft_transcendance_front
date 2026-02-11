/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 13:17:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/11 16:15:19 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../utils";
import { FiGithub } from "react-icons/fi";

export default function Login() 
{
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => 
	{
		e.preventDefault();
		console.log("Login:", login);
		console.log("Password:", password);
	}

	const handle42Login = () => {
		// URL de l'API 42 OAuth
		// const clientId = "YOUR_42_CLIENT_ID";
		// const redirectUri = encodeURIComponent("http://localhost:5173/callback");
		// const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
		// window.location.href = authUrl;
		
		console.log("Connexion avec 42 (à implémenter avec l'API)");
		// Pour l'instant, redirection mockée vers le feed
		window.location.href = "/feed";
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-md w-80"
			>
				<h1 className="text-2xl font-bold text-center mb-6">
    				<span className="text-black">42</span>
    				<span className="text-blue-600">Hub</span>
				</h1>

				<Input
					label="Login"
					type="text"
					value={login}
					onChange={(e) => setLogin(e.target.value)}
					placeholder="login42"
					required
				/>

				<Input
					label="Mot de passe"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
				/>

				<Button type="submit" variant="blue">
					Se connecter
				</Button>

				{/* SEPARATEUR */}
				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">ou</span>
					</div>
				</div>

				{/* BOUTON 42 OAUTH */}
				<button
					type="button"
					onClick={handle42Login}
					className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition mb-4"
				>
					<svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
						<polygon points="128,0 256,74 256,182 128,256 0,182 0,74"/>
						<text x="128" y="180" fontSize="180" fontWeight="bold" textAnchor="middle" fill="#000">42</text>
					</svg>
					Se connecter avec 42
				</button>
				
				<p className="text-center text-sm text-gray-600">
					Pas encore de compte ?{" "}
					<Link to="/register" className="text-blue-600 hover:underline">
						S'inscrire
					</Link>
				</p>
			</form>
		</div>
	);
}
