# 📡 42Hub API - Documentation Complète

## 🎯 Vue d'ensemble

Cette documentation liste **toutes les requêtes API** du projet 42Hub, organisées par catégorie.

**Base URL:** `http://localhost:3000/api`

**Authentification:** JWT Token (Bearer Token dans le header `Authorization`)

---

## 📊 Résumé des Requêtes

- **Total:** 41 requêtes
- **GET:** 17
- **POST:** 10
- **PUT:** 7
- **DELETE:** 5

---

## 🔐 Authentification (API AUTH)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| # | Méthode | Endpoint 				| Description           | Body/Payload                                                                                          | Auth   |
|---|---------|-------------------------|-----------------------|-------------------------------------------------------------------------------------------------------|--------|
| 1 | POST 	  | `/auth/login`           | Connexion classique   | `{"login":"string","password":"string"}`                                                              | ❌ Non |
| 2 | GET     | `/auth/42`              | URL OAuth 42          | -                                                                                                     | ❌ Non |
| 3 | POST    | `/auth/42/callback`     | Callback OAuth 42     | `{"code":"string"}`                                                                                   | ❌ Non |
| 4 | POST    | `/auth/42/confirm`      | Confirmation OAuth 42 | `{"firstName":"string","lastName":"string","email":"string"}`                                         | ❌ Non |
| 5 | POST    | `/auth/register`        | Inscription classique | `{"username":"string","email":"string","password":"string","firstName":"string","lastName":"string"}` | ❌ Non |
| 6 | GET     | `/auth/me`              | Utilisateur connecté  | -                                                                                                     | ✅ Oui |
| 7 | POST    | `/auth/change-password` | Changer mot de passe  | `{"currentPassword":"string","newPassword":"string","confirmPassword":"string"}`                      | ✅ Oui |
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

---

## 👤 Profil Utilisateur (PROFILE API)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| #  | Méthode  | Endpoint 					| Description 	     | Body/Payload    																					     | Auth   |
|----|----------|---------------------------|--------------------|-------------------------------------------------------------------------------------------------------|--------|
| 8  | GET 		| `/users/{username}` 		| Profil public      | -    																							     | ❌ Non |
| 9  | GET 		| `/users/me` 		  		| Mon profil 	     | -    																							     | ✅ Oui |
| 10 | PUT 		| `/users/me` 		  		| Modifier profil    | `{"username":"string?","firstName":"string?","lastName":"string?","bio":"string?","email":"string?"}` | ✅ Oui |
| 11 | POST 	| `/users/me/avatar`  		| Upload avatar      | FormData: `{avatar:File}`                                                                             | ✅ Oui |
| 12 | GET 		| `/users/{username}/posts` | Posts utilisateur	 | Query: `page=1&limit=10`                                                                              | ❌ Non |
| 13 | GET 		| `/users/{username}/media` | Médias utilisateur | Query: `page=1&limit=20`                                                                              | ❌ Non |
| 14 | GET 		| `/users/{username}/likes` | Posts likés        | Query: `page=1&limit=10`                                                                              | ❌ Non |
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---

## 👥 Utilisateurs (USERS API)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint              | Description              | Body/Payload                                                                          | Auth   |
|----|---------|-----------------------|--------------------------|---------------------------------------------------------------------------------------|--------|
| 15 | GET     | `/users`              | Tous utilisateurs        | Query: `page=1&limit=10`                                                              | ❌ Non |
| 16 | GET     | `/users/{userId}`     | Utilisateur par ID       | -                                                                                     | ❌ Non |
| 17 | GET     | `/users/search?q=...` | Rechercher utilisateurs  | Query: `q=john`                                                                       | ❌ Non |
| 18 | PUT     | `/users/{userId}`     | Modifier utilisateur     | `{"username":"string?","email":"string?","firstName":"string?","lastName":"string?"}` | ✅ Oui |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------

---

## 📝 Posts (POSTS API)
---------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint               | Description    | Body/Payload             | Auth   |
|----|---------|------------------------|----------------|--------------------------|--------|
| 19 | GET     | `/posts`               | Feed posts     | Query: `page=1&limit=20` | ❌ Non |
| 20 | POST    | `/posts`               | Créer post     | `{"content":"string"}`   | ✅ Oui |
| 21 | GET     | `/posts/{postId}`      | Post détail    | -                        | ❌ Non |
| 22 | PUT     | `/posts/{postId}`      | Modifier post  | `{"content":"string"}`   | ✅ Oui |
| 23 | DELETE  | `/posts/{postId}`      | Supprimer post | -                        | ✅ Oui |
| 24 | POST    | `/posts/{postId}/like` | Liker post     | -                        | ✅ Oui |
| 25 | DELETE  | `/posts/{postId}/like` | Retirer like   | -                        | ✅ Oui |
---------------------------------------------------------------------------------------------

---

## 👫 Followers (FOLLOWERS API)
-----------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint                      | Description        | Body/Payload    | Auth   |
|----|---------|-------------------------------|--------------------|-----------------|--------|
| 26 | GET     | `/users/{username}/followers` | Followers          | Query: `page=1` | ❌ Non |
| 27 | GET     | `/users/{username}/following` | Following          | Query: `page=1` | ❌ Non |
| 28 | POST    | `/users/{username}/follow`    | Suivre utilisateur | -               | ✅ Oui |
| 29 | DELETE  | `/users/{username}/follow`    | Ne plus suivre     | -               | ✅ Oui |
-----------------------------------------------------------------------------------------------

---

## 🔔 Notifications (NOTIFICATIONS API)
--------------------------------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint                               | Description           | Body/Payload             | Auth   |
|----|---------|----------------------------------------|-----------------------|--------------------------|--------|
| 30 | GET     | `/notifications`                       | Voir notifications    | Query: `page=1&limit=20` | ✅ Oui |
| 31 | PUT     | `/notifications/{notificationId}/read` | Marquer comme lue     | -                        | ✅ Oui |
| 32 | PUT     | `/notifications/read-all`              | Marquer tout comme lu | -                        | ✅ Oui |
--------------------------------------------------------------------------------------------------------------------

---

## 💬 Messages (MESSAGES API)
----------------------------------------------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint                                   | Description     | Body/Payload                             |  Auth  |
|----|---------|--------------------------------------------|-----------------|------------------------------------------|--------|
| 33 | GET     | `/messages/conversations`                  | Conversations   | Query: `page=1`                          | ✅ Oui |
| 34 | GET     | `/messages/conversations/{conversationId}` | Messages        | Query: `page=1&limit=20`                 | ✅ Oui |
| 35 | POST    | `/messages`                                | Envoyer message | `{"content":"string","receiverId":int}`  | ✅ Oui |
-----------------------------------------------------------------------------------------------------------------------------------

---

## 💭 Commentaires (COMMENTS API)
-----------------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint                  | Description           | Body/Payload           | Auth   |
|----|---------|---------------------------|-----------------------|------------------------|--------|
| 36 | GET     | `/comments/post/{postId}` | Commentaires post     | Query: `page=1`        | ❌ Non |
| 37 | POST    | `/comments/post/{postId}` | Créer commentaire     | `{"content":"string"}` | ✅ Oui |
| 38 | PUT     | `/comments/{commentId}`   | Modifier commentaire  | `{"content":"string"}` | ✅ Oui |
| 39 | DELETE  | `/comments/{commentId}`   | Supprimer commentaire | -                      | ✅ Oui |
-----------------------------------------------------------------------------------------------------

---

## 🔍 Recherche (SEARCH API)
--------------------------------------------------------------------------------------------------
| #  | Méthode | Endpoint                    | Description         | Body/Payload        | Auth   |
|----|---------|-----------------------------|---------------------|---------------------|--------|
| 40 | GET     | `/search/42users?query=...` | Utilisateurs 42     | Query: `query=john` | ✅ Oui |
| 41 | GET     | `/search/users?query=...`   | Utilisateurs locaux | Query: `query=john` | ✅ Oui |
--------------------------------------------------------------------------------------------------

---

## 🛡️ Codes de Réponse

| Code | Signification |
|------|---|
| 200 | ✅ Succès |
| 201 | ✅ Créé avec succès |
| 400 | ❌ Requête invalide |
| 401 | ❌ Non authentifié |
| 403 | ❌ Non autorisé |
| 404 | ❌ Non trouvé |
| 409 | ❌ Conflit (username existe) |
| 500 | ❌ Erreur serveur |

---

## 📦 Schémas des Réponses (Objets Attendus par le Frontend)

### 👤 User Object
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
  "followersCount": 45,
  "followingCount": 23,
  "createdAt": "2026-02-15T10:30:00Z",
  "isFollowing": false,
  "isFollowedBy": true
}
```

### 📝 Post Object
```json
{
  "id": 42,
  "content": "Mon contenu du post",
  "userId": 1,
  "avatar": "https://...",
  "date": "2026-03-20 15:45",
  "isEdited": false,
  "isLiked": false,
  "user": {
    "id": 1,
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://..."
  },
  "_count": {
    "likes": 3,
    "comments": 2
  },
  "createdAt": "2026-03-20T15:45:00Z",
  "updatedAt": "2026-03-20T15:45:00Z"
}
```

### 💬 Comment Object
```json
{
  "id": 5,
  "content": "Commentaire sympa!",
  "postId": 42,
  "userId": 2,
  "author": "jane_smith",
  "avatar": "https://...",
  "createdAt": "2026-03-20T16:20:00Z",
  "updatedAt": "2026-03-20T16:20:00Z",
  "user": {
    "id": 2,
    "username": "jane_smith",
    "firstName": "Jane",
    "lastName": "Smith",
    "avatar": "https://..."
  }
}
```

### 💭 Message Object
```json
{
  "id": 10,
  "content": "Salut, ça va?",
  "conversationId": 3,
  "senderId": 1,
  "receiverId": 2,
  "isRead": false,
  "createdAt": "2026-03-20T14:30:00Z",
  "sender": {
    "id": 1,
    "username": "john_doe",
    "avatar": "https://..."
  }
}
```

### 🔔 Notification Object
```json
{
  "id": 8,
  "userId": 1,
  "type": "like",
  "message": "john_doe a aimé votre post",
  "relatedUserId": 2,
  "relatedPostId": 42,
  "isRead": false,
  "createdAt": "2026-03-20T13:15:00Z",
  "sender": {
    "id": 2,
    "username": "john_doe",
    "avatar": "https://..."
  }
}
```

### 👥 Follower Object
```json
{
  "id": 1,
  "followerId": 5,
  "followingId": 1,
  "createdAt": "2026-03-15T10:00:00Z",
  "follower": {
    "id": 5,
    "username": "alice_wonder",
    "firstName": "Alice",
    "lastName": "Wonder",
    "avatar": "https://..."
  }
}
```

### 📊 Pagination Response
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 📝 Notes Importantes

1. **JWT Token** - Obtenu lors du login, valide 24h
2. **Headers** - `Content-Type: application/json` pour les POST/PUT avec body
3. **Authorization** - `Bearer {token}` dans le header pour requêtes protégées
4. **FormData** - Utilisé pour upload de fichiers (avatar)
5. **Query params** - `page=1&limit=10` pour la pagination
6. **Schémas** - Les objets retournés doivent respecter les structures de réponse

---

**Dernière mise à jour:** 23 mars 2026
