// Landing page for the application
export default function Home() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to <span className="text-indigo-600">Taskify</span>
      </h1>

      {/* Short platform description */}
      <p className="text-gray-600">
        Secure trading platform with role-based authentication.
      </p>
    </div>
  );
}
