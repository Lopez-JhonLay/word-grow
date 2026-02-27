import { Word } from '@/types/dictionary';

type Props = {
  word: Word;
  isCompleted: boolean;
};

export function DailyWordItem({ word, isCompleted }: Props) {
  const handlePlaySound = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word.word);

    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 capitalize wrap-break-word">{word.word}</h3>

            {isCompleted && (
              <span className="text-green-500 shrink-0" title="Completed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}

            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handlePlaySound}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Listen"
              >
                🔊
              </button>
              <button
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Add to Favorites"
              >
                ❤️
              </button>
            </div>
          </div>
          {word.phonetic && <p className="text-xs sm:text-sm text-gray-500 mt-1">{word.phonetic}</p>}
        </div>

        {isCompleted ? (
          <span className="px-2.5 sm:px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full border border-green-200 shadow-sm whitespace-nowrap self-start">
            Mastered
          </span>
        ) : (
          <span className="px-2.5 sm:px-3 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-full border border-amber-100 whitespace-nowrap self-start">
            Pending
          </span>
        )}
      </div>

      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{word.definition}</p>

      {word.example && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-l-4 border-gray-300 p-3 mb-4 rounded">
          <p className="text-xs sm:text-sm text-gray-700 italic wrap-break-word">"{word.example}"</p>
        </div>
      )}
    </div>
  );
}
