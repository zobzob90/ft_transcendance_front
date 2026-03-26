/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 00:01:19 by eric              #+#    #+#             */
/*   Updated: 2026/03/26 13:38:49 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function Input({ label, type, value, onChange, placeholder, required, name, hint })
{
	return (
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				{label}
			</label>
			{hint && (
				<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
					{hint}
				</p>
			)}
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
}

export function Button({ children, type = "button", variant = "blue", disabled = false, onClick })
{
	const colors = 
	{
		blue: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
		green: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
	};
	return (
	<button
		type={type}
		disabled={disabled}
		onClick={onClick}
		className={`w-full ${colors[variant]} text-white py-2 rounded transition mb-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
	>
		{children}
	</button>
	);
}