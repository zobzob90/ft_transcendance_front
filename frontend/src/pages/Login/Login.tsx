/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/05 12:12:12 by eric              #+#    #+#             */
/*   Updated: 2026/02/05 13:35:24 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, type FormEvent } from "react";

export default function Login() 
{
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => 
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
					Transcendance
				</h1>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">
						Login
					</label>
					<input
						type="text"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-blue-300"
						placeholder="login42"
						required
					/>
				</div>
				<div className="mb-6">
					<label className="block text-sm font-medium mb-1">
						Mot de passe
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-blue-300"
						placeholder="••••••••"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
				>
					Se connecter
				</button>
			</form>
		</div>
	);
}