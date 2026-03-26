/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PrivacyPolicy.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/23 12:00:00 by eric              #+#    #+#             */
/*   Updated: 2026/03/26 13:17:32 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../../utils";

export default function PrivacyPolicy() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const sections = [
        'introduction', 'data', 'usage', 'sharing', 
        'security', 'rights', 'cookies', 'retention', 'modifications'
    ];

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
                        {t('privacy.back')}
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('privacy.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('privacy.lastUpdated')}
                    </p>
                </div>

                {/* Privacy Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
                    
                    {/* Render all sections dynamically */}
                    {sections.map((section) => (
                        <section key={section}>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t(`privacy.sections.${section}.title`)}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                {t(`privacy.sections.${section}.content`)}
                            </p>
                            {(() => {
                                const items = t(`privacy.sections.${section}.items`, { returnObjects: true });
                                return Array.isArray(items) ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                                        {items.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                ) : null;
                            })()}
                            {t(`privacy.sections.${section}.note`) && (
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                                    {t(`privacy.sections.${section}.note`)}
                                </p>
                            )}
                        </section>
                    ))}

                    {/* Contact Section */}
                    <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('privacy.contactUs')}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            {t('privacy.contactEmail')}
                        </p>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex gap-4 justify-center items-center">
                    <Button
                        onClick={() => navigate('/privacy')}
                        variant="blue"
                    >
                        {t('privacy.title')}
                    </Button>
                    <Button
                        onClick={() => navigate('/terms')}
                        variant="secondary"
                    >
                        {t('terms.title')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
