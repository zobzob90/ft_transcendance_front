/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Feed.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:04 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 10:50:00 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import PostCard from "../../components/PostCard";
import CreatePostForm from "../../components/CreatePostForm";
import FloatingChat from "../../components/FloatingChat";
import { FiMessageCircle } from "react-icons/fi";

export default function Feed() 
{
    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { posts, addPost, toggleLike, deletePost } = useAppContext();

    const handleCreatePost = (postData) => {
        console.log("Création post:", postData);
        addPost(postData);
    };

    const handleLike = (postId) => {
        toggleLike(postId);
    };

    const handleDelete = (postId) => {
        deletePost(postId);
    };
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('feed.title')}</h1>

            <CreatePostForm onSubmit={handleCreatePost} />

            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onLike={handleLike}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">{t('feed.noPosts')}</p>
                        <p className="text-sm">{t('feed.beFirstToPost')}</p>
                    </div>
                )}
            </div>

            {/* Bouton flottant chat */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center justify-center z-40"
                title={t('navbar.messages')}
            >
                <FiMessageCircle className="text-2xl" />
            </button>

            {/* FloatingChat */}
            {isChatOpen && <FloatingChat onClose={() => setIsChatOpen(false)} />}
        </div>
    );
}
