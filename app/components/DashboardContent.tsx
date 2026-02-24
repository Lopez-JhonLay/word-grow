'use client';

import { useState } from 'react';
import { Word } from '@/types/dictionary';
import DashboardHeader from './DashboardHeader';
import DashboardCard from './DashboardCard';
import DashboardTodaysVocab from './DashboardTodaysVocab';

type Props = {
  dailyWords: Word[];
  completedWords: string[];
  totalWordsLearned: number;
  dailyProgress: number;
  totalDaily: number;
};

export default function DashboardContent({
  dailyWords,
  completedWords,
  totalWordsLearned,
  dailyProgress,
  totalDaily,
}: Props) {
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  return (
    <div>
      <DashboardHeader onStartLearning={() => setIsPracticeModalOpen(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard icon="🔥" title="Learning Streak" stats="12 Days" bgColor="bg-orange-100" />
        <DashboardCard stats={totalWordsLearned} icon="🎓" title="Words Learned" bgColor="bg-blue-100" />
        <DashboardCard icon="📈" title="Accuracy Rate" stats="86%" bgColor="bg-green-100" />
        <DashboardCard
          stats={`${dailyProgress} / ${totalDaily}`}
          icon="✓"
          title="Today's Progress"
          bgColor="bg-indigo-100"
        />
      </div>

      <DashboardTodaysVocab
        dailyWords={dailyWords}
        completedWords={completedWords}
        isModalOpen={isPracticeModalOpen}
        onCloseModal={() => setIsPracticeModalOpen(false)}
      />
    </div>
  );
}
