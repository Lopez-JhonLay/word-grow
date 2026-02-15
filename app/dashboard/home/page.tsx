'use client';

import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardCard from '@/app/components/DashboardCard';
import WordCard from '@/app/components/WordCard';
import DashboardTodaysVocab from '@/app/components/DashboardTodaysVocab';

function Home() {
  return (
    <div className="p-4 sm:p-8">
      <div>
        <DashboardHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard icon="🔥" title="Learning Streak" stats="12 Days" bgColor="bg-orange-100" />
          <DashboardCard icon="🎓" title="Words Learned" stats={245} bgColor="bg-blue-100" />
          <DashboardCard icon="📈" title="Accuracy Rate" stats="86%" bgColor="bg-green-100" />
          <DashboardCard icon="✓" title="Today's Progress" stats="3/5" bgColor="bg-indigo-100" />
        </div>

        {/* <WordCard /> */}
        <DashboardTodaysVocab />
      </div>
    </div>
  );
}

export default Home;
