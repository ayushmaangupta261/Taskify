import { useState } from "react";
import CreateWorkModal from "../../components/work/admin/CreateWorkModal";
import ShowAllWorks from "../../components/work/admin/ShowAllWorks";
import { useSelector } from "react-redux";

// Admin dashboard for managing works
export default function AdminDashboard() {
  // Control create modal visibility
  const [showCreate, setShowCreate] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Key used to trigger works refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle successful work creation
  const handleCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setShowCreate(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Taskify Admin Dashboard</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + Create Work
        </button>
      </div>


      <div className="bg-white p-4 rounded shadow mb-4">
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>

      {/* Create work modal */}
      {showCreate && (
        <CreateWorkModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Works list */}
      <ShowAllWorks refreshKey={refreshKey} />
    </div>
  );
}
