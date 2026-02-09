import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MyWorks from "../../components/work/user/MyWorks";

// User dashboard showing profile info and assigned works
export default function UserDashboard() {
  // Read authentication state
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Debug log for user data
  console.log("user -> ", user);

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
      Taskify User Dashboard
      </h1>

      {/* User profile details */}
      <div className="bg-white p-4 rounded shadow">
        <p>
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>

      {/* User works */}
      <div className="mt-5">
        <MyWorks userId={user?.id} />
      </div>
    </div>
  );
}
