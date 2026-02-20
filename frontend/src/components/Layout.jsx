/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Layout.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:00:30 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 09:44:37 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Navbar from "./Navbar";

export default function Layout({ children })
{
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors">
			{/* Sidebar */}
			<Navbar />
			
			{/* Main Content */}
			<main className="flex-1 ml-20 p-8">
				<div className="max-w-6xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	);
}
