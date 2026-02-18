'use client';

import { useUser } from '../contexts/UserContext';

function DashboardHeader() {
  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Ready to expand your horizons and learn new words today?</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors whitespace-nowrap text-sm sm:text-base">
        <span className="text-lg">▶</span>
        Start Today's Learning
      </button>
    </div>
  );
}

export default DashboardHeader;
