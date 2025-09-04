import express from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(requireAuth);
router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
