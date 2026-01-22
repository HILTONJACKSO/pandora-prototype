import { Submission } from "../types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";
import { Eye, Download, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

interface SubmissionsTableProps {
  submissions: Submission[];
  onViewDetails: (submission: Submission) => void;
  showMac?: boolean;
}

export function SubmissionsTable({ submissions, onViewDetails, showMac = false }: SubmissionsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {showMac && <TableHead>MAC</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div>
                  <p className="text-gray-900">{submission.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{submission.fileName}</p>
                </div>
              </TableCell>
              {showMac && (
                <TableCell>
                  <p className="text-gray-700">{submission.macName}</p>
                </TableCell>
              )}
              <TableCell>
                <Badge variant="outline">{getContentTypeLabel(submission.contentType)}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-gray-700">{formatDate(submission.submittedAt)}</p>
                  <p className="text-gray-500 text-xs">{submission.submittedBy}</p>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={submission.status} />
              </TableCell>
              <TableCell>
                {submission.priority && (
                  <Badge 
                    className={
                      submission.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                      submission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                      'bg-gray-100 text-gray-800 hover:bg-gray-100'
                    }
                  >
                    {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(submission)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
