import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { createTask } from "../../../services/operations/taskOperations.js";

export default function CreateTaskModal({
  onClose,
  workId,
  members = [],
  onCreated
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e?.target?.name]: e?.target?.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATIONS (NO SILENT FAIL)
    if (!form?.title?.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!form?.assignedTo) {
      toast.error("Please assign the task to a user");
      return;
    }

    if (!workId) {
      toast.error("Invalid work selected");
      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(
        createTask(
          {
            title: form?.title,
            description: form?.description,
            workId,
            assignedTo: form?.assignedTo
          },
          (task) => {
            onCreated?.(task);
          }
        )
      );

      if (!result) {
        throw new Error("Task creation failed");
      }

      onClose();

    } catch (error) {
      toast.error(
        error?.message || "Something went wrong while creating task"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return " text-red-700";
      case "in_progress":
        return " text-orange-700";
      case "completed":
        return " text-green-700";
      default:
        return " text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Task title"
            value={form?.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            placeholder="Task description (optional)"
            value={form?.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="assignedTo"
            value={form?.assignedTo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Assign to user</option>

            {members?.length === 0 ? (
              <option disabled>No members available</option>
            ) : (
              members?.map((user) => (
                <option key={user?._id} value={user?._id}>
                  {user?.name} ({user?.email})
                </option>
              ))
            )}
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
