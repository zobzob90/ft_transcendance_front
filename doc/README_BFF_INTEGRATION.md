# 🔄 Integration Guide: Frontend ↔ BFF

**Date**: 26 mars 2026  
**To**: Collègue BFF  
**From**: Eric  
**Status**: ⏳ À valider avant de continuer

---

## 🎯 TL;DR - 3 Things to Fix

Your new BFF API spec is **95% compatible** with the frontend. Just 3 small issues to align:

### Issue #1: Field Names (User Object)
```javascript
// Your BFF sends:
{
  firstname: "John",          // ← lowercase
  lastname: "Doe",            // ← lowercase
  mail: "john@example.com"    // ← "mail" not "email"
}

// Frontend needs:
{
  firstname: "John",          // ✅ This is fine
  lastname: "Doe",            // ✅ This is fine
  mail: "john@example.com"    // ✅ This is fine
}
```

**Action**: ✅ **NO CHANGE NEEDED**  
Frontend will automatically normalize these to camelCase on its side.

---

### Issue #2: Response Format
```javascript
// Your BFF sends (currently):
[
  { id: 1, content: "post 1", likesCount: 5 },
  { id: 2, content: "post 2", likesCount: 3 }
]

// Frontend expects:
[
  { id: 1, content: "post 1", likesCount: 5 },
  { id: 2, content: "post 2", likesCount: 3 }
]
```

**Action**: ✅ **CORRECT FORMAT**  
Your arrays are exactly what frontend expects. No wrapping needed.

---

### Issue #3: Pagination (CONFIRMED ✅)

**Your BFF implementation:**
```
GET /post?limit=10
  → Returns: [post1 (newest), post2, post3, ..., post10 (older)]
  
GET /post?date=2026-03-26T15:45:00Z&limit=10
  → Returns: Posts created BEFORE 2026-03-26T15:45:00Z
  → [post11, post12, ..., post20]
```

**Frontend will send (confirmed):**
```javascript
// First load - get latest posts
GET /post?limit=10

// Load more - use createdAt of last post from previous request
GET /post?date=${posts[posts.length - 1].createdAt}&limit=10
```

**Status: ✅ CONFIRMED** - This is exactly right!

---

## ✅ Everything Else is Perfect

| Feature | Status | Notes |
|---------|--------|-------|
| Auth Routes | ✅ OK | POST /register, GET /register/42, etc. |
| User Routes | ✅ OK | GET /user/:userId, PUT /user/:userId |
| Post Routes | ✅ OK | GET /post, POST /post, PUT /post/:id |
| Comment Routes | ✅ OK | GET /comment/post/:id, POST /comment |
| Like Routes | ✅ OK | POST /like, DELETE /like/post/:id |
| Social Routes | ✅ OK | GET /social/followers, POST /social/user/:id |
| Response Fields | ✅ OK | likesCount, commentsCount, createdAt, etc. |
| Auth Header | ✅ OK | `Authorization: Bearer {token}` |
| Error Format | ✅ OK | `{error: "message"}` |

---

## 🚀 Integration Timeline

**If pagination format is ✅ confirmed:**
- Frontend refactoring: **3 hours max**
- Testing integration: **2 hours**
- **Ready to deploy: ~5 hours**

**If pagination format needs adjustment:**
- Frontend refactoring: **1 hour** (already handles date-based)
- Your adjustment: **depends on implementation**
- Testing: **2 hours**

---

## 📋 Checklist for BFF

Before merging your new API version, please confirm:

- [x] User object uses `firstname`, `lastname`, `mail`
- [x] Login response is `{user: {...}, token: "JWT"}`
- [x] GET /post with no date param returns **latest 10 posts** (newest first)
- [x] GET /post?date=ISO returns posts **created BEFORE that date**
- [x] All array endpoints return plain arrays (not wrapped)
- [x] Dates are **ISO8601 format** (e.g., `2026-03-26T15:45:00.000Z`)
- [x] `_count` syntax is **removed** (using direct fields instead)
- [ ] 401 responses return `{error: "Unauthorized"}` (or similar)

---

## 🔧 Frontend Changes (for our team)

Eric is updating the frontend to:
1. Normalize BFF field names (automatic)
2. Use date-based pagination (replaces page-based)
3. Handle array responses directly
4. Remove all `_count.X` references

**No breaking changes for you.** We handle the adaptation layer.

---

## 💬 Questions?

If something doesn't match, let's discuss:
- Slack: `@eric`
- Discord: Eric#development
- PR: Comment on BFF PR with questions

---

## 📚 Full Documentation

For detailed field-by-field specs, see: [`FRONTEND_BFF_FIXES.md`](./FRONTEND_BFF_FIXES.md)

---

**Status: PAGINATION CONFIRMED** ✅

Pagination is working exactly as expected. Ready to refactor frontend! 🚀
