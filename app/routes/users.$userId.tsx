import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Pencil, Check } from "lucide-react";

interface Note {
  judge: string;
  rate: number;
  timestamp: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  notes: Note[];
}

export async function loader({ params }: { params: { userId: string } }) {
  const res = await fetch(`https://api-cnw6qzk6uq-uc.a.run.app/user?username=${params.userId}`);
  const data = await res.json();

  return { user: data.user };
}

// Fonction utilitaire pour formater le timestamp
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function User() {
  const { user } = useLoaderData<{ user: User }>();

  // Initialisation de l'état
  const [notes, setNotes] = useState(user.notes);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState<Note | null>(null);

  // Synchroniser les notes lorsque les données utilisateur changent
  useEffect(() => {
    setNotes(user.notes);
  }, [user]);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedNote(notes[index]);
  };

  const handleSaveClick = async () => {
    if (editedNote && editingIndex !== null) {
      try {
        const response = await fetch("https://api-cnw6qzk6uq-uc.a.run.app/user/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            judge: editedNote.judge,
            rate: editedNote.rate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la mise à jour des données.");
        }

        // Mettre à jour localement la note modifiée
        setNotes((prevNotes: Note[]) =>
          prevNotes.map((note, index) =>
            index === editingIndex ? { ...note, ...editedNote } : note
          )
        );

        // Réinitialiser les champs d'édition
        setEditingIndex(null);
        setEditedNote(null);
      } catch (error: any) {
        console.error("Erreur :", error);
        alert("Échec de la mise à jour : " + error.message);
      }
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-bold mb-12">Users</h1>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-xl mt-2">Email: {user.email}</p>
      </div>

      {/* Notes Table */}
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-2xl">Judge</th>
            <th className="p-2 text-2xl">Note</th>
            <th className="p-2 text-2xl">Date</th>
            <th className="p-2 text-2xl">Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note: Note, index: number) => (
            <tr key={index} className="border-t text-xl">
              {editingIndex === index ? (
                <>
                  <td className="p-2">
                    <input
                      type="text"
                      value={editedNote?.judge || ""}
                      onChange={(e) => setEditedNote({ ...editedNote!, judge: e.target.value })}
                      className="border-2 p-2 rounded mr-2 bg-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={editedNote?.rate || ""}
                      onChange={(e) =>
                        setEditedNote({ ...editedNote!, rate: parseFloat(e.target.value) })
                      }
                      className="border-2 p-2 rounded mr-2 bg-white"
                    />
                  </td>
                  <td className="p-2">{formatDate(note.timestamp)}</td>
                  <td className="p-2 text-green-600 cursor-pointer">
                    <Check onClick={handleSaveClick} />
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{note.judge}</td>
                  <td className="p-2">{note.rate}</td>
                  <td className="p-2">{formatDate(note.timestamp)}</td>
                  <td className="p-2 text-blue-600 cursor-pointer">
                    <p onClick={() => handleEditClick(index)}>Modifier</p>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
