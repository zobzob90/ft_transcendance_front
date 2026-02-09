/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Navbar.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 13:47:42 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 15:17:52 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Link, useLocation } from "react-router-dom";
import { FiHome, FiMessageCircle, FiUser, FiSettings, FiLogOut, FiBell } from "react-icons/fi";

export default function Navbar()
{
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="fixed left-0 top-0 h-screen w-20 bg-white shadow-lg flex flex-col">
			{/* LOGO */}
			<div className="p-6 border-b flex justify-center">
				<Link to="/feed" className="text-2xl font-bold">
					<span className="text-black-600">42</span>
				</Link>
			</div>

			{/* NAV LINKS */}
			<div className="flex-1 py-6 px-4 space-y-2">
				<Link
					to="/feed"
					className={`flex items-center justify-center px-4 py-3 rounded-lg transition ${
						isActive('/feed')
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
					}`}
					title="Feed"
				>
					<FiHome className="text-2xl" />
				</Link>

				<Link
					to="/messages"
					className={`flex items-center justify-center px-4 py-3 rounded-lg transition ${
						isActive('/messages')
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
					}`}
					title="Messages"
				>
					<FiMessageCircle className="text-2xl" />
				</Link>

				<Link
					to="/notifications"
					className={`relative flex items-center justify-center px-4 py-3 rounded-lg transition ${
						isActive('/notifications')
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
					}`}
					title="Notifications"
				>
					<FiBell className="text-2xl" />
					{/* Badge de compteur */}
					<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
						3
					</span>
				</Link>

				<Link
					to="/profile"
					className={`flex items-center justify-center px-4 py-3 rounded-lg transition ${
						isActive('/profile')
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
					}`}
					title="Profil"
				>
					<FiUser className="text-2xl" />
				</Link>

				<Link
					to="/settings"
					className={`flex items-center justify-center px-4 py-3 rounded-lg transition ${
						isActive('/settings')
							? 'bg-blue-600 text-white'
							: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
					}`}
					title="Paramètres"
				>
					<FiSettings className="text-2xl" />
				</Link>
			</div>

			{/* LOGOUT BUTTON */}
			<div className="p-4 border-t">
				<button
					className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition"
					onClick={() => console.log("Déconnexion")}
					title="Déconnexion"
				>
					<FiLogOut className="text-2xl" />
				</button>
			</div>
		</nav>
	);
}
