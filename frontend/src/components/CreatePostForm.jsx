/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CreatePostForm.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 16:21:28 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:36:32 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiSend, FiImage, FiFileText, FiX } from "react-icons/fi";

export default function CreatePostForm({ onSubmit })
{
	const { t } = useTranslation();
	const [content, setContent] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const fileInputRef = useRef(null);
	
	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		const validFiles = files.filter(file => {
			const isImage = file.type.startsWith('image/');
			const isPDF = file.type === 'application/pdf';
			const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
			return (isImage || isPDF) && isValidSize;
		});
		setSelectedFiles(prev => [...prev, ...validFiles]);
	};
	
	const removeFile = (index) => {
		setSelectedFiles(prev => prev.filter((_, i) => i !== index));
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (content.trim() === "" && selectedFiles.length === 0)
			return;
		onSubmit({ content, files: selectedFiles });
		setContent("");
		setSelectedFiles([]);
	};
	
	return (
		<form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder={t('post.create')}
				className="w-full p-3 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
				rows="3"
			/>
			
			{/* Prévisualisation des fichiers sélectionnés */}
			{selectedFiles.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-2">
					{selectedFiles.map((file, index) => (
						<div key={index} className="relative bg-gray-100 dark:bg-gray-700 rounded p-2 flex items-center space-x-2">
							{file.type.startsWith('image/') ? (
								<FiImage className="text-blue-500" />
							) : (
								<FiFileText className="text-red-500" />
							)}
							<span className="text-sm text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{file.name}</span>
							<button
								type="button"
								onClick={() => removeFile(index)}
								className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
							>
								<FiX size={16} />
							</button>
						</div>
					))}
				</div>
			)}
			
			<div className="mt-3 flex items-center justify-between">
				<div className="flex space-x-2">
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*,.pdf"
						onChange={handleFileSelect}
						className="hidden"
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition flex items-center space-x-1"
						title="Ajouter une image"
					>
						<FiImage size={20} />
						<span className="text-sm">Image</span>
					</button>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition flex items-center space-x-1"
						title="Ajouter un PDF"
					>
						<FiFileText size={20} />
						<span className="text-sm">PDF</span>
					</button>
				</div>
				
				<button
					type="submit"
					disabled={content.trim() === "" && selectedFiles.length === 0}
					className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<FiSend />
					<span>{t('post.publish')}</span>
				</button>
			</div>
		</form>
	);
}
