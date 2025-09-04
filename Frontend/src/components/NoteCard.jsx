import React from 'react'


export default function NoteCard({note, onDelete}){
return (
<div className="p-4 bg-white rounded-lg shadow-sm">
<div className="flex justify-between items-start">
<div>
<h3 className="font-semibold text-lg">{note.title || 'Untitled'}</h3>
<p className="mt-2 text-sm text-gray-600">{note.body}</p>
</div>
<button onClick={() => onDelete(note._id)} className="text-red-500">Delete</button>
</div>
</div>
)
}