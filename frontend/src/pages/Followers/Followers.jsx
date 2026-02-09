/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Followers.jsx                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 14:20:44 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 14:52:48 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { FiUserPlus, FiUserCheck, FiUserX, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Followers() {
	const [activeTab, setActiveTab] = useState("followers");
	const [searchQuery, setSearchQuery] = useState("");

	const [followers, setFollowers] = useState([
		{
			id: 1,
			username: "Anony",
			name: "Adrien Nony",
			avatar: "/avatars/anony.jpg",
			bio: "Sausage and Pizza lover",
			isFollowingBack: false,
			since: "2024-11-15"
		},
		{
			id: 2,
			username: "Kearmand",
			name: "Kevin Armand",
			avatar: "/avatars/Kearmand.jpg",
			bio: "MiniRT enjoyer | The Hashmaster",
			isFollowingBack: true,
			since: "2025-11-15"
		},
		{
			id: 3,
			username: "Vdeliere",
			name:  "Valentin Deliere",
			avatar: "/avatars/vdeliere.jpg",
			bio: "Art enthusiast 🎨",
			isFollowingBack: true,
			since: "2026-01-09"
		}
	]);
	
	const [following, setFollowing] = useState([
		{
			id: 2,
			username: "kearmand",
			name: "Kevin Armand",
			avatar: "/avatars/Kearmand.jpg",
			bio: "MiniRT enjoyer | The Hashmaster",
			followsMe: true,
			since: "2025-11-15"
		},
		{
			id: 4,
            username: "johndoe",
            name: "John Doe",
            avatar: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6",
            bio: "Software Engineer | Tech lover",
            followsMe: false,
            since: "2024-01-05"
		}
	]);
	
	const handleFollow = (userId) => {
		setFollowers(followers.map(user =>
			user.id === userId ? {... user, isFollowingBack: true} : user
		));
	}
	
	const handleUnfollow = (userId) => {
		setFollowing(followers.filter(user=> user.id !== userId));
	};

	const handleRemoveFollower = (userId) => {
		setFollowers(followers.filter(user => user.id !== userId));
	};

	const currentList = activeTab === "Followers" ? followers : following;
	const filteredList = currentList.filter(user =>
		user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		user.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="max-w-4xl mx-auto">
            {/* Header avec stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">Réseau</h1>
                <div className="flex space-x-8">
                    <div>
                        <p className="text-3xl font-bold text-blue-600">{followers.length}</p>
                        <p className="text-gray-600">Abonnés</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-blue-600">{following.length}</p>
                        <p className="text-gray-600">Abonnements</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-green-600">
						{followers.filter(f => f.isFollowingBack).length}
                        </p>
                        <p className="text-gray-600">Mutuels</p>
                    </div>
                </div>
            </div>
			
			 {/* Onglets */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("followers")}
                            className={`flex-1 px-6 py-4 font-semibold transition ${
                                activeTab === "followers"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Abonnés ({followers.length})
                        </button>
						<button
                            onClick={() => setActiveTab("following")}
                            className={`flex-1 px-6 py-4 font-semibold transition ${
                                activeTab === "following"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Abonnements ({following.length})
                        </button>
                    </div>
                </div>

				 {/* Barre de recherche */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>
				
				 {/* Liste des utilisateurs */}
                <div className="divide-y max-h-[600px] overflow-y-auto">
                    {filteredList.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchQuery 
                                ? "Aucun résultat trouvé" 
                                : activeTab === "followers"
                                    ? "Aucun abonné pour le moment"
                                    : "Vous ne suivez personne pour le moment"
                            }
                        </div>
					) : (
                        filteredList.map(user => (
                            <div key={user.id} className="p-4 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        {/* Avatar */}
                                        <Link to={`/profile/${user.username}`}>
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-14 h-14 rounded-full hover:opacity-80 transition"
                                            />
                                        </Link>

										{/* Info utilisateur */}
                                        <div className="flex-1 min-w-0">
                                            <Link 
                                                to={`/profile/${user.username}`}
                                                className="hover:underline"
                                            >
                                                <h3 className="font-semibold text-gray-900">
                                                    {user.name}
                                                    {activeTab === "followers" && user.isFollowingBack && (
                                                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                            Mutuel
                                                        </span>
                                                    )}
                                                    {activeTab === "following" && user.followsMe && (
                                                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                            Vous suit
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500">@{user.username}</p>
                                            </Link>
                                            <p className="text-sm text-gray-600 truncate mt-1">{user.bio}</p>
                                        </div>
                                    </div>

									{/* Boutons d'action */}
                                    <div className="flex space-x-2">
                                        {activeTab === "followers" ? (
                                            <>
                                                {!user.isFollowingBack ? (
                                                    <button
                                                        onClick={() => handleFollow(user.id)}
                                                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        <FiUserPlus />
                                                        <span>Suivre</span>
                                                    </button>
                                                ) : (
                                                    <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-default">
                                                        <FiUserCheck />
                                                        <span>Suivi</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveFollower(user.id)}
                                                    className="flex items-center space-x-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                                                    title="Retirer cet abonné"
                                                >
                                                    <FiUserX />
                                                </button>
                                            </>
                                        ) : (
											<button
                                                onClick={() => handleUnfollow(user.id)}
                                                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <FiUserX />
                                                <span>Ne plus suivre</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
	);
}
