/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.tsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/27 14:18:53 by eric              #+#    #+#             */
/*   Updated: 2026/01/27 15:22:51 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Routes, Route, Navigate } from "react-router-dom";
import  Login from "./pages/Login";
import	Feed from "./pages/Feed";
import	Profile from "./pages/Profile";
import	Messages from "./pages/Messages";
import	Navbar from "./components/Navbar";

export default function App()
{
	return(
		<div>
			<Navbar />
			<Routes>			<Route path="/login" element={<Login />} />
			<Route path="/feed" element ={<Feed />} />
			<Route path="/profile/:login" element={<Profile />} />
			<Route path="/messages" element={<Messages />} />
				<Route path="*" element={<Navigate to="/feed" />} />
			</Routes>
		</div>
	);
}