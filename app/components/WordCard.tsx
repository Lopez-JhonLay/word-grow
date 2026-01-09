"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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

const initialSaveState: State = {
  message: null,
  errors: {},
};

export default function WordCard({
  word = "Ubiquitous",
  definition = "Present, appearing, or found everywhere.",
  example = "Smartphones have become ubiquitous in modern society.",
}: WordCardProps) {
  const [sentence, setSentence] = useState("");
  const [saveState, saveAction, isSaving] = useActionState(saveUserSentence, initialSaveState);
  const [grammarState, grammarAction, isChecking] = useActionState(checkUserSentence, initialGrammarState);

  useEffect(() => {
    if (saveState.message === "Saved successfully!") {
      toast.success("Sentence saved successfully!");
      setSentence("");
    } else if (saveState.message && saveState.message !== "Saved successfully!") {
      toast.error(saveState.message);
    }
  }, [saveState.message]);

  useEffect(() => {
    if (grammarState.success && grammarState.is_correct) {
      toast.success("Great! Your sentence is correct!");
    } else if (grammarState.error) {
      toast.error(grammarState.error);
    }
  }, [grammarState.success, grammarState.is_correct, grammarState.error]);

  return (
    <div className="max-w-2xl bg-white rounded-lg shadow-xl p-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">{word}</h1>

      <p className="mb-2">
        <span className="text-gray-500 font-medium">Definition:</span> {definition}
      </p>

      <p className="mb-6">
        <span className="text-gray-500 font-medium">Example:</span> {example}
      </p>

      {/* Textarea */}
      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        className={`w-full h-24 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
          saveState.errors?.userSentence ? "border-red-500" : "border-gray-200"
        }`}
        placeholder="Type your sentence here..."
        disabled={isSaving}
      />

      {/* Validation error */}
      {saveState.errors?.userSentence && (
        <p className="mt-2 text-sm text-red-500">{saveState.errors.userSentence[0]}</p>
      )}

      {/* AI Feedback */}
      <div className="mt-4">
        <form action={grammarAction}>
          <input type="hidden" name="word" value={word} />
          <input type="hidden" name="definition" value={definition} />
          <input type="hidden" name="example" value={example} />
          <input type="hidden" name="userSentence" value={sentence} />
          <button type="submit" disabled={isChecking} className="cursor-pointer">
            {isChecking ? "Checking..." : "Check"}
          </button>
        </form>
      </div>

      {grammarState.success && (
        <div className="mt-4 py-4 rounded-lg text-sm">
          <strong>AI Feedback:</strong>{" "}
          <p className={grammarState.is_correct ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
            {grammarState.explanation}
          </p>
          {grammarState.corrected && !grammarState.is_correct && (
            <div className="mt-2 font-mono text-green-700">Did you mean: "{grammarState.corrected}"?</div>
          )}
        </div>
      )}

      {grammarState.error && <p className="mt-2 text-sm text-red-500">{grammarState.error}</p>}

      {/* SAVE FORM */}
      <form action={saveAction} className="mt-6">
        <input type="hidden" name="userSentence" value={sentence} />
        <input type="hidden" name="word" value={word} />
        <input type="hidden" name="definition" value={definition} />

        <button
          type="submit"
          disabled={!grammarState.is_correct || isSaving}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
