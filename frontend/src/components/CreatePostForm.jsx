/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CreatePostForm.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 16:21:28 by eric              #+#    #+#             */
/*   Updated: 2026/02/06 18:56:24 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";

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
				className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
				rows="3"
			/>
			<button
				type="submit"
				className="mt-3 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
			>
				Publier
			</button>
		</form>
	);
}
