# Endpoint Mapping: Old → New API

**Généré**: 26 mars 2026  
**Frontend Version**: v1.0  
**BFF Version**: Initial  

---

## 🔵 AUTH - Authentification

### 1. Login Classique
```
OLD: POST /auth/login
     { "email": "...", "password": "..." }
     ❌ Status: 200
     ❌ Response: { "token": "...", "user": {...} }

NEW: POST /auth/
     { "email": "...", "password": "..." }
     ✅ Status: 200
     ✅ Response: {
       "user": {
         "id", "username", "email", "firstName", "lastName",
         "bio", "theme", "avatar", "postsCount",
         "followersCount", "followingCount", "createdAt"
       },
       "token": "JWT_TOKEN"
     }

REFACTOR: ✅ Minor - Juste endpoint path change
FILE: src/services/api.js > authAPI.login()
```

---

### 2. Login OAuth 42 - Étape 1 (Récupérer données)
```
OLD: Pas directement d'appel. Redirect via window.location = ...

NEW: GET /register/42
     Headers: Authorization: Bearer token (optionnel pour register)
     ✅ Response: {
       "login": "john",
       "first_name": "Jean",
       "last_name": "Dupont",
       "email": "john@student.42.fr",
       "avatar": "https://cdn.intra.42.fr/..."
     }

REFACTOR: 🔴 Critical - Nouveau flow (Register 42 requiert 2 appels)
FILE: src/services/api.js > authAPI.getRegister42Data()
      src/pages/Register/Register42.jsx
```

---

### 3. Login OAuth 42 - Étape 2 (Enregistrement)
```
OLD: POST /auth/42/confirm
     { "username": "...", "email": "...", ... }
     ❌ Format: JSON
     
NEW: POST /register
     FormData:
       "user": {
         "username": "john",
         "firstname": "Jean",
         "lastname": "Dupont",
         "mail": "john@student.42.fr",
         "password": "..." (optionnel pour 42),
         "avatar": "https://cdn.intra.42.fr/..." (URL ou null)
       }
       "avatar": File (optionnel - si user change avatar avant enregistrement)
     ✅ Response: {}

REFACTOR: 🔴 Critical - FormData + endpoint change
FILE: src/services/api.js > authAPI.register42()
      src/pages/Register/Register42.jsx
```

---

### 4. Auth OAuth 42 (Login only - pas register)
```
OLD: GET /auth/42
     ❌ Retourne juste redirect URL

NEW: GET /auth/42
     ✅ Response: {
       "user": {
         "id", "username", "email", "firstName", "lastName",
         "bio", "theme", "avatar", "campus", "cursus", "level",
         "postsCount", "followersCount", "followingCount", "createdAt"
       },
       "token": "JWT_TOKEN"
     }

REFACTOR: 🟡 Important - Change de comportement (pas de redirect)
FILE: src/services/api.js > authAPI.getOAuth42Url()
      src/pages/Login/Login.jsx
```

---

### 5. Change Password
```
OLD: POST /auth/change-password
     { "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }

NEW: PUT /auth/
     Authorization: Bearer token
     { "password": "OLD", "newPassword": "NEW" }
     ✅ Response: {}

REFACTOR: 🟡 Important - Endpoint path change + format
FILE: src/services/api.js > authAPI.changePassword()
      src/pages/Settings/Settings.jsx
```

---

## 👤 USER - Profil Utilisateur

### 6. Récupérer Tous les Users
```
OLD: GET /users?page=1&limit=10

NEW: GET /user
     Authorization: Bearer token
     ✅ Response: [
       {
         "id", "username", "email", "firstname", "lastname",
         "bio", "theme", "avatar",
         "postsCount", "followersCount", "followingCount", "createdAt"
       },
       ...
     ]

REFACTOR: 🟡 Important - Format _count change + pagination goes away
FILE: src/services/api.js > usersAPI.getAllUsers()
```

---

### 7. Récupérer User par ID (MAJOR CHANGE)
```
OLD: GET /users/:username   (username-based)
     { user object }

NEW: GET /user/:userId      (id-based)
     Authorization: Bearer token
     ✅ Response: {
       "id", "username", "email", "firstname", "lastname",
       "bio", "theme", "avatar",
       "postsCount", "followersCount", "followingCount", "createdAt"
     }

REFACTOR: 🔴 CRITICAL - username → userId everywhere
FILE: src/services/api.js > profileAPI.getProfile(userId)
      src/pages/Profile/PublicProfile.jsx
      src/components/SearchFilter.jsx

IMPACT NOTES:
- Must fetch userId before getting user profile
- Cannot use username in URL directly anymore
- Need mapping from username → userId somewhere
```

---

### 8. Update Profile (User Data + Avatar)
```
OLD: PATCH /users/me
     { "firstName": "...", "lastName": "...", "bio": "..." }
     (Avatar upload était POST /users/me/avatar séparé)

NEW: PUT /user/:userId
     Authorization: Bearer token
     FormData:
       "user": {
         "username": "...",      // optionnel
         "firstname": "...",     // optionnel
         "lastname": "...",      // optionnel
         "mail": "..."           // optionnel
       }
       "avatar": File            // optionnel
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - FormData + endpoint change
FILE: src/services/api.js > profileAPI.updateProfile()
      src/pages/Settings/Settings.jsx
      src/components/ProfileEditor.jsx

MIGRATION NOTES:
- Combine avatar upload + user update in single request
- Only include fields that are changing
- File must be .jpg, .jpeg or .png
```

---

### 9. Restore 42 Data (NEW)
```
NEW: PUT /user/data42/:userId
     Authorization: Bearer token
     Body: {} (empty)
     ✅ Response: {
       "username": "...",
       "email": "...",
       "firstname": "...",
       "lastname": "...",
       "avatar": "https://cdn.intra.42.fr/..."
     }

REFACTOR: 🟢 New Feature - Non-breaking
FILE: src/services/api.js > userAPI.restore42Data()
      src/pages/Settings/Settings.jsx (add button)
```

---

### 10. Delete Account
```
OLD: N/A

NEW: DELETE /user/:userId
     Authorization: Bearer token
     Body: {}
     ✅ Response: {}

REFACTOR: 🟢 New Feature
FILE: src/services/api.js > userAPI.deleteAccount()
      src/pages/Settings/Settings.jsx
```

---

### 11. Get User Posts
```
OLD: GET /users/:username/posts?page=1&limit=10

NEW: GET /post/user/:userId
     Authorization: Bearer token
     Query: ?date=ISO_DATE&limit=10
     ✅ Response: [
       {
         "id", "content", "image", "pdf", "userId",
         "createdAt", "modifiedAt",
         "commentsCount", "likesCount"
       },
       ...
     ]

REFACTOR: 🔴 CRITICAL - Date-based pagination + userId + format change
FILE: src/services/api.js > profileAPI.getUserPosts()
      src/pages/Profile/Profile.jsx > posts tab
      src/pages/Profile/PublicProfile.jsx

MIGRATION NOTES:
- Old: pagination by page number
- New: pagination by date (must track lastDate)
- Structure change: _count.likes → likesCount
```

---

### 12. Get User Commented Posts
```
NEW: GET /post/commented/:userId
     Authorization: Bearer token
     Query: ?date=ISO_DATE&limit=10
     ✅ Response: [post objects]

REFACTOR: 🟢 Existing feature now exposed
FILE: src/services/api.js > profileAPI.getUserCommentedPosts()
      src/pages/Profile/Profile.jsx > add new tab?
```

---

### 13. Get User Liked Posts
```
OLD: GET /users/:username/likes?page=1&limit=10

NEW: GET /post/liked/:userId
     Authorization: Bearer token
     Query: ?date=ISO_DATE&limit=10
     ✅ Response: [post objects]

REFACTOR: 🔴 CRITICAL - Date pagination + userId
FILE: src/services/api.js > profileAPI.getUserLikes()
      src/pages/Profile/Profile.jsx > likes tab
```

---

### 14. Get User Media
```
OLD: GET /users/:username/media?page=1&limit=20
     Response: [
       { "id": "...", "url": "...", "type": "image|pdf", ...}
     ]

NEW: GET /media/user/:userId
     Authorization: Bearer token
     ✅ Response: {
       "avatar": {
         "filename": "abc-123_1711234567.jpg",
         "url": "https://localhost:3000/files/avatars/abc-123_1711234567.jpg"
       },
       "pdfs": [
         {
           "filename": "abc-123_1711234568.pdf",
           "url": "https://localhost:3000/files/pdfs/abc-123_1711234568.pdf"
         },
         ...
       ],
       "images": [
         {
           "filename": "abc-123_1711234568.jpg",
           "url": "https://localhost:3000/files/images/abc-123_1711234568.jpg"
         },
         ...
       ]
     }

REFACTOR: 🟡 IMPORTANT - Structure complètement différente
FILE: src/services/api.js > profileAPI.getUserMedia()
      src/pages/Profile/Profile.jsx > media tab
      src/components/MediaGallery.jsx

MIGRATION NOTES:
- Old: flat array of mixed media
- New: grouped by type (avatar, images, pdfs)
- Each item has filename + url
```

---

### 15. Search 42 Users
```
OLD: GET /search/42users?query=john

NEW: GET /search42Users/:login
     Authorization: Bearer token
     ✅ Response: [
       {
         "id": "42_user_id",
         "login": "john",
         "displayName": "John Dupont",
         "avatar": "https://cdn.intra.42.fr/...",
         "campus": "Paris",
         "cursus": "C/Unix",
         "level": 10.5
       },
       ...
     ]

REFACTOR: 🟡 IMPORTANT - Endpoint path change + format change
FILE: src/services/api.js > searchAPI.search42Users()
      src/components/SearchModal.jsx

MIGRATION NOTES:
- Old: query parameter
- New: login as URL path segment
- New fields: campus, cursus, level
```

---

## 📝 POSTS - Contenu

### 16. Get Feed (MAJOR CHANGE)
```
OLD: GET /posts?page=1&limit=10
     ❌ Pagination: page-based
     ❌ Response: { posts: [...], total: ... }
     ❌ Structure: _count.likes, _count.comments

NEW: GET /post?date=ISO_DATE&limit=10
     ✅ Pagination: date-based
     ✅ Query params:
        - date: date du plus ancien post déjà chargé (optionnel, sinon now())
        - limit: nombre de posts à retourner
     ✅ Response: [
       {
         "id", "content", "image", "pdf", "userId",
         "createdAt", "modifiedAt",
         "commentsCount", "likesCount"
       },
       ...
     ]

REFACTOR: 🔴 CRITICAL - BIGGEST CHANGE for Feed functionality
FILE: src/services/api.js > postsAPI.getFeed()
      src/context/AppContext.jsx > fetchPosts, loadMorePosts
      src/pages/Feed/Feed.jsx > infinite scroll logic

MIGRATION NOTES:
- Old: Go to page 2, 3, 4... (standard pagination)
- New: Stateless date-based pagination
- 2 different use cases:
  1. Refresh (no date) = get latest posts
  2. Load more (with date) = get older posts
- UI Change: Remove page numbers, add "Refresh" + "Load More" buttons
```

---

### 17. Create Post (FormData)
```
OLD: POST /posts
     { "content": "..." } OR FormData with media
     Response: { id, ... }

NEW: POST /post
     Authorization: Bearer token
     FormData:
       "post": { "content": "..." }   // optionnel si media
       "media": File                  // optionnel si content
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - FormData format change
FILE: src/services/api.js > postsAPI.createPost()
      src/components/CreatePostForm.jsx
      src/context/AppContext.jsx > addPost()

MIGRATION NOTES:
- Media can be .jpg, .jpeg, .png or PDF
- Either content OR media (at least one must be present)
- "post" and "media" fields must be lowercase
```

---

### 18. Get Post
```
OLD: GET /posts/:postId

NEW: GET /post/:postId
     Authorization: Bearer token
     ✅ Response: {
       "id", "content", "image", "pdf", "userId",
       "createdAt", "modifiedAt",
       "commentsCount", "likesCount"
     }

REFACTOR: 🟡 IMPORTANT - Path change + format change
FILE: src/services/api.js > postsAPI.getPost()

MIGRATION NOTES:
- Structure: _count.* → direct properties
```

---

### 19. Update Post (FormData)
```
OLD: PUT /posts/:postId
     { "content": "..." }

NEW: PUT /post/:postId
     Authorization: Bearer token
     FormData:
       "post": { "content": "..." }   // optionnel si media change
       "media": File                  // optionnel si content change
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - FormData + path change
FILE: src/services/api.js > postsAPI.updatePost()
      src/components/PostCard.jsx > edit functionality

MIGRATION NOTES:
- Only include fields that are changing
- Media replaces previous media entirely
```

---

### 20. Delete Post
```
OLD: DELETE /posts/:postId

NEW: DELETE /post/:postId
     Authorization: Bearer token
     ✅ Response: {}

REFACTOR: 🟢 Minor - Just path change
FILE: src/services/api.js > postsAPI.deletePost()
      src/context/AppContext.jsx > deletePost()
```

---

## 💬 COMMENTS - Commentaires

### 21. Get Comments (Date Pagination)
```
OLD: GET /comments/post/:postId?page=1&limit=20

NEW: GET /comment/post/:postId?date=ISO&limit=20
     Authorization: Bearer token
     ✅ Response: [
       {
         "id", "content", "userId", "postId",
         "createdAt", "modifiedAt", "deleted"
       },
       ...
     ]

REFACTOR: 🔴 CRITICAL - Date pagination + 'deleted' field
FILE: src/services/api.js > commentsAPI.getCommentsByPost()
      src/components/CommentSection.jsx

MIGRATION NOTES:
- Comments now have a "deleted" field
- Date-based pagination like posts
- Need 2 buttons: Refresh + Load More
```

---

### 22. Create Comment
```
OLD: POST /comments/post/:postId
     { "content": "..." }

NEW: POST /comment/post/:postId
     Authorization: Bearer token
     { "content": "..." }
     ✅ Response: {}

REFACTOR: 🟡 IMPORTANT - Path singular
FILE: src/services/api.js > commentsAPI.createComment()
      src/components/CommentSection.jsx
```

---

### 23. Update Comment
```
OLD: PATCH /comments/:commentId
     { "content": "..." }

NEW: PUT /comment/:commentId
     Authorization: Bearer token
     { "content": "..." }
     ✅ Response: {}

REFACTOR: 🟡 IMPORTANT - PATCH → PUT + path singular
FILE: src/services/api.js > commentsAPI.updateComment()
      src/components/CommentSection.jsx
```

---

### 24. Delete Comment
```
OLD: DELETE /comments/:commentId

NEW: DELETE /comment/:commentId
     Authorization: Bearer token
     ✅ Response: {}

REFACTOR: 🟢 Minor - Path singular only
FILE: src/services/api.js > commentsAPI.deleteComment()
      src/components/CommentSection.jsx
```

---

## ❤️ LIKES - J'aime

### 25. Like Post (RESTRUCTURED)
```
OLD: POST /posts/:postId/like
     Body: {}

NEW: POST /like
     Authorization: Bearer token
     { "postId": "..." }
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - Endpoint + body format fundamentally changed
FILE: src/services/api.js > postsAPI.likePost()
      src/context/AppContext.jsx > toggleLike()
      src/components/PostCard.jsx

MIGRATION NOTES:
- PostId goes in body, not URL
- New unified endpoint for all likes
```

---

### 26. Unlike Post
```
OLD: DELETE /posts/:postId/like

NEW: DELETE /like/post/:postId
     Authorization: Bearer token
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - Path change
FILE: src/services/api.js > postsAPI.unlikePost()
      src/context/AppContext.jsx > toggleLike()
```

---

### 27. Get Likes on Post
```
OLD: ?

NEW: GET /like/post/:postId
     Authorization: Bearer token
     ✅ Response: [
       { "userId": "..." },
       { "userId": "..." },
       ...
     ]

REFACTOR: 🟢 New feature
FILE: src/services/api.js > likesAPI.getLikesOnPost()
      (Optional - for showing who liked a post)
```

---

### 28. Get My Likes (REMOVED from dedicated route)
```
OLD: GET /likes/me
     Response: { likedPostIds: [...] }

NEW: Must use GET /like/post/:postId for each post
     OR get from posts via /post?date=...&limit=...

REFACTOR: 🔴 CRITICAL - Function removed, must fetch differently
FILE: Refactor to not use likesAPI.getMyLikes()
      Instead: Track likes in post objects or fetch post-by-post
```

---

## 👥 SOCIAL - Suivi & Followers

### 29. Get My Followers
```
OLD: GET /users/:username/followers
     (Works for any user)

NEW: GET /social/followers
     Authorization: Bearer token
     (Only for connected user)
     ✅ Response: [
       {
         "id", "username", "firstname", "lastname", "avatar"
       },
       ...
     ]

REFACTOR: 🔴 CRITICAL - Only works for current user
FILE: src/services/api.js > followersAPI.getFollowers()
      src/pages/Followers/Followers.jsx

LIMITATION: Cannot view other users' followers
WORKAROUND: Need new endpoint or different design?
```

---

### 30. Get My Following (Friends)
```
OLD: GET /users/:username/following

NEW: GET /social/friends
     Authorization: Bearer token
     (Only for connected user)
     ✅ Response: [
       {
         "id", "username", "firstname", "lastname", "avatar"
       },
       ...
     ]

REFACTOR: 🔴 CRITICAL - Only works for current user
FILE: src/services/api.js > followersAPI.getFollowing()
      src/pages/Followers/Followers.jsx

LIMITATION: Cannot view other users' following
```

---

### 31. Follow User (BY ID)
```
OLD: POST /users/:username/follow

NEW: POST /social/user/:userId
     Authorization: Bearer token
     Body: {}
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - userId based + path change
FILE: src/services/api.js > followersAPI.follow()
      src/components/ProfileCard.jsx
      src/pages/Profile/PublicProfile.jsx
```

---

### 32. Unfollow User
```
OLD: DELETE /users/:username/follow

NEW: DELETE /social/user/:userId
     Authorization: Bearer token
     ✅ Response: {}

REFACTOR: 🔴 CRITICAL - userId based + path change
FILE: src/services/api.js > followersAPI.unfollow()
      src/components/ProfileCard.jsx
      src/pages/Profile/PublicProfile.jsx
```

---

## 📊 Summary Table

| # | Feature | OLD | NEW | Critical | Files Affected |
|---|---------|-----|-----|----------|-----------------|
| 1 | Login | `/auth/login` | `/auth/` | 🔴 | api.js, Login.jsx |
| 2 | Register 42 v1 | N/A | `/register/42` | 🔴 | api.js, Register42.jsx |
| 3 | Register 42 v2 | `/auth/42/confirm` | `/register` | 🔴 | api.js, Register42.jsx |
| 4 | Auth 42 | `/auth/42` | `/auth/42` | 🟡 | api.js, Login.jsx |
| 5 | Change PW | `/auth/change-password` | `/auth/` | 🟡 | api.js, Settings.jsx |
| 6 | Get All Users | `/users?page=...` | `/user` | 🟡 | api.js |
| 7 | Get User | `/users/:un` | `/user/:id` | 🔴 | api.js, Profile.jsx |
| 8 | Update Profile | `PATCH /users/me` | `PUT /user/:id` | 🔴 | api.js, Settings.jsx |
| 9 | Restore 42 | N/A | `PUT /user/data42:id` | 🟢 | api.js |
| 10 | Delete Account | N/A | `DELETE /user/:id` | 🟢 | api.js, Settings.jsx |
| 11 | User Posts | `/users/:un/posts` | `/post/user/:id` | 🔴 | api.js, Profile.jsx |
| 12 | Commented Posts | N/A | `/post/commented/:id` | 🟢 | api.js |
| 13 | User Likes | `/users/:un/likes` | `/post/liked/:id` | 🔴 | api.js, Profile.jsx |
| 14 | User Media | `/users/:un/media` | `/media/user/:id` | 🟡 | api.js, Profile.jsx |
| 15 | Search 42 | `/search/42users` | `/search42Users/:login` | 🟡 | api.js, Search.jsx |
| 16 | Get Feed | `/posts?page=...` | `/post?date=...` | 🔴 | api.js, Feed.jsx |
| 17 | Create Post | `POST /posts` | `POST /post` | 🔴 | api.js, CreatePostForm.jsx |
| 18 | Get Post | `GET /posts/:id` | `GET /post/:id` | 🟡 | api.js |
| 19 | Update Post | `PUT /posts/:id` | `PUT /post/:id` | 🔴 | api.js, PostCard.jsx |
| 20 | Delete Post | `DELETE /posts/:id` | `DELETE /post/:id` | 🟢 | api.js |
| 21 | Get Comments | `/comments/post/:id` | `/comment/post/:id` | 🔴 | api.js, CommentSection.jsx |
| 22 | Create Comment | `POST /comments/post/:id` | `POST /comment/post/:id` | 🟡 | api.js, CommentSection.jsx |
| 23 | Update Comment | `PATCH /comments/:id` | `PUT /comment/:id` | 🟡 | api.js, CommentSection.jsx |
| 24 | Delete Comment | `DELETE /comments/:id` | `DELETE /comment/:id` | 🟢 | api.js, CommentSection.jsx |
| 25 | Like Post | `POST /posts/:id/like` | `POST /like` | 🔴 | api.js, PostCard.jsx |
| 26 | Unlike | `DELETE /posts/:id/like` | `DELETE /like/post/:id` | 🔴 | api.js, PostCard.jsx |
| 27 | Get Likes | N/A | `GET /like/post/:id` | 🟢 | api.js |
| 28 | My Likes | `GET /likes/me` | Removed | 🔴 | api.js, AppContext.jsx |
| 29 | Get Followers | `/users/:un/followers` | `/social/followers` | 🔴 | api.js, Followers.jsx |
| 30 | Get Following | `/users/:un/following` | `/social/friends` | 🔴 | api.js, Followers.jsx |
| 31 | Follow | `POST /users/:un/follow` | `POST /social/user/:id` | 🔴 | api.js, ProfileCard.jsx |
| 32 | Unfollow | `DELETE /users/:un/follow` | `DELETE /social/user/:id` | 🔴 | api.js, ProfileCard.jsx |

---

## 🎯 Critical Patterns to Handle

### Pattern 1: Date-Based Pagination
```javascript
// Old: page-based
getFeed(page = 1, limit = 10)

// New: date-based  
getFeed(date = null, limit = 10) {
  // date = null → fresh load (most recent)
  // date = "2026-03-25T12:00:00Z" → load before this date (older)
}
```

### Pattern 2: FormData with Optional Fields
```javascript
// For user updates, avatars, post media
const formData = new FormData();
if (userData.username) formData.append('user[username]', userData.username);
if (file) formData.append('avatar', file);
```

### Pattern 3: userId vs username
```javascript
// Old: Worked directly with usernames
GET /users/john/posts

// New: Must resolve username → userId first
1. GET /user (get all users to find john's id)
2. GET /post/user/123 (use the id)
OR
1. Search user by name
2. Get their userId
3. Fetch their posts
```

### Pattern 4: Avatar Format Handling
```javascript
// Could be 42 API URL
"https://cdn.intra.42.fr/users/john.png"

// Or internal server URL
"https://localhost:3000/files/avatars/abc-123_1234567.jpg"

// Must handle both in display
```

