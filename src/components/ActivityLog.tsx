import { ActivityLog as ActivityLogType } from "../types";
import { Card } from "./ui/card";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  RotateCcw,
  Clock
} from "lucide-react";

interface ActivityLogProps {
  logs: ActivityLogType[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  const getActionIcon = (action: string) => {
    if (action.includes('Submitted')) return <FileText className="w-4 h-4 text-blue-900" />;
    if (action.includes('Approved')) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (action.includes('Denied')) return <XCircle className="w-4 h-4 text-red-600" />;
    if (action.includes('Returned')) return <RotateCcw className="w-4 h-4 text-blue-900" />;
    if (action.includes('Comment')) return <MessageSquare className="w-4 h-4 text-purple-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Submitted')) return 'bg-blue-100 border-blue-300';
    if (action.includes('Approved')) return 'bg-green-50 border-green-200';
    if (action.includes('Denied')) return 'bg-red-50 border-red-200';
    if (action.includes('Returned')) return 'bg-blue-100 border-blue-300';
    if (action.includes('Comment')) return 'bg-purple-50 border-purple-200';
    return 'bg-amber-50 border-amber-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (logs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No activity logs found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Activity Logs</h2>
        <p className="text-gray-600">Complete audit trail of all system activities</p>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className={`p-4 border ${getActionColor(log.action)}`}>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900">
                      <span>{log.userName}</span>
                      <span className="text-gray-600"> · {log.action}</span>
                    </p>
                    <p className="text-gray-700 text-sm mt-1">{log.details}</p>
                  </div>
                  <p className="text-gray-500 text-xs whitespace-nowrap ml-4">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
