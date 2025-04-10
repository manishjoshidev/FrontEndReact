// src/components/AddUserForm.tsx
import React, { useState } from "react";

interface AddUserFormProps {
  onClose: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "student",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New User:", {
      ...formData,
      id: Number(formData.id),
      phoneNumber: Number(formData.phoneNumber),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        {/* ID Field */}
        <input
          type="number"
          placeholder="ID"
          required
          className="w-full mb-3 p-2 border rounded"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        />

        {/* Name Field */}
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full mb-3 p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Email Field */}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-3 p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Password Field */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-3 p-2 border rounded"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Phone Number Field */}
        <input
          type="tel"
          placeholder="Phone Number"
          required
          pattern="[0-9]{10}"
          className="w-full mb-3 p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />

        {/* Role Field */}
        <select
          className="w-full mb-4 p-2 border rounded"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
