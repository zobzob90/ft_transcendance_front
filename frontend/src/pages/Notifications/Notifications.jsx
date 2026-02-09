/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Notifications.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/09 14:30:00 by eric              #+#    #+#             */
/*   Updated: 2026/02/09 15:26:58 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { FiHeart, FiMessageCircle, FiUserPlus, FiCheckCircle } from "react-icons/fi";

const mockNotifications = [
	{
		id: 1,
		type: "like",
		user: "johndoe",
		avatar: "/avatars/john.jpg",
		message: "a aimé votre publication",
		time: "Il y a 5 min",
		isRead: false,
	},
	{
		id: 2,
		type: "comment",
		user: "janesmith",
		avatar: "/avatars/jane.jpg",
		message: "a commenté votre publication",
		time: "Il y a 15 min",
		isRead: false,
	},
	{
		id: 3,
		type: "follow",
		user: "alexmartin",
		avatar: "/avatars/alex.jpg",
		message: "a commencé à vous suivre",
		time: "Il y a 1h",
		isRead: false,
	},
	{
		id: 4,
		type: "like",
		user: "sarahlee",
		avatar: "/avatars/sarah.jpg",
		message: "a aimé votre publication",
		time: "Il y a 2h",
		isRead: true,
	},
	{
		id: 5,
		type: "comment",
		user: "mikebrown",
		avatar: "/avatars/mike.jpg",
		message: "a commenté votre publication : 'Super projet ! 🚀'",
		time: "Il y a 3h",
		isRead: true,
	},
	{
		id: 6,
		type: "follow",
		user: "emilydavis",
		avatar: "/avatars/emily.jpg",
		message: "a commencé à vous suivre",
		time: "Il y a 5h",
		isRead: true,
	},
];

export default function Notifications() {
	const [activeTab, setActiveTab] = useState("all"); // all | unread
	const [notifications, setNotifications] = useState(mockNotifications);

	const filteredNotifications =
		activeTab === "all"
			? notifications
			: notifications.filter((n) => !n.isRead);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const markAsRead = (id) => {
		setNotifications((prev) =>
			prev.map((notif) =>
				notif.id === id ? { ...notif, isRead: true } : notif
			)
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
	};

	const getNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <FiHeart className="text-red-500" />;
			case "comment":
				return <FiMessageCircle className="text-blue-500" />;
			case "follow":
				return <FiUserPlus className="text-green-500" />;
			default:
				return <FiCheckCircle className="text-gray-500" />;
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Notifications</h1>
				{unreadCount > 0 && (
					<button
						onClick={markAllAsRead}
						className="text-sm text-blue-600 hover:text-blue-700 font-medium"
					>
						Tout marquer comme lu
					</button>
				)}
			</div>

			{/* TABS */}
			<div className="flex gap-4 mb-6 border-b">
				<button
					onClick={() => setActiveTab("all")}
					className={`pb-2 px-1 font-medium transition ${
						activeTab === "all"
							? "text-blue-600 border-b-2 border-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					Toutes ({notifications.length})
				</button>
				<button
					onClick={() => setActiveTab("unread")}
					className={`pb-2 px-1 font-medium transition ${
						activeTab === "unread"
							? "text-blue-600 border-b-2 border-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					Non lues ({unreadCount})
				</button>
			</div>

			{/* NOTIFICATIONS LIST */}
			<div className="space-y-3">
				{filteredNotifications.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<p className="text-lg">Aucune notification</p>
					</div>
				) : (
					filteredNotifications.map((notif) => (
						<div
							key={notif.id}
							onClick={() => !notif.isRead && markAsRead(notif.id)}
							className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition shadow-sm ${
								notif.isRead
									? "bg-white hover:bg-gray-50"
									: "bg-blue-50 hover:bg-blue-100"
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
								<p className="text-gray-800 text-sm">
									<span className="font-semibold">{notif.user}</span>{" "}
									{notif.message}
								</p>
								<p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
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
		</div>
	);
}
