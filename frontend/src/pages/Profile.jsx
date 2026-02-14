import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.name}
        </h1>

        <p className="text-gray-600 mb-2">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="text-gray-600 mb-6">
          <strong>Role:</strong> {user.role}
        </p>

        <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition" >
          Logout
        </button>
      </div>

    </div>
  );
}
