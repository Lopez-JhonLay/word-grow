'use client';

import { useState } from 'react';
import { Word } from '@/types/dictionary';
import DashboardHeader from './DashboardHeader';
import DashboardCard from './DashboardCard';
import DashboardTodaysVocab from './DashboardTodaysVocab';

type Props = {
  words: Word[];
};

export default function DashboardContent({ words }: Props) {
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  return (
    <div>
      <DashboardHeader onStartLearning={() => setIsPracticeModalOpen(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard icon="🔥" title="Learning Streak" stats="12 Days" bgColor="bg-orange-100" />
        <DashboardCard icon="🎓" title="Words Learned" stats={245} bgColor="bg-blue-100" />
        <DashboardCard icon="📈" title="Accuracy Rate" stats="86%" bgColor="bg-green-100" />
        <DashboardCard icon="✓" title="Today's Progress" stats="3/5" bgColor="bg-indigo-100" />
      </div>

      <DashboardTodaysVocab
        words={words}
        isModalOpen={isPracticeModalOpen}
        onCloseModal={() => setIsPracticeModalOpen(false)}
      />
    </div>
  );
}
