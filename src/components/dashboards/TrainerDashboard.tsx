import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Assessment {
  id: string;
  title: string;
  dueDate: string;
  studentId: string;
  studentName: string;
  status: string;
}

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    dueDate: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockStudents: Student[] = [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
      { id: "3", name: "Bob Johnson", email: "bob@example.com" },
    ];

    const mockAssessments: Assessment[] = [
      {
        id: "1",
        title: "JavaScript Basics",
        dueDate: "2025-04-15",
        studentId: "1",
        studentName: "John Doe",
        status: "In Progress",
      },
      {
        id: "2",
        title: "React Fundamentals",
        dueDate: "2025-04-20",
        studentId: "2",
        studentName: "Jane Smith",
        status: "Not Started",
      },
    ];

    // Simulate API calls
    setTimeout(() => {
      setStudents(mockStudents);
      setAssessments(mockAssessments);
      setLoading(false);
    }, 500);

    // In real implementation, fetch students and assessments from API
  }, [user?.id]);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newAssessment.title ||
      !newAssessment.dueDate ||
      !newAssessment.studentId
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Find the student name for display
    const student = students.find((s) => s.id === newAssessment.studentId);

    // Create a new assessment object
    const assessment: Assessment = {
      id: Date.now().toString(), // temporary ID
      title: newAssessment.title,
      dueDate: newAssessment.dueDate,
      studentId: newAssessment.studentId,
      studentName: student?.name || "Unknown Student",
      status: "Not Started",
    };

    // Update local state
    setAssessments([...assessments, assessment]);

    // Reset form
    setNewAssessment({ title: "", dueDate: "", studentId: "" });

    // In real implementation:
    // await fetch('/api/assessments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ...newAssessment,
    //     trainerId: user?.id,
    //     status: 'Not Started'
    //   })
    // });
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assign Assessment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Assign Assessment</h2>
          <form onSubmit={handleAssessmentSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assessment Title
              </label>
              <input
                id="title"
                type="text"
                value={newAssessment.title}
                onChange={(e) =>
                  setNewAssessment({ ...newAssessment, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={newAssessment.dueDate}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    dueDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="student"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Student
              </label>
              <select
                id="student"
                value={newAssessment.studentId}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    studentId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Assign Assessment
            </button>
          </form>
        </div>

        {/* Assessment List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Assigned Assessments</h2>
          {assessments.length === 0 ? (
            <p>No assessments assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-gray-600">
                        Student: {assessment.studentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due: {assessment.dueDate}
                      </p>
                    </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
