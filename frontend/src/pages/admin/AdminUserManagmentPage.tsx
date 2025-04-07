import { useEffect, useState } from "react";
import Loading from "../../components/frontend_util/Loading";
import { getAllUsersApi } from "../../components/api/Api";
import { Link } from "react-router-dom";


type User = {
  id: number;
  username: string;
  email: string;
}


export const AdminUserManagmentPage = () => {
  const [shownUsers, setShownUsers] = useState<User[]>([]);
  const [shownUsersLoading, setShownUsersLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  const getAllUsers = () => {
    getAllUsersApi(username).then((response) => {
      setShownUsers(response);
      setShownUsersLoading(false);
    }).catch((error) => {
      console.error("Error fetching users:", error);
      setShownUsersLoading(false);
    });
  };

  useEffect(() => {
    setShownUsersLoading(true);
    getAllUsers();
  }, [username]);

  return (
    <div>
      <h1>Admin User Management Page</h1>
      <p>This is the admin user management page. You can delete/remove accounts and access all profiles.</p>
      <h2>All Users</h2>
      <input
        type="text"
        placeholder="Search by username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        {shownUsersLoading ? (
          <Loading />
        ) : shownUsers.length > 0 ? (
          shownUsers.map((user) => (
            <div key={user.id} className="user-card">
              <Link to={`/profile/${user.username}`}><h3>{user.username}</h3></Link>
              <p>Email: {user.email}</p>
              <button onClick={() => { /* Add delete functionality here */ }}>Delete</button>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
