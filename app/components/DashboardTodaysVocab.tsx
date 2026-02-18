'use client';

import { Word } from '@/types/dictionary';

type DashboardTodaysVocabProps = {
  words: Word[];
};

function DashboardTodaysVocab({ words }: DashboardTodaysVocabProps) {
  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Vocabulary</h2>
      </div>

      <div className="space-y-6">
        {words.map((item, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-800 capitalize">{item.word}</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Listen">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Add to Favorites">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {item.phonetic && <p className="text-sm text-gray-500 mt-1">{item.phonetic}</p>}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{item.definition}</p>
            {item.example && (
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-l-4 border-gray-300 p-3 mb-4 rounded">
                <p className="text-sm text-gray-700 italic">"{item.example}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTodaysVocab;
