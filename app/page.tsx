'use client';

import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900">WordGrow</span>
                <span className="ml-2 text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Daily vocabulary that sticks
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => redirect('/auth')}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Make new words feel familiar,
              <br />
              <span className="text-gray-700">not intimidating.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg">
              WordGrow helps you learn a few words each day, write your own sentences, and get gentle AI feedback—so you
              actually remember what you learn.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12">
              <button
                onClick={() => redirect('/auth')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium text-center cursor-pointer"
              >
                Start learning for free
              </button>
            </div>
          </div>

          {/* Right side - Word card mockup */}
          <div className="order-1 lg:order-2 lg:pl-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Today in WordGrow</span>
                <div className="flex items-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Streak: 7 days</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Serene</h3>
                <p className="text-gray-600 text-sm mb-4">Calm, peaceful, and untroubled; tranquil.</p>
                <p className="text-xs text-gray-500 mb-4">First practice sentence:</p>
                <p className="text-sm text-gray-700 italic">"The lake was serene in the early morning light."</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-gray-900">Daily result: 3/5</span>
                  <span className="text-xs text-gray-500">Advanced practice and sentence feedback</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why WordGrow Section */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-sm text-gray-500 mb-2">Why WordGrow</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 px-4">
              A calmer way to build a stronger vocabulary.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto px-4">
              No flashcard chaos. WordGrow keeps each day focused: just a few words, natural sentences, and a simple
              review that fits into your routine.
            </p>
            <button className="text-blue-600 hover:text-blue-700 mt-4 text-sm font-medium">See the dashboard →</button>
          </div>

          {/* Three columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center px-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily word sessions</h3>
              <p className="text-gray-600 text-sm">
                Meet a small set of curated words each day with clear definitions and examples that feel human, not
                textbook-heavy.
              </p>
              <p className="text-xs text-blue-600 mt-2">5-8 words. Spaced. Contextual.</p>
            </div>

            <div className="text-center px-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Write own sentences</h3>
              <p className="text-gray-600 text-sm">
                Write sentences based on your life, work, or studies, then revisit them later so new vocabulary feels
                natural to use.
              </p>
              <p className="text-xs text-blue-600 mt-2">Sentence practice. Real fluency.</p>
            </div>

            <div className="text-center px-4 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gentle AI feedback</h3>
              <p className="text-gray-600 text-sm">
                Get simple corrections and suggestions that focus on clarity and tone instead of overwhelming grammar
                lectures.
              </p>
              <p className="text-xs text-blue-600 mt-2">Feedback. Clear suggestions.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 space-y-4 sm:space-y-0">
            <p>© 2024 WordGrow. All rights reserved.</p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
