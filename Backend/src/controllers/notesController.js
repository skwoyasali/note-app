import Note from '../models/Note.js';

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const note = await Note.create({ user: req.user._id, title, body });
    res.status(201).json(note);
  } catch (err) { next(err); }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if(!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
