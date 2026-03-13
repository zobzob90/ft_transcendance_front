import express from 'express';
import { search42Users, searchLocalUsers } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search/42users?query=xxx - Rechercher des utilisateurs sur l'intra 42
router.get('/42users', search42Users);

// GET /api/search/users?query=xxx - Rechercher des utilisateurs inscrits sur 42Hub
router.get('/users', searchLocalUsers);

export default router;
