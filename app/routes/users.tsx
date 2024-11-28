import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";

interface User {
    id: string,
    username: string,
    email: string,
}

export async function loader() {
    const response = await fetch("https://api-cnw6qzk6uq-uc.a.run.app/users");
    const users = await response.json();
    return ({userList: users.users});
}

export default function Users() {
    let { userList } = useLoaderData<typeof loader>();
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredUsers = userList.filter((user: User) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="w-1/4 border-r-2 p-2">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        className="w-full border-2 p-2 rounded bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: User) => (
                            <li key={user.id} className="text-xl">
                               <Link to={`/users/${user.username}`}>{user.username}</Link>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    )}
                </ul>
            </div>
            <div className="flex-1 flex">
                <Outlet />
            </div>
        </> 
    );
}