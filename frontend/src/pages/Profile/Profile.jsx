/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 14:07:20 by eric              #+#    #+#             */
/*   Updated: 2026/04/08 15:40:05 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import { authAPI, uploadAPI, userAPI, postsAPI } from "../../services/api";
import { useAvatar } from "../../hooks/useAvatar";
import PostCard from "../../components/PostCard";
import CreatePostForm from "../../components/CreatePostForm";
import FloatingChat from "../../components/FloatingChat";
import { Link } from "react-router-dom";
import { FiImage, FiFileText, FiDownload, FiCamera, FiX, FiMessageCircle } from "react-icons/fi";

export default function Profile() 
{
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userMedia, setUserMedia] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [profilePosts, setProfilePosts] = useState([]);
    
    const { user, setUser, posts, addPost, toggleLike, deletePost } = useAppContext();
    
    // Hook pour charger l'avatar avec JWT - seulement si c'est un filename local
    const isLocalAvatar = user?.avatar && !user.avatar.startsWith('http') && !user.avatar.startsWith('data:');
    const { imageUrl: avatarUrl } = useAvatar(isLocalAvatar ? user?.avatar : null);
    
    // Utiliser profilePosts au lieu de filtrer depuis posts
    const userPosts = profilePosts;
    
    // Charger les posts du profil séparément
    useEffect(() => {
        const fetchProfilePosts = async () => {
            if (!user?.id) return;
            try {
                const postsData = await postsAPI.getUserPosts(user.id, 999999);
                setProfilePosts(postsData || []);
            } catch (err) {
                console.error('Erreur chargement posts profil:', err);
            }
        };
        
        fetchProfilePosts();
    }, [user?.id]);

    // Synchroniser les changements du contexte posts avec profilePosts
    useEffect(() => {
        if (!user?.id) return;
        
        // Mettre à jour profilePosts quand le contexte posts change
        // Garder TOUS les posts du profil, juste mettre à jour ceux qui sont dans le contexte
        const updatedProfilePosts = profilePosts.map(profilePost => {
            const contextPost = posts.find(p => p.id === profilePost.id);
            return contextPost ? { ...contextPost } : profilePost;
        });
        
        // Ajouter les nouveaux posts du contexte qui appartiennent à cet utilisateur
        const newContextPosts = posts.filter(p => 
            p.userId === user.id && !profilePosts.some(pp => pp.id === p.id)
        );
        
        if (newContextPosts.length > 0) {
            setProfilePosts([...newContextPosts, ...updatedProfilePosts]);
        } else if (updatedProfilePosts.some((p, i) => p !== profilePosts[i])) {
            // Mettre à jour seulement si quelque chose a changé
            setProfilePosts(updatedProfilePosts);
        }
    }, [posts, user?.id]);
    
    // Récupère les infos de l'utilisateur connecté depuis l'API (toujours pour avoir les stats à jour)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
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

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setUploadError(null);
        } else {
            setUploadError(t('profile.uploadError'));
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile || !user?.id) return;

        setUploading(true);
        setUploadError(null);

        try {
            console.log('🔵 [PROFILE] Uploading avatar for user:', user.id);
            
            // Call updateProfile with the avatar file
            const response = await userAPI.updateProfile(user.id, {}, selectedFile);
            
            console.log('🟢 [PROFILE] Avatar uploaded successfully:', response);
            
            // Update the user's avatar
            setUser({ ...user, avatar: response.avatar || selectedFile.name });
            
            // Close the modal and reset
            setShowAvatarModal(false);
            setSelectedFile(null);
        } catch (err) {
            console.error('❌ Avatar upload error:', err);
            setUploadError(err.message || t('profile.uploadError'));
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedMedia) return;

            const filteredMedia = userPosts && userPosts.filter(post => post.image || post.pdf);
            if (!filteredMedia || filteredMedia.length === 0) return;

            if (e.key === 'Escape') {
                setSelectedMedia(null);
                setSelectedMediaIndex(0);
            } else if (e.key === 'ArrowLeft') {
                setSelectedMediaIndex((prev) => (prev === 0 ? filteredMedia.length - 1 : prev - 1));
            } else if (e.key === 'ArrowRight') {
                setSelectedMediaIndex((prev) => (prev === filteredMedia.length - 1 ? 0 : prev + 1));
            }
        };

        if (selectedMedia) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedMedia, userPosts, selectedMediaIndex]);

    // Si pas de user, ne rien afficher (le useEffect va le créer)
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    console.log('👤 [Profile] User object:', user);
    console.log('📝 [Profile] User bio:', user.bio);
    
 return (
        <div className="max-w-4xl mx-auto">
            {/* En-tête du profil */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                    {/* Avatar */}
                    <div className="group flex-shrink-0">
                        <div className="relative">
                            <img
                                src={avatarUrl || user.avatar || `https://ui-avatars.com/api/?name=${user.firstName || user.username}&background=3b82f6&color=fff`}
                                alt={user.username}
                                className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 border-blue-500"
                            />
                            <button
                                onClick={() => setShowAvatarModal(true)}
                                className="absolute inset-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all"
                            >
                                <FiCamera className="text-white opacity-0 group-hover:opacity-100 text-2xl sm:text-3xl" />
                            </button>
                        </div>
                    </div>

                    {/* Infos utilisateur */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">@{user.username}</p>
                            </div>
                            <Link
                                to="/settings"
                                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                            >
                                ⚙️ {t('profile.edit')}
                            </Link>
                        </div>
                        {user.bio && <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">{user.bio}</p>}

                        {/* Informations 42 */}
                        <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {user.campus && <span className="break-words">📍 {user.campus}</span>}
                            {user.level && <span>🎯 Niveau {user.level}</span>}
                            {user.cursus && <span className="break-words">📚 {user.cursus}</span>}
                        </div>

                        {/* Statistiques */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white">{userPosts.length}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{t('profile.posts')}</span>
                            </div>
                            <Link to="/followers?tab=followers" className="hover:underline" title={`Followers count: ${user._count?.followers}`}>
                                <span className="font-bold text-gray-900 dark:text-white">{user._count?.followers || 0}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{t('profile.followers')}</span>
                            </Link>
                            <Link to="/followers?tab=following" className="hover:underline" title={`Following count: ${user._count?.following}`}>
                                <span className="font-bold text-gray-900 dark:text-white">{user._count?.following || 0}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-1">{t('profile.following')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Formulaire de création de post */}
            <CreatePostForm onSubmit={handleCreatePost} />
            
            {/* Onglets */}
            <div className="mb-6">
                <div className="border-b dark:border-gray-700">
                    <button 
                        onClick={() => setActiveTab("posts")}
                        className={`px-6 py-3 font-semibold ${
                            activeTab === "posts" 
                                ? "text-blue-500 border-b-2 border-blue-500" 
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        {t('profile.tabs.posts')}
                    </button>
                    <button 
                        onClick={() => setActiveTab("media")}
                        className={`px-6 py-3 font-semibold ${
                            activeTab === "media" 
                                ? "text-blue-500 border-b-2 border-blue-500" 
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        {t('profile.tabs.media')}
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
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
                            {t('profile.noPosts')}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "media" && (
                (() => {
                    const filteredMedia = userPosts && userPosts.filter(post => post.image || post.pdf);
                    console.log('🖼️ [MyProfile Media] User posts:', userPosts?.length);
                    console.log('🖼️ [MyProfile Media] Filtered media count:', filteredMedia?.length);
                    console.log('🖼️ [MyProfile Media] Filtered items:', filteredMedia?.map(p => ({
                        id: p.id,
                        image: !!p.image,
                        pdf: !!p.pdf
                    })));

                    return (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredMedia && filteredMedia.length > 0 ? (
                                filteredMedia.map(post => (
                                    <div key={post.id} className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square cursor-pointer hover:opacity-80 transition" onClick={() => {
                                        const allMedia = userPosts && userPosts.filter(p => p.image || p.pdf);
                                        const idx = allMedia ? allMedia.findIndex(m => m.id === post.id) : 0;
                                        setSelectedMediaIndex(idx);
                                        setSelectedMedia(post.image || post.pdf);
                                    }}>
                                        {post.image && (
                                            <img 
                                                src={post.image} 
                                                alt="Post media" 
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {post.pdf && !post.image && (
                                            <a 
                                                href={post.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-900/30"
                                            >
                                                <div className="text-center">
                                                    <div className="text-3xl">📄</div>
                                                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">PDF</p>
                                                </div>
                                            </a>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                                            {post.pdf && post.image && (
                                                <a 
                                                    href={post.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <div className="text-2xl">📄</div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                                    {t('profile.noMedia') || 'Aucun média pour le moment.'}
                                </div>
                            )}
                        </div>
                    );
                })()
            )}

            {/* Modal de changement d'avatar */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('profile.uploadAvatar')}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAvatarModal(false);
                                    setSelectedFile(null);
                                    setUploadError(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Preview de l'image sélectionnée */}
                        {selectedFile && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                />
                            </div>
                        )}

                        {/* Input fichier */}
                        <div className="mb-4">
                            <label className="block w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <div className="cursor-pointer bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition">
                                    <FiImage className="mx-auto text-4xl text-gray-400 mb-2" />
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {selectedFile ? selectedFile.name : t('profile.selectImage')}
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Erreur */}
                        {uploadError && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
                                {uploadError}
                            </div>
                        )}

                        {/* Boutons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowAvatarModal(false);
                                    setSelectedFile(null);
                                    setUploadError(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                disabled={uploading}
                            >
                                {t('profile.cancel')}
                            </button>
                            <button
                                onClick={handleAvatarUpload}
                                disabled={!selectedFile || uploading}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {uploading ? t('profile.uploading') : t('profile.changeAvatar')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Modal Fullscreen Media */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => {
                    setSelectedMedia(null);
                    setSelectedMediaIndex(0);
                }}>
                    <button
                        onClick={() => {
                            setSelectedMedia(null);
                            setSelectedMediaIndex(0);
                        }}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-50"
                    >
                        ✕
                    </button>

                    {/* Navigation buttons */}
                    {(() => {
                        const filteredMedia = userPosts && userPosts.filter(post => post.image || post.pdf);
                        return filteredMedia && filteredMedia.length > 1 ? (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMediaIndex((prev) => (prev === 0 ? filteredMedia.length - 1 : prev - 1));
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl z-50"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMediaIndex((prev) => (prev === filteredMedia.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl z-50"
                                >
                                    ❯
                                </button>
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                                    {selectedMediaIndex + 1} / {filteredMedia.length}
                                </div>
                            </>
                        ) : null;
                    })()}

                    <img
                        src={(() => {
                            const filteredMedia = userPosts && userPosts.filter(post => post.image || post.pdf);
                            return filteredMedia && filteredMedia[selectedMediaIndex] 
                                ? (filteredMedia[selectedMediaIndex].image || filteredMedia[selectedMediaIndex].pdf)
                                : selectedMedia;
                        })()}
                        alt="Full screen media"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );                 
}
