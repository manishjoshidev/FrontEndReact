import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentDailyUpdates from "../StudentDailyUpdates";

interface Assessment {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    // Mock data for demonstration
    const mockData: Assessment[] = [
      {
        id: "1",
        title: "JavaScript Basics",
        dueDate: "2025-04-15",
        status: "In Progress",
      },
      {
        id: "2",
        title: "React Fundamentals",
        dueDate: "2025-04-20",
        status: "Not Started",
      },
      {
        id: "3",
        title: "TypeScript Introduction",
        dueDate: "2025-04-10",
        status: "Completed",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setAssignments(mockData);
      setLoading(false);
    }, 500);

    // In real implementation:
    // fetch(`/api/students/${user.id}/assessments`)
    //   .then((res) => res.json())
    //   .then((data) => setAssignments(data))
    //   .catch((err) => console.error("Error fetching assessments:", err))
    //   .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return <div className="p-6">Loading assessments...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.length === 0 ? (
            <p>No assessments assigned yet.</p>
          ) : (
            assignments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {assessment.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Due: {assessment.dueDate}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      assessment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : assessment.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {assessment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {user && <StudentDailyUpdates userId={user.id} />}
    </div>
  );
};

export default StudentDashboard;
