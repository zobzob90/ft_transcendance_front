/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CreatePostForm.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 16:21:28 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 12:00:16 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function CreatePostForm({ onSubmit })
{
	const [content, setContent] = useState("");
	
	const handleSubmit = (e) =>
	{
		e.preventDefault();
		if (content.trim() === "")
			return;
		onSubmit(content);
		setContent("");
	};
	return (
		<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Quoi de neuf ?"
				className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
				rows="3"
			/>
			<button
				type="submit"
				className="mt-3 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center space-x-2"
			>
				<FiSend />
				<span>Publier</span>
			</button>
		</form>
	);
}
