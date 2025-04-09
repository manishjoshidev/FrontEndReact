// services/api.ts

// services/api.ts

export type Update = {
  id: string;
  user_id: string;
  username: string;
  today_update: string;
  tomorrow_update: string;
  created_at: string;
};

export const fetchStudentUpdates = async (
  userId: string
): Promise<Update[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/student-updates/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching updates:", error);
    return [];
  }
};
