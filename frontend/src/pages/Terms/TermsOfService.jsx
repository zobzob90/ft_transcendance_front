/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TermsOfService.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/23 14:41:05 by eric              #+#    #+#             */
/*   Updated: 2026/03/23 16:39:56 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../../utils";

export default function TermsOfService() {
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
                        Conditions d'Utilisation
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dernière mise à jour : 23 mars 2026
                    </p>
                </div>

                {/* Terms Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
                    
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            1. Acceptation des Conditions
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            En créant un compte et en utilisant cette plateforme, vous acceptez pleinement ces conditions d'utilisation. 
                            Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce service.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            2. Compte Utilisateur
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vous êtes responsable de maintenir la confidentialité de vos identifiants et de votre mot de passe. 
                            Vous acceptez l'entière responsabilité de toutes les activités qui se produisent sous votre compte.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Vous garantissez que les informations fournies sont exactes et complètes</li>
                            <li>Vous devez informer immédiatement de tout accès non autorisé à votre compte</li>
                            <li>Vous acceptez de ne pas partager votre compte avec d'autres personnes</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            3. Contenu Utilisateur
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vous reconnaissez que vous êtes responsable de tout contenu (messages, images, fichiers) que vous publiez ou partagez sur la plateforme.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vous acceptez que votre contenu :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Ne viole aucun droit d'auteur ou de propriété intellectuelle</li>
                            <li>N'est pas illégal, diffamatoire, abusif ou discriminatoire</li>
                            <li>Ne contient pas de malware ou code malveillant</li>
                            <li>Respecte les droits et la dignité d'autres utilisateurs</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            4. Comportement Utilisateur
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Vous vous engagez à utiliser la plateforme de manière responsable. 
                            Les comportements suivants sont strictement interdits :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Harcèlement ou menaces envers d'autres utilisateurs</li>
                            <li>Spam, publicité non consentie ou contenu répétitif</li>
                            <li>Tentatives de piratage ou d'accès non autorisé</li>
                            <li>Usurpation d'identité ou tromperie</li>
                            <li>Contenu sexuel, violent ou choquant</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            5. Propriété Intellectuelle
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Le contenu, le design et les fonctionnalités de cette plateforme sont protégés par les droits d'auteur et autres lois de propriété intellectuelle. 
                            Vous ne pouvez pas copier, modifier ou distribuer ce contenu sans autorisation préalable.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            6. Limitation de Responsabilité
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Cette plateforme est fournie "tel quel" sans garantie d'aucune sorte. 
                            Nous ne pouvons pas être tenus responsables de :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Les dommages directs ou indirects résultant de l'utilisation du service</li>
                            <li>Les pertes de données ou d'accès</li>
                            <li>Les contenus tiers ou les actions d'autres utilisateurs</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            7. Modification des Conditions
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Nous nous réservons le droit de modifier ces conditions à tout moment. 
                            Les modifications seront effectives immédiatement après leur publication. 
                            Votre utilisation continue du service constitue votre acceptation des conditions modifiées.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            8. Droit Applicable
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Ces conditions sont régies par les lois applicables. 
                            Tout litige découlant de ces conditions sera soumis à la juridiction compétente.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Questions ?
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            Si vous avez des questions concernant ces conditions, 
                            veuillez nous contacter à support@example.com
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
