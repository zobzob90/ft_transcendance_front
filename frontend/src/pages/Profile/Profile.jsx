/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:20 by eric              #+#    #+#             */
/*   Updated: 2026/02/15 13:57:41 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { authAPI } from "../../services/api";
import PostCard from "../../components/PostCard";
import { Link } from "react-router-dom";
import { FiImage, FiFileText, FiDownload } from "react-icons/fi";

export default function Profile() 
{
    const [activeTab, setActiveTab] = useState("posts");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Récupère les infos de l'utilisateur connecté
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
            } catch (err) {
                console.error('Erreur récupération profil:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    // Données mockées pour posts, media, likes (à remplacer par API plus tard)
    const [userPosts] = useState([]);
    const [userMedia] = useState([]);
    const [likedPosts] = useState([]);

    const handleLike = (postId) => {
        console.log("Like post:", postId);
    }

    // Affichage pendant le chargement
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Affichage en cas d'erreur
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Erreur: {error}</div>
            </div>
        );
    }

    // Si pas de user
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Utilisateur non trouvé</div>
            </div>
        );
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
                                    {user.firstName} {user.lastName}
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
                        {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

                        {/* Informations 42 */}
                        <div className="flex space-x-6 text-sm text-gray-600 mb-4">
                            {user.campus && <span>📍 {user.campus}</span>}
                            {user.level && <span>🎯 Niveau {user.level}</span>}
                            {user.cursus && <span>📚 {user.cursus}</span>}
                        </div>

                        {/* Statistiques */}
                        <div className="flex space-x-6">
                            <div>
                                <span className="font-bold text-gray-900">{user._count?.posts || 0}</span>
                                <span className="text-gray-600 ml-1">posts</span>
                            </div>
                            <Link to="/followers" className="hover:underline">
                                <span className="font-bold text-gray-900">{user._count?.followers || 0}</span>
                                <span className="text-gray-600 ml-1">abonnés</span>
                            </Link>
                            <Link to="/followers" className="hover:underline">
                                <span className="font-bold text-gray-900">{user._count?.following || 0}</span>
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
