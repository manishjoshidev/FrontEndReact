import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentDailyUpdates from "../StudentDailyUpdates";

interface Assessment {
  id: string;
  assessmentByTrainer: string;
  assessmentSubmitted: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAssessments = async () => {
      try {
        const response = await fetch(`/api/students/${user.id}/assessments`);
        if (!response.ok) throw new Error("Failed to fetch assessments");

        const data: Assessment[] = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user?.id]);

  const handleChange = (id: string, value: string) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, assessmentSubmitted: value } : a))
    );
  };

  const handleSubmitAssessment = async (id: string) => {
    const current = assessments.find((a) => a.id === id);
    if (!current || !current.assessmentSubmitted.trim()) {
      alert("Please enter your submission before submitting.");
      return;
    }

    try {
      const response = await fetch(
        `/api/students/${user?.id}/assessments/${id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentSubmitted: current.assessmentSubmitted,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit assessment");

      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Try again later.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading assessments...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Assessments By Trainer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.length === 0 ? (
            <p>No assessments assigned yet.</p>
          ) : (
            assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {assessment.assessmentByTrainer}
                </h3>

                <textarea
                  rows={3}
                  placeholder="Type your submission here..."
                  className="w-full border p-2 rounded mt-2 text-sm"
                  value={assessment.assessmentSubmitted}
                  onChange={(e) => handleChange(assessment.id, e.target.value)}
                />

                <button
                  className="mt-3 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => handleSubmitAssessment(assessment.id)}
                >
                  Submit Assessment
                </button>
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
