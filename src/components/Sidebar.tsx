import { UserRole } from "../types";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Users, 
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  LogOut
} from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";

interface SidebarProps {
  currentRole: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentRole, currentView, onViewChange, onLogout }: SidebarProps) {
  const macOfficerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Content', icon: Upload },
    { id: 'submissions', label: 'My Submissions', icon: FileText },
    { id: 'approved', label: 'Approved Content', icon: CheckCircle },
  ];

  const micatReviewerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'review', label: 'Review Queue', icon: Clock },
    { id: 'approved', label: 'Approved Content', icon: CheckCircle },
    { id: 'library', label: 'Content Library', icon: FileCheck },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'submissions', label: 'All Submissions', icon: FileText },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'library', label: 'Content Library', icon: FileCheck },
  ];

  const menuItems = 
    currentRole === 'mac_officer' ? macOfficerMenuItems :
    currentRole === 'micat_reviewer' ? micatReviewerMenuItems :
    adminMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 flex flex-col">
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                currentView === item.id
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button - Always visible at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
