'use client';

import { useEffect } from 'react';

import { Word } from '@/types/dictionary';

type DashboardTodaysVocabProps = {
  words: Word[];
};

function DashboardTodaysVocab({ words }: DashboardTodaysVocabProps) {
  useEffect(() => {
    console.log('CLIENT:', words);
  }, [words]);

  const vocabularyWords = [
    {
      word: 'Reluctant',
      definition: 'Unwilling and hesitant; disinclined to do something.',
      difficulty: 'MEDIUM',
      difficultyColor: 'bg-orange-100 text-orange-600',
    },
    {
      word: 'Eloquent',
      definition: 'Fluent or persuasive in speaking or writing.',
      difficulty: 'EASY',
      difficultyColor: 'bg-green-100 text-green-600',
    },
    {
      word: 'Pensive',
      definition: 'Engaged in, involving, or reflecting deep or serious thought.',
      difficulty: 'HARD',
      difficultyColor: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Vocabulary</h2>
      </div>

      <div className="space-y-6">
        {vocabularyWords.map((item, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">{item.word}</h3>
              <span className={`${item.difficultyColor} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                {item.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{item.definition}</p>
            <div className="flex gap-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Listen
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Add to Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTodaysVocab;
