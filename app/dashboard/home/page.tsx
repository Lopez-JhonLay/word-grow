"use client";

import { useUser } from "@/app/contexts/UserContext";

import WordCard from "@/app/components/WordCard";

function Home() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to WordGrow, {user?.fullName || "User"}!</h1>
      <p className="text-gray-600 mb-6">Start your learning journey here!</p>

      <div>
        <WordCard />
      </div>
    </div>
  );
}

export default Home;
