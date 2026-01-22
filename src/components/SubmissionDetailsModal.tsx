import { Submission, UserRole } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { StatusBadge } from "./StatusBadge";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  Lock, 
  Download,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";

interface SubmissionDetailsModalProps {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
  onApprove?: (submissionId: string, comment: string) => void;
  onDeny?: (submissionId: string, comment: string) => void;
  onReturn?: (submissionId: string, comment: string) => void;
}

export function SubmissionDetailsModal({
  submission,
  open,
  onClose,
  userRole,
  onApprove,
  onDeny,
  onReturn,
}: SubmissionDetailsModalProps) {
  const [comment, setComment] = useState("");

  if (!submission) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContentTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleAction = (action: 'approve' | 'deny' | 'return') => {
    if (action === 'approve' && onApprove) {
      onApprove(submission.id, comment);
    } else if (action === 'deny' && onDeny) {
      onDeny(submission.id, comment);
    } else if (action === 'return' && onReturn) {
      onReturn(submission.id, comment);
    }
    setComment("");
    onClose();
  };

  const canReview = userRole === 'micat_reviewer' && 
    (submission.status === 'pending' || submission.status === 'under_review');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-gray-900 mb-2">{submission.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={submission.status} />
                  <Badge variant="outline">{getContentTypeLabel(submission.contentType)}</Badge>
                  {submission.priority && (
                    <Badge 
                      className={
                        submission.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        submission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)} Priority
                    </Badge>
                  )}
                  {submission.confidential && (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                      <Lock className="w-3 h-3 mr-1" />
                      Confidential
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-xs">Submitted By</p>
                  <p className="text-gray-900">{submission.submittedBy}</p>
                  <p className="text-gray-600 text-sm">{submission.macName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-xs">Submitted On</p>
                  <p className="text-gray-900">{formatDate(submission.submittedAt)}</p>
                </div>
              </div>
              {submission.reviewedBy && (
                <>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-xs">Reviewed By</p>
                      <p className="text-gray-900">{submission.reviewedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-xs">Reviewed On</p>
                      <p className="text-gray-900">{formatDate(submission.reviewedAt!)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{submission.description}</p>
          </div>

          {/* Tags */}
          {submission.tags.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-2">Tags</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {submission.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* File Info */}
          <div>
            <h3 className="text-gray-900 mb-2">Attached File</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-gray-500" />
                <div>
                  <p className="text-gray-900">{submission.fileName}</p>
                  <p className="text-gray-500 text-sm">{submission.fileSize}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Comments & History */}
          {submission.comments && submission.comments.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-2">Review Comments</h3>
              <div className="space-y-3">
                {submission.comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-blue-100 rounded-lg border border-blue-300">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-900" />
                        <p className="text-gray-900">{comment.userName}</p>
                      </div>
                      <p className="text-gray-500 text-xs">{formatDate(comment.timestamp)}</p>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Actions for MICAT Reviewers */}
          {canReview && (
            <>
              <Separator />
              <div>
                <h3 className="text-gray-900 mb-2">Review Action</h3>
                <Textarea
                  placeholder="Add your comments or feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mb-4"
                />
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleAction('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction('return')}
                    variant="outline"
                    className="border-blue-900 text-blue-900 hover:bg-blue-100"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Return for Edits
                  </Button>
                  <Button
                    onClick={() => handleAction('deny')}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Deny
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
