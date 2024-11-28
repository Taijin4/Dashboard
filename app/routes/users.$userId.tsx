import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Pencil, Check } from "lucide-react";
import { useState } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    notes: Note[];
}

interface Note {
    judge: string;
    rate: number;
}

export async function loader({ params }: LoaderFunctionArgs) {
    const res = await fetch(`https://api-cnw6qzk6uq-uc.a.run.app/user?username=${params.userId}`);
    const data = await res.json();

    return { user: data.user };
}

export default function User() {
    const { user } = useLoaderData<{ user: User }>();
    const [notes, setNotes] = useState(user.notes);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedNote, setEditedNote] = useState<Note | null>(null);

    const handleEditClick = (index: number) => {
        setEditingIndex(index);
        setEditedNote({ ...notes[index] });
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
    
                // Si l'API renvoie des données utilisateur, utilisez-les pour mettre à jour l'état local
                const updatedData = await response.json();
    
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
    
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Note) => {
        if (editedNote) {
            setEditedNote({ ...editedNote, [field]: e.target.value });
        }
    };

    return (
        <div className="p-8 w-full">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-2xl my-2">Email : {user.email}</p>
            <hr className="w-full my-6" />
            <ul>
                {notes.map((note: Note, index: number) => (
                    <div key={index} className="flex items-center mb-4">
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editedNote?.judge || ""}
                                    onChange={(e) => handleInputChange(e, "judge")}
                                    className="border-2 p-2 rounded mr-2 bg-white"
                                />
                                <input
                                    type="number"
                                    value={editedNote?.rate || ""}
                                    onChange={(e) => handleInputChange(e, "rate")}
                                    className="border-2 p-2 rounded mr-2 bg-white"
                                />
                                <Check
                                    className="h-6 w-6 text-green-600 cursor-pointer"
                                    onClick={handleSaveClick}
                                />
                            </>
                        ) : (
                            <>
                                <li className="text-xl">
                                    Juge : {note.judge} - Note : {note.rate}
                                </li>
                                <Pencil
                                    className="h-6 w-6 ml-4 cursor-pointer"
                                    onClick={() => handleEditClick(index)}
                                />
                            </>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
}
