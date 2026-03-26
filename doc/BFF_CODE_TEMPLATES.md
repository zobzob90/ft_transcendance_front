# Code Templates & Patterns Pour Migration BFF

## 📋 Estructura des Services (api.js)

### Template: Service avec Date Pagination
```javascript
// ============================================
// API POST - DATE-BASED PAGINATION
// ============================================

export const postsAPI = {
  // Récupérer le feed
  getFeed: async (dateString = null, limit = 10) => {
    const params = new URLSearchParams();
    
    // Si date fournie, charger les posts AVANT cette date
    // Sinon, charger les posts les plus récents
    if (dateString) {
      params.append('date', dateString);
    }
    
    params.append('limit', limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/post?${queryString}` : '/post';
    
    return fetchWithAuth(endpoint);
  },

  // Créer un post (FormData)
  createPost: async (content, mediaFile = null) => {
    const formData = new FormData();
    
    // Ajouter le contenu s'il existe
    if (content) {
      formData.append('post', JSON.stringify({ content }));
    }
    
    // Ajouter le média s'il existe (.jpg, .jpeg, .png, .pdf)
    if (mediaFile) {
      formData.append('media', mediaFile);
    }
    
    // Au moins l'un des deux doit exister
    if (!content && !mediaFile) {
      throw new Error('Post doit avoir du contenu ou un média');
    }
    
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erreur création post');
    }
    
    return response.json();
  },

  // Mettre à jour un post (FormData)
  updatePost: async (postId, content = null, mediaFile = null) => {
    const formData = new FormData();
    
    if (content) {
      formData.append('post', JSON.stringify({ content }));
    }
    
    if (mediaFile) {
      formData.append('media', mediaFile);
    }
    
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erreur modification post');
    }
    
    return response.json();
  },
};
```

---

## 📱 Hook: Pagination avec Dates

```javascript
// hooks/useDatePagination.js

import { useState, useCallback } from 'react';

/**
 * Hook pour gérer la pagination basée sur les dates
 * 
 * Usage:
 * const {
 *   items,
 *   isLoading,
 *   hasMore,
 *   refresh,
 *   loadMore,
 * } = useDatePagination(apiCall, limit);
 */
export function useDatePagination(apiCall, limit = 10) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDate, setLastDate] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Rafraîchir: charger les posts les plus récents
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const newItems = await apiCall(null, limit); // null = pas de date
      
      if (newItems.length > 0) {
        setItems(newItems);
        // Sauvegarder la date du dernier item pour "charger plus"
        setLastDate(newItems[newItems.length - 1].createdAt);
        setHasMore(newItems.length >= limit);
      } else {
        setItems([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur refresh:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, limit]);

  // Charger plus: charger les posts AVANT lastDate
  const loadMore = useCallback(async () => {
    if (!hasMore || !lastDate || isLoading) return;
    
    setIsLoading(true);
    try {
      const moreItems = await apiCall(lastDate, limit);
      
      if (moreItems.length > 0) {
        setItems(prev => [...prev, ...moreItems]);
        setLastDate(moreItems[moreItems.length - 1].createdAt);
        setHasMore(moreItems.length >= limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur load more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [lastDate, limit, hasMore, isLoading, apiCall]);

  return {
    items,
    isLoading,
    hasMore,
    refresh,
    loadMore,
  };
}
```

---

## 🎨 Composante: Pagination UI

```javascript
// components/DatePaginationButtons.jsx

import { FiRefreshCw, FiDownload } from 'react-icons/fi';

export function DatePaginationButtons({
  onRefresh,
  onLoadMore,
  isLoading,
  hasMore,
  disabled = false,
}) {
  return (
    <div className="flex gap-4 justify-center my-6">
      {/* Bouton Rafraîchir */}
      <button
        onClick={onRefresh}
        disabled={isLoading || disabled}
        className="flex items-center gap-2 px-6 py-2 bg-blue-500 
                   text-white rounded-lg hover:bg-blue-600 
                   disabled:opacity-50 transition"
      >
        <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
        Rafraîchir
      </button>

      {/* Bouton Charger Plus */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading || disabled}
          className="flex items-center gap-2 px-6 py-2 bg-gray-500 
                     text-white rounded-lg hover:bg-gray-600 
                     disabled:opacity-50 transition"
        >
          <FiDownload />
          Charger plus
        </button>
      )}

      {!hasMore && (
        <p className="text-gray-500 italic">Pas plus de posts</p>
      )}
    </div>
  );
}
```

---

## 🔄 Utilitaire: FormData Builder

```javascript
// utils/formDataBuilder.js

/**
 * Constructeur de FormData avec support des champs optionnels
 * 
 * Example:
 * const formData = buildFormData({
 *   user: { firstname, lastname, email },
 *   avatar: File,
 * });
 */
export function buildFormData(data) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue; // Skip champs vides
    }

    // Si c'est un objet (user data)
    if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
    // Si c'est un fichier
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // Sinon (string, number, etc)
    else {
      formData.append(key, value);
    }
  }

  return formData;
}

/**
 * Alternative plus simple pour FormData avec validation
 */
export function buildProfileUpdateFormData(userData, avatarFile = null) {
  const formData = new FormData();

  // Ajouter les données user (seulement les champs qui changent)
  const userObject = {};
  if (userData.username) userObject.username = userData.username;
  if (userData.firstname) userObject.firstname = userData.firstname;
  if (userData.lastname) userObject.lastname = userData.lastname;
  if (userData.mail) userObject.mail = userData.mail;

  // Ajouter user object
  if (Object.keys(userObject).length > 0) {
    formData.append('user', JSON.stringify(userObject));
  }

  // Ajouter avatar si fourni
  if (avatarFile) {
    formData.append('avatar', avatarFile);
  }

  return formData;
}
```

---

## 🖼️ Utilitaire: Avatar Handling

```javascript
// utils/avatarUtils.js

/**
 * Normaliser une URL d'avatar (gère 2 formats différents)
 */
export function normalizeAvatarUrl(avatar, fallbackName = 'User') {
  if (!avatar) {
    return `https://ui-avatars.com/api/?name=${fallbackName}&background=3b82f6&color=fff`;
  }

  // Si c'est déjà une URL valide (42 ou serveur)
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // Si c'est juste un filename (ancien format)
  const filename = avatar.split('/').pop();
  return `https://localhost:3000/files/avatars/${filename}`;
}

/**
 * Déterminer si un avatar est local (serveur) ou externe (42)
 */
export function isLocalAvatar(avatar) {
  if (!avatar) return false;
  return avatar.startsWith('https://localhost') ||
         avatar.startsWith('http://localhost') ||
         !avatar.startsWith('http');
}

/**
 * Déterminer si un avatar est de 42
 */
export function is42Avatar(avatar) {
  return avatar?.includes('cdn.intra.42.fr');
}

/**
 * Hook React pour normaliser l'avatar
 */
import { useMemo } from 'react';

export function useNormalizedAvatar(avatar, fallbackName = 'User') {
  return useMemo(() => {
    return normalizeAvatarUrl(avatar, fallbackName);
  }, [avatar, fallbackName]);
}
```

---

## 🔐 Utilitaire: UserId Cache

```javascript
// utils/userIdCache.js

/**
 * Cache pour mapper username → userId
 * Évite les lookups répétés
 */
class UserIdCache {
  constructor() {
    this.cache = new Map();
    this.users = []; // List de tous les users
  }

  // Ajouter plusieurs users à la fois
  setUsers(usersList) {
    this.users = usersList;
    usersList.forEach(user => {
      this.cache.set(user.username.toLowerCase(), user.id);
    });
  }

  // Trouver un userId par username
  getUserId(username) {
    return this.cache.get(username.toLowerCase());
  }

  // Chercher un user complet par username
  findUser(username) {
    return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  // Vider le cache
  clear() {
    this.cache.clear();
    this.users = [];
  }
}

export const userIdCache = new UserIdCache();
```

**Usage dans AppContext:**
```javascript
import { userIdCache } from '../utils/userIdCache';

// Au démarrage, charger tous les users
useEffect(() => {
  const loadUserIds = async () => {
    try {
      const allUsers = await userAPI.getAllUsers();
      userIdCache.setUsers(allUsers);
    } catch (error) {
      console.error('Erreur chargement users:', error);
    }
  };
  loadUserIds();
}, []);

// Plus tard, utiliser le cache
const userId = userIdCache.getUserId(username);
if (userId) {
  const user = await userAPI.getUser(userId);
}
```

---

## 🧪 Tests: Pagination Date

```javascript
// __tests__/useDatePagination.test.js

import { renderHook, act, waitFor } from '@testing-library/react';
import { useDatePagination } from '../hooks/useDatePagination';

describe('useDatePagination', () => {
  it('devrait charger les items au refresh', async () => {
    const mockData = [
      { id: 1, content: 'Post 1', createdAt: '2026-03-26T12:00:00Z' },
      { id: 2, content: 'Post 2', createdAt: '2026-03-26T11:00:00Z' },
    ];
    
    const mockApiCall = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useDatePagination(mockApiCall, 2));
    
    await act(async () => {
      await result.current.refresh();
    });
    
    expect(result.current.items).toEqual(mockData);
    expect(mockApiCall).toHaveBeenCalledWith(null, 2);
  });

  it('devrait charger plus avec la date du dernier item', async () => {
    const firstLoad = [
      { id: 1, content: 'Post 1', createdAt: '2026-03-26T12:00:00Z' },
      { id: 2, content: 'Post 2', createdAt: '2026-03-26T11:00:00Z' },
    ];
    
    const secondLoad = [
      { id: 3, content: 'Post 3', createdAt: '2026-03-26T10:00:00Z' },
      { id: 4, content: 'Post 4', createdAt: '2026-03-26T09:00:00Z' },
    ];
    
    const mockApiCall = jest.fn()
      .mockResolvedValueOnce(firstLoad)
      .mockResolvedValueOnce(secondLoad);
    
    const { result } = renderHook(() => useDatePagination(mockApiCall, 2));
    
    // First load
    await act(async () => {
      await result.current.refresh();
    });
    
    // Load more
    await act(async () => {
      await result.current.loadMore();
    });
    
    expect(result.current.items).toEqual([...firstLoad, ...secondLoad]);
    expect(mockApiCall).toHaveBeenLastCalledWith('2026-03-26T11:00:00Z', 2);
  });
});
```

---

## 📝 Checklist: Profile Update

```javascript
// Exemple complet: Mise à jour profil avec avatar

async function updateUserProfile(userId, updates) {
  const formData = buildProfileUpdateFormData(
    {
      username: updates.username,
      firstname: updates.firstName,
      lastname: updates.lastName,
      mail: updates.email,
    },
    updates.avatarFile // File object or null
  );

  try {
    await userAPI.updateProfile(userId, formData);
    
    // Mettre à jour le context
    setUser({
      ...user,
      username: updates.username || user.username,
      firstName: updates.firstName || user.firstName,
      lastName: updates.lastName || user.lastName,
      email: updates.email || user.email,
      avatar: updates.avatarFile 
        ? URL.createObjectURL(updates.avatarFile)
        : user.avatar,
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Patterns: Erreurs Courantes à Éviter

### ❌ Erreur 1: Oublier FormData
```javascript
// MAUVAIS
await fetch('/user/123', {
  method: 'PUT',
  body: JSON.stringify({ username: 'new' }), // ❌ String au lieu de FormData
});

// BON
const formData = new FormData();
formData.append('user', JSON.stringify({ username: 'new' }));
await fetch('/user/123', {
  method: 'PUT',
  body: formData, // ✅ FormData
});
```

### ❌ Erreur 2: UserId vs Username
```javascript
// MAUVAIS
const user = await userAPI.getUser('john'); // ❌ Username

// BON
const userId = userIdCache.getUserId('john');
const user = await userAPI.getUser(userId); // ✅ UserId
```

### ❌ Erreur 3: Pagination classique
```javascript
// MAUVAIS
const feed = await postsAPI.getFeed(2, 10); // ❌ Page 2

// BON
const feed = await postsAPI.getFeed('2026-03-26T10:00:00Z', 10); // ✅ Date
```

### ❌ Erreur 4: Avatar Format
```javascript
// MAUVAIS (ne gère qu'un format)
<img src={user.avatar} />

// BON (gère les deux)
<img src={normalizeAvatarUrl(user.avatar, user.firstName)} />
```

### ❌ Erreur 5: Likes endpoint ancien
```javascript
// MAUVAIS
await likesAPI.likePost(postId); // ❌ Old route

// BON
await likesAPI.like(postId); // ✅ New route with proper structure
```

---

## CLI: Script de Migration

```bash
#!/bin/bash
# scripts/migrate-api.sh

echo "🚀 Démarrage migration BFF..."

# Step 1: Backup
git add .
git commit -m "backup: avant migration BFF"
git branch backup-pre-bff

# Step 2: Checkout feature branch
git checkout -b feat/bff-migration

# Step 3: Refactor api.js
echo "📝 Refactorisant api.js..."
# (mannuel pour maintenant)

# Step 4: Run tests
echo "🧪 Exécution tests..."
npm test -- api.js

# Step 5: Run linter
echo "🔍 Linting code..."
npm run lint

echo "✅ Préparation terminée!"
echo "Prochaine étape: Refactoriser AppContext.jsx"
```

---

## 📦 Installation de dépendances (si nécessaire)

```bash
# Aucune nouvelle dépendance requise!
# Tous les patterns utilisent React/JS built-ins

npm test  # Devrait faire fonctionner tests existants
npm run lint  # Devrait passer après refactor
```

---

