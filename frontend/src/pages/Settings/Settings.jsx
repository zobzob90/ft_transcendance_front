/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Settings.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 11:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/04/03 17:29:18 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, Button } from "../../utils";
import { validateEmail, validatePassword } from "../../utils/validation";
import { 
    FiSun, 
    FiMoon, 
    FiMonitor,
    FiUser,
    FiLock,
    FiBell,
    FiGlobe,
    FiAlertTriangle
} from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";
import { usersAPI, authAPI } from "../../services/api";

export default function Settings() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, setUser, theme: contextTheme, setTheme: setContextTheme, language, setLanguage } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

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

    const [passwordErrors, setPasswordErrors] = useState({
        newPassword: null,
        confirmPassword: null
    });

    const [notifications, setNotifications] = useState({
        likes: true,
        follows: true,
        comments: false
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
        
        // Validation en temps réel pour les mots de passe
        if (name === 'newPassword') {
            validatePasswordField(value, formData.confirmPassword);
        } else if (name === 'confirmPassword') {
            validatePasswordField(formData.newPassword, value);
        }
    };

    const validatePasswordField = (newPwd, confirmPwd) => {
        const errors = { newPassword: null, confirmPassword: null };
        
        // Validation du nouveau mot de passe
        if (newPwd) {
            if (newPwd.length < 3) {
                errors.newPassword = t('settings.password.minLength');
            } else if (newPwd.length > 10) {
                errors.newPassword = t('settings.password.maxLength');
            } else if (/\s/.test(newPwd)) {
                errors.newPassword = t('settings.password.noSpaces');
            }
        }
        
        // Validation de la confirmation
        if (confirmPwd) {
            if (newPwd && confirmPwd !== newPwd) {
                errors.confirmPassword = t('settings.password.mismatch');
            }
        }
        
        setPasswordErrors(errors);
    };

    const handleNotifToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
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
        setError(null);
        setSuccess(null);

        // Vérifier que user.id existe
        console.log('👤 [Settings] User object:', user);
        console.log('👤 [Settings] User ID:', user?.id);
        
        if (!user?.id) {
            setError(t('settings.messages.errors.notAuthenticated'));
            return;
        }

        // Validation email
        if (!validateEmail(formData.email)) {
            setError(t('settings.messages.errors.invalidEmail'));
            return;
        }

        setLoading(true);

        try {
            // Appel API pour mettre à jour le profil
            console.log('📝 [Settings] Mise à jour avec userId:', user.id);
            console.log('📝 [Settings] Données envoyées:', { bio: formData.bio, firstName: formData.firstName, lastName: formData.lastName, username: formData.username, email: formData.email });
            await usersAPI.updateUser(user.id, {
                bio: formData.bio,
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email
            });

            // Récupérer l'utilisateur mis à jour du serveur
            const updatedUser = await authAPI.getCurrentUser();
            setUser(updatedUser);
            setSuccess(t('settings.messages.profileUpdated'));
            
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

        // Validation password
        if (!validatePassword(formData.newPassword)) {
            setError(t('settings.messages.errors.invalidPassword'));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        setLoading(true);

        try {
            // Appel API pour changer le mot de passe
            console.log('🔐 [Settings] Changement de mot de passe - currentPassword:', formData.currentPassword.length, 'chars');
            const response = await authAPI.changePassword(
                formData.currentPassword,
                formData.newPassword
            );
            console.log('🟢 [Settings] Réponse changement password:', response);
            
            setSuccess(t('settings.messages.passwordChanged'));
            
            // Réinitialiser les champs de mot de passe
            setFormData({
                ...formData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("❌ Erreur changement mot de passe:", err);
            setError(err.message || "Erreur lors du changement de mot de passe");
        } finally {
            setLoading(false);
        }
    };

    // Restaurer les infos 42 (avatar, prénom, nom, email)
    const handleRestore42Profile = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const restoredUser = await usersAPI.restore42Profile(user.id);
            
            // Mettre à jour le contexte avec les infos restaurées
            setUser(restoredUser);
            setFormData({
                ...formData,
                username: restoredUser.username || "",
                email: restoredUser.mail || restoredUser.email || "",
                firstName: restoredUser.firstname || "",
                lastName: restoredUser.lastname || "",
            });
            
            setSuccess(t('settings.messages.profileRestored'));
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Erreur restauration 42:", err);
            setError(err.message || "Erreur lors de la restauration du profil");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword.trim()) {
            setError(t('settings.messages.errors.invalidPassword'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('⚠️ [Settings] Suppression de compte');
            await usersAPI.deleteAccount(user.id);
            
            // Logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            
            // Rediriger immédiatement vers login
            navigate('/login');
        } catch (err) {
            console.error("Erreur suppression compte:", err);
            setError(err.message || "Erreur lors de la suppression du compte");
            setLoading(false);
            setShowDeleteModal(false);
            setDeletePassword("");
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

                {/* Bouton Restaurer 42 */}
                {/* Désactivé si l'utilisateur n'a pas été inscrit via OAuth 42 */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        onClick={handleRestore42Profile}
                        disabled={loading || !user?.login42}
                        title={!user?.login42 ? 'Cette option n\'est disponible que pour les comptes inscrits via 42' : ''}
                    >
                        {loading ? 'Restauration...' : 'Restaurer le profil 42'}
                    </Button>
                    {!user?.login42 && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <FiAlertTriangle className="w-4 h-4" />
                            <span>Disponible uniquement pour les comptes inscrits via 42</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Section Mot de passe */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiLock className="text-blue-500" />
                    <span>{t('settings.password.title')}</span>
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <Input
                            label={t('settings.password.current')}
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                            label={t('settings.password.new')}
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            hint={!passwordErrors.newPassword ? "3-10 caractères, pas d'espaces" : null}
                        />
                        {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                                <span>⚠️</span>
                                <span>{passwordErrors.newPassword}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <Input
                            label={t('settings.password.confirm')}
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            hint={!passwordErrors.confirmPassword ? "Doit correspondre au nouveau mot de passe" : null}
                        />
                        {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                                <span>⚠️</span>
                                <span>{passwordErrors.confirmPassword}</span>
                            </p>
                        )}
                        {formData.confirmPassword && !passwordErrors.confirmPassword && formData.newPassword === formData.confirmPassword && (
                            <p className="mt-1 text-sm text-green-500 flex items-center space-x-1">
                                <span>✅</span>
                                <span>{t('settings.password.match')}</span>
                            </p>
                        )}
                    </div>
                    {formData.currentPassword && formData.newPassword && formData.confirmPassword && !passwordErrors.newPassword && !passwordErrors.confirmPassword && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 flex items-center space-x-2">
                            <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
                            <span className="text-green-700 dark:text-green-300 font-medium">{t('settings.password.valid')}</span>
                        </div>
                    )}
                    <Button type="submit" disabled={loading || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword || !formData.newPassword || !formData.confirmPassword}>
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
                            <p className="font-medium text-gray-900 dark:text-white">{t('settings.notifications.follows')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.followsDesc')}</p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.follows}
                            onChange={() => handleNotifToggle('follows')}
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

            {/* Section Légal */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <FiAlertTriangle className="text-blue-500" />
                    <span>{t('settings.legal.title')}</span>
                </h2>
                <div className="flex flex-col gap-4">
                    <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition text-center"
                    >
                        {t('settings.legal.termsButton')}
                    </a>
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition text-center"
                    >
                        {t('settings.legal.privacyButton')}
                    </a>
                </div>
            </div>

            {/* Section Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-colors">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
                    <FiAlertTriangle />
                    <span>{t('settings.danger.title')}</span>
                </h2>
                <div className="space-y-3">
                    <button 
                        onClick={() => setShowDeleteModal(true)}
                        disabled={loading}
                        className="w-full bg-red-600 dark:bg-red-700 text-white py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition disabled:opacity-50"
                    >
                        {loading ? "..." : t('settings.danger.delete')}
                    </button>
                </div>
            </div>

            {/* Modal de confirmation suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                            ⚠️ {t('settings.danger.delete')}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Cette action est irréversible. Tous vos données seront supprimées.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder={t('settings.password.current')}
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletePassword("");
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                                >
                                    {t('settings.profile.cancel')}
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {loading ? "..." : t('settings.danger.delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
