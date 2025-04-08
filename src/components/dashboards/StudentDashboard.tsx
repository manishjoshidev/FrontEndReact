import React, { useEffect, useState } from "react";
import { BookOpen, Award, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface Course {
  name: string;
  progress: number;
  nextClass: string;
}

interface Assignment {
  title: string;
  due: string;
  status: string;
}

interface DashboardData {
  enrolledCourses: number;
  achievements: number;
  studyHours: number;
  currentCourses: Course[];
  assignments: Assignment[];
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    enrolledCourses: 0,
    achievements: 0,
    studyHours: 0,
    currentCourses: [],
    assignments: [],
  });

  useEffect(() => {
    fetch("https://your-backend.com/api/student-dashboard")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("Error fetching student dashboard:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
          <p className="text-gray-600">Your active courses</p>
          <p className="text-2xl font-bold mt-4">
            {dashboardData.enrolledCourses}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Award className="h-8 w-8 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Achievements</h2>
          <p className="text-gray-600">Completed certifications</p>
          <p className="text-2xl font-bold mt-4">
            {dashboardData.achievements}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="h-8 w-8 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Study Hours</h2>
          <p className="text-gray-600">This month's study time</p>
          <p className="text-2xl font-bold mt-4">{dashboardData.studyHours}h</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
            <div className="space-y-4">
              {dashboardData.currentCourses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-sm text-gray-500">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Next class: {course.nextClass}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
            <div className="space-y-4">
              {dashboardData.assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-gray-500">
                      Due in {assignment.due}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      assignment.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
