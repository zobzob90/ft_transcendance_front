/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Layout.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:00:30 by eric              #+#    #+#             */
/*   Updated: 2026/02/06 14:02:59 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Navbar from "./Navbar";

export default function Layout({ children })
{
	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
