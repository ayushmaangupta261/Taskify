import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateMembers } from "../../../services/operations/workOperations.js";
import { getTasksByWorkId } from "../../../services/operations/taskOperations";
import CreateTaskModal from "./CreateTaskModal";

export default function AdminWorkDetailsModal({ work, onClose }) {
  const dispatch = useDispatch();

  console.log("work in modal -> ", work);


  // Local state for work and members
  const [localWork, setLocalWork] = useState(work);
  const [localMembers, setLocalMembers] = useState(work?.members || []);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Task-related state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Sync local state when work prop changes
  useEffect(() => {
    setLocalWork(work);
    setLocalMembers(work?.members || []);
  }, [work]);

  // Fetch tasks when work ID changes
  useEffect(() => {
    if (!work?._id) return;
    reloadTasks();
  }, [work?._id]);

  // Reload tasks for the current work
  const reloadTasks = async () => {
    setLoadingTasks(true);
    const data = await dispatch(getTasksByWorkId(work?._id));
    console.log("task in modal -> ", data);

    setTasks(data || []);
    setLoadingTasks(false);
  };

  // Map status to UI color
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-red-700";
      case "in_progress":
        return "text-orange-700";
      case "completed":
        return "text-green-700";
      default:
        return "text-gray-600";
    }
  };

  // Add member to work
  const handleAddMember = async () => {
    if (!email?.trim()) return;

    setLoading(true);

    const updatedMembers = await dispatch(
      updateMembers({
        workId: localWork?._id,
        addEmail: email?.trim(),
        remove: []
      })
    );

    if (Array.isArray(updatedMembers)) {
      setLocalMembers(updatedMembers);
      setLocalWork((prev) => ({ ...prev, members: updatedMembers }));
      await reloadTasks();
    }

    setEmail("");
    setLoading(false);
  };

  // Remove member from work
  const handleRemoveMember = async (userId) => {
    setLoading(true);

    const updatedMembers = await dispatch(
      updateMembers({
        workId: localWork?._id,
        remove: [userId]
      })
    );

    if (Array.isArray(updatedMembers)) {
      setLocalMembers(updatedMembers);
      setLocalWork((prev) => ({ ...prev, members: updatedMembers }));
      await reloadTasks();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative">

        {/* Close modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Work header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{localWork?.title}</h2>
          <p className="text-gray-700">{localWork?.description}</p>

          <p className="text-sm text-gray-500 capitalize mt-1">
            Status:{" "}
            <span className={`text-xs font-semibold ${getStatusStyle(localWork?.status)}`}>
              {localWork?.status?.replace("_", " ")}
            </span>
          </p>
        </div>

        {/* Members section */}
        <div className="border rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-3">Members</h3>

          <div className="space-y-2 mb-4">
            {localMembers?.length === 0 && (
              <p className="text-sm text-gray-400">No members added</p>
            )}

            {localMembers?.map((user) => (
              <div
                key={user?._id}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
              >
                <span className="text-sm">
                  {user?.name} ({user?.email})
                </span>

                <button
                  disabled={loading}
                  onClick={() => handleRemoveMember(user?._id)}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
            />

            <button
              disabled={loading}
              onClick={handleAddMember}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Tasks section */}
        <div className="flex justify-between items-center mt-6 mb-2">
          <h3 className="font-semibold">Tasks</h3>

          <button
            onClick={() => setShowTaskModal(true)}
            className="text-indigo-600 text-sm font-medium"
          >
            + Create Task
          </button>
        </div>

        {loadingTasks ? (
          <p className="text-sm text-gray-400">Loading tasks...</p>
        ) : tasks?.length === 0 ? (
          <div className="border rounded p-4 text-sm text-gray-400">
            No tasks created yet
          </div>
        ) : (
          <div className="space-y-2">
            {tasks?.map((task) => (
              <div
                key={task?._id}
                className="border rounded px-3 py-2 text-sm flex justify-between"
              >
                <span>{task?.title}</span>
                <span className={getStatusStyle(task?.status)}>
                  {task?.status?.replace("_", " ")}
                </span>
              </div>
            ))}

          </div>
        )}

        {/* Create task modal */}
        {showTaskModal && (
          <CreateTaskModal
            workId={localWork._id}
            members={localMembers}
            onClose={() => setShowTaskModal(false)}
            onCreated={(task) =>
              setTasks((prev) => [task, ...prev])
            }
          />
        )}
      </div>
    </div>
  );
}
