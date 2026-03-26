# Quick Start - Incompatibilités API BFF

## 🔴 12 Incompatibilités Critiques

### 1. **Pagination par DATE, pas par PAGE**
```javascript
AVANT: GET /posts?page=1&limit=10
APRÈS: GET /post?date=2026-03-26T00:00:00Z&limit=10
```
- Impact: Feed.jsx, Profile posts, Commentaires
- Action: Redesigner infinite scroll avec dates

---

### 2. **Routes avec userId, pas username**
```javascript
AVANT: GET /users/john
APRÈS: GET /user/123
```
- Impact: Profile, PublicProfile, Search
- Action: Récupérer userId avant de faire requête

---

### 3. **Likes routes complètement changées**
```javascript
AVANT: 
  POST /posts/:postId/like
  DELETE /posts/:postId/like

APRÈS:
  POST /like { "postId": "..." }
  DELETE /like/post/:postId
```
- Impact: PostCard.jsx, AppContext
- Action: Refactoriser service likes

---

### 4. **OAuth 42 en 2 étapes**
```javascript
ÉTAPE 1: GET /register/42 → récupère {login, email, avatar}
ÉTAPE 2: POST /register (FormData) → enregistrement final
```
- Impact: Register42.jsx
- Action: Créer flow en 2 étapes

---

### 5. **FormData pour User + Avatar**
```javascript
AVANT: PATCH /users/me { "firstName": "..." }
APRÈS: PUT /user/:userId 
        formData { "user": {...}, "avatar": File }
```
- Impact: Settings.jsx, Profile update
- Action: Utiliser FormData partout

---

### 6. **Routes Auth simplifiées**
```javascript
AVANT:
  POST /auth/login
  POST /auth/42/callback
  POST /auth/42/confirm

APRÈS:
  POST /auth/ { email, password }
  GET  /auth/42
  PUT  /auth/ { password, newPassword }
```
- Impact: Login.jsx
- Action: Refactoriser services auth

---

### 7. **Commentaires: page → date**
```javascript
GET /comments/post/:postId?page=1&limit=20
GET /comment/post/:postId?date=ISO&limit=20
```
- Impact: CommentSection.jsx
- Action: Adapter pagination

---

### 8. **Followers routes changées**
```javascript
AVANT: GET /users/:username/followers
APRÈS: GET /social/followers (connecté uniquement)
```
- Impact: Followers.jsx, PublicProfile
- Action: Utiliser /social/ seulement pour l'user connecté

---

### 9. **Structure posts: _count → direct**
```javascript
AVANT: { _count: { likes: 5, comments: 3 } }
APRÈS: { likesCount: 5, commentsCount: 3 }
```
- Impact: Tous les fichiers parsing posts
- Action: Refactoriser parseurs

---

### 10. **Search 42 Users API**
```javascript
AVANT: GET /search/42users?query=john
APRÈS: GET /search42Users/john
```
- Impact: SearchFilter.jsx, SearchModal.jsx
- Action: Adapter endpoint

---

### 11. **Comments singulier**
```javascript
/comments/ → /comment/
```
- Impact: Tous appels comments
- Action: Renommer dans api.js

---

### 12. **Avatars dual format**
```javascript
// Avatar 42
https://cdn.intra.42.fr/...

// Avatar serveur
https://localhost:3000/files/avatars/abc-123_1234567.jpg
```
- Impact: Affichage avatars partout
- Action: Fonction normaliser avatars

---

## 📊 Changements par Fichier

| Fichier | Changements | Priority |
|---------|-------------|----------|
| `api.js` | 100% - Refactoriser tous services | 🔴 |
| `AppContext.jsx` | Fetch posts, likes, comments | 🔴 |
| `Feed.jsx` | Pagination date + 2 boutons | 🔴 |
| `Profile.jsx` | userId, media format, stats | 🔴 |
| `Login.jsx` | OAuth flow, /auth/ POST | 🔴 |
| `Register.jsx` | FormData + avatar optionnel | 🔴 |
| `PostCard.jsx` | Nouveau format likes | 🔴 |
| `CommentSection.jsx` | Pagination date comments | 🟠 |
| `Followers.jsx` | Routes /social/, userId | 🟠 |
| `Settings.jsx` | FormData profile update | 🟠 |
| `SearchModal.jsx` | /search42Users/:login | 🟢 |
| `Messages.jsx` | À vérifier | 🟢 |

---

## 🚀 Ordre de Refactorisation Recommandé

1. **Services (api.js)** - 2-3 jours
   - Toutes les routes API

2. **Context (AppContext.jsx)** - 1-2 jours
   - Post fetching, likes, profile

3. **Main pages** - 3-4 jours
   - Feed.jsx (pagination date)
   - Profile.jsx (userId)
   - Login.jsx (OAuth)

4. **Secondary pages** - 1-2 jours
   - Followers, Settings, Comments

5. **Polish & Tests** - 2 jours

---

## ✅ Checklist Rapide

### Services
- [ ] POST /auth/ pour login
- [ ] PUT /auth/ pour change password
- [ ] GET /auth/42 pour OAuth
- [ ] POST /register pour register FormData
- [ ] GET /user/:userId pour user data
- [ ] PUT /user/:userId pour profile update FormData
- [ ] GET /post?date=...&limit=... pour feed
- [ ] POST /like et DELETE /like/post/:postId
- [ ] GET /comment/post/:postId?date=...&limit=...
- [ ] GET /social/followers et GET /social/friends
- [ ] POST/DELETE /social/user/:userId

### Pages
- [ ] Feed: 2 boutons (Refresh + Load More)
- [ ] Profile: userId, media structure
- [ ] Followers: nouvelles routes
- [ ] Login: OAuth 2 étapes
- [ ] Comments: pagination date

---

## 💾 Code Template: Service Migration

```javascript
// AVANT
export const postsAPI = {
  getFeed: async (page = 1, limit = 10) => {
    return fetchWithAuth(`/posts?page=${page}&limit=${limit}`);
  },
};

// APRÈS
export const postsAPI = {
  getFeed: async (date = null, limit = 10) => {
    const dateParam = date ? `date=${date}` : '';
    const limitParam = `limit=${limit}`;
    const query = [dateParam, limitParam].filter(Boolean).join('&');
    return fetchWithAuth(`/post?${query}`);
  },
};

// Dans la composante
const [lastPostDate, setLastPostDate] = useState(null);

const refreshFeed = () => {
  // Sans date = les posts les plus récents
  const posts = await postsAPI.getFeed(null, 10);
  setLastPostDate(posts[posts.length - 1].createdAt);
};

const loadMorePosts = () => {
  // Avec date du dernier post = posts antérieurs
  const more = await postsAPI.getFeed(lastPostDate, 10);
  setLastPostDate(more[more.length - 1].createdAt);
};
```

---

## 🎯 Effort Estimé

- **Petite équipe (1 dev)**: 10-12 jours
- **Équipe normale (2-3 devs)**: 5-6 jours en parallèle
- **Grosse équipe (3+ devs)**: 3-4 jours avec bonne coordination

**Risque**: Moyen-Haut (changements structurels)  
**Recommandation**: Prévoir 1-2 jours buffer pour tests/fixes

---

## 📎 Voir aussi

- `BFF_MIGRATION_GUIDE.md` - Guide complet (détails & rationale)
- `backend/API_DOCUMENTATION.md` - Doc API actuelle
- Request BFF - Documentation fournie en JSON

