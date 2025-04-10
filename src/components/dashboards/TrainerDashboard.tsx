import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Assessment {
  id: string;
  assessmentByTrainer: string;
  assessmentSubmitted: string;
  userId: string;
  studentName: string;
  status: string;
}

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [newAssessment, setNewAssessment] = useState({
    studentId: "",
    assessmentByTrainer: user?.name || "",
    assessmentSubmitted: "",
  });
  const [loading, setLoading] = useState(true);

  const API =
    import.meta.env.VITE_TRAINER_API || "http://localhost:5678/trainer";
  // Fetch all assessments and users
  // This effect runs once when the component mounts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/allAsses`);
        const allAssessments = res.data;

        const uniqueUserIds = [
          ...new Set(allAssessments.map((a: any) => a.userId)),
        ];

        const studentList: Student[] = [];

        for (let id of uniqueUserIds) {
          try {
            const userRes = await axios.get(`${API}/fetch/${id}`);
            const userData = userRes.data.user;
            studentList.push({
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
            });
          } catch (err) {
            console.warn(`Failed to fetch user with id ${id}`);
          }
        }

        const enhancedAssessments: Assessment[] = allAssessments.map(
          (a: any) => {
            const student = studentList.find(
              (s) => s.id === a.userId.toString()
            );
            return {
              id: a.id.toString(),
              assessmentByTrainer: a.assessmentByTrainer,
              assessmentSubmitted: a.assessmentSubmitted,
              userId: a.userId.toString(),
              studentName: student?.name || "Unknown",
              status: a.status,
            };
          }
        );

        setStudents(studentList);
        setAssessments(enhancedAssessments);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAssessment.studentId || !newAssessment.assessmentSubmitted) {
      alert("Please fill in all fields");
      return;
    }

    const student = students.find((s) => s.id === newAssessment.studentId);

    const payload = {
      userId: parseInt(newAssessment.studentId),
      assessmentByTrainer: user?.name || "Trainer",
      assessmentSubmitted: newAssessment.assessmentSubmitted,
      remarks: "Assigned by Trainer",
      marks: 0,
      status: "Not Started",
    };

    try {
      const res = await axios.post(`${API}/postasses`, payload);
      const saved = res.data;

      const newEntry: Assessment = {
        id: saved.id.toString(),
        assessmentByTrainer: saved.assessmentByTrainer,
        assessmentSubmitted: saved.assessmentSubmitted,
        userId: saved.userId.toString(),
        studentName: student?.name || "Unknown",
        status: saved.status,
      };

      setAssessments([...assessments, newEntry]);
      setNewAssessment({
        studentId: "",
        assessmentByTrainer: user?.name || "",
        assessmentSubmitted: "",
      });
    } catch (err) {
      console.error("Error submitting assessment", err);
    }
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
                htmlFor="assessmentSubmitted"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assessment Description
              </label>
              <textarea
                id="assessmentSubmitted"
                value={newAssessment.assessmentSubmitted}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    assessmentSubmitted: e.target.value,
                  })
                }
                rows={4}
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
                      <h3 className="font-medium">
                        Trainer: {assessment.assessmentByTrainer}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Student: {assessment.studentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Remarks: {assessment.assessmentSubmitted}
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
