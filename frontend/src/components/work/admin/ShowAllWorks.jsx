import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllWorks } from "../../../services/operations/workOperations";
import AdminWorkDetailsModal from "./AdminWorkDetailsModal";
import Loader1 from "../../../assets/loaders/Loader1";

// Displays all works for admin with status and details
export default function ShowAllWorks({ refreshKey }) {
  const dispatch = useDispatch();

  // Local state for works and UI control
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWork, setActiveWork] = useState(null);

  // Fetch all works from backend
  const loadWorks = async () => {
    setLoading(true);
    const data = await dispatch(getAllWorks());
    setWorks(data || []);
    setLoading(false);
  };

  // Load works on mount and when refreshKey changes
  useEffect(() => {
    loadWorks();
  }, [dispatch, refreshKey]);

  // Resolve UI styles based on work status
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700";
      case "in_progress":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader1 />
        <p className="text-sm text-gray-500 animate-pulse">
          Loading your works...
        </p>
      </div>
    );
  }

  // Empty state
  if (works?.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
        <div className="text-4xl">📂</div>
        <p className="text-lg font-medium text-gray-700">
          No works found
        </p>
        <p className="text-sm text-gray-500 max-w-sm">
          You don't any work yet. Once you create a work,
          it will appear here.
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
            className="
              relative
              bg-white
              border
              rounded-xl
              p-5
              shadow-sm
              hover:shadow-md
              transition
              cursor-pointer
            "
          >
            {/* Work status badge */}
            <span
              className={`
                absolute top-4 right-4
                px-3 py-1 text-xs font-semibold rounded-full
                ${getStatusStyle(work?.status)}
              `}
            >
              {work?.status?.replace("_", " ")}
            </span>

            {/* Work title */}
            <h2 className="text-lg font-semibold text-gray-900">
              {work?.title}
            </h2>

            {/* Work description */}
            <p className="text-xs text-gray-900">
              {work?.description}
            </p>

            {/* Meta details */}
            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-500">
                Members:{" "}
                <span className="font-medium text-gray-700">
                  {work?.members?.length || 0}
                </span>
              </p>

              {work?.createdBy && (
                <p className="text-xs text-gray-400">
                  Created by {work?.createdBy?.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Work details modal */}
      {activeWork && (
        <AdminWorkDetailsModal
          work={activeWork}
          onClose={async () => {
            setActiveWork(null);
            await loadWorks();
          }}
        />
      )}
    </>
  );
}
