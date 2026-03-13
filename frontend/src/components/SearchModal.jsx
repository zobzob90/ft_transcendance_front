import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { searchAPI } from "../services/api";

export default function SearchModal({ isOpen, onClose }) {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const [localUsers, setLocalUsers] = useState([]);
	const [intraUsers, setIntraUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (query.trim() === '') {
			setLocalUsers([]);
			setIntraUsers([]);
			setError(null);
			return;
		}

		const searchUsers = async () => {
			setLoading(true);
			setError(null);
			try {
				// Recherche en parallèle : BDD locale + intra 42
				const [localRes, intraRes] = await Promise.allSettled([
					searchAPI.searchLocalUsers(query),
					searchAPI.search42Users(query),
				]);

				const local = localRes.status === 'fulfilled' ? (localRes.value.users || []) : [];
				const intra = intraRes.status === 'fulfilled' ? (intraRes.value.users || []) : [];

				setLocalUsers(local);

				// Exclure de l'intra les users déjà dans la BDD locale (même username/login)
				const localUsernames = new Set(local.map(u => u.username.toLowerCase()));
				setIntraUsers(intra.filter(u => !localUsernames.has(u.login.toLowerCase())));
			} catch (err) {
				setError(t('search.errorSearching'));
			} finally {
				setLoading(false);
			}
		};

		const timeoutId = setTimeout(searchUsers, 500);
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

	const totalResults = localUsers.length + intraUsers.length;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[60] flex items-start justify-center pt-20 px-4"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl"
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
					{query && (
						<button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
							<FiX className="text-xl" />
						</button>
					)}
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
						<FiX className="text-2xl" />
					</button>
				</div>

				{/* RESULTS */}
				<div className="max-h-[60vh] overflow-y-auto">
					{loading ? (
						<div className="p-8 text-center text-gray-500 dark:text-gray-400">
							<FiLoader className="text-4xl mx-auto mb-2 animate-spin" />
							<p>{t('search.searching')}</p>
						</div>
					) : error ? (
						<div className="p-8 text-center text-red-500">{error}</div>
					) : query.length > 0 ? (
						totalResults > 0 ? (
							<div className="py-2">
								{/* Utilisateurs inscrits sur 42Hub */}
								{localUsers.length > 0 && (
									<>
										<p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
											Sur 42Hub
										</p>
										{localUsers.map((user) => (
											<Link
												key={user.id}
												to={`/profile/${user.username}`}
												onClick={onClose}
												className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
											>
												<img
													src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName || user.username}&background=3b82f6&color=fff`}
													alt={user.username}
													className="w-12 h-12 rounded-full object-cover"
												/>
												<div className="flex-1">
													<p className="font-semibold text-gray-900 dark:text-white">
														{user.firstName} {user.lastName}
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
												</div>
												<div className="text-right">
													{user.campus && <p className="text-sm text-gray-500 dark:text-gray-400">{user.campus}</p>}
													{user.level && (
														<p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
															{t('search.level')} {Number(user.level).toFixed(2)}
														</p>
													)}
												</div>
												<span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
													42Hub
												</span>
											</Link>
										))}
									</>
								)}

								{/* Utilisateurs intra 42 non inscrits */}
								{intraUsers.length > 0 && (
									<>
										<p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t dark:border-gray-700 mt-2 pt-3">
											Intra 42
										</p>
										{intraUsers.map((user) => (
											<div
												key={user.id}
												className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition opacity-70"
											>
												<img
													src={user.avatar || `https://ui-avatars.com/api/?name=${user.login}&background=6b7280&color=fff`}
													alt={user.login}
													className="w-12 h-12 rounded-full object-cover"
												/>
												<div className="flex-1">
													<p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">@{user.login}</p>
												</div>
												<div className="text-right">
													<p className="text-sm text-gray-500 dark:text-gray-400">{user.campus}</p>
													{user.level > 0 && (
														<p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
															{t('search.level')} {user.level.toFixed(2)}
														</p>
													)}
												</div>
												<span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
													Intra
												</span>
											</div>
										))}
									</>
								)}
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
