/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Navbar.tsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/27 14:06:52 by eric              #+#    #+#             */
/*   Updated: 2026/01/27 14:11:11 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Link } from "react-router-dom";

export default function Navbar()
{
	return 
	(
		<nav style={{ marginBottom: "20px" }}>
			<Link to="/feed" style={{marginRight: "10px"}}>Feed</Link>
			<Link to="/profile/jdoe" style={{marginRight: "10px"}}>Profile</Link>
			<Link to="/messages">Messages</Link>
		</nav>
	);
}