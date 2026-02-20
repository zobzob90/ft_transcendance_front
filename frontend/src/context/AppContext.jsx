/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AppContext.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/17 14:12:55 by eric              #+#    #+#             */
/*   Updated: 2026/02/20 09:44:37 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { postsAPI } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { i18n, t } = useTranslation();
    
    // User data
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    // Posts (NE PLUS charger depuis localStorage au démarrage)
    const [posts, setPosts] = useState(() => {
        // Nettoyer les anciennes données mockées de localStorage au démarrage
        localStorage.removeItem('posts');
        return [];
    });

    // Notifications
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });

    // Flag pour savoir si la notification de bienvenue a été ajoutée
    const [welcomeNotificationAdded, setWelcomeNotificationAdded] = useState(() => {
        return localStorage.getItem('welcomeNotificationAdded') === 'true';
    });

    // Theme (light, dark, auto)
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'light';
    });

    // Language
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'fr';
    });

    // Fonction pour changer la langue
    const setLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        console.log('🌍 Langue changée:', lang);
    };

    // Charger les posts depuis l'API au démarrage
    useEffect(() => {
        const loadPosts = async () => {
            try {
                console.log("📥 Chargement des posts depuis l'API...");
                const response = await postsAPI.getFeed(1, 20);
                
                // Formatter les posts pour l'affichage
                const formattedPosts = response.posts?.map(p => ({
                    id: p.id,
                    author: p.user?.username || p.user?.firstName || 'Anonyme',
                    avatar: p.user?.avatar || `https://ui-avatars.com/api/?name=${p.user?.firstName || 'User'}&background=3b82f6&color=fff`,
                    content: p.content,
                    likes: p._count?.likes || 0,
                    liked: false, // TODO: vérifier si l'user a liké
                    date: new Date(p.createdAt).toLocaleDateString('fr-FR'),
                    userId: p.userId,
                    createdAt: p.createdAt,
                })) || [];
                
                console.log("✅ Posts chargés:", formattedPosts.length);
                setPosts(formattedPosts);
            } catch (error) {
                console.error("❌ Erreur chargement posts:", error);
                // Ne plus charger depuis localStorage - laisser vide
                setPosts([]);
            }
        };

        loadPosts();
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        if (user) {
            console.log("💾 Sauvegarde utilisateur dans localStorage:", user);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Ajouter une notification de bienvenue si c'est la première fois
            if (!welcomeNotificationAdded) {
                const welcomeNotif = {
                    id: Date.now(),
                    type: 'system',
                    content: t ? t('notifications.welcome.message', { name: user.firstName || user.username }) : `Bienvenue ${user.firstName || user.username} ! Découvrez votre nouveau réseau social pour la communauté 42.`,
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=42Hub&background=3b82f6&color=fff`,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                };
                
                setNotifications(prev => [welcomeNotif, ...prev]);
                setWelcomeNotificationAdded(true);
                localStorage.setItem('welcomeNotificationAdded', 'true');
                console.log("🎉 Notification de bienvenue ajoutée");
            }
        } else {
            console.log("⚠️ Pas d'utilisateur à sauvegarder");
        }
    }, [user, welcomeNotificationAdded, t]);



    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Sauvegarder le thème et l'appliquer au DOM
    useEffect(() => {
        localStorage.setItem('theme', theme);
        
        const root = window.document.documentElement;
        
        // Retirer les classes existantes
        root.classList.remove('light', 'dark');
        
        if (theme === 'auto') {
            // Détecter la préférence système
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemPrefersDark ? 'dark' : 'light');
        } else {
            // Appliquer le thème choisi
            root.classList.add(theme);
        }
    }, [theme]);

    // Fonctions pour gérer les posts
    const addPost = async (post) => {
        if (!user) {
            console.warn("⚠️ Tentative d'ajout de post sans utilisateur connecté");
            return null;
        }
        
        console.log("📝 Ajout d'un post par:", user.username || user.firstName);
        
        try {
            // Appeler l'API pour créer le post dans la BDD
            const createdPost = await postsAPI.createPost(post.content);
            
            // Formatter le post pour l'affichage
            const newPost = {
                id: createdPost.id, // Utiliser l'ID de la BDD
                author: user?.username || user?.firstName || 'Vous',
                avatar: user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=3b82f6&color=fff`,
                content: createdPost.content,
                likes: createdPost._count?.likes || 0,
                liked: false,
                date: 'À l\'instant',
                userId: user?.id,
                createdAt: createdPost.createdAt,
            };
            
            console.log("✅ Post créé dans la BDD:", newPost);
            setPosts([newPost, ...posts]);
            return newPost;
        } catch (error) {
            console.error("❌ Erreur création post:", error);
            alert(`Erreur lors de la création du post: ${error.message}`);
            return null;
        }
    };

    const toggleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { 
                    ...post, 
                    liked: !post.liked,
                    likes: post.liked ? post.likes - 1 : post.likes + 1 
                  }
                : post
        ));
    };

    const deletePost = async (postId) => {
        try {
            await postsAPI.deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
            console.log("✅ Post supprimé:", postId);
        } catch (error) {
            console.error("❌ Erreur suppression post:", error);
            alert(`Erreur lors de la suppression: ${error.message}`);
        }
    };

    // Fonctions pour gérer les notifications
    const addNotification = (notification) => {
        const newNotif = {
            id: Date.now(),
            ...notification,
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        setNotifications([newNotif, ...notifications]);
    };

    const markNotificationAsRead = (notifId) => {
        setNotifications(notifications.map(notif =>
            notif.id === notifId ? { ...notif, isRead: true } : notif
        ));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    const getUnreadCount = () => {
        return notifications.filter(n => !n.isRead).length;
    };

    const value = {
        // User
        user,
        setUser,
        
        // Posts
        posts,
        setPosts,
        addPost,
        toggleLike,
        deletePost,
        
        // Notifications
        notifications,
        setNotifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadCount,
        
        // Theme
        theme,
        setTheme,

        // Language
        language,
        setLanguage,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
