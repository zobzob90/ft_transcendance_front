/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:20 by eric              #+#    #+#             */
/*   Updated: 2026/02/11 16:12:47 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import PostCard from "../../components/PostCard";
import { Link } from "react-router-dom";
import { FiImage, FiFileText, FiDownload } from "react-icons/fi";

export default function Profile() 
{
    const [activeTab, setActiveTab] = useState("posts"); // posts | media | likes
    
    // Donnee Mockee (remplace par l'API plus tard)
    const [user] = useState({
        username: "Anony",
        displayName: "Adrien Nony",
        email: "anony@student.42.fr",
        avatar: "/avatars/anony.jpg",
        bio: "Étudiant à 42 Paris | Fan de saucisse | PizzaCringe Lover",
        level: 7.30,
        campus: "Paris",
        cursus: "42cursus",
        stats: {
            posts: 42,
            followers: 39,
            following: 69,
        }
    });
    const [userPosts] = useState([
        {
            id: 1,
            author: user.username,
            avatar: user.avatar,
            content: "Mon premier post sur 42Hub !",
            likes: 23,
            date: "Il y a 48 jours",
        },
        {
            id: 2,
            author: user.username,
            avatar: user.avatar,
            content: "IRC est valide !",
            likes: 1,
            date: "Il y a 3 jours",
        }
    ]);

    const [userMedia] = useState([
        {
            id: 1,
            type: "image",
            url: "/avatars/anony.jpg",
            title: "Photo de profil",
            date: "Il y a 2 mois"
        },
        {
            id: 2,
            type: "image",
            url: "/avatars/kearmand.jpg",
            title: "Screenshot du projet",
            date: "Il y a 1 mois"
        },
        {
            id: 3,
            type: "pdf",
            url: "/docs/correction.pdf",
            title: "Correction MiniRT",
            date: "Il y a 3 semaines"
        },
        {
            id: 4,
            type: "image",
            url: "/avatars/vdeliere.jpg",
            title: "Événement 42",
            date: "Il y a 1 semaine"
        }
    ]);

    const [likedPosts] = useState([
        {
            id: 10,
            author: "Kearmand",
            avatar: "/avatars/kearmand.jpg",
            content: "PizzaCringe le goat",
            likes: 42,
            date: "Il y a 1h"
        },
        {
            id: 11,
            author: "Vdeliere",
            avatar: "/avatars/vdeliere.jpg",
            content: "Allah Akbar",
            likes: 12,
            date: "Il y a 6h"
        }
    ]);

    const handleLike = (postId) => {
        console.log("Like post:", postId);
    }
    
 return (
        <div className="max-w-4xl mx-auto">
            {/* En-tête du profil */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-32 h-32 rounded-full border-4 border-blue-500"
                    />

                    {/* Infos utilisateur */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.displayName}
                                </h1>
                                <p className="text-gray-600">@{user.username}</p>
                            </div>
                            <Link
                                to="/settings"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                ⚙️ Modifier le profil
                            </Link>
                        </div>
                        <p className="text-gray-700 mb-4">{user.bio}</p>

                        {/* Informations 42 */}
                        <div className="flex space-x-6 text-sm text-gray-600 mb-4">
                            <span>📍 {user.campus}</span>
                            <span>🎯 Niveau {user.level}</span>
                            <span>📚 {user.cursus}</span>
                        </div>

                        {/* Statistiques */}
                        <div className="flex space-x-6">
                            <div>
                                <span className="font-bold text-gray-900">{user.stats.posts}</span>
                                <span className="text-gray-600 ml-1">posts</span>
                            </div>
                            <Link to="/followers" className="hover:underline">
                                <span className="font-bold text-gray-900">{user.stats.followers}</span>
                                <span className="text-gray-600 ml-1">abonnés</span>
                            </Link>
                            <Link to="/followers" className="hover:underline">
                                <span className="font-bold text-gray-900">{user.stats.following}</span>
                                <span className="text-gray-600 ml-1">abonnements</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Onglets */}
            <div className="mb-6">
                <div className="border-b">
                    <button 
                        onClick={() => setActiveTab("posts")}
                        className={`px-6 py-3 font-semibold ${
                            activeTab === "posts" 
                                ? "text-blue-500 border-b-2 border-blue-500" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab("media")}
                        className={`px-6 py-3 font-semibold ${
                            activeTab === "media" 
                                ? "text-blue-500 border-b-2 border-blue-500" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Médias
                    </button>
                    <button 
                        onClick={() => setActiveTab("likes")}
                        className={`px-6 py-3 font-semibold ${
                            activeTab === "likes" 
                                ? "text-blue-500 border-b-2 border-blue-500" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Likes
                    </button>
                </div>
            </div>

            {/* Contenu selon l'onglet actif */}
            {activeTab === "posts" && (
                <div className="space-y-4">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onLike={handleLike} 
                            />
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                            Aucun post pour le moment
                        </div>
                    )}
                </div>
            )}

            {activeTab === "media" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userMedia.length > 0 ? (
                        userMedia.map(media => (
                            <div 
                                key={media.id} 
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
                            >
                                {media.type === "image" ? (
                                    <div className="relative aspect-square">
                                        <img 
                                            src={media.url} 
                                            alt={media.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                                            <FiImage className="text-white text-3xl opacity-0 group-hover:opacity-100 transition" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center p-4">
                                        <FiFileText className="text-red-500 text-5xl mb-2" />
                                        <p className="text-sm text-gray-700 font-medium text-center">{media.title}</p>
                                    </div>
                                )}
                                <div className="p-3">
                                    <p className="text-sm text-gray-600 truncate">{media.title}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-gray-500">{media.date}</p>
                                        {media.type === "pdf" && (
                                            <button className="text-blue-500 hover:text-blue-700">
                                                <FiDownload className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                            Aucun média pour le moment
                        </div>
                    )}
                </div>
            )}

            {activeTab === "likes" && (
                <div className="space-y-4">
                    {likedPosts.length > 0 ? (
                        likedPosts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onLike={handleLike} 
                            />
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                            Aucun post liké pour le moment
                        </div>
                    )}
                </div>
            )}
        </div>
    );                 
}
