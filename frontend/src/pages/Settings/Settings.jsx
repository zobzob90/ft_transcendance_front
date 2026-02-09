/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Settings.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 11:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 12:11:17 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { Input, Button } from "../../utils";
import { 
    FiSun, 
    FiMoon, 
    FiMonitor,
    FiUser,
    FiLock,
    FiBell,
    FiShield,
    FiGlobe,
    FiAlertTriangle
} from "react-icons/fi";

export default function Settings() {
    const [formData, setFormData] = useState({
        username: "jdupont",
        email: "john.dupont@student.42.fr",
        bio: "Développeur passionné | 42 Student",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notifications, setNotifications] = useState({
        emailNotif: true,
        pushNotif: false,
        messages: true,
        likes: true,
        comments: false
    });

    const [privacy, setPrivacy] = useState({
        profilePublic: true,
        showEmail: false,
        showProjects: true
    });

    const [language, setLanguage] = useState("fr");
    const [theme, setTheme] = useState("light"); // light, dark, auto

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNotifToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const handlePrivacyToggle = (key) => {
        setPrivacy({ ...privacy, [key]: !privacy[key] });
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        // TODO: Implémenter le changement de thème avec Tailwind dark mode
        console.log("Thème changé:", newTheme);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        alert("Profil mis à jour !");
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
        alert("Mot de passe modifié !");
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                checked ? 'bg-blue-500' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-black-600">
                Paramètres
            </h1>

            {/* Section Profil */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiUser className="text-blue-500" />
                    <span>Profil</span>
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <Input
                        label="Nom d'utilisateur"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button type="submit">Sauvegarder les modifications</Button>
                </form>
            </div>

            {/* Section Mot de passe */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiLock className="text-blue-500" />
                    <span>Changer le mot de passe</span>
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input
                        label="Mot de passe actuel"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Nouveau mot de passe"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    <Button type="submit">Changer le mot de passe</Button>
                </form>
            </div>

            {/* Section Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiBell className="text-blue-500" />
                    <span>Notifications</span>
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Notifications par email</p>
                            <p className="text-sm text-gray-600">Recevoir des emails de notification</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.emailNotif}
                            onChange={() => handleNotifToggle('emailNotif')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Notifications push</p>
                            <p className="text-sm text-gray-600">Recevoir des notifications dans le navigateur</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.pushNotif}
                            onChange={() => handleNotifToggle('pushNotif')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-sm text-gray-600">Notifications pour nouveaux messages</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.messages}
                            onChange={() => handleNotifToggle('messages')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">J'aime</p>
                            <p className="text-sm text-gray-600">Notifications quand quelqu'un aime vos posts</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.likes}
                            onChange={() => handleNotifToggle('likes')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Commentaires</p>
                            <p className="text-sm text-gray-600">Notifications pour nouveaux commentaires</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.comments}
                            onChange={() => handleNotifToggle('comments')}
                        />
                    </div>
                </div>
            </div>

            {/* Section Confidentialité */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiShield className="text-blue-500" />
                    <span>Confidentialité</span>
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Profil public</p>
                            <p className="text-sm text-gray-600">Autoriser les autres à voir votre profil</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.profilePublic}
                            onChange={() => handlePrivacyToggle('profilePublic')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Afficher l'email</p>
                            <p className="text-sm text-gray-600">Rendre votre email visible sur votre profil</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.showEmail}
                            onChange={() => handlePrivacyToggle('showEmail')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Afficher les projets</p>
                            <p className="text-sm text-gray-600">Afficher vos projets 42 sur votre profil</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.showProjects}
                            onChange={() => handlePrivacyToggle('showProjects')}
                        />
                    </div>
                </div>
            </div>

            {/* Section Apparence */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiSun className="text-blue-500" />
                    <span>Apparence</span>
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Thème
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Light Theme */}
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    theme === 'light' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <FiSun className={`text-2xl ${theme === 'light' ? 'text-blue-500' : 'text-gray-600'}`} />
                                <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Clair
                                </span>
                            </button>

                            {/* Dark Theme */}
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    theme === 'dark' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <FiMoon className={`text-2xl ${theme === 'dark' ? 'text-blue-500' : 'text-gray-600'}`} />
                                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Sombre
                                </span>
                            </button>

                            {/* Auto Theme */}
                            <button
                                onClick={() => handleThemeChange('auto')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    theme === 'auto' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <FiMonitor className={`text-2xl ${theme === 'auto' ? 'text-blue-500' : 'text-gray-600'}`} />
                                <span className={`text-sm font-medium ${theme === 'auto' ? 'text-blue-700' : 'text-gray-700'}`}>
                                    Auto
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {theme === 'auto' 
                                ? "Le thème s'adaptera à vos préférences système" 
                                : theme === 'dark' 
                                    ? "Mode sombre activé" 
                                    : "Mode clair activé"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Langue */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FiGlobe className="text-blue-500" />
                    <span>Langue</span>
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Langue de l'interface
                        </label>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section Danger Zone */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center space-x-2">
                    <FiAlertTriangle />
                    <span>Gestion du compte</span>
                </h2>
                <div className="space-y-3">
                    <button className="w-full bg-white border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition">
                        Désactiver le compte
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                        Supprimer le compte
                    </button>
                </div>
            </div>
        </div>
    );
}
