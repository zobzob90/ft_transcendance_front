/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PostCard.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 16:21:25 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 12:00:16 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Button } from "../utils";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

export default function PostCard({ post, onLike })
{
	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-start space-x-4">
				{/*AVATAR */}
				<img
					src={post.avatar}
					alt={post.author}
					className="w-12 h-12 rounded-full"
				/>
				<div className="flex-1">
					{/*HEADER (auteur + date) */}
					<div className="flex justify-between items-start mb-2">
						<div>
							<h3 className="font-bold text-gray-900">{post.author}</h3>
							<p className="text-sm text-gray-500">{post.date}</p>
                        </div>
					</div>
					{/*CONTENU*/}
					<p className="text-gray-800 mb-4">{post.content}</p>
					{/*footer like*/}
					<div className="flex items-center space-x-6">
						<button
							onClick={() => onLike(post.id)}
							className={`flex items-center space-x-2 transition ${
								post.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
							}`}
						>
							<FiHeart className={post.liked ? 'fill-red-500' : ''} />
							<span>{post.likes}</span>
						</button>
						<button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition">
							<FiMessageCircle />
							<span>Commenter</span>
						</button>
						<button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition">
							<FiShare2 />
							<span>Partager</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}