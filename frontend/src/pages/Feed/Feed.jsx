/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Feed.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:04 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 15:34:28 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import PostCard from "../../components/PostCard";
import CreatePostForm from "../../components/CreatePostForm";
import FloatingChat from "../../components/FloatingChat";
import { FiMessageCircle } from "react-icons/fi";

export default function Feed() 
{
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Anony",
            avatar: "/avatars/anony.jpg",
            content: "Paulo me manque, j'aimais beaucoup sa saucisse",
            likes: 39,
            date: "Il y a 2h"
        },
        {
            id: 2,
            author: "Kearmand",
            avatar: "/avatars/kearmand.jpg",
            content: "PizzaCringe le goat",
            likes: 42,
            date: "Il y a 1h"
        },
        {
            id: 3,
            author: "Vdeliere",
            avatar: "/avatars/vdeliere.jpg",
            content: "Allah Akbar",
            likes: 12,
            date: "Il y a 6h"
        }
    ]);

    const handleCreatePost = (content) =>
    {
        const newPost = {
            id: posts.length + 1,
            author: "Moi",
            avatar: "https://ui-avatars.com/api/?name=Moi&background=ff7f00",
            content: content,
            likes: 0,
            date: "À l'instant"
        }
        setPosts([newPost, ...posts]);
    };

    const handleLike = (postId) =>
    {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.likes + 1}
                :post
        ));
    };
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Feed</h1>

            <CreatePostForm onSubmit={handleCreatePost} />

            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={handleLike} 
                    />
                ))}
            </div>

            {/* Bouton flottant chat */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center group"
                title="Ouvrir le chat"
            >
                <FiMessageCircle className="text-2xl" />
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Messages
                </span>
            </button>

            {/* Mini chat flottant */}
            {isChatOpen && <FloatingChat onClose={() => setIsChatOpen(false)} />}
        </div>
    );
}
