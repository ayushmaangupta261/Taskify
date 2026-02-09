import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getUserTasksByWork,
  updateTaskStatus
} from "../../../services/operations/taskOperations";
import Loader2 from "../../../assets/loaders/Loader2";

// Modal to display and manage tasks assigned to the user for a work
export default function UserTasksModal({
  work,
  userId,
  onClose
}) {
  const dispatch = useDispatch();

  // Local state for tasks and UI status
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Fetch user tasks for the selected work
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const data = await dispatch(
        getUserTasksByWork({
          workId: work._id,
          userId
        })
      );
      setTasks(data || []);
      setLoading(false);
    };

    if (work?._id) loadTasks();
  }, [dispatch, work?._id, userId]);

  // Update task status
  const handleStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);

    const updatedTask = await dispatch(
      updateTaskStatus({ taskId, status })
    );

    if (updatedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t?._id === taskId ? updatedTask : t
        )
      );
    }

    setUpdatingTaskId(null);
  };

  // Resolve UI color based on task status
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
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">

        {/* Close modal */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1">
          {work?.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Your Tasks
        </p>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No tasks assigned to you in this work
          </p>
        ) : (
          <div className="space-y-2">
            {tasks?.map((task) => (
              <div
                key={task?._id}
                className="border rounded px-3 py-2 text-sm flex justify-between items-center"
              >
                <span>{task?.title}</span>

                {/* Task status selector */}
                <select
                  value={task?.status}
                  onChange={(e) =>
                    handleStatusChange(task?._id, e.target.value)
                  }
                  className={`border px-2 py-1 rounded text-xs capitalize bg-white
                    ${getStatusStyle(task?.status)}
                    ${updatingTaskId === task?._id ? "opacity-60 pointer-events-none" : ""}
                  `}
                >
                  <option value="pending" className="text-red-700">pending</option>
                  <option value="accepted" className="text-gray-600">accepted</option>
                  <option value="in_progress" className="text-orange-700">in progress</option>
                  <option value="completed" className="text-green-700">completed</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

