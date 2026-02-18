import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardCard from '@/app/components/DashboardCard';

import DashboardTodaysVocab from '@/app/components/DashboardTodaysVocab';

import { fetchDailyWords } from '@/app/actions/word.action';

import { Word } from '@/types/dictionary';

async function Home() {
  const words = (await fetchDailyWords()) as Word[];

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

        <DashboardTodaysVocab words={words || []} />
      </div>
    </div>
  );
}

export default Home;
