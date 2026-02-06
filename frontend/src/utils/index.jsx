/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/06 00:01:19 by eric              #+#    #+#             */
/*   Updated: 2026/02/06 12:47:16 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function Input({ label, type, value, onChange, placeholder, required })
{
	return (
		<div className="mb-4">
			<label className="block text-sm font-medium mb-1">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-blue-300"
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
}

export function Button({ children, type = "button", variant = "blue" })
{
	const colors = 
	{
		blue: "bg-blue-600 hover:bg-blue-700",
		green: "bg-green-600 hover:bg-green-700"
	};
	return (
	<button
		type={type}
		className={`w-full ${colors[variant]} text-white py-2 rounded transition mb-4`}
	>
		{children}
	</button>
	);
}