'use client';

import { useState, useMemo } from 'react';

interface LearnedWord {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  createdAt: Date;
}

interface ProgressClientProps {
  learnedWords: LearnedWord[];
}

export default function ProgressClient({ learnedWords }: ProgressClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredAndSortedWords = useMemo(() => {
    let filtered = learnedWords;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = learnedWords.filter(
        (word) =>
          word.word.toLowerCase().includes(query) ||
          word.definition.toLowerCase().includes(query) ||
          word.sentence.toLowerCase().includes(query),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [learnedWords, searchQuery, sortBy]);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedWords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedWords = filteredAndSortedWords.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInDays === 0) return 'Mastered today';
    if (diffInDays === 1) return 'Mastered 1 day ago';
    if (diffInDays < 7) return `Mastered ${diffInDays} days ago`;
    if (diffInWeeks === 1) return 'Mastered 1 week ago';
    return `Mastered ${diffInWeeks} weeks ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search learned words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border-0 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'oldest')}
              className="px-4 py-2 text-sm bg-gray-50 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="recent">📅 Most Recent</option>
              <option value="oldest">📅 Oldest First</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedWords.length)} of{' '}
          {filteredAndSortedWords.length} results
        </div>

        <div className="space-y-6">
          {paginatedWords.map((word) => (
            <div key={word.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-3xl font-bold text-gray-900 capitalize">{word.word}</h2>
                </div>
                <p className="text-sm text-gray-400">{getRelativeTime(word.createdAt)}</p>
              </div>

              <div className="px-6 pb-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Usage</h3>
                  </div>
                  <p className="text-gray-700 pl-3">
                    <span className="italic">
                      "
                      {word.sentence.split(' ').map((w, i) => (
                        <span key={i}>
                          {w.toLowerCase().replace(/[.,!?;:"']/g, '') === word.word.toLowerCase() ? (
                            <span className="text-blue-600 font-medium not-italic">{w}</span>
                          ) : (
                            w
                          )}
                          {i < word.sentence.split(' ').length - 1 ? ' ' : ''}
                        </span>
                      ))}
                      "
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredAndSortedWords.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 text-5xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No words found matching your search.' : 'No words learned yet. Start learning!'}
              </p>
            </div>
          )}
        </div>

        {filteredAndSortedWords.length > 0 && (
          <div className="flex justify-between items-center mt-6 text-sm">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
