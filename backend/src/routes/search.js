import express from 'express';
import { search42Users } from '../controllers/searchController.js';

const router = express.Router();

// GET /api/search/42users?query=xxx - Rechercher des utilisateurs 42
router.get('/42users', search42Users);

export default router;
