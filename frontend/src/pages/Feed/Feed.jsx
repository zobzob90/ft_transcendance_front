/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Feed.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:04 by eric              #+#    #+#             */
/*   Updated: 2026/02/06 19:59:02 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import PostCard from "../../components/PostCard";
import CreatePostForm from "../../components/CreatePostForm";
import { Link } from "react-router-dom";

export default function Feed() 
{
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
            <Link
                to="/messages"
                className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition flex items-center space-x-2"
                >
                    <span className="text-2xl">💬</span>
                    <span className="hidden sm:block">Messages</span>
                </Link>
        </div>
    );
}
