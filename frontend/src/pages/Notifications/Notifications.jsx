/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Notifications.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 14:30:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:58:33 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/AppContext";
import FloatingChat from "../../components/FloatingChat";
import { FiHeart, FiMessageCircle as FiMessageCircleIcon, FiUserPlus, FiCheckCircle, FiBell, FiMessageCircle } from "react-icons/fi";

export default function Notifications() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("all"); // all | unread
	const [isChatOpen, setIsChatOpen] = useState(false);
	const { 
		notifications, 
		markNotificationAsRead, 
		markAllNotificationsAsRead 
	} = useAppContext();

	const filteredNotifications =
		activeTab === "all"
			? notifications
			: notifications.filter((n) => !n.isRead);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const markAsRead = (id) => {
		markNotificationAsRead(id);
	};

	const markAllAsRead = () => {
		markAllNotificationsAsRead();
	};

	const getNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <FiHeart className="text-red-500" />;
			case "comment":
				return <FiMessageCircleIcon className="text-blue-500" />;
			case "follow":
				return <FiUserPlus className="text-green-500" />;
			case "system":
				return <FiBell className="text-purple-500" />;
			default:
				return <FiCheckCircle className="text-gray-500" />;
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('notifications.title')}</h1>
				{unreadCount > 0 && (
					<button
						onClick={markAllAsRead}
						className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
					>
						{t('notifications.markAllRead')}
					</button>
				)}
			</div>

			{/* TABS */}
			<div className="flex gap-4 mb-6 border-b dark:border-gray-700">
				<button
					onClick={() => setActiveTab("all")}
					className={`pb-2 px-1 font-medium transition ${
						activeTab === "all"
							? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
							: "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
					}`}
				>
					{t('notifications.all')} ({notifications.length})
				</button>
				<button
					onClick={() => setActiveTab("unread")}
					className={`pb-2 px-1 font-medium transition ${
						activeTab === "unread"
							? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
							: "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
					}`}
				>
					{t('notifications.unread')} ({unreadCount})
				</button>
			</div>

			{/* NOTIFICATIONS LIST */}
			<div className="space-y-3">
				{filteredNotifications.length === 0 ? (
					<div className="text-center py-12 text-gray-500 dark:text-gray-400">
						<p className="text-lg">{t('notifications.noNotifications')}</p>
					</div>
				) : (
					filteredNotifications.map((notif) => (
						<div
							key={notif.id}
							onClick={() => !notif.isRead && markAsRead(notif.id)}
							className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition shadow-sm ${
								notif.isRead
									? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
									: "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
							}`}
						>
							{/* ICON */}
							<div className="flex-shrink-0 text-xl">
								{getNotificationIcon(notif.type)}
							</div>

							{/* AVATAR */}
							<img
								src={notif.avatar}
								alt=""
								className="w-10 h-10 rounded-full object-cover flex-shrink-0"
							/>

							{/* CONTENT */}
							<div className="flex-1 min-w-0">
								{notif.type === "system" ? (
									<p className="text-gray-800 dark:text-gray-200 text-sm">{notif.content}</p>
								) : (
									<p className="text-gray-800 dark:text-gray-200 text-sm">
										<span className="font-semibold">{notif.user}</span>{" "}
										{notif.content}
									</p>
								)}
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
									{new Date(notif.createdAt).toLocaleString('fr-FR')}
								</p>
							</div>

							{/* UNREAD BADGE */}
							{!notif.isRead && (
								<div className="flex-shrink-0">
									<div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
								</div>
							)}
						</div>
					))
				)}
			</div>

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
		</div>
	);
}
