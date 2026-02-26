import { fetchDailyWords, getUserDashboardStats } from '@/app/actions/word.action';
import { Word } from '@/types/dictionary';
import DashboardContent from '@/app/components/DashboardContent';

async function Home() {
  const dailyWords = (await fetchDailyWords()) as Word[];

  const stats = await getUserDashboardStats(dailyWords || []);

  const { totalWordsLearned, completedWordList, dailyProgress, streak } = stats;

  const totalDaily = dailyWords ? dailyWords.length : 0;

  return (
    <div className="p-4 sm:p-8">
      <DashboardContent
        dailyWords={dailyWords}
        completedWords={completedWordList}
        totalWordsLearned={totalWordsLearned}
        dailyProgress={dailyProgress}
        totalDaily={totalDaily}
        streak={streak}
      />
    </div>
  );
}

export default Home;
