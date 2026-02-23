import { fetchDailyWords } from '@/app/actions/word.action';
import { Word } from '@/types/dictionary';
import DashboardContent from '@/app/components/DashboardContent';

async function Home() {
  const words = (await fetchDailyWords()) as Word[];

  return (
    <div className="p-4 sm:p-8">
      <DashboardContent words={words} />
    </div>
  );
}

export default Home;
