/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/27 14:03:24 by eric              #+#    #+#             */
/*   Updated: 2026/01/27 14:05:27 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useParams } from "react-router-dom";

export default function Profile()
{
	const { login } = useParams();
	return <h1>Profile Page: {login}</h1>;
}
