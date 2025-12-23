"use client";

import { useUser } from "@/app/contexts/UserContext";

function Home() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to WordGrow, {user?.fullName || "User"}!</h1>
      <p className="text-gray-600 mb-6">Start your learning journey here!</p>

      {user && (
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user.fullName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
