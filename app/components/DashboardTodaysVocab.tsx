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

  const allLearned = dailyWords.length > 0 && dailyWords.every((w) => completedWords.includes(w.word));

  const activeWord = dailyWords[currentIndex];
  const isLastWord = currentIndex === dailyWords.length - 1;

  useEffect(() => {
    if (isModalOpen) {
      if (allLearned) {
        setCurrentIndex(0);
      } else {
        const nextToLearnIndex = dailyWords.findIndex((w) => !completedWords.includes(w.word));
        setCurrentIndex(nextToLearnIndex >= 0 ? nextToLearnIndex : 0);
      }
    }
  }, [isModalOpen, dailyWords, completedWords, allLearned]);

  const handleNextWord = () => {
    if (isLastWord) {
      onCloseModal();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl sm:rounded-4xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Vocabulary</h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {dailyWords.map((item) => (
            <DailyWordItem key={item.word} word={item} isCompleted={completedWords.includes(item.word)} />
          ))}
        </div>
      </div>

      {/* Modal logic remains the same... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {allLearned ? (
              /* --- SCENARIO A: ALL WORDS COMPLETED --- */
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-4xl">🎉</span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">You're All Caught Up!</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You have successfully mastered all of today's vocabulary words. Great job keeping up with your
                    streak!
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Next words available tomorrow</p>
                </div>

                <button
                  onClick={onCloseModal}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Close & See Dashboard
                </button>
              </div>
            ) : (
              /* --- SCENARIO B: WORDS LEFT TO PRACTICE --- */
              activeWord && (
                <WordPracticeForm
                  key={activeWord.word}
                  word={activeWord.word}
                  definition={activeWord.definition}
                  example={activeWord.example}
                  isLastWord={isLastWord}
                  onNext={handleNextWord}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardTodaysVocab;
