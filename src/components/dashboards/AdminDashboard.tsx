import { useEffect, useState } from "react";
import { Users, UserCheck, BookOpen, Trash2, Pencil } from "lucide-react";
import AddUserForm from "./AddUserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);

  // GET all users
  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddUser(true)}
        >
          Add User
        </button>
      </div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2 space-x-2">
                  <button className="text-blue-500 hover:underline">
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">No users found.</p>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserForm
          onClose={() => {
            setShowAddUser(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
