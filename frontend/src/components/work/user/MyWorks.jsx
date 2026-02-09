import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getWorksByUserId } from "../../../services/operations/workOperations";
import Loader2 from "../../../assets/loaders/Loader2";
import UserTasksModal from "./UserTasksModal";

// Displays works assigned to the logged-in user
export default function MyWorks({ userId }) {
  const dispatch = useDispatch();

  // Local state for works and UI control
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWork, setActiveWork] = useState(null);

  // Fetch works assigned to the user
  const loadWorks = async () => {
    setLoading(true);
    const data = await dispatch(getWorksByUserId(userId));
    console.log("data -> ", data);

    setWorks(data || []);
    setLoading(false);
  };

  // Resolve UI color based on work status
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

  // Load works when userId becomes available
  useEffect(() => {
    if (userId) loadWorks();
  }, [dispatch, userId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 />
      </div>
    );
  }

  // Empty state
  if (works.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-2">
        <span className="text-4xl">📂</span>
        <p className="text-lg font-medium text-gray-700">
          No works assigned
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Works grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {works?.map((work) => (
          <div
            key={work?._id}
            onClick={() => setActiveWork(work)}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold">
              {work?.title}
            </h3>
            <p className="text-sm text-gray-600 ">
              {work?.description}
            </p>

            <p className="text-sm text-gray-600 ">
              Created By: {work?.createdBy?.name}
            </p>

           

            <p className="mt-2 text-xs text-gray-500">
              Members: {work?.members?.length}
            </p>

            <p className="text-xs capitalize text-gray-400">
              Status:{" "}
              <span className={getStatusStyle(work?.status)}>
                {work?.status?.replace("_", " ")}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* User tasks modal */}
      {activeWork && (
        <UserTasksModal
          work={activeWork}
          userId={userId}
          onClose={async () => {
            setActiveWork(null);
            await loadWorks();
          }}
        />
      )}
    </>
  );
}
