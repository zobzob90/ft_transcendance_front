# 🔄 Guide de Migration - Nouvelle API BFF

**Date**: 26 mars 2026  
**Status**: ⚠️ Changements majeurs nécessaires  
**Impact Frontend**: ÉLEVÉ - Refactorisation importante requise

---

## 📊 Résumé Exécutif

La nouvelle API BFF introduit des changements **majeurs** dans la structure des endpoints et des formats de données. **~70% des appels API du frontend doivent être refactorisés**.

### Statistiques:
- **Endpoints affectés**: 31/31 (100%)
- **Changements critiques**: 12
- **Changements mineurs**: 19
- **Nouveaux endpoints**: 2
- **Endpoints supprimés**: 3

---

## ⚡ Changements Critiques (Priorité 1)

### 1. ❌ Pagination par Date au lieu de Page/Limit

**AVANT:**
```javascript
GET /posts?page=1&limit=10
GET /comments/post/:postId?page=1&limit=20
```

**APRÈS:**
```javascript
GET /post?date=ISO_DATE&limit=10
GET /comment/post/:postId?date=ISO_DATE&limit=10
```

**Impact**: 
- Système de pagination complètement différent (date-based au lieu de page-based)
- Requiert redesign du système de chargement infini (Feed.jsx, Profile.jsx)
- Nécessite deux boutons: "Rafraîchir" (sans date) et "Charger plus" (avec date du dernier post)

**Fichiers affectés**:
- `src/services/api.js` (postsAPI, commentsAPI)
- `src/context/AppContext.jsx` (logique de chargement)
- `src/pages/Feed/Feed.jsx` (UI et logique)
- `src/pages/Profile/Profile.jsx` (onglet posts)

---

### 2. ❌ Routes basées sur userId au lieu de username

**AVANT:**
```javascript
GET /users/:username
GET /users/:username/posts
GET /users/:username/followers
POST /users/:username/follow
DELETE /users/:username/follow
```

**APRÈS:**
```javascript
GET /user/:userId
GET /post/user/:userId
GET /social/followers        // pour l'utilisateur connecté
POST /social/user/:userId    // suivre quelqu'un
DELETE /social/user/:userId  // arrêter de suivre
```

**Impact**:
- Faut récupérer les IDs des utilisateurs au lieu de leurs usernames
- La récupération des followers/following change de structure
- Routes `/social/` uniquement pour l'utilisateur connecté (pas pour un profil public)

**Fichiers affectés**:
- `src/services/api.js` (profileAPI, followersAPI)
- `src/pages/Profile/Profile.jsx` (PublicProfile.jsx)
- `src/pages/Followers/Followers.jsx`
- `src/components/SearchFilter.jsx`

---

### 3. ❌ Endpoints Like complètement restructurés

**AVANT:**
```javascript
POST /posts/:postId/like
DELETE /posts/:postId/like
GET /likes/me
```

**APRÈS:**
```javascript
POST /like { "postId": ... }
DELETE /like/post/:postId
GET /like/post/:postId  // récupère les users qui ont liké
```

**Impact**:
- Le POST change de structure (body au lieu de URL param)
- Le format de retour des likes change

**Fichiers affectés**:
- `src/services/api.js` (likesAPI, postsAPI)
- `src/context/AppContext.jsx`
- `src/components/PostCard.jsx`

---

### 4. ❌ Routes Auth 42 restructurées

**AVANT:**
```javascript
GET /auth/42           // redirect OAuth
POST /auth/42/callback // échange code
POST /auth/42/confirm  // confirmation données
```

**APRÈS:**
```javascript
GET /register/42       // récupère données 42 (username, email, avatar)
POST /register         // enregistrement final avec FormData
GET /auth/42           // auth 42 (login uniquement)
POST /auth/            // auth normal
PUT /auth/             // changer password
```

**Impact**:
- Processus OAuth complètement différent
- Register 42 nécessite un appel GET puis POST (en deux étapes)
- Auth 42 retourne maintenant user complet + token

**Fichiers affectés**:
- `src/services/api.js` (authAPI)
- `src/pages/Login/Login.jsx`
- `src/pages/Register/Register42.jsx`
- `src/context/AppContext.jsx`

---

### 5. ❌ Changement des formats de retour POST/PUT

**Types de payload**:

#### FormData pour user + avatar/media:
```javascript
// Format BFF (FormData)
formData {
  "user": { "username": "...", "firstname": "...", ... },
  "avatar": File
}

// Ancien format (JSON)
{ "firstName": "...", "lastName": "...", ... }
```

**Impact**:
- Beaucoup plus d'endpoints utilisent FormData maintenant
- Nécessite refactorisation du code de création/édition

**Affected**:
- Register (avatar optionnel)
- Profile update (avatar optionnel)
- Post creation (média optionnel)
- Post update (média optionnel)
- Comment creation (texte seulement)

---

## 🟡 Changements Importants (Priorité 2)

### 6. Structure des données retournées

**Posts**:
```javascript
// AVANT: _count.likes, _count.comments
{
  id, content, image, pdf, userId, createdAt,
  _count: { likes: 5, comments: 3 }
}

// APRÈS: likesCount, commentsCount
{
  id, content, image, pdf, userId, createdAt,
  commentsCount, likesCount
}
```

**Users**:
```javascript
// AVANT: _count.followers, _count.following
{
  id, username, email, firstName, lastName, bio, theme,
  avatar, postsCount, _count: { followers: 10, following: 5 },
  createdAt
}

// APRÈS: followersCount, followingCount
{
  id, username, email, firstName, lastName, bio, theme,
  avatar, postsCount, followersCount, followingCount, createdAt
}
```

**Comments**:
```javascript
// APRÈS: ajout d'un champ "deleted" 
{
  id, content, userId, postId, createdAt, modifiedAt, deleted
}
```

**Impact**: Refactorisation simple mais systématique du traitement des données

---

### 7. Routes Comments renommées

**AVANT**: `/comments/`  
**APRÈS**: `/comment/` (singulier)

Routes affectées:
- `GET /comment/post/:postId?date=...&limit=...`
- `POST /comment/post/:postId`
- `PUT /comment/:commentId`
- `DELETE /comment/:commentId`

---

### 8. Search 42 Users - changement mineur

**AVANT**: `/search/42users?query=...` (format JSON)  
**APRÈS**: `/search42Users/:login` (URL param)

Retour:
```javascript
{
  id, login, displayName, avatar,
  campus, cursus, level
}
```

---

### 9. Média utilisateur - format structuré

**APRÈS**: `/media/user/:userId` retourne structure spécifique:
```javascript
{
  avatar: { filename, url },
  pdfs: [{ filename, url }, ...],
  images: [{ filename, url }, ...]
}
```

---

### 10. Restauration données 42

**NOUVEAU**: `/user/data42/:userId` (PUT)
- Réinitialise données + avatar 42 d'un utilisateur
- Retourne les données 42 restaurées

---

## 🟢 Changements Mineurs (Priorité 3)

### 11. Suppression de compte

**APRÈS**: `DELETE /user/:userId`
- Pas de changement majeur, juste nouvel endpoint

---

### 12. Avatar 42 vs Local

**Important**: Avatar peut avoir deux formats:
```javascript
// Avatar 42 (URL directe)
avatar: "https://cdn.intra.42.fr/..."

// Avatar local (URL serveur)
avatar: "https://localhost:3000/files/avatars/abc-123_1711234567.jpg"
```

**Action**: Gérer les deux formats dans le frontend

---

## 📋 Plan de Migration Détaillé

### Phase 1: Préparation (1-2 jours)
- [ ] Auditer tous les appels API existants
- [ ] Documenter les transformations de données
- [ ] Créer un schéma de migration

### Phase 2: Refactorisation Services (2-3 jours)
- [ ] Refactoriser `src/services/api.js`
  - [ ] authAPI (endpoints OAuth + auth)
  - [ ] userAPI/profileAPI (routes userId)
  - [ ] postsAPI (pagination par date)
  - [ ] commentsAPI (routes et format)
  - [ ] likesAPI (structure complète)
  - [ ] socialAPI (followers/friends)
  - [ ] searchAPI (search42Users)
  - [ ] uploadAPI (FormData)

### Phase 3: Refactorisation Context (1-2 jours)
- [ ] AppContext.jsx
  - [ ] fetchPosts (pagination par date)
  - [ ] toggleLike (nouveau format)
  - [ ] updateProfile (FormData)
  - [ ] Load initial data

### Phase 4: Refactorisation Pages (3-4 jours)
- [ ] Feed.jsx
  - [ ] Infinite scroll → date-based pagination
  - [ ] Refresh button design
  - [ ] Load more button design
- [ ] Profile.jsx / PublicProfile.jsx
  - [ ] userId au lieu de username
  - [ ] Routes posts commentés/likés
  - [ ] Tab "Média" avec structure correcte
- [ ] Login.jsx / Register.jsx
  - [ ] Nouveau flow OAuth 42
  - [ ] FormData pour avatar
- [ ] Followers.jsx
  - [ ] Nouvelle structure /social/

### Phase 5: Tests & Validation (2 jours)
- [ ] Tests unitaires des services
- [ ] Tests fonctionnels des pages principales
- [ ] Tests d'intégration auth flow
- [ ] Tests du flow publication

---

## 🔗 Tableau de Correspondances

| Fonctionnalité | AVANT | APRÈS | Priority |
|---|---|---|---|
| **AUTH** | | | |
| Login 42 | `GET /auth/42` | `GET /auth/42` | Critique |
| Register 42 Étape 1 | N/A | `GET /register/42` | Critique |
| Register 42 Étape 2 | `POST /auth/42/confirm` | `POST /register` (FormData) | Critique |
| Login Normal | `POST /auth/login` | `POST /auth/` | Critique |
| Change Password | `POST /auth/change-password` | `PUT /auth/` | Important |
| **USER** | | | |
| Get All Users | `GET /users?page=page&limit=limit` | `GET /user` | Minor |
| Get User | `GET /users/:username` | `GET /user/:userId` | Critique |
| Update Profile | `PATCH /users/me` | `PUT /user/:userId` (FormData) | Critique |
| Delete Account | N/A | `DELETE /user/:userId` | Minor |
| Get User Posts | `GET /users/:username/posts?page=page&limit=limit` | `GET /post/user/:userId` | Critique |
| Get Commented Posts | N/A | `GET /post/commented/:userId` | Important |
| Get User Likes | `GET /users/:username/likes?page=page&limit=limit` | `GET /post/liked/:userId` | Important |
| Get User Media | `GET /users/:username/media?page=page&limit=limit` | `GET /media/user/:userId` | Important |
| Restore 42 Data | N/A | `PUT /user/data42/:userId` | Minor |
| Search 42 Users | `GET /search/42users?query=...` | `GET /search42Users/:login` | Minor |
| **POST** | | | |
| Get Feed | `GET /posts?page=page&limit=limit` | `GET /post?date=ISO&limit=limit` | **Critique** |
| Create Post | `POST /posts` (JSON ou FormData) | `POST /post` (FormData) | Critique |
| Get Post | `GET /posts/:postId` | `GET /post/:postId` | Minor |
| Update Post | `PUT /posts/:postId` | `PUT /post/:postId` (FormData) | Critique |
| Delete Post | `DELETE /posts/:postId` | `DELETE /post/:postId` | Minor |
| **COMMENT** | | | |
| Get Comments | `GET /comments/post/:postId?page=page&limit=limit` | `GET /comment/post/:postId?date=ISO&limit=limit` | **Critique** |
| Create Comment | `POST /comments/post/:postId` | `POST /comment/post/:postId` | Minor |
| Update Comment | `PATCH /comments/:commentId` | `PUT /comment/:commentId` | Minor |
| Delete Comment | `DELETE /comments/:commentId` | `DELETE /comment/:commentId` | Minor |
| **LIKE** | | | |
| Like Post | `POST /posts/:postId/like` | `POST /like` (body: {postId}) | **Critique** |
| Unlike Post | `DELETE /posts/:postId/like` | `DELETE /like/post/:postId` | **Critique** |
| Get My Likes | `GET /likes/me` | `GET /like/post/:postId` | Important |
| **SOCIAL** | | | |
| Get Followers | `GET /users/:username/followers` | `GET /social/followers` | Critique |
| Get Following | `GET /users/:username/following` | `GET /social/friends` | Critique |
| Follow User | `POST /users/:username/follow` | `POST /social/user/:userId` | Critique |
| Unfollow User | `DELETE /users/:username/follow` | `DELETE /social/user/:userId` | Critique |

---

## 🚨 Incompatibilités Majeures

### 1. Impossible de paginer les posts/commentaires comme avant
- ❌ Impossible: page 2, 3, 4...
- ✅ Possible: charger les posts avant/après une date

**Solution**: Implémenter un système de "Refresh" et "Load More" avec dates

---

### 2. Profils publics vs route /social/
- ❌ Impossible: consulter les followers d'un autre user via `/social/followers`
- ✅ Possible: consulter les followers uniquement de l'utilisateur connecté

**Solution**: Faut peut-être demander une route `/social/user/:userId/followers` ou implémenter autrement

---

### 3. Avatars 42 vs Serveur
- Faut gérer deux types d'URLs différentes dans le frontend
- Certains avatars viendront de 42, d'autres du serveur

**Solution**: Créer une fonction utilitaire pour normaliser les avatars

---

## 📝 Checklist d'Incompatibilités à Corriger

### Services (api.js)
- [ ] authAPI.login → authAPI.login (basé sur `/auth/`)
- [ ] authAPI.getOAuth42Url → garder mais vérifier le flow
- [ ] authAPI.callback42 → remplacer par `/auth/42` GET
- [ ] authAPI.confirm42 → remplacer par `/register` POST (FormData)
- [ ] authAPI.register → adapter pour FormData
- [ ] authAPI.getCurrentUser → ajouter userId
- [ ] profileAPI.getProfile(username) → profileAPI.getProfile(userId)
- [ ] profileAPI.getMyProfile → utiliser userId courant
- [ ] profileAPI.updateProfile → adapter FormData
- [ ] profileAPI.uploadAvatar → intégrer dans updateProfile
- [ ] profileAPI.getUserPosts → adapter pagination date
- [ ] profileAPI.getUserMedia → adapter nouveau format
- [ ] profileAPI.getUserLikes → adapter pagination date
- [ ] usersAPI.searchUsers → remplacer par /search42Users/:login
- [ ] postsAPI.getFeed → adapter pagination date **CRITIQUE**
- [ ] postsAPI.createPost → adapter FormData
- [ ] postsAPI.updatePost → adapter FormData
- [ ] likesAPI.likePost → remplacer par `/like` POST
- [ ] likesAPI.unlikePost → remplacer par `/like/post/:postId` DELETE
- [ ] likesAPI.getMyLikes → intégrer dans post fetch
- [ ] followersAPI → remplacer par socialAPI avec userId
- [ ] commentsAPI → adapter pagination date
- [ ] searchAPI.search42Users → adapter nouveau format

### Context (AppContext.jsx)
- [ ] fetchPosts → utiliser pagination date
- [ ] checkForNewPosts → adapter pagination date
- [ ] addPost → adapter FormData
- [ ] toggleLike → adapter nouveau format
- [ ] updateProfile → adapter FormData

### Pages
- [ ] Feed.jsx → infinite scroll avec dates
- [ ] Profile.jsx → userId, media structure
- [ ] PublicProfile.jsx → userId, followers restriction
- [ ] Followers.jsx → nouvelles routes /social/
- [ ] Login.jsx → nouveau flow OAuth
- [ ] Register.jsx → FormData pour avatar
- [ ] Messages.jsx → vérifier structure

---

## 🎯 Impact Estimation

| Composant | Complexité | Temps | Risk |
|---|---|---|---|
| Services (api.js) | 🔴 Haute | 2-3j | Élev |
| AppContext | 🔴 Haute | 1-2j | Élev |
| Feed.jsx | 🔴 Haute | 1-2j | Élev |
| Profile pages | 🟠 Moyenne | 1-2j | Moy |
| Auth pages | 🟠 Moyenne | 1j | Moy |
| Followers | 🟠 Moyenne | 0.5j | Bas |
| Other pages | 🟢 Basse | 0.5j | Bas |
| **TOTAL** | **🔴 Haute** | **~7-10j** | **Élev** |

---

## 💡 Recommandations

### 1. Créer une couche d'abstraction
- Wrapper les appels API pour faciliter la migration progressive
- Permettre de basculer entre ancienne et nouvelle API

### 2. Système de versioning
- Garder un tag git avant la migration
- Commits réguliers avec messages clairs

### 3. Tests
- Créer des tests d'intération pour valider les appels API
- Tests e2e pour les flows critiques (auth, posts, comments)

### 4. FormData utility
- Créer une fonction utilitaire pour faciliter la création de FormData
- Gérer les fichiers optionnels de manière robuste

### 5. Avatar handling
- Créer une fonction `normalizeAvatarUrl()` pour gérer les deux formats
- Utiliser un hook `useAvatar()` partout

---

## 🔗 Ressources

- Nouvelle API BFF: Voir `BFF_ROUTES` dans le dossier racine
- API actuelle: `frontend/src/services/api.js`
- Contexte app: `frontend/src/context/AppContext.jsx`

---

## ✅ Prochaines Étapes

1. **Valider** le scope avec l'équipe
2. **Planner** les sprints de migration
3. **Créer** une branche feature `bff-migration`
4. **Commencer** par refactoriser `services/api.js`
5. **Tester** chaque changement avec un mock BFF si nécessaire
