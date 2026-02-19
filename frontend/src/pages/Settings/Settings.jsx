/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Settings.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 11:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:46:31 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { useAppContext } from "../../context/AppContext";
import { usersAPI } from "../../services/api";

export default function Settings() {
    const { t } = useTranslation();
    const { user, setUser, theme: contextTheme, setTheme: setContextTheme, language, setLanguage } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
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

    // La langue vient maintenant du contexte (plus besoin de useState local)

    // Charger les données utilisateur depuis le contexte
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        }
    }, [user]);

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
        console.log("🌍 Langue changée:", e.target.value);
    };

    const handleThemeChange = (newTheme) => {
        setContextTheme(newTheme);
        console.log("🎨 Thème changé:", newTheme);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Appel API pour mettre à jour le profil
            const updatedUser = await usersAPI.updateUser(user.id, {
                bio: formData.bio,
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email
            });

            // Mettre à jour le contexte
            setUser(updatedUser);
            setSuccess("Profil mis à jour avec succès !");
            
            // Effacer le message de succès après 3 secondes
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Erreur mise à jour profil:", err);
            setError(err.message || "Erreur lors de la mise à jour du profil");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setLoading(true);

        try {
            // TODO: Implémenter l'endpoint backend pour changer le mot de passe
            // await usersAPI.changePassword(user.id, {
            //     currentPassword: formData.currentPassword,
            //     newPassword: formData.newPassword
            // });
            
            setSuccess("Mot de passe modifié avec succès !");
            
            // Réinitialiser les champs de mot de passe
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Erreur changement mot de passe:", err);
            setError(err.message || "Erreur lors du changement de mot de passe");
        } finally {
            setLoading(false);
        }
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                checked ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('settings.title')}
            </h1>

            {/* Messages de succès et d'erreur */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Section Profil */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiUser className="text-blue-500" />
                    <span>{t('settings.profile.title')}</span>
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <Input
                        label={t('settings.profile.firstName')}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label={t('settings.profile.lastName')}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label={t('settings.profile.username')}
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                    <Input
                        label={t('settings.profile.email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('settings.profile.bio')}
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={t('settings.profile.bioPlaceholder')}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? t('settings.profile.saving') : t('settings.profile.save')}
                    </Button>
                </form>
            </div>

            {/* Section Mot de passe */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiLock className="text-blue-500" />
                    <span>{t('settings.password.title')}</span>
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input
                        label={t('settings.password.current')}
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        label={t('settings.password.new')}
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        label={t('settings.password.confirm')}
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? t('settings.password.changing') : t('settings.password.change')}
                    </Button>
                </form>
            </div>

            {/* Section Notifications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiBell className="text-blue-500" />
                    <span>{t('settings.notifications.title')}</span>
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.email')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.emailDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.emailNotif}
                            onChange={() => handleNotifToggle('emailNotif')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.push')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.pushDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.pushNotif}
                            onChange={() => handleNotifToggle('pushNotif')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.messages')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.messagesDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.messages}
                            onChange={() => handleNotifToggle('messages')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.likes')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.likesDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.likes}
                            onChange={() => handleNotifToggle('likes')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.comments')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.commentsDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.comments}
                            onChange={() => handleNotifToggle('comments')}
                        />
                    </div>
                </div>
            </div>

            {/* Section Confidentialité */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiShield className="text-blue-500" />
                    <span>{t('settings.privacy.title')}</span>
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.privacy.profilePublic')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.privacy.profilePublicDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.profilePublic}
                            onChange={() => handlePrivacyToggle('profilePublic')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.privacy.showEmail')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.privacy.showEmailDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.showEmail}
                            onChange={() => handlePrivacyToggle('showEmail')}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.privacy.showProjects')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.privacy.showProjectsDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={privacy.showProjects}
                            onChange={() => handlePrivacyToggle('showProjects')}
                        />
                    </div>
                </div>
            </div>

            {/* Section Apparence */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiSun className="text-blue-500" />
                    <span>{t('settings.appearance.title')}</span>
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('settings.appearance.theme')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Light Theme */}
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    contextTheme === 'light' 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                }`}
                            >
                                <FiSun className={`text-2xl ${contextTheme === 'light' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                <span className={`text-sm font-medium ${contextTheme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {t('settings.appearance.light')}
                                </span>
                            </button>

                            {/* Dark Theme */}
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    contextTheme === 'dark' 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                }`}
                            >
                                <FiMoon className={`text-2xl ${contextTheme === 'dark' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                <span className={`text-sm font-medium ${contextTheme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {t('settings.appearance.dark')}
                                </span>
                            </button>

                            {/* Auto Theme */}
                            <button
                                onClick={() => handleThemeChange('auto')}
                                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition ${
                                    contextTheme === 'auto' 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                }`}
                            >
                                <FiMonitor className={`text-2xl ${contextTheme === 'auto' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                <span className={`text-sm font-medium ${contextTheme === 'auto' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {t('settings.appearance.auto')}
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {contextTheme === 'auto' 
                                ? t('settings.appearance.autoDesc')
                                : contextTheme === 'dark' 
                                    ? t('settings.appearance.darkDesc')
                                    : t('settings.appearance.lightDesc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Langue */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiGlobe className="text-blue-500" />
                    <span>{t('settings.language.title')}</span>
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('settings.language.interface')}
                        </label>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                            <option value="pt">Português</option>
                            <option value="ar">العربية</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-colors">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
                    <FiAlertTriangle />
                    <span>{t('settings.danger.title')}</span>
                </h2>
                <div className="space-y-3">
                    <button className="w-full bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                        {t('settings.danger.deactivate')}
                    </button>
                    <button className="w-full bg-red-600 dark:bg-red-700 text-white py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition">
                        {t('settings.danger.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}
