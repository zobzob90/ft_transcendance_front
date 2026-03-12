/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PublicProfile.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/12 16:02:01 by eric              #+#    #+#             */
/*   Updated: 2026/03/12 16:17:26 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { profileAPI  } from '../../services/api';
import PostCard	from '../../components/PostCard';

