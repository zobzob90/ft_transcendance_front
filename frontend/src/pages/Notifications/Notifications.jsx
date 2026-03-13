/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Notifications.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 14:30:00 by eric              #+#    #+#             */
/*   Updated: 2026/03/13 13:41:45 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiUserPlus, FiBell, FiRefreshCw } from "react-icons/fi";

export default function Notifications() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("all");
	const [refreshing, setRefreshing] = useState(false);
	const {
		notifications,
		markNotificationAsRead,
		markAllNotificationsAsRead,
		fetchNotifications,
	} = useAppContext();

	const filteredNotifications =
		activeTab === "all"
			? notifications
			: notifications.filter((n) => !n.isRead);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchNotifications();
		setRefreshing(false);
	};

	const getNotificationIcon = (type) => {
		switch (type) {
			case "like":    return <FiHeart className="text-red-500" />;
			case "comment": return <FiMessageCircle className="text-blue-500" />;
			case "follow":  return <FiUserPlus className="text-green-500" />;
			default:        return <FiBell className="text-purple-500" />;
		}
	};

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = Math.floor((now - date) / 1000); // secondes
		if (diff < 60) return "À l'instant";
		if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
		if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
		return date.toLocaleDateString('fr-FR');
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					{t('notifications.title')}
				</h1>
				<div className="flex items-center gap-3">
					<button
						onClick={handleRefresh}
						disabled={refreshing}
						className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
						title="Actualiser"
					>
						<FiRefreshCw className={`text-xl ${refreshing ? 'animate-spin' : ''}`} />
					</button>
					{unreadCount > 0 && (
						<button
							onClick={markAllNotificationsAsRead}
							className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
						>
							{t('notifications.markAllRead')}
						</button>
					)}
				</div>
			</div>

			{/* TABS */}
			<div className="flex gap-4 mb-6 border-b dark:border-gray-700">
				{["all", "unread"].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`pb-2 px-1 font-medium transition ${
							activeTab === tab
								? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
								: "text-gray-600 dark:text-gray-400 hover:text-blue-600"
						}`}
					>
						{tab === "all"
							? `${t('notifications.all')} (${notifications.length})`
							: `${t('notifications.unread')} (${unreadCount})`}
					</button>
				))}
			</div>

			{/* LISTE */}
			<div className="space-y-3">
				{filteredNotifications.length === 0 ? (
					<div className="text-center py-12 text-gray-500 dark:text-gray-400">
						<FiBell className="text-5xl mx-auto mb-3 text-gray-300 dark:text-gray-600" />
						<p className="text-lg">{t('notifications.noNotifications')}</p>
					</div>
				) : (
					filteredNotifications.map((notif) => (
						<div
							key={notif.id}
							onClick={() => !notif.isRead && markNotificationAsRead(notif.id)}
							className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition shadow-sm ${
								notif.isRead
									? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
									: "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
							}`}
						>
							{/* ICONE TYPE */}
							<div className="text-xl flex-shrink-0">
								{getNotificationIcon(notif.type)}
							</div>

							{/* AVATAR SENDER */}
							{notif.sender ? (
								<Link
									to={`/profile/${notif.sender.username}`}
									onClick={(e) => e.stopPropagation()}
								>
									<img
										src={notif.sender.avatar || `https://ui-avatars.com/api/?name=${notif.sender.firstName || notif.sender.username}&background=3b82f6&color=fff`}
										alt={notif.sender.username}
										className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:opacity-80 transition"
									/>
								</Link>
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
									<FiBell className="text-gray-400" />
								</div>
							)}

							{/* CONTENU */}
							<div className="flex-1 min-w-0">
								<p className="text-gray-800 dark:text-gray-200 text-sm">
									{notif.sender && (
										<Link
											to={`/profile/${notif.sender.username}`}
											onClick={(e) => e.stopPropagation()}
											className="font-semibold hover:underline"
										>
											{notif.sender.firstName} {notif.sender.lastName}
										</Link>
									)}{" "}
									{notif.content}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
									{formatDate(notif.createdAt)}
								</p>
							</div>

							{/* BADGE NON LU */}
							{!notif.isRead && (
								<div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0" />
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}
