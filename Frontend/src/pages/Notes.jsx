import React, { useEffect, useState } from "react";
import API from "../api/api";
import Header from "../components/Header";
import NoteCard from "../components/NoteCard";
import { getUser } from "../utils/auth";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = getUser();

  const fetchNotes = async () => {
    try {
      const resp = await API.get("/notes");
      setNotes(resp.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const resp = await API.post("/notes", { title, body });
      setNotes((prev) => [resp.data, ...prev]);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar/Header */}
      <Header />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* User Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold">Your Notes</h2>
          <p className="text-sm text-gray-600">
            Signed in as {user?.email || "xxxxxx@xxxx.com"}
          </p>
        </div>

        {/* Create Note Form */}
        <form
          onSubmit={createNote}
          className="bg-white p-4 rounded-lg shadow mb-6"
        >
          {error && (
            <div className="text-sm text-red-600 mb-2">{error}</div>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note..."
            className="w-full p-2 border rounded mb-3"
            rows={4}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Create Note"}
          </button>
        </form>

        {/* Notes List */}
        <h3 className="text-lg font-semibold mb-3">Saved Notes</h3>
        <div className="space-y-3">
          {notes.length === 0 && (
            <div className="text-sm text-gray-600">No notes yet.</div>
          )}
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </main>
    </div>
  );
}
