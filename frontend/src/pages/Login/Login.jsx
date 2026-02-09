/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 13:17:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 12:11:20 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../utils";

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
