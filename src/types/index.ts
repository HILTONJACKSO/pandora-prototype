export type UserRole = 'mac_officer' | 'micat_reviewer' | 'admin';

export type SubmissionStatus = 'pending' | 'under_review' | 'approved' | 'returned' | 'denied';

export type ContentType = 'press_release' | 'announcement' | 'speech' | 'photo' | 'video' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  macId?: string;
  macName?: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface MAC {
  id: string;
  name: string;
  acronym: string;
  category: string;
}

export interface Submission {
  id: string;
  title: string;
  contentType: ContentType;
  description: string;
  tags: string[];
  date: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  confidential: boolean;
  status: SubmissionStatus;
  macId: string;
  macName: string;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: Comment[];
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  type: 'comment' | 'edit' | 'status_change';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  submissionId?: string;
}

export interface ActivityLog {
  id: string;
  submissionId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
