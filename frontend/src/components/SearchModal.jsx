import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { searchAPI } from "../services/api";

export default function SearchModal({ isOpen, onClose }) {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Rechercher les utilisateurs 42 quand la query change
	useEffect(() => {
		if (query.trim() === '') {
			setUsers([]);
			setError(null);
			return;
		}

		const searchUsers = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await searchAPI.search42Users(query);
				setUsers(response.users || []);
			} catch (err) {
				console.error(t('search.errorSearching'), err);
				setError(err.message || t('search.errorSearching'));
				setUsers([]);
			} finally {
				setLoading(false);
			}
		};

		// Debounce de 800ms pour réduire les appels API
		const timeoutId = setTimeout(searchUsers, 800);
		return () => clearTimeout(timeoutId);
	}, [query]);

	// Fermer avec ESC
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};
		
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}
		
		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-start justify-center pt-20 px-4"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl animate-slide-down"
				onClick={(e) => e.stopPropagation()}
			>
				{/* HEADER */}
				<div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
					<FiSearch className="text-gray-400 dark:text-gray-500 text-xl flex-shrink-0" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder={t('search.placeholder')}
						className="flex-1 outline-none text-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
						autoFocus
					/>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
					>
						<FiX className="text-2xl" />
					</button>
				</div>

				{/* RESULTS */}
				<div className="max-h-96 overflow-y-auto">
					{loading ? (
						<div className="p-8 text-center text-gray-500 dark:text-gray-400">
							<FiLoader className="text-4xl mx-auto mb-2 text-gray-300 dark:text-gray-600 animate-spin" />
							<p>{t('search.searching')}</p>
						</div>
					) : error ? (
						<div className="p-8 text-center text-red-500 dark:text-red-400">
							<p>{error}</p>
						</div>
					) : query.length > 0 ? (
						users.length > 0 ? (
							<div className="py-2">
								{users.map((user) => (
									<div
										key={user.id}
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
									>
										<img
											src={user.avatar || '/default-avatar.png'}
											alt={user.login}
											className="w-12 h-12 rounded-full object-cover"
										/>
										<div className="flex-1">
											<p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">@{user.login}</p>
										</div>
										<div className="text-right">
											<p className="text-sm text-gray-500 dark:text-gray-400">{user.campus}</p>
											<p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
												{t('search.level')} {user.level.toFixed(2)}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-8 text-center text-gray-500 dark:text-gray-400">
								<FiSearch className="text-4xl mx-auto mb-2 text-gray-300 dark:text-gray-600" />
								<p>{t('search.noResults', { query })}</p>
							</div>
						)
					) : (
						<div className="p-8 text-center text-gray-400 dark:text-gray-500">
							<FiSearch className="text-4xl mx-auto mb-2 text-gray-300 dark:text-gray-600" />
							<p>{t('search.typeToSearch')}</p>
							<p className="text-xs mt-2">{t('search.pressEsc')}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
