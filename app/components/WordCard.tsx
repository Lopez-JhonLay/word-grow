// 'use client';

// import { useActionState, useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { GrammarState, saveUserSentence, checkUserSentence, State, fetchWordData } from '../actions/word.action';
// import { WordData } from '../../types/dictionary';

// interface WordCardProps {
//   initialWord?: string;
// }

// const initialGrammarState: GrammarState = {
//   success: false,
//   error: '',
//   corrected: '',
//   explanation: '',
//   is_correct: false,
// };

// const initialSaveState: State = {
//   message: null,
//   errors: {},
// };

// export default function WordCard({ initialWord }: WordCardProps) {
//   const [sentence, setSentence] = useState('');
//   const [wordData, setWordData] = useState<WordData | null>(null);
//   const [isLoadingWord, setIsLoadingWord] = useState(true);
//   const [saveState, saveAction, isSaving] = useActionState(saveUserSentence, initialSaveState);
//   const [grammarState, grammarAction, isChecking] = useActionState(checkUserSentence, initialGrammarState);

//   // Load word data on component mount
//   useEffect(() => {
//     const loadWordData = async () => {
//       setIsLoadingWord(true);
//       const data = await fetchWordData(initialWord);
//       if (data) {
//         setWordData(data);
//       } else {
//         // Fallback to default data if API fails
//         setWordData({
//           word: 'Ubiquitous',
//           definition: 'Present, appearing, or found everywhere.',
//           example: 'Smartphones have become ubiquitous in modern society.',
//         });
//         toast.error('Failed to load word from API, using default word');
//       }
//       setIsLoadingWord(false);
//     };

//     loadWordData();
//   }, [initialWord]);

//   // Function to load a new random word
//   const loadNewWord = async () => {
//     setIsLoadingWord(true);
//     setSentence(''); // Clear current sentence
//     const data = await fetchWordData();
//     if (data) {
//       setWordData(data);
//       toast.success(`New word loaded: ${data.word}`);
//     } else {
//       toast.error('Failed to load new word');
//     }
//     setIsLoadingWord(false);
//   };

//   useEffect(() => {
//     if (saveState.message === 'Saved successfully!') {
//       toast.success('Sentence saved successfully!');
//       setSentence('');
//     } else if (saveState.message && saveState.message !== 'Saved successfully!') {
//       toast.error(saveState.message);
//     }
//   }, [saveState.message]);

//   useEffect(() => {
//     if (grammarState.success && grammarState.is_correct) {
//       toast.success('Great! Your sentence is correct!');
//     } else if (grammarState.error) {
//       toast.error(grammarState.error);
//     }
//   }, [grammarState.success, grammarState.is_correct, grammarState.error]);

//   // Show loading state while fetching word data
//   if (isLoadingWord || !wordData) {
//     return (
//       <div className="max-w-2xl bg-white rounded-xl shadow-xl p-8 border border-gray-100">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="w-16 h-1 bg-gray-200 rounded-full mb-8"></div>
//           <div className="space-y-4 mb-8">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             </div>
//             <div className="bg-blue-50 rounded-lg p-4">
//               <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { word, definition, example } = wordData;

//   return (
//     <div className="max-w-2xl bg-white rounded-xl shadow-xl p-8 border border-gray-100">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">{word}</h1>
//           </div>
//           <button
//             onClick={loadNewWord}
//             disabled={isLoadingWord}
//             className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
//           >
//             {isLoadingWord ? 'Loading...' : 'New Word'}
//           </button>
//         </div>
//         <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
//       </div>

//       {/* Definition and Example */}
//       <div className="space-y-4 mb-8">
//         <div className="bg-gray-50 rounded-lg p-4">
//           <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Definition</span>
//           <p className="text-gray-800 mt-1 leading-relaxed">{definition}</p>
//         </div>

//         <div className="bg-blue-50 rounded-lg p-4">
//           <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Example</span>
//           <p className="text-gray-800 mt-1 leading-relaxed italic">"{example}"</p>
//         </div>
//       </div>

//       {/* Input Section */}
//       <div className="mb-6">
//         <label className="block text-gray-700 font-semibold mb-3">Create your own sentence using "{word}":</label>
//         <textarea
//           value={sentence}
//           onChange={(e) => setSentence(e.target.value)}
//           className={`w-full h-28 p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//             saveState.errors?.userSentence
//               ? 'border-red-300 bg-red-50'
//               : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
//           }`}
//           placeholder="Type your sentence here..."
//           disabled={isSaving}
//         />

//         {/* Validation error */}
//         {saveState.errors?.userSentence && (
//           <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-sm text-red-600 font-medium">{saveState.errors.userSentence[0]}</p>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-3 mb-6">
//         <form action={grammarAction} className="flex-1">
//           <input type="hidden" name="word" value={word} />
//           <input type="hidden" name="definition" value={definition} />
//           <input type="hidden" name="example" value={example} />
//           <input type="hidden" name="userSentence" value={sentence} />
//           <button
//             type="submit"
//             disabled={isChecking || !sentence.trim()}
//             className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
//           >
//             {isChecking ? (
//               <span className="flex items-center justify-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Checking...
//               </span>
//             ) : (
//               'Check Grammar'
//             )}
//           </button>
//         </form>

//         <form action={saveAction}>
//           <input type="hidden" name="userSentence" value={sentence} />
//           <input type="hidden" name="word" value={word} />
//           <input type="hidden" name="definition" value={definition} />

//           <button
//             type="submit"
//             disabled={!grammarState.is_correct || isSaving}
//             className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
//           >
//             {isSaving ? (
//               <span className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Saving...
//               </span>
//             ) : (
//               'Save'
//             )}
//           </button>
//         </form>
//       </div>

//       {/* AI Feedback */}
//       {grammarState.success && (
//         <div
//           className={`p-4 rounded-xl border-l-4 ${
//             grammarState.is_correct ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'
//           }`}
//         >
//           <div className="flex items-start gap-3">
//             <div
//               className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
//                 grammarState.is_correct ? 'bg-green-500' : 'bg-yellow-500'
//               }`}
//             >
//               {grammarState.is_correct ? '✓' : '!'}
//             </div>
//             <div className="flex-1">
//               <h4 className="font-semibold text-gray-900 mb-1">AI Feedback</h4>
//               <p
//                 className={`text-sm leading-relaxed ${grammarState.is_correct ? 'text-green-800' : 'text-yellow-800'}`}
//               >
//                 {grammarState.explanation}
//               </p>
//               {grammarState.corrected && !grammarState.is_correct && (
//                 <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
//                   <span className="text-sm text-gray-600 font-medium">Suggested correction:</span>
//                   <p className="text-green-700 font-medium mt-1">"{grammarState.corrected}"</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {grammarState.error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
//               ✕
//             </div>
//             <p className="text-sm text-red-600 font-medium">{grammarState.error}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
