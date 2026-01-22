import { User, UserRole } from "../types";
import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import logo from "figma:asset/c2ee33523dd647e72a3633ee1c475a9d167a02dc.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Notification } from "../types";

interface HeaderProps {
  currentUser: User;
  notifications: Notification[];
  onRoleSwitch: (role: UserRole) => void;
  onNotificationRead: (id: string) => void;
  onLogout: () => void;
}

export function Header({ currentUser, notifications, onRoleSwitch, onNotificationRead, onLogout }: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'mac_officer': return 'MAC PR Officer';
      case 'micat_reviewer': return 'MICAT Reviewer';
      case 'admin': return 'System Admin';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-gray-900">Pandora Box</h1>
              <p className="text-gray-500 text-xs">One Government. One Voice. One Messaging.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Notifications</h3>
                  <Badge variant="secondary">{unreadCount} new</Badge>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
                        }`}
                        onClick={() => onNotificationRead(notif.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={!notif.read ? 'text-gray-900' : 'text-gray-600'}>
                              {notif.title}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(notif.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-gray-900">{currentUser.name}</p>
                  <p className="text-gray-500 text-xs">{getRoleLabel(currentUser.role)}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p>{currentUser.name}</p>
                  <p className="text-gray-500 text-xs">{currentUser.email}</p>
                  {currentUser.macName && (
                    <p className="text-gray-500 text-xs mt-1">{currentUser.macName}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-gray-500">
                Switch Role (Demo)
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRoleSwitch('mac_officer')}>
                MAC PR Officer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRoleSwitch('micat_reviewer')}>
                MICAT Reviewer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRoleSwitch('admin')}>
                System Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
