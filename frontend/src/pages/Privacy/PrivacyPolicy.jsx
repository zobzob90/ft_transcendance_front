/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PrivacyPolicy.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/23 12:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/03/23 16:39:32 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../../utils";

export default function PrivacyPolicy() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition"
                    >
                        <FiArrowLeft />
                        Retour
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dernière mise à jour : 23 mars 2026
                    </p>
                </div>

                {/* Privacy Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
                    
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Nous accordons une grande importance à la protection de vos données personnelles. 
                            Cette politique de confidentialité explique comment nous collectons, utilisons, partageons 
                            et protégeons vos informations lorsque vous utilisez notre plateforme.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            2. Données que Nous Collectons
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Nous collectons les informations suivantes :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>Informations de compte :</strong> Nom d'utilisateur, email, mot de passe (chiffré)</li>
                            <li><strong>Profil :</strong> Prénom, nom, bio, avatar</li>
                            <li><strong>Contenu créé :</strong> Posts, commentaires, messages</li>
                            <li><strong>Données de connexion :</strong> Adresse IP, type d'appareil, navigateur</li>
                            <li><strong>Interactions :</strong> Likes, suivi d'utilisateurs, notifications</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            3. Utilisation de Vos Données
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Fournir et améliorer les services de la plateforme</li>
                            <li>Authentifier votre compte et sécuriser votre session</li>
                            <li>Personaliser votre expérience utilisateur</li>
                            <li>Envoyer des notifications selon vos préférences</li>
                            <li>Analyser l'utilisation du service (données anonymisées)</li>
                            <li>Respecter nos obligations légales</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            4. Partage de Vos Données
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Nous ne vendons jamais vos données personnelles. Cependant, nous pouvons partager vos informations :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>Avec d'autres utilisateurs :</strong> Votre profil public et vos posts sont visibles selon vos paramètres de confidentialité</li>
                            <li><strong>Avec des prestataires :</strong> Pour l'hébergement, les services de paiement (le cas échéant)</li>
                            <li><strong>Conformité légale :</strong> Si requis par la loi ou pour protéger nos droits</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            5. Sécurité des Données
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Nous mettons en place les mesures techniques et organisationnelles suivantes :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Chiffrement des mots de passe avec bcrypt</li>
                            <li>Connexion HTTPS pour protéger les données en transit</li>
                            <li>Authentification par tokens JWT sécurisés</li>
                            <li>Accès restreint aux données sensibles</li>
                            <li>Contrôles d'accès basés sur les rôles</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            6. Vos Droits
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vous avez les droits suivants concernant vos données :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li><strong>Accès :</strong> Vous pouvez consulter vos données personnelles</li>
                            <li><strong>Correction :</strong> Vous pouvez modifier vos informations dans les paramètres</li>
                            <li><strong>Suppression :</strong> Vous pouvez demander la suppression de votre compte</li>
                            <li><strong>Portabilité :</strong> Vous pouvez exporter vos données</li>
                            <li><strong>Opposition :</strong> Vous pouvez refuser certains traitements</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            7. Cookies et Technologies de Suivi
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Nous utilisons le stockage local (localStorage) pour :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Stocker vos tokens d'authentification</li>
                            <li>Mémoriser vos préférences (thème, langue)</li>
                            <li>Améliorer votre expérience utilisateur</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            Vous pouvez nettoyer votre localStorage à tout moment via les paramètres de votre navigateur.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            8. Rétention des Données
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Nous conservons vos données tant que votre compte est actif. 
                            Si vous supprimez votre compte, vos données seront supprimées dans les 30 jours, 
                            sauf si la loi nous oblige à les conserver plus longtemps.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            9. Modifications de cette Politique
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Nous pouvons mettre à jour cette politique de confidentialité à tout moment. 
                            Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Nous Contacter
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Pour toute question concernant cette politique de confidentialité ou vos données, 
                            veuillez nous contacter à privacy@example.com
                        </p>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex gap-4 justify-center w-full">
                    <div className="w-48">
                        <Button
                            onClick={() => navigate('/settings')}
                            variant="blue"
                        >
                            Retour
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
