/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 13:11:40 by eric              #+#    #+#             */
/*   Updated: 2026/02/06 13:12:37 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../utils/index";

export default function Register()
{
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) =>
	{
		e.preventDefault();
		
		if (password !== confirmPassword)
		{
			alert("Les mots de passe ne correspondent pas !");
			return ;
		}

		console.log("Username:", username);
		console.log("Email:", email);
		console.log("Password:", password);
	}
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-md w-96"
			>
				<h1 className="text-2xl font-bold text-center mb-6">
					Créer un compte
				</h1>
				<Input
					label="Nom d'utilisateur"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Oussame Ben Laden"
					required
				/>
				<Input
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="email@example.com"
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
				<Input
					label="Confirmer le mot de passe"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					placeholder="••••••••"
					required
				/>
				<Button type="submit" variant="green">
					S'inscrire
				</Button>
				<p className="text-center text-sm text-gray-600">
					Déjà un compte ?{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						Se Connecter
					</Link>
				</p>
			</form>
		</div>
	);
}