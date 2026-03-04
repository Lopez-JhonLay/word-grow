import { getUserLearnedWords } from '@/app/actions/word.action';
import ProgressClient from './ProgressClient';

async function Progress() {
  const learnedWords = await getUserLearnedWords();

  return <ProgressClient learnedWords={learnedWords} />;
}

export default Progress;
