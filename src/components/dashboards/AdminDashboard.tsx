import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  FileCheck,
  Trash2,
  Pencil,
  UserPlus,
} from "lucide-react";
import AddUserForm from "./AddUserForm";
import EditUserForms from "./EditUserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  totalUsers: number;
  trainers: number;
  students: number;
  assessments: number;
}

interface Assessment {
  id: string;
  studentName: string;
  trainerName: string;
  status: string;
  submittedDate: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    trainers: 0,
    students: 0,
    assessments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "analytics">("users");
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const mockUsers: User[] = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        {
          id: 2,
          name: "John Trainer",
          email: "john@example.com",
          role: "trainer",
        },
        {
          id: 3,
          name: "Sarah Trainer",
          email: "sarah@example.com",
          role: "trainer",
        },
        {
          id: 4,
          name: "Mike Student",
          email: "mike@example.com",
          role: "student",
        },
        {
          id: 5,
          name: "Lisa Student",
          email: "lisa@example.com",
          role: "student",
        },
        {
          id: 6,
          name: "David Student",
          email: "david@example.com",
          role: "student",
        },
      ];

      const trainers = mockUsers.filter(
        (user) => user.role === "trainer"
      ).length;
      const students = mockUsers.filter(
        (user) => user.role === "student"
      ).length;

      setUsers(mockUsers);
      setStats({
        totalUsers: mockUsers.length,
        trainers,
        students,
        assessments: 12,
      });

      const mockAssessments: Assessment[] = [
        {
          id: "1",
          studentName: "Mike Student",
          trainerName: "John Trainer",
          status: "Completed",
          submittedDate: "2025-04-09",
        },
        {
          id: "2",
          studentName: "Lisa Student",
          trainerName: "Sarah Trainer",
          status: "In Progress",
          submittedDate: "2025-04-10",
        },
        {
          id: "3",
          studentName: "David Student",
          trainerName: "John Trainer",
          status: "Not Started",
          submittedDate: "2025-04-11",
        },
      ];

      setRecentAssessments(mockAssessments);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const deletedUser = users.find((user) => user.id === id);
      setUsers(users.filter((user) => user.id !== id));

      if (deletedUser) {
        setStats((prev) => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          trainers:
            deletedUser.role === "trainer" ? prev.trainers - 1 : prev.trainers,
          students:
            deletedUser.role === "student" ? prev.students - 1 : prev.students,
        }));
      }
    }
  };

  const handleAddUser = (newUser: Omit<User, "id">) => {
    const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = { ...newUser, id };
    setUsers([...users, user]);

    setStats((prev) => ({
      ...prev,
      totalUsers: prev.totalUsers + 1,
      trainers: newUser.role === "trainer" ? prev.trainers + 1 : prev.trainers,
      students: newUser.role === "student" ? prev.students + 1 : prev.students,
    }));

    setShowAddUser(false);
  };

  const handleEditUser = (editedUser: User) => {
    const originalUser = users.find((user) => user.id === editedUser.id);
    setUsers(
      users.map((user) => (user.id === editedUser.id ? editedUser : user))
    );

    if (originalUser && originalUser.role !== editedUser.role) {
      setStats((prev) => {
        let newTrainers = prev.trainers;
        let newStudents = prev.students;

        if (originalUser.role === "trainer") newTrainers--;
        if (originalUser.role === "student") newStudents--;
        if (editedUser.role === "trainer") newTrainers++;
        if (editedUser.role === "student") newStudents++;

        return {
          ...prev,
          trainers: newTrainers,
          students: newStudents,
        };
      });
    }

    setShowEditUser(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: <Users className="text-blue-700" size={24} />,
            bg: "bg-blue-100",
          },
          {
            label: "Trainers",
            value: stats.trainers,
            icon: <UserCheck className="text-green-700" size={24} />,
            bg: "bg-green-100",
          },
          {
            label: "Students",
            value: stats.students,
            icon: <BookOpen className="text-purple-700" size={24} />,
            bg: "bg-purple-100",
          },
          {
            label: "Assessments",
            value: stats.assessments,
            icon: <FileCheck className="text-amber-700" size={24} />,
            bg: "bg-amber-100",
          },
        ].map(({ label, value, icon, bg }, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 flex items-center"
          >
            <div className={`p-3 ${bg} rounded-full mr-4`}>{icon}</div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["users", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "users" | "analytics")}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "users" ? "User Management" : "Analytics & Overview"}
          </button>
        ))}
      </div>

      {/* Users */}
      {activeTab === "users" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              onClick={() => setShowAddUser(true)}
            >
              <UserPlus size={18} className="mr-2" /> Add User
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => setShowEditUser(user.id)}>
                        <Pencil size={18} className="text-blue-600" />
                      </button>
                      <button onClick={() => deleteUser(user.id)}>
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Assessments</h2>
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAssessments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.id}</td>
                  <td className="p-3">{a.studentName}</td>
                  <td className="p-3">{a.trainerName}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">{a.submittedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit User Forms */}
      {showAddUser && (
        <AddUserForm
          onClose={() => setShowAddUser(false)}
          onSave={handleAddUser}
        />
      )}
      {showEditUser !== null && (
        <EditUserForm
          user={users.find((u) => u.id === showEditUser)!}
          onClose={() => setShowEditUser(null)}
          onSave={handleEditUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
