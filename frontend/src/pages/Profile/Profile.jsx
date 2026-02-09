/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:20 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 09:52:07 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import PostCard from "../../components/PostCard";
import { Link } from "react-router-dom";

export default function Profile() 
{
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
                            <div>
                                <span className="font-bold text-gray-900">{user.stats.followers}</span>
                                <span className="text-gray-600 ml-1">abonnés</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">{user.stats.following}</span>
                                <span className="text-gray-600 ml-1">abonnements</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Onglets */}
            <div className="mb-6">
                <div className="border-b">
                    <button className="px-6 py-3 font-semibold text-blue-500 border-b-2 border-blue-500">
                        Posts
                    </button>
                    <button className="px-6 py-3 font-semibold text-gray-500 hover:text-gray-700">
                        Médias
                    </button>
                    <button className="px-6 py-3 font-semibold text-gray-500 hover:text-gray-700">
                        Likes
                    </button>
                </div>
            </div>

             {/* Posts de l'utilisateur */}
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
        </div>
    );                 
}
