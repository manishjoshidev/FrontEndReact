import React, { useEffect, useState } from "react";

export interface Update {
  id: string;
  username: string;
  today_update: string;
  tomorrow_update: string;
  created_at: string;
}

interface StudentDailyUpdatesProps {
  userId: string;
}

// Mock API service
export const fetchStudentUpdates = async (
  userId: string
): Promise<Update[]> => {
  // In a real app, you'd make an API call here
  // For demo purposes, returning mock data after a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockData = [
    {
      id: "1",
      username: "John Doe",
      today_update:
        "Completed JavaScript assignment and attended React workshop",
      tomorrow_update:
        "Will work on TypeScript exercises and prepare for assessment",
      created_at: "2025-04-07T14:30:00Z",
    },
    {
      id: "2",
      username: "John Doe",
      today_update:
        "Finished React component exercises and studied hooks documentation",
      tomorrow_update: "Will start working on the final project wireframes",
      created_at: "2025-04-06T15:45:00Z",
    },
  ];

  // Simulate filtering updates by userId
  return mockData.filter((update) => update.username === userId);
};

const StudentDailyUpdates: React.FC<StudentDailyUpdatesProps> = ({
  userId,
}) => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const res = await fetchStudentUpdates(userId);
        setUpdates(res);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUpdates();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">Student Daily Updates</h2>
        <p>Loading updates...</p>
      </div>
    );
  }

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Student Daily Updates</h2>
      {updates.length === 0 ? (
        <p>No updates available.</p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded"
            >
              <p className="text-sm text-gray-600">
                <strong>{update.username}</strong> —{" "}
                {formatDate(update.created_at)}
              </p>
              <p className="mt-2">
                <strong>Today:</strong> {update.today_update}
              </p>
              <p className="mt-1">
                <strong>Tomorrow:</strong> {update.tomorrow_update}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDailyUpdates;
