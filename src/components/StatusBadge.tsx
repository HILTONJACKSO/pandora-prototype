import { Badge } from "./ui/badge";
import { SubmissionStatus } from "../types";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
    under_review: { label: 'Under Review', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    returned: { label: 'Returned for Edits', className: 'bg-blue-100 text-blue-900 hover:bg-blue-100' },
    denied: { label: 'Denied', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
