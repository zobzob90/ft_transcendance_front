/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SearchModal.jsx                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/11 16:20:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/11 16:20:00 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const mockUsers = [
	{ id: 1, username: "Anony", name: "Adrien Nony", avatar: "/avatars/anony.jpg", level: 7.30 },
	{ id: 2, username: "Kearmand", name: "Kevin Armand", avatar: "/avatars/kearmand.jpg", level: 6.15 },
	{ id: 3, username: "Vdeliere", name: "Valentin Deliere", avatar: "/avatars/vdeliere.jpg", level: 5.80 },
];

export default function SearchModal({ isOpen, onClose }) {
	const [query, setQuery] = useState("");

	// Fermer avec ESC
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};
		
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}
		
		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	const filteredUsers = mockUsers.filter(
		(user) =>
			user.username.toLowerCase().includes(query.toLowerCase()) ||
			user.name.toLowerCase().includes(query.toLowerCase())
	);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-slide-down"
				onClick={(e) => e.stopPropagation()}
			>
				{/* HEADER */}
				<div className="flex items-center gap-3 p-4 border-b">
					<FiSearch className="text-gray-400 text-xl flex-shrink-0" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Rechercher des utilisateurs..."
						className="flex-1 outline-none text-lg"
						autoFocus
					/>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 flex-shrink-0"
					>
						<FiX className="text-2xl" />
					</button>
				</div>

				{/* RESULTS */}
				<div className="max-h-96 overflow-y-auto">
					{query.length > 0 ? (
						filteredUsers.length > 0 ? (
							<div className="py-2">
								{filteredUsers.map((user) => (
									<Link
										key={user.id}
										to="/profile"
										onClick={onClose}
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
									>
										<img
											src={user.avatar}
											alt={user.username}
											className="w-12 h-12 rounded-full object-cover"
										/>
										<div className="flex-1">
											<p className="font-semibold text-gray-900">{user.name}</p>
											<p className="text-sm text-gray-500">@{user.username}</p>
										</div>
										<div className="text-sm text-gray-500">
											Niveau {user.level}
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className="p-8 text-center text-gray-500">
								<FiSearch className="text-4xl mx-auto mb-2 text-gray-300" />
								<p>Aucun résultat pour "{query}"</p>
							</div>
						)
					) : (
						<div className="p-8 text-center text-gray-400">
							<FiSearch className="text-4xl mx-auto mb-2 text-gray-300" />
							<p>Tapez pour rechercher des utilisateurs...</p>
							<p className="text-xs mt-2">ESC pour fermer</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
