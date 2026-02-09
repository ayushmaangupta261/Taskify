import { useState } from "react";
import { useDispatch } from "react-redux";
import { createWork } from "../../../services/operations/workOperations";

// Modal for creating a new work item
export default function CreateWorkModal({ onClose, onCreated }) {
  const dispatch = useDispatch();

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submit if title is empty
    if (!form?.title.trim()) return;

    setLoading(true);

    // Dispatch create work action
    const result = await dispatch(
      createWork(form.title, form.description, (work) => {
        onCreated?.(work);
      })
    );

    setLoading(false);

    // Close modal on success
    if (result) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded">
        <h2 className="text-lg font-bold mb-4">Create Work</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={form?.title}
            onChange={(e) =>
              setForm({ ...form, title: e?.target?.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={form?.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
