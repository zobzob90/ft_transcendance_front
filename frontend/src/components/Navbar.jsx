/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Navbar.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 13:47:42 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 11:04:16 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Link } from "react-router-dom";
import { Button } from "../utils";

export default function Navbar()
{
	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* LOGO */}
						<Link to="/feed" className="text-2xl font-bold">
							<span className="text-black">42</span>
							<span className="text-orange-500">Hub</span>
						</Link>
						{/*NAV LINK*/}
						<div className="flex space-x-8">
							<Link
								to="/feed"
								className="text-gray-700 hover:text-orange-500 font-medium transition"
							>
								Feed
							</Link>
							<Link
								to="/messages"
								className="text-gray-700 hover:text-orange-500 font-medium transition"
							>
								Messages
							</Link>
							<Link
								to="/profile"
								className="text-gray-700 hover:text-orange-500 font-medium transition"
							>
								Profile
							</Link>
							<Link
								to="/settings"
								className="text-gray-700 hover:text-orange-500 font-medium transition"
							>
								Paramètres
							</Link>
						</div>
						{/* LOGOUT BUTTON */}
						<button
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
							onClick={() => console.log("Déconnexion")}
						>
							Déconnexion
						</button>
					</div>
			</div>
		</nav>
	);
}
