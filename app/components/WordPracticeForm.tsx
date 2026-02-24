'use client';

import { useState } from 'react';
import { checkUserSentence, saveUserSentence } from '@/app/actions/word.action';

type WordPracticeFormProps = {
  word: string;
  definition: string;
  example?: string;
  isLastWord: boolean;
  onNext: () => void;
};

export function WordPracticeForm({ word, definition, example, isLastWord, onNext }: WordPracticeFormProps) {
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function handleCheck() {
    if (!sentence.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('word', word);
    formData.append('definition', definition);
    formData.append('example', example || '');
    formData.append('userSentence', sentence);

    const result = await checkUserSentence({ success: false }, formData);
    setFeedback(result);
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    const formData = new FormData();
    formData.append('word', word);
    formData.append('definition', definition);
    formData.append('userSentence', feedback?.corrected || sentence);

    const result = await saveUserSentence({ message: '' }, formData);

    if (result.message === 'Saved successfully!') {
      setIsSaved(true);
    }
    setLoading(false);
  }

  if (isSaved) {
    return (
      <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Word Mastered!</h3>
          <p className="text-gray-500 mt-2">
            You've successfully practiced "<span className="capitalize text-black font-medium">{word}</span>".
          </p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLastWord ? 'Finish Session' : 'Continue to Next Word'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-3xl font-bold text-gray-900 capitalize mb-2">{word}</h4>
        <p className="text-gray-600 text-base leading-relaxed">{definition}</p>
      </div>

      <textarea
        className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none min-h-[120px] transition-all resize-none text-lg"
        placeholder={`Write a sentence using "${word}"...`}
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        disabled={loading}
      />

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm border ${feedback.is_correct ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}
        >
          <div className="font-bold mb-1 flex items-center gap-2">
            {feedback.is_correct ? (
              <>
                <span className="text-lg">🎉</span> Perfect!
              </>
            ) : (
              <>
                <span className="text-lg">🤔</span> Suggestion
              </>
            )}
          </div>
          <p className="leading-relaxed">{feedback.explanation}</p>
          {!feedback.is_correct && feedback.corrected && (
            <div className="mt-3 p-3 bg-white/60 rounded-lg border border-orange-200/50">
              <span className="font-bold text-xs uppercase tracking-wider text-orange-500 mb-1 block">Correction</span>
              <p className="text-gray-800 font-medium">"{feedback.corrected}"</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {!feedback || !feedback.is_correct ? (
          <button
            onClick={handleCheck}
            disabled={loading || !sentence}
            className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? 'Analyzing...' : 'Check Grammar'}
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Save to Journal'}
          </button>
        )}
      </div>
    </div>
  );
}
