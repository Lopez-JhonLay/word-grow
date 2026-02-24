'use client';

import { useEffect, useState } from 'react';
import { Word } from '@/types/dictionary';
import { WordPracticeForm } from './WordPracticeForm';
import { DailyWordItem } from './DailyWordItem';

type DashboardTodaysVocabProps = {
  dailyWords: Word[];
  completedWords: string[];
  isModalOpen: boolean;
  onCloseModal: () => void;
};

function DashboardTodaysVocab({ dailyWords, completedWords, isModalOpen, onCloseModal }: DashboardTodaysVocabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeWord = dailyWords[currentIndex];
  const isLastWord = currentIndex === dailyWords.length - 1;

  useEffect(() => {
    if (isModalOpen) {
      setCurrentIndex(0);
    }
  }, [isModalOpen]);

  const handleNextWord = () => {
    if (isLastWord) {
      onCloseModal();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Today's Vocabulary</h2>
        </div>

        <div className="space-y-6">
          {dailyWords.map((item) => (
            <DailyWordItem key={item.word} word={item} isCompleted={completedWords.includes(item.word)} />
          ))}
        </div>
      </div>

      {/* Modal logic remains the same... */}
      {isModalOpen && activeWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* ... existing modal code ... */}
          <WordPracticeForm
            key={activeWord.word}
            word={activeWord.word}
            definition={activeWord.definition}
            example={activeWord.example}
            isLastWord={isLastWord}
            onNext={handleNextWord}
          />
          {/* ... */}
        </div>
      )}
    </>
  );
}

export default DashboardTodaysVocab;
