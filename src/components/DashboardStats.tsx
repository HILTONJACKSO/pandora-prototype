import { Card } from "./ui/card";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mb-1">{title}</p>
          <p className={`text-gray-900`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    total?: number;
    pending?: number;
    underReview?: number;
    approved?: number;
    returned?: number;
    denied?: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.total !== undefined && (
        <StatCard
          title="Total Submissions"
          value={stats.total}
          icon={<FileText className="w-6 h-6 text-gray-700" />}
          color="bg-gray-100"
        />
      )}
      {stats.pending !== undefined && (
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="w-6 h-6 text-orange-700" />}
          color="bg-orange-100"
        />
      )}
      {stats.underReview !== undefined && (
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<AlertCircle className="w-6 h-6 text-amber-700" />}
          color="bg-amber-100"
        />
      )}
      {stats.approved !== undefined && (
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-6 h-6 text-green-700" />}
          color="bg-green-100"
        />
      )}
      {stats.returned !== undefined && stats.returned > 0 && (
        <StatCard
          title="Returned"
          value={stats.returned}
          icon={<AlertCircle className="w-6 h-6 text-blue-900" />}
          color="bg-blue-100"
        />
      )}
      {stats.denied !== undefined && stats.denied > 0 && (
        <StatCard
          title="Denied"
          value={stats.denied}
          icon={<XCircle className="w-6 h-6 text-red-700" />}
          color="bg-red-100"
        />
      )}
    </div>
  );
}
