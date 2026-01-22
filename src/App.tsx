import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LoginScreen } from "./components/LoginScreen";
import { DashboardStats } from "./components/DashboardStats";
import { SubmissionsTable } from "./components/SubmissionsTable";
import { UploadForm } from "./components/UploadForm";
import { SubmissionDetailsModal } from "./components/SubmissionDetailsModal";
import { UserManagement } from "./components/UserManagement";
import { ActivityLog } from "./components/ActivityLog";
import { UserRole, Submission, User, Notification, ContentType } from "./types";
import { MOCK_USERS, MACS, MOCK_SUBMISSIONS, MOCK_NOTIFICATIONS, MOCK_ACTIVITY_LOGS } from "./data/mockData";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Filter, Upload as UploadIcon } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export default function App() {
  // State
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState(MOCK_ACTIVITY_LOGS);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Current user
  const currentUser = loggedInUser;

  // Filter submissions based on role and filters
  const filteredSubmissions = useMemo(() => {
    if (!currentUser) return [];
    
    let filtered = submissions;

    // Role-based filtering
    if (currentUser.role === 'mac_officer' && currentUser.macId) {
      filtered = filtered.filter(s => s.macId === currentUser.macId);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.macName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [submissions, currentUser, statusFilter, searchQuery]);

  // Get user-specific notifications
  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter(n => n.userId === currentUser.id);
  }, [notifications, currentUser]);

  // Calculate stats based on role
  const stats = useMemo(() => {
    if (!currentUser) return {
      total: 0,
      pending: 0,
      underReview: 0,
      approved: 0,
      returned: 0,
      denied: 0,
    };
    
    let relevantSubmissions = submissions;
    if (currentUser.role === 'mac_officer' && currentUser.macId) {
      relevantSubmissions = submissions.filter(s => s.macId === currentUser.macId);
    }

    return {
      total: relevantSubmissions.length,
      pending: relevantSubmissions.filter(s => s.status === 'pending').length,
      underReview: relevantSubmissions.filter(s => s.status === 'under_review').length,
      approved: relevantSubmissions.filter(s => s.status === 'approved').length,
      returned: relevantSubmissions.filter(s => s.status === 'returned').length,
      denied: relevantSubmissions.filter(s => s.status === 'denied').length,
    };
  }, [submissions, currentUser]);

  // Handlers
  const handleLogin = (user: User) => {
    setLoggedInUser(user);
    setCurrentView('dashboard');
    toast.success(`Welcome, ${user.name}!`);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('dashboard');
    toast.info('You have been logged out');
  };

  const handleRoleSwitch = (role: UserRole) => {
    if (!currentUser) return;
    
    // Find a user with the requested role
    const newUser = users.find(u => u.role === role && u.active);
    if (newUser) {
      setLoggedInUser(newUser);
      setCurrentView('dashboard');
      toast.info(`Switched to ${newUser.name} (${role === 'mac_officer' ? 'MAC PR Officer' : role === 'micat_reviewer' ? 'MICAT Reviewer' : 'System Admin'})`);
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  };

  const handleUploadSubmission = (data: {
    title: string;
    contentType: ContentType;
    description: string;
    tags: string[];
    date: string;
    fileName: string;
    confidential: boolean;
  }) => {
    if (!currentUser) return;
    
    const newSubmission: Submission = {
      id: `sub${submissions.length + 1}`,
      ...data,
      fileSize: '2.4 MB',
      status: 'pending',
      macId: currentUser.macId!,
      macName: currentUser.macName!,
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString(),
      comments: [],
      priority: 'medium',
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    
    // Add activity log
    setActivityLogs(prev => [{
      id: `log${prev.length + 1}`,
      submissionId: newSubmission.id,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Submitted',
      details: 'New submission created',
      timestamp: new Date().toISOString(),
    }, ...prev]);

    toast.success('Submission created successfully!', {
      description: 'Your content has been submitted for MICAT review.',
    });

    setCurrentView('submissions');
  };

  const handleApprove = (submissionId: string, comment: string) => {
    if (!currentUser) return;
    
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? {
            ...s,
            status: 'approved' as const,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            comments: comment ? [
              ...(s.comments || []),
              {
                id: `c${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                text: comment,
                timestamp: new Date().toISOString(),
                type: 'status_change' as const,
              }
            ] : s.comments,
          }
        : s
    ));

    setActivityLogs(prev => [{
      id: `log${prev.length + 1}`,
      submissionId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Approved',
      details: 'Submission approved for publication',
      timestamp: new Date().toISOString(),
    }, ...prev]);

    toast.success('Submission approved!', {
      description: 'The content has been approved and published.',
    });
  };

  const handleDeny = (submissionId: string, comment: string) => {
    if (!currentUser) return;
    
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? {
            ...s,
            status: 'denied' as const,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            comments: [
              ...(s.comments || []),
              {
                id: `c${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                text: comment || 'Submission denied',
                timestamp: new Date().toISOString(),
                type: 'status_change' as const,
              }
            ],
          }
        : s
    ));

    setActivityLogs(prev => [{
      id: `log${prev.length + 1}`,
      submissionId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Denied',
      details: comment || 'Submission denied',
      timestamp: new Date().toISOString(),
    }, ...prev]);

    toast.error('Submission denied', {
      description: 'The content has been denied with feedback.',
    });
  };

  const handleReturn = (submissionId: string, comment: string) => {
    if (!currentUser) return;
    
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? {
            ...s,
            status: 'returned' as const,
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            comments: [
              ...(s.comments || []),
              {
                id: `c${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                text: comment || 'Returned for edits',
                timestamp: new Date().toISOString(),
                type: 'status_change' as const,
              }
            ],
          }
        : s
    ));

    setActivityLogs(prev => [{
      id: `log${prev.length + 1}`,
      submissionId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Returned for Edits',
      details: comment || 'Submission returned for revisions',
      timestamp: new Date().toISOString(),
    }, ...prev]);

    toast.warning('Submission returned for edits', {
      description: 'The content has been sent back with feedback.',
    });
  };

  const handleCreateUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    macId?: string;
  }) => {
    const mac = userData.macId ? MACS.find(m => m.id === userData.macId) : undefined;
    const newUser: User = {
      id: `user${users.length + 1}`,
      ...userData,
      macName: mac?.name,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    toast.success('User created successfully!');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ));
    toast.info('User status updated');
  };

  // Show login screen if not logged in
  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  // Render content based on current view
  const renderContent = () => {
    // MAC Officer Views
    if (currentUser.role === 'mac_officer') {
      if (currentView === 'dashboard') {
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
            <DashboardStats stats={stats} />
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">Recent Submissions</h2>
                <Button 
                  onClick={() => setCurrentView('upload')}
                  className="bg-blue-900 hover:bg-blue-950"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload New Content
                </Button>
              </div>
              <SubmissionsTable 
                submissions={filteredSubmissions.slice(0, 5)} 
                onViewDetails={handleViewDetails}
              />
            </Card>
          </div>
        );
      }

      if (currentView === 'upload') {
        return (
          <div className="max-w-3xl">
            <UploadForm 
              onSubmit={handleUploadSubmission}
              onCancel={() => setCurrentView('dashboard')}
            />
          </div>
        );
      }

      if (currentView === 'submissions') {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-1">My Submissions</h1>
                <p className="text-gray-600">Track all your submitted content</p>
              </div>
              <Button 
                onClick={() => setCurrentView('upload')}
                className="bg-blue-900 hover:bg-blue-950"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload New Content
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search submissions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </Card>

            <SubmissionsTable 
              submissions={filteredSubmissions} 
              onViewDetails={handleViewDetails}
            />
          </div>
        );
      }

      if (currentView === 'approved') {
        const approvedSubmissions = filteredSubmissions.filter(s => s.status === 'approved');
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Approved Content</h1>
              <p className="text-gray-600">View all your approved and published content</p>
            </div>
            <SubmissionsTable 
              submissions={approvedSubmissions} 
              onViewDetails={handleViewDetails}
            />
          </div>
        );
      }
    }

    // MICAT Reviewer Views
    if (currentUser.role === 'micat_reviewer') {
      if (currentView === 'dashboard') {
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Review Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
            <DashboardStats stats={stats} />
            
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Review ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Under Review ({stats.underReview})
                </TabsTrigger>
                <TabsTrigger value="recent">
                  Recent Activity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4">
                <SubmissionsTable 
                  submissions={submissions.filter(s => s.status === 'pending')} 
                  onViewDetails={handleViewDetails}
                  showMac
                />
              </TabsContent>
              
              <TabsContent value="under_review" className="space-y-4">
                <SubmissionsTable 
                  submissions={submissions.filter(s => s.status === 'under_review')} 
                  onViewDetails={handleViewDetails}
                  showMac
                />
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                <ActivityLog logs={activityLogs.slice(0, 10)} />
              </TabsContent>
            </Tabs>
          </div>
        );
      }

      if (currentView === 'review') {
        const reviewQueue = submissions.filter(s => 
          s.status === 'pending' || s.status === 'under_review'
        );
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Review Queue</h1>
              <p className="text-gray-600">Review and approve submissions from all MACs</p>
            </div>
            
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search submissions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </Card>

            <SubmissionsTable 
              submissions={reviewQueue} 
              onViewDetails={handleViewDetails}
              showMac
            />
          </div>
        );
      }

      if (currentView === 'approved') {
        const approvedSubmissions = submissions.filter(s => s.status === 'approved');
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Approved Content</h1>
              <p className="text-gray-600">View all approved and published content</p>
            </div>
            <SubmissionsTable 
              submissions={approvedSubmissions} 
              onViewDetails={handleViewDetails}
              showMac
            />
          </div>
        );
      }

      if (currentView === 'library') {
        const publishedContent = submissions.filter(s => s.status === 'approved');
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Content Library</h1>
              <p className="text-gray-600">Browse and download all published content</p>
            </div>
            
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Search library..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </Card>

            <SubmissionsTable 
              submissions={publishedContent} 
              onViewDetails={handleViewDetails}
              showMac
            />
          </div>
        );
      }
    }

    // Admin Views
    if (currentUser.role === 'admin') {
      if (currentView === 'dashboard') {
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">System Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
            <DashboardStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-gray-900 mb-4">System Overview</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Users</span>
                    <span className="text-gray-900">{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="text-gray-900">{users.filter(u => u.active).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total MACs</span>
                    <span className="text-gray-900">{MACS.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Submissions</span>
                    <span className="text-gray-900">{submissions.length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {activityLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="text-sm">
                      <p className="text-gray-700">{log.userName} · {log.action}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      }

      if (currentView === 'users') {
        return (
          <UserManagement 
            users={users}
            macs={MACS}
            onCreateUser={handleCreateUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );
      }

      if (currentView === 'submissions') {
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">All Submissions</h1>
              <p className="text-gray-600">View and monitor all submissions across MACs</p>
            </div>
            
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Search submissions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </Card>

            <SubmissionsTable 
              submissions={filteredSubmissions} 
              onViewDetails={handleViewDetails}
              showMac
            />
          </div>
        );
      }

      if (currentView === 'activity') {
        return <ActivityLog logs={activityLogs} />;
      }

      if (currentView === 'library') {
        const publishedContent = submissions.filter(s => s.status === 'approved');
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-gray-900 mb-1">Content Library</h1>
              <p className="text-gray-600">Browse and download all published content</p>
            </div>
            
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Search library..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </Card>

            <SubmissionsTable 
              submissions={publishedContent} 
              onViewDetails={handleViewDetails}
              showMac
            />
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        notifications={userNotifications}
        onRoleSwitch={handleRoleSwitch}
        onNotificationRead={handleNotificationRead}
        onLogout={handleLogout}
      />
      
      <Sidebar 
        currentRole={currentUser.role}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="ml-64 mt-16 p-8">
        {renderContent()}
      </main>

      <SubmissionDetailsModal 
        submission={selectedSubmission}
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSubmission(null);
        }}
        userRole={currentUser.role}
        onApprove={handleApprove}
        onDeny={handleDeny}
        onReturn={handleReturn}
      />

      <Toaster />
    </div>
  );
}
