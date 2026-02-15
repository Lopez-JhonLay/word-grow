'use client';

import DashboardHeader from '@/app/components/DashboardHeader';
import WordCard from '@/app/components/WordCard';

function Home() {
  return (
    <div className="p-8">
      <div>
        <DashboardHeader />
        <WordCard />
      </div>
    </div>
  );
}

export default Home;
