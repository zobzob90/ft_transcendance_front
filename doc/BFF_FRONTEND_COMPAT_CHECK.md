# 🔍 Vérification Compatibilité: Frontend vs BFF en Production

**Date**: 26 mars 2026  
**Objectif**: Verifier si les réponses du BFF en développement vont matcher ce que le frontend attend  

---

## 📊 Comparatif Réponses

### ❌ PROBLÈME 1: Post Object - `_count` vs Direct Properties

**Frontend Actuel Attend:**
```javascript
response.posts?.map(p => ({
    id: p.id,
    likes: p._count?.likes || 0,      // ← _count.likes
    commentsCount: p._count?.comments || 0,  // ← _count.comments
    content: p.content,
    userId: p.userId,
    createdAt: p.createdAt,
}))
```

**BFF en Prod Envoie (selon docAPI.md):**
```json
{
  "id": 42,
  "content": "...",
  "_count": {
    "likes": 3,
    "comments": 2
  },
  "createdAt": "2026-03-20T15:45:00Z"
}
```

**MAIS aussi (selon doc spec du début):**
```json
{
  "id": 42,
  "content": "...",
  "likesCount": 3,           // ← DIRECT (pas _count)
  "commentsCount": 2,        // ← DIRECT (pas _count)
  "createdAt": "2026-03-20T15:45:00Z"
}
```

**⚠️ C'est Quoi le Vrai Format BFF?** `_count` ou direct?

---

### ❌ PROBLÈME 2: Pagination - Page/Limit vs Date

**Frontend Actuel Attend:**
```javascript
postsAPI.getFeed(1, 10)  // page=1, limit=10
```

**BFF en Prod Envoie (docAPI.md - ANCIEN):**
```javascript
GET /posts?page=1&limit=20
```

**MAIS Spec du Début dit (NOUVEAU):**
```javascript
GET /post?date=2026-03-26T00:00:00Z&limit=10
// Date du plus ancien post déjà chargé
```

**⚠️ Quel système le BFF implémente?** Page/limit ou date-based?

---

### ❌ PROBLÈME 3: User Object - Format

**Frontend Actuel Attend:**
```javascript
{
  id: 1,
  username: "john",
  email: "john@42hub.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "https://...",
  bio: "...",
  postsCount: 12,
  _count: {
    followers: 45,
    following: 23
  }
}
```

**BFF en Prod Envoie (docAPI.md):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@42hub.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "bio": "Mon bio",
  "postsCount": 12,
  "followersCount": 45,      // ← DIRECT (pas _count)
  "followingCount": 23       // ← DIRECT (pas _count)
}
```

**✅ OK Match** (mais attention au camelCase vs snake_case pour `firstName`)

---

### ❌ PROBLÈME 4: Réponses Login

**Frontend Actuel Attend:**
```javascript
{
  user: {
    id, username, email, firstName, lastName, bio, 
    theme, avatar, postsCount, followersCount, followingCount
  },
  token: "JWT_TOKEN"
}
```

**BFF en Prod Envoie (docAPI.md):**
```json
{
  "id": "...",
  "username": "...",
  "email": "...",
  // ... user object
  // MANQUE: user wrappé + token
}
```

**⚠️ Le format de réponse login est OK?** Envoies-tu `{user: {...}, token: "..."}` ou juste l'user?

---

## 🔴 Format Actuel Frontend vs Ce Qu'il Faut

| Champ | Frontend Attend | BFF Doit Envoyer | Status |
|-------|-----------------|------------------|--------|
| Post Likes | `p._count.likes` | `lukesCount` ou `_count.likes`? | ❌ ? |
| Post Comments | `p._count.comments` | `commentsCount` ou `_count.comments`? | ❌ ? |
| User Followers | `user._count.followers` | `followersCount` | ✅ OK |
| User Following | `user._count.following` | `followingCount` | ✅ OK |
| Login Response | `{user, token}` | `{user, token}` ou juste user? | ❌ ? |
| Pagination | `page=1&limit=10` | `date=...&limit=10` ou `page=...` ? | ❌ ? |
| Route Posts | `/api/posts` | `/post` ou `/posts`? | ❌ ? |
| Route Users | `/api/users/:username` | `/user/:userId` ou `/users/:username`? | ❌ ? |

---

## ❓ Questions Pour Ton Collègue

Faut que le BFF dise:

1. **Post object**: Envoies-tu `_count.likes` et `_count.comments` ou `likesCount` et `commentsCount` directement?
   
2. **Pagination**: C'est date-based (`date=ISO&limit=10`) ou page-based (`page=1&limit=10`)?

3. **Login response**: Format `{user: {...}, token: "..."}` ou juste l'user?

4. **Routes**: Sont-elles `/post` (singulier) ou `/posts` (pluriel)?

5. **User routes**: C'est `/user/:userId` ou `/users/:username`?

6. **Handles**: Les champs sont `firstName` (camelCase) ou `first_name` (snake_case)?

---

## ✅ Ce Qui Match Déjà

- ✅ User object structure (mais vérifier camelCase)
- ✅ Comment object structure
- ✅ Message object structure
- ✅ JWT Token authentication
- ✅ FormData pour upload avatar

---

## 🚨 ACTIONS IMMÉDIATES

**Pour Toi:**
1. Demande au collègue: Quelle est la réponse exacte d'une requête `/posts` ou `/post`?
2. Demande: Quel format pour une requête login?
3. Partagez ce document pour aligner les formats

**Pour le Collègue (BFF):**
1. Finalise le format des réponses (référence: docAPI.md vs spec du début)
2. Envoie des exemples de réponse pour: `GET /post`, `POST /auth/login`, `GET /user/:userId`
3. Documente TOUS les champs avec le camelCase exact

---

## 📋 Checklist d'Alignement

Ton collègue doit confirmer/implémenter:

- [ ] Post object: `likesCount` + `commentsCount` (pas `_count`)
- [ ] User object: `followersCount` + `followingCount` (pas `_count`)
- [ ] Login response: `{user: {...}, token: "JWT"}`
- [ ] Tous les champs en camelCase (firstName, lastName, not first_name)
- [ ] Pagination: definir date-based vs page-based
- [ ] Routes finales: /post vs /posts, /user/:id vs /users/:username
- [ ] Error responses: code 400, 401, 404, 500 avec `{error: "message"}`

---

## 🔗 Voir Aussi

- `ENDPOINT_MAPPING.md` - Spec détaillée des endpoints
- `docAPI.md` du BFF - Doc actuellement dans le BFF
- `frontend/src/services/api.js` - Ce que le frontend appelle

