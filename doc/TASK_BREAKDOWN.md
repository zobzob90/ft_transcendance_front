# 📋 Fiches de Tâches Par Composant/Page

Pour que chaque dev puisse prendre une tâche spécifique et savoir exactement quoi changer.

---

## 🟥 CRITIQUE - À Faire D'Abord

### Tâche 1: Refactoriser `src/services/api.js`
**Durée**: 2-3 jours  
**Difficulté**: 🔴 Élevée  
**Priority**: 🔴 Critique  
**Dépendances**: Aucune  
**Bloque**: Tous les autres changements  

#### Détails à Changer:

**AUTH API**
- [ ] `authAPI.login` → `POST /auth/` (au lieu de `/auth/login`)
- [ ] `authAPI.getOAuth42Url()` → Garder même endpoint
- [ ] `authAPI.callback42` → SUPPRIMER (remplacé par 2-étapes)
- [ ] `authAPI.confirm42` → Remplacer par `authAPI.register42Data()` GET `/register/42` + `authAPI.register()` POST `/register`
- [ ] `authAPI.register` → Adapter pour FormData
- [ ] `authAPI.changePassword` → Changer en `PUT /auth/` avec body `{password, newPassword}`

**USER API**
- [ ] `profileAPI.getProfile(username)` → Change to `userAPI.getUser(userId)` avec endpoint `GET /user/:userId`
- [ ] `profileAPI.getMyProfile()` → SUPPRIMER (pas d'endpoint)
- [ ] `profileAPI.updateProfile()` → Changer en `PUT /user/:userId` avec FormData
- [ ] `profileAPI.uploadAvatar()` → INTÉGRER dans updateProfile
- [ ] `profileAPI.getUserPosts(username)` → Adapter pour date-pagination: `GET /post/user/:userId?date=...&limit=...`
- [ ] `profileAPI.getUserMedia()` → Adapter format retour
- [ ] `profileAPI.getUserLikes()` → `GET /post/liked/:userId?date=...&limit=...`
- [ ] `usersAPI.getAllUsers()` → Keep but remove pagination params
- [ ] `usersAPI.getUserById()` → OK
- [ ] `usersAPI.searchUsers()` → Remplacer par `searchAPI.search42Users()`
- [ ] `usersAPI.changePassword()` → SUPPRIMER (move to auth)

**POST API**
- [ ] `postsAPI.getFeed()` → CHANGE: `(page, limit)` → `(dateString, limit)`, endpoint `/post?date=...&limit=...`
- [ ] `postsAPI.createPost()` → Adapter FormData format
- [ ] `postsAPI.updatePost()` → Adapter FormData
- [ ] `postsAPI.deletePost()` → Endpoint path change only
- [ ] `postsAPI.likePost()` → CHANGE: `POST /posts/:id/like` → `POST /like {postId}`
- [ ] `postsAPI.unlikePost()` → CHANGE: `DELETE /posts/:id/like` → `DELETE /like/post/:id`

**COMMENT API**
- [ ] `commentsAPI.getCommentsByPost()` → Adapter date-pagination: `GET /comment/post/:postId?date=...&limit=...`
- [ ] Tous les autres endpoints → path `/comments/` → `/comment/`

**LIKE API**
- [ ] `likesAPI.getMyLikes()` → SUPPRIMER (plus d'endpoint)
- [ ] Ajouter `likesAPI.like(postId)` → `POST /like {postId}`
- [ ] Ajouter `likesAPI.unlike(postId)` → `DELETE /like/post/:postId`

**FOLLOWERS API**
- [ ] `followersAPI.getFollowers(username)` → CHANGE: `GET /social/followers` (pour user connecté seulement)
- [ ] `followersAPI.getFollowing(username)` → CHANGE: `GET /social/friends` (pour user connecté seulement)
- [ ] `followersAPI.follow(username)` → CHANGE: `POST /social/user/:userId`
- [ ] `followersAPI.unfollow(username)` → CHANGE: `DELETE /social/user/:userId`

**SEARCH API**
- [ ] `searchAPI.search42Users(query)` → CHANGE: endpoint et format

#### Tests à Ajouter:
- [ ] Unit test chaque fonction
- [ ] Mock data pour pagination date
- [ ] Test FormData creation

#### Checklist Complète:
```javascript
// Avant de committer:
- [ ] Tous les tests passent
- [ ] Pas d'erreurs linting
- [ ] Aucun console.error
- [ ] Fonction `fetchWithAuth` inchangée (juste usage)
- [ ] Commentaires jour pour patterns complexes
```

---

### Tâche 2: Adapter `src/context/AppContext.jsx`
**Durée**: 1-2 jours  
**Difficulté**: 🔴 Élevée  
**Priority**: 🔴 Critique (après api.js)  
**Dépendances**: Tâche 1  

#### Détails à Changer:

- [ ] `fetchPosts()` → Adapter pour date-pagination (pas page-based)
  - Avant: `postsAPI.getFeed(1, 10)`
  - Après: `postsAPI.getFeed(null, 10)` (null = pas de date, get latest)

- [ ] `checkForNewPosts()` → Adapter aussi pour dates

- [ ] `addPost()` → Adapter FormData
  - Gérer media optionnel

- [ ] `toggleLike()` → Adapter new Like API
  - Avant: `postsAPI.likePost()` / `unlikePost()`
  - Après: `likesAPI.like()` / `likesAPI.unlike()`

- [ ] Structure posts changé: `_count.likes` → `likesCount`
  - Update tous les mapages de posts

- [ ] `deletePost()` → OK (juste endpoint change)

- [ ] Gestion du thème: OK (no change)

- [ ] Gestion de la langue: OK (no change)

- [ ] UserIdCache initialization
  - Charger tous les users pour cache username→userId

#### Code Pattern à Utiliser:
```javascript
// Nouveau fetchPosts avec date pagination
const fetchPosts = useCallback(async () => {
  try {
    // date = null → get latest posts
    const response = await postsAPI.getFeed(null, 10);
    
    // Format posts
    const formatted = response.map(p => ({
      id: p.id,
      content: p.content,
      likesCount: p.likesCount, // Change from _count.likes
      commentsCount: p.commentsCount, // Change from _count.comments
      // ...
    }));
    
    setPosts(formatted);
    setLastPostDate(response[response.length - 1]?.createdAt);
  } catch (error) {
    console.error('Error:', error);
  }
}, []);
```

#### Tests:
- [ ] Tests fetch avec dates
- [ ] Tests addPost avec media
- [ ] Tests toggleLike new format
- [ ] Tests data transformation

---

## 🟠 IMPORTANT - À Faire Ensuite

### Tâche 3: Refactoriser `src/pages/Feed/Feed.jsx`
**Durée**: 1-2 jours  
**Difficulté**: 🟠 Moyenne-Élevée  
**Priority**: 🔴 Critique (UX change important)  
**Dépendances**: Tâche 1, 2  

#### Ce Qui Change:

1. **Infinite Scroll → Manual Pagination**
   - Avant: Auto-load on scroll
   - Après: Deux boutons "Refresh" + "Load More"

2. **Remove Page State**
   - Avant: currentPage, setCurrentPage
   - Après: lastPostDate, setLastPostDate

3. **Two Different Calls**
   ```javascript
   // Refresh = sans date (get latest)
   const refresh = async () => {
     const posts = await postsAPI.getFeed(null, 10);
   };
   
   // Load More = avec date (get older)
   const loadMore = async () => {
     const posts = await postsAPI.getFeed(lastPostDate, 10);
   };
   ```

#### Changes Détaillés:

- [ ] Remove `IntersectionObserver` logic
- [ ] Remove `currentPage` state
- [ ] Add `lastPostDate` state
- [ ] Add two buttons: `<button onClick={refresh}>Refresh</button>`
- [ ] Add button: `<button onClick={loadMore}>Load More</button>`
- [ ] Update data fetch logic pour dates
- [ ] Adapt loading states
- [ ] Remove "has no more posts" detection (keep it simple)

#### UI Components:
- [ ] Use `DatePaginationButtons` component from BFF_CODE_TEMPLATES.md
- [ ] Position buttons below posts (not floating)
- [ ] Show loading state while fetching

#### Tests:
- [ ] Test refresh button call
- [ ] Test load more button call
- [ ] Test data appending
- [ ] Test error states

---

### Tâche 4: Adapter `src/pages/Profile/Profile.jsx`
**Durée**: 1 jour  
**Difficulté**: 🟠 Moyenne  
**Priority**: 🔴 Critique  
**Dépendances**: Tâche 1, 2, 3  

#### Changes:

**Stats Section**:
- [ ] `user._count.followers` → `user.followersCount`
- [ ] `user._count.following` → `user.followingCount`

**Posts Tab**:
- [ ] Adapter date-pagination (comme Feed.jsx)
- [ ] Add "Refresh" + "Load More" buttons

**Media Tab**:
- [ ] Change handling from flat array to structured:
  ```javascript
  // Avant: [{ url, type }, ...]
  // Après: { avatar: {...}, images: [...], pdfs: [...] }
  ```

**Likes Tab**:
- [ ] Adapter date-pagination pour liked posts

**Profile Update**:
- [ ] Pass userId au lieu de username
- [ ] Adapter FormData profile update

#### Détails:

```javascript
// OLD structure
const userMedia = response; // [{ url, type }, ...]

// NEW structure  
const { avatar, images, pdfs } = response;
// Display as separate sections
```

#### Components à Update:
- [ ] Stats display (followers/following counts)
- [ ] Posts tab pagination
- [ ] Media tab display
- [ ] Likes tab pagination

---

### Tâche 5: Adapter `src/pages/Login/Login.jsx`
**Durée**: 1 jour  
**Difficulté**: 🟠 Moyenne  
**Priority**: 🔴 Critique  
**Dépendances**: Tâche 1  

#### Changes:

**Login Normal**:
- [ ] Change endpoint from `/auth/login` to `/auth/`
- [ ] Same form, same UX

**Login 42**:
- [ ] Change from redirect to API call: `GET /auth/42`
- [ ] Returns user + token directly
- [ ] No OAuth callback needed (backend handles it)

#### Code Pattern:
```javascript
// Login 42 - New Way
const handleLogin42 = async (code) => {
  try {
    const response = await authAPI.auth42();
    const { user, token } = response;
    // Save token + user
  } catch (error) {
    // Handle error
  }
};
```

---

### Tâche 6: Adapter `src/pages/Register/Register.jsx`
**Durée**: 1 jour  
**Difficulté**: 🟠 Moyenne  
**Priority**: 🔴 Critique  
**Dépendances**: Tâche 1  

#### Changes:

**Normal Register**:
- [ ] Change to FormData
- [ ] Format: `{ user: {...}, avatar: File }`
- [ ] Avatar peut être optionnel (mais champ doit exister)

**Register 42 - New Two-Step**:
1. Step 1: `GET /register/42` → Get username, email, avatar from 42
   ```javascript
   const data42 = await authAPI.getRegister42Data();
   // Returns: { login, email, firstName, lastName, avatar }
   ```

2. Step 2: `POST /register` → User confirms + provides password
   ```javascript
   const formData = new FormData();
   formData.append('user', JSON.stringify({
     username: data42.login,
     firstname: data42.firstName,
     lastname: data42.lastName,
     mail: data42.email,
     password: userPassword,
     avatar: data42.avatar,
   }));
   // If user changed avatar before registering, upload new file
   if (newAvatarFile) {
     formData.append('avatar', newAvatarFile);
   }
   ```

#### UI Changes:
- [ ] Add optional avatar upload
- [ ] Show 42 data fetch loading
- [ ] Two-step form for 42

---

## 🟡 IMPORTANT - À Faire Après

### Tâche 7: Adapter `src/components/CommentSection.jsx`
**Durée**: 0.5-1 jour  
**Difficulté**: 🟡 Moyenne  
**Priority**: 🟠 Important  
**Dépendances**: Tâche 1  

#### Changes:

- [ ] Comments pagination: `date=...&limit=...` (like posts)
- [ ] Add "Refresh" + "Load More" buttons
- [ ] Format change: `/comments/` → `/comment/`
- [ ] New field in comment: `deleted`

#### Optional:
- [ ] Show deleted indicator for deleted comments
- [ ] Or hide deleted comments entirely

---

### Tâche 8: Adapter `src/pages/Profile/PublicProfile.jsx`
**Durée**: 0.5-1 jour  
**Difficulté**: 🟡 Moyenne  
**Priority**: 🟠 Important  
**Dépendances**: Tâche 1, 3  

#### Changes:

- [ ] Change from username to userId routing
- [ ] Get user by ID: `userAPI.getUser(userId)`
- [ ] Adapt posts tab (date pagination)
- [ ] Cannot access /social/followers for other users
  - Option 1: Remove followers section
  - Option 2: Add manual route (ask BFF team)
  - Option 3: Show empty state

#### Note:
This might reveal UX limitation - ask BFF team if they have endpoint for this.

---

### Tâche 9: Adapter `src/pages/Followers/Followers.jsx`
**Durée**: 0.5-1 jour  
**Difficulté**: 🟡 Moyenne  
**Priority**: 🟠 Important  
**Dépendances**: Tâche 1  

#### Changes:

- [ ] `/social/followers` - get my followers
- [ ] `/social/friends` - get users following (who I'm following)
- [ ] Follow/unfollow: use userId now
  - `POST /social/user/:userId`
  - `DELETE /social/user/:userId`

#### Limited Scope:
- Only shows current user's followers/following
- Cannot view other users' followers (UX limitation)

---

### Tâche 10: Adapter `src/pages/Settings/Settings.jsx`
**Durée**: 0.5-1 jour  
**Difficulté**: 🟡 Moyenne  
**Priority**: 🟠 Important  
**Dépendances**: Tâche 1  

#### Changes:

- [ ] Profile update: use FormData
- [ ] Avatar optional
- [ ] New button: Restore 42 Data
  - `PUT /user/data42/:userId`
- [ ] Option: Delete Account
  - `DELETE /user/:userId`

#### Code Pattern:
```javascript
const handleProfileUpdate = async (updates) => {
  const formData = buildProfileUpdateFormData(
    {
      username: updates.username,
      firstname: updates.firstName,
      lastname: updates.lastName,
      mail: updates.email,
    },
    updates.avatarFile
  );
  
  await userAPI.updateProfile(userId, formData);
};
```

---

### Tâche 11: Adapter `src/components/PostCard.jsx`
**Durée**: 0.5 jour  
**Difficulté**: 🟡 Moyenne  
**Priority**: 🟠 Important  
**Dépendances**: Tâche 1  

#### Changes:

- [ ] `likesCount` instead of `_count.likes`
- [ ] `commentsCount` instead of `_count.comments`
- [ ] Like/unlike buttons use new API
- [ ] Delete/edit use new endpoints

---

### Tâche 12: Adapter `src/components/SearchModal.jsx`
**Durée**: 0.5 jour  
**Difficulté**: 🟡 Basse  
**Priority**: 🟢 Mineur  
**Dépendances**: Tâche 1  

#### Changes:

- [ ] `/search42Users/:login` (endpoint change)
- [ ] Format change: return `{ campus, cursus, level }` now

---

## 🟢 MINEUR - Si Temps Disponible

### Tâche 13: Créer/Adapter Utilités
**Durée**: 0.5-1 jour  
**Difficulté**: 🟢 Basse  
**Priority**: 🟢 Mineur  
**Dépendances**: Aucune  

- [ ] `utils/avatarUtils.js` - normalizeAvatarUrl()
- [ ] `utils/userIdCache.js` - username → userId cache
- [ ] `utils/formDataBuilder.js` - Helper pour FormData
- [ ] `hooks/useDatePagination.js` - Réusable pagination hook

Voir `BFF_CODE_TEMPLATES.md` pour code complet.

---

### Tâche 14: Tests & Polish
**Durée**: 1-2 jours  
**Difficulté**: 🟢 Variable  
**Priority**: 🟢 Mineur  
**Dépendances**: Toutes tâches critiques  

- [ ] Unit tests api.js
- [ ] Integration tests AppContext
- [ ] E2E tests pour auth flow
- [ ] E2E tests pour post creation
- [ ] E2E tests pour comments
- [ ] Manual testing (browser)
- [ ] Edge case handling

---

## 📊 Ordre Recommandé

```
Day 1-2:
  ✓ Tâche 1: api.js (services refactor)
  ✓ Tâche 2: AppContext (context adapt)

Day 3-4:
  ✓ Tâche 3: Feed.jsx (pagination change - CRITICAL UX)
  ✓ Tâche 4: Profile.jsx (stats + pagination)

Day 5-6:
  ✓ Tâche 5: Login.jsx (auth flow)
  ✓ Tâche 6: Register.jsx (2-step 42 + FormData)

Day 7:
  ✓ Tâche 7: CommentSection (pagination)
  ✓ Tâche 8: PublicProfile (userId)
  ✓ Tâche 9: Followers (new routes)
  ✓ Tâche 10: Settings (FormData)
  ✓ Tâche 11: PostCard (data transform)
  ✓ Tâche 12: SearchModal (endpoint)

Day 8-10:
  ✓ Tâche 13: Utils
  ✓ Tâche 14: Tests & Polish
```

---

## ✅ Definition of Done (Per Task)

Pour chaque tâche:
- [ ] Code complet et testé
- [ ] Pas d'erreurs linting
- [ ] Tests passent (ou ajoutés si nouveau code)
- [ ] Pas de console.error/warning
- [ ] Code review (pair program ou PR)
- [ ] Fonctionne avec mock BFF API

---

## 🤝 Collaboration Notes

- **Code review obligatoire** pour toutes les changements api.js + AppContext
- **Pair programming** recommandé pour Tâche 1 (api.js) et Tâche 3 (Feed pagination UX)
- **Ask BFF team** si unclear sur comportement des endpoints
- **Git branches**: `feat/bff-migration-{tache-name}`
- **Commits**: atomic + mensages clairs (ex: "feat(api): adapt posts getFeed to date pagination")

