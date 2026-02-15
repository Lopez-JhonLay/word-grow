interface DashboardCardProps {
  icon: string;
  title: string;
  stats: string | number;
  bgColor?: string;
}

function DashboardCard({ icon, title, stats, bgColor = 'bg-orange-100' }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-4xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${bgColor} w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{stats}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
