# 🔧 Fixes Requises: Frontend pour Matcher le BFF (Nouvelle Spec)

**Generated**: 26 mars 2026  
**Based on**: Spec BFF officielle de ton collègue  
**Priority**: 🔴 CRITIQUE - À fixer avant d'essayer le BFF  

---

## 🚨 3 Problèmes Critiques

### 1️⃣ **camelCase vs snake_case**

**BFF envoie:**
```json
{
  "user": {
    "id": 1,
    "username": "john",
    "firstname": "John",        // ← lowercase 'f'
    "lastname": "Doe",          // ← lowercase 'l'
    "mail": "john@example",     // ← "mail" au lieu de "email"
    "bio": "...",
    "theme": "light",
    "avatar": "...",
    "postsCount": 5,
    "followersCount": 10,
    "followingCount": 3,
    "createdAt": "2026-03-26T..."
  },
  "token": "JWT_TOKEN"
}
```

**Frontend doit adapter:**

```bash
# Fichiers à modifier:
- src/context/AppContext.jsx (setUser)
- src/services/api.js (parsers)
- src/pages/Profile/Profile.jsx (affichage user)
- src/pages/Settings/Settings.jsx (édition user)
- Tous les components qui affichent user: `${user.firstName}` → `${user.firstname}`
```

**Code Pattern:**
```javascript
// AVANT (ancien backend)
{
  id: user.id,
  firstName: user.firstName,  // ← camelCase
  lastName: user.lastName,
  email: user.email
}

// APRÈS (BFF nouveau)
{
  id: user.id,
  firstName: user.firstname,  // ← adapte snake_case du BFF
  lastName: user.lastname,
  email: user.mail
}
```

**Checklist:**
- [ ] `src/services/api.js` - normaliser user objects dans les parsers
- [ ] `src/context/AppContext.jsx` - adapter setUser
- [ ] `src/components/` - chercher tous les `user.firstName` et adapter
- [ ] `src/pages/Profile/` - adapter données user
- [ ] `src/pages/Settings/` - adapter form fields

---

### 2️⃣ **Pagination Date-Based au lieu de Page-Based** 

**BFF implémentation (CONFIRMÉE ✅):**
```javascript
// First request - get latest 10 posts
GET /post?limit=10
// Returns: [post1 (newest), post2, post3, ..., post10]

// Next request - get 10 posts created BEFORE post10
GET /post?date=2026-03-26T15:45:00Z&limit=10
// (where date = createdAt of last post from previous request)
// Returns: [post11, post12, ..., post20]
```

**Frontend envoie actuellement:**
```javascript
GET /post?page=1&limit=10  // ❌ WRONG
```

**Code à changer:**

```bash
# Fichiers à modifier:
- src/services/api.js (postsAPI.getFeed)
- src/context/AppContext.jsx (fetchPosts, loadMorePosts)
- src/pages/Feed/Feed.jsx (pagination logic)
- src/components/CommentSection.jsx (comment pagination)
```

**Exemple Fix:**
```javascript
// api.js
// AVANT
export const postsAPI = {
  getFeed: async (page = 1, limit = 10) => {
    return fetchWithAuth(`/post?page=${page}&limit=${limit}`);
  },
};

// APRÈS (date-based pagination)
export const postsAPI = {
  getFeed: async (beforeDate = null, limit = 10) => {
    let url = `/post?limit=${limit}`;
    if (beforeDate) {
      // beforeDate = createdAt of last post from previous request
      url = `/post?date=${encodeURIComponent(beforeDate)}&limit=${limit}`;
    }
    return fetchWithAuth(url);
  },
};
```

**Usage Pattern:**
```javascript
// First load
const firstPosts = await postsAPI.getFeed(null, 10);
// → GET /post?limit=10
// Returns: [post1, post2, ..., post10]

// Load more (use createdAt of last post)
const lastPostDate = firstPosts[firstPosts.length - 1].createdAt;
const morePosts = await postsAPI.getFeed(lastPostDate, 10);
// → GET /post?date=2026-03-26T15:45:00Z&limit=10
// Returns: [post11, post12, ..., post20]
```

```javascript
// AppContext.jsx
// AVANT
const [currentPage, setCurrentPage] = useState(1);

// APRÈS
const [lastPostDate, setLastPostDate] = useState(null);

// AVANT
const posts = await postsAPI.getFeed(1, 10);

// APRÈS
const posts = await postsAPI.getFeed(null, 10); // null = get latest
// Sauvegarder la date du dernier post chargé:
setLastPostDate(posts[posts.length - 1]?.createdAt);

// AVANT
const more = await postsAPI.getFeed(currentPage + 1, 10);

// APRÈS
const more = await postsAPI.getFeed(lastPostDate, 10); // date du dernier post
```

**Checklist:**
- [ ] `src/services/api.js` - postsAPI.getFeed(date, limit)
- [ ] `src/services/api.js` - commentsAPI.getCommentsByPost(date, limit)
- [ ] `src/context/AppContext.jsx` - fetchPosts() utilise dates
- [ ] `src/context/AppContext.jsx` - loadMorePosts() utilise dates
- [ ] `src/pages/Feed/Feed.jsx` - Pagination avec "Refresh" + "Load More"
- [ ] `src/components/CommentSection.jsx` - Pagination commentaires avec dates

---

### 3️⃣ **Response sans Wrapping** 

**BFF envoie (Array direct):**
```json
[
  {
    "id": 1,
    "content": "Mon post",
    "userId": 5,
    "commentsCount": 2,
    "likesCount": 3,
    "createdAt": "2026-03-26T..."
  },
  {
    "id": 2,
    ...
  }
]
```

**Frontend expect (wrappé):**
```json
{
  "posts": [
    { ... },
    { ... }
  ],
  "pagination": { ... }
}
```

**Code à changer:**

```bash
# Fichiers à modifier:
- src/context/AppContext.jsx (loadPosts)
- src/pages/Feed/Feed.jsx (data handling)
- src/pages/Profile/Profile.jsx (user posts)
```

**Exemple Fix:**
```javascript
// AVANT
const response = await postsAPI.getFeed(1, 10);
const posts = response.posts?.map(p => ({ ... }));

// APRÈS (réponse est un array direct)
const posts = await postsAPI.getFeed(null, 10);
const formatted = posts.map(p => ({
  id: p.id,
  content: p.content,
  likesCount: p.likesCount,      // Direct, pas _count
  commentsCount: p.commentsCount, // Direct, pas _count
  ...
}));
```

**Checklist:**
- [ ] `src/context/AppContext.jsx` - Handle array responses au lieu de `response.posts`
- [ ] `src/pages/Feed/Feed.jsx` - Handle array responses
- [ ] `src/pages/Profile/Profile.jsx` - Handle array responses
- [ ] `src/components/CommentSection.jsx` - Handle array responses

---

## ✅ **CE QUI EST DÉJÀ OK** (pas besoin de changer)

```javascript
// Routes
✅ POST /register
✅ GET /register/42
✅ GET /auth/42
✅ POST /auth/
✅ PUT /auth/
✅ GET /user
✅ GET /user/:userId
✅ PUT /user/:userId
✅ DELETE /user/:userId
✅ GET /post/:postId
✅ POST /post
✅ PUT /post/:postId
✅ DELETE /post/:postId
✅ POST /like
✅ DELETE /like/post/:postId
✅ GET /comment/post/:postId
✅ POST /comment/post/:postId
✅ PUT /comment/:commentId
✅ DELETE /comment/:commentId
✅ GET /social/followers
✅ GET /social/friends
✅ POST /social/user/:userId
✅ DELETE /social/user/:userId
✅ GET /search42Users/:login
✅ GET /media/user/:userId

// Response Structures
✅ Post object: id, content, userId, image, pdf, createdAt, modifiedAt, commentsCount, likesCount
✅ Comment object: id, content, userId, postId, createdAt, modifiedAt, deleted
✅ User object: id, username, email, firstname, lastname, bio, theme, avatar, postsCount, followersCount, followingCount, createdAt
✅ Error handling: {error: "..."}
```

---

## 🎯 **Par Fichier - Actions Concrètes**

### `src/services/api.js`

```javascript
// Adapter le parser de réponses user
const normalizeUser = (userData) => ({
  id: userData.id,
  username: userData.username,
  email: userData.mail,              // "mail" → "email"
  firstName: userData.firstname,      // "firstname" → "firstName"
  lastName: userData.lastname,        // "lastname" → "lastName"
  bio: userData.bio,
  theme: userData.theme,
  avatar: userData.avatar,
  postsCount: userData.postsCount,
  followersCount: userData.followersCount,
  followingCount: userData.followingCount,
  createdAt: userData.createdAt,
});

// Adapter postsAPI
export const postsAPI = {
  getFeed: async (beforeDate = null, limit = 10) => {
    let url = `/post?limit=${limit}`;
    if (beforeDate) {
      // beforeDate = createdAt of last post from previous request
      url = `/post?date=${encodeURIComponent(beforeDate)}&limit=${limit}`;
    }
    return fetchWithAuth(url);  // Retourne array direct
  },

  // ... autres méthodes
};

// Adapter commentsAPI
export const commentsAPI = {
  getCommentsByPost: async (postId, dateString = null, limit = 20) => {
    let url = `/comment/post/${postId}?limit=${limit}`;
    if (dateString) {
      url = `/comment/post/${postId}?date=${encodeURIComponent(dateString)}&limit=${limit}`;
    }
    return fetchWithAuth(url);  // Retourne array direct
  },

  // ... autres méthodes
};
```

### `src/context/AppContext.jsx`

```javascript
// Adapter pour dates au lieu de pages
const [lastPostDate, setLastPostDate] = useState(null);

const fetchPosts = useCallback(async () => {
  try {
    const posts = await postsAPI.getFeed(null, 10);  // null = latest
    
    const formatted = posts.map(p => ({
      id: p.id,
      content: p.content,
      likesCount: p.likesCount,      // Direct
      commentsCount: p.commentsCount, // Direct
      userId: p.userId,
      createdAt: p.createdAt,
    }));
    
    setPosts(formatted);
    // Sauvegarder date du dernier post
    if (formatted.length > 0) {
      setLastPostDate(formatted[formatted.length - 1].createdAt);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}, []);

const loadMorePosts = async () => {
  if (!lastPostDate) return;
  
  const more = await postsAPI.getFeed(lastPostDate, 10);
  const formatted = more.map(p => ({...}));
  
  setPosts(prev => [...prev, ...formatted]);
  if (formatted.length > 0) {
    setLastPostDate(formatted[formatted.length - 1].createdAt);
  }
};
```

### `src/pages/Feed/Feed.jsx`

```javascript
// Remplacer infinite scroll par boutons
const [lastPostDate, setLastPostDate] = useState(null);

const handleRefresh = async () => {
  const posts = await postsAPI.getFeed(null, 10);  // Latest
  setDisplayedPosts(posts);
  if (posts.length > 0) {
    setLastPostDate(posts[posts.length - 1].createdAt);
  }
};

const handleLoadMore = async () => {
  const more = await postsAPI.getFeed(lastPostDate, 10);
  setDisplayedPosts(prev => [...prev, ...more]);
  if (more.length > 0) {
    setLastPostDate(more[more.length - 1].createdAt);
  }
};

// JSX
<button onClick={handleRefresh}>Rafraîchir</button>
<button onClick={handleLoadMore} disabled={!lastPostDate}>Charger Plus</button>
```

---

## 📊 **Ordre de Refactorisation**

1. **Services (api.js)** - 2 heures
   - Normaliser users (snake → camelCase)
   - Adapter getFeed pour dates
   - Adapter getComments pour dates

2. **Context (AppContext.jsx)** - 2 heures
   - Adapter fetchPosts
   - Adapter loadMorePosts
   - Adapter user parsing

3. **Feed et Pagination** - 2-3 heures
   - Remplacer infinite scroll
   - Ajouter boutons Refresh/LoadMore
   - Adapter logique dates

4. **Autres pages** - 1-2 heures
   - Profile.jsx
   - CommentSection.jsx
   - Settings.jsx

---

## 🧪 **Tester Chaque Fix**

```bash
# Test 1: User normalization
// Appeler /auth/42 ou /auth/ et vérifier que user.firstName existe

# Test 2: Posts pagination
// Appeler /post?limit=5
// Puis /post?date=LAST_DATE&limit=5

# Test 3: Array responses
// Vérifier que postsAPI.getFeed() retourne un array
// Pas un objet avec {posts: [...]}
```

---

## 🚀 **Après les Fixes**

Une fois les 3 problèmes fixés, le frontend devrait marcher 100% avec le BFF!

✅ Auth will work  
✅ User profiles will load  
✅ Posts feed will load with date pagination  
✅ Comments with date pagination  
✅ Likes, followers, all social features  

---

## 📞 Questions pour le Collègue BFF?

1. **Confirmer**: Response login est `{user: {...}, token: "JWT"}`?
2. **Confirmer**: Arrays sont retournés direct (pas wrappés)?
3. **Confirmer**: Nécessite `Authorization: Bearer token` en header (pas query param)?
4. **Confirmer**: Dates format ISO8601 (2026-03-26T15:45:00Z)?

