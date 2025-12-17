"use client";

import { useState } from "react";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

function page() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex overflow-hidden border border-gray-100">
        <div className="w-2/5 p-12 hidden md:flex flex-col justify-between relative bg-white">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500 text-white p-1.5 rounded-lg">
                <span className="font-bold text-lg px-1">W</span>
              </div>
              <span className="text-xl font-bold text-gray-800">WordGrow</span>
            </div>

            <p className="text-gray-500 mb-8 leading-relaxed">
              Grow your vocabulary with small, focused daily sessions.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3 text-blue-600 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Why learners love WordGrow</span>
              </div>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  3–5 new words per day, tailored to your level.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  AI feedback on real sentences you write.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  Quick quizzes to lock in what you learn.
                </li>
              </ul>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-12 leading-relaxed">
            By continuing, you agree to our Terms of Use and acknowledge our Privacy Policy.
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-12 bg-white relative">
          <div className="bg-white p-0 rounded-lg inline-flex w-full mb-6 border border-gray-200 overflow-hidden mt-8 sm:mt-0">
            <button
              onClick={() => setActiveTab("login")}
              className={`w-full text-sm font-medium py-2.5 transition ${
                activeTab === "login" ? "bg-blue-500 text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`w-full text-sm font-medium py-2.5 transition border-l border-gray-200 ${
                activeTab === "signup" ? "bg-blue-500 text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              Sign up
            </button>
          </div>

          {activeTab === "login" ? (
            <Login onSwitch={() => setActiveTab("signup")} />
          ) : (
            <SignUp onSwitch={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
