import {Form, Link, Outlet, useLoaderData} from "@remix-run/react";
import {MouseEventHandler, useState} from "react";
import {CiSearch} from "react-icons/ci";
import {FaUserCircle} from "react-icons/fa";

interface User {
    id: string;
    username: string;
    email: string;
    imageUrl: string; // Nom de l'image (par exemple : "profile1.jpg")
}

export async function loader() {
    const response = await fetch("https://api-cnw6qzk6uq-uc.a.run.app/users");
    const users = await response.json();
    return {userList: users.users};
}

export default function Users() {
    const {userList} = useLoaderData<typeof loader>();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const filteredUsers = userList.filter((user: User) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="w-1/5 border-r-2 p-8">
                {/* Barre de recherche */}
                <div className="relative mb-4">
                    <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 w-7 h-7"/>
                    <input
                        type="text"
                        placeholder="Search users"
                        className="w-full p-2 px-12 py-5 rounded-xl bg-[#EDEDED] focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <p className="mt-10 mb-5 text-3xl font-bold">Users</p>

                {/* Liste des utilisateurs */}
                <ul className="space-y-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: User) => (
                            <Link
                                to={`/users/${user.username}`}
                                key={user.id}
                            >
                                <li
                                    key={user.id}
                                    onClick={() => setSelectedUserId(user.id)}
                                    className={`flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-100 cursor-pointer mt-2 ${
                                        selectedUserId === user.id ? "bg-gray-200 hover:bg-gray-200" : ""
                                    }`} // Ajout de la classe si sélectionné
                                >
                                    {/* Image de l'utilisateur ou icône par défaut */}
                                    {user.imageUrl ? (
                                        <img
                                            src={`https://api-cnw6qzk6uq-uc.a.run.app/user/image/${user.imageUrl}`}
                                            alt={`${user.username}'s profile`}
                                            className="w-16 h-16 rounded-full object-cover"
                                            onError={(e) => {
                                                // Si l'image ne peut pas être chargée, affiche une icône par défaut
                                                (e.target as HTMLImageElement).src =
                                                    "";
                                                (e.target as HTMLImageElement).style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <FaUserCircle className="w-16 h-16 text-gray-400"/>
                                    )}

                                    {/* Informations utilisateur */}
                                    <div className="flex flex-col">
                                        <p className="text-3xl font-medium hover:underline">{user.username}</p>
                                        <span className="text-lg text-gray-500">
                                            Active
                                        </span>
                                    </div>
                                </li>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    )}
                </ul>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex">
                <Outlet/>
            </div>
        </>
    );
}
