import React, { useEffect, useState } from "react";
import { Calendar, Users, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

interface Session {
  course: string;
  time: string;
  students: number;
}

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [hoursCompleted, setHoursCompleted] = useState(0);

  useEffect(() => {
    if (user?.role === "trainer") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(`/api/trainer/dashboard/${user?.id}`);
      setUpcomingSessions(data.sessions);
      setTotalClasses(data.todayClasses);
      setActiveStudents(data.activeStudents);
      setHoursCompleted(data.hoursCompleted);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Calendar className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Today's Classes</h2>
          <p className="text-gray-600">Your scheduled sessions for today</p>
          <p className="text-2xl font-bold mt-4">{totalClasses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="h-8 w-8 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Active Students</h2>
          <p className="text-gray-600">Students in your current courses</p>
          <p className="text-2xl font-bold mt-4">{activeStudents}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="h-8 w-8 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Hours Completed</h2>
          <p className="text-gray-600">Total teaching hours this month</p>
          <p className="text-2xl font-bold mt-4">{hoursCompleted}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{session.course}</p>
                    <p className="text-sm text-gray-500">{session.time}</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {session.students} students
                  </span>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <p className="text-gray-500 text-sm">No upcoming sessions.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
