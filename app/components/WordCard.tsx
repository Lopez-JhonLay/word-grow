"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { GrammarState, saveUserSentence, checkUserSentence, State } from "../actions/word.action";

interface WordCardProps {
  word?: string;
  definition?: string;
  example?: string;
}

const initialGrammarState: GrammarState = {
  success: false,
  error: "",
  corrected: "",
  explanation: "",
  is_correct: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-blue-300"
    >
      {pending ? "Saving..." : "Save & continue"}
      {!pending && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" fill="none" />
          <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )}
    </button>
  );
}

export default function WordCard({
  word = "Ubiquitous",
  definition = "Present, appearing, or found everywhere.",
  example = "Smartphones have become ubiquitous in modern society.",
}: WordCardProps) {
  const initialState: State = { message: null, errors: {} };
  const [saveState, saveAction] = useActionState(saveUserSentence, initialState);
  const [grammarState, grammarAction, isChecking] = useActionState(checkUserSentence, initialGrammarState);

  return (
    <form action={saveAction} className="max-w-2xl bg-white rounded-lg shadow-xl p-8 ">
      <input type="hidden" name="word" value={word} />
      <input type="hidden" name="definition" value={definition} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M5 2h14a1 1 0 0 1 1 1v18l-8-4-8 4V3a1 1 0 0 1 1-1z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{word}</h1>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-gray-500 font-medium">Definition: </span>
        <span className="text-gray-900">{definition}</span>
      </div>

      <div className="mb-8">
        <span className="text-gray-500 font-medium">Example: </span>
        <span className="text-gray-900">{example}</span>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-900 font-medium mb-4">Your sentence</h3>
        <textarea
          name="userSentence"
          className={`w-full h-24 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            saveState.errors?.userSentence ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="Type your sentence here..."
        />
        {saveState.errors?.userSentence && (
          <p className="mt-2 text-sm text-red-500">{saveState.errors.userSentence[0]}</p>
        )}
        {saveState.message && !saveState.errors && <p className="mt-2 text-sm text-green-600">{saveState.message}</p>}
      </div>

      {grammarState.success && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-800">
          <strong>AI Feedback:</strong> {grammarState.explanation}
          {grammarState.corrected && (
            <div className="mt-2 font-mono text-green-700">Did you mean: "{grammarState.corrected}"?</div>
          )}
        </div>
      )}
      {grammarState.error && <p className="text-red-500 text-sm mb-4">{grammarState.error}</p>}

      <div className="flex justify-between items-center">
        <button
          type="submit"
          formAction={grammarAction}
          disabled={isChecking}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          {isChecking ? (
            "Checking..."
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              AI feedback
            </>
          )}
        </button>

        <SubmitButton />
      </div>
    </form>
  );
}
