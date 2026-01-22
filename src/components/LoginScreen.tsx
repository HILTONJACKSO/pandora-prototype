import { User } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LogIn } from "lucide-react";
import logo from "figma:asset/c2ee33523dd647e72a3633ee1c475a9d167a02dc.png";

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

export function LoginScreen({ users, onLogin }: LoginScreenProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'mac_officer': return 'MAC PR Officer';
      case 'micat_reviewer': return 'MICAT Reviewer';
      case 'admin': return 'System Admin';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'mac_officer': return 'bg-blue-100 text-blue-900 hover:bg-blue-100';
      case 'micat_reviewer': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'admin': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Group users by role
  const macOfficers = users.filter(u => u.role === 'mac_officer' && u.active);
  const reviewers = users.filter(u => u.role === 'micat_reviewer' && u.active);
  const admins = users.filter(u => u.role === 'admin' && u.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Government Logo" className="h-24 w-auto" />
          </div>
          <div className="mb-3">
            <p className="text-gray-700">Department of Public Affairs</p>
            <p className="text-gray-700">Ministry of Information</p>
          </div>
          <h1 className="text-gray-900 mb-2">Pandora Box</h1>
          <p className="text-gray-600">Government Information Coordination System</p>
          <p className="text-gray-500 text-sm mt-2">One Government. One Voice. One Messaging.</p>
        </div>

        {/* Login Card */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-1">Select User to Login</h2>
            <p className="text-gray-600">Choose a user account to access the system</p>
          </div>

          <div className="space-y-8">
            {/* MAC PR Officers */}
            {macOfficers.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-3">MAC PR Officers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {macOfficers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => onLogin(user)}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-sm truncate">{user.email}</p>
                        {user.macName && (
                          <p className="text-gray-600 text-xs mt-1">{user.macName}</p>
                        )}
                      </div>
                      <LogIn className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MICAT Reviewers */}
            {reviewers.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-3">MICAT Reviewers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reviewers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => onLogin(user)}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-sm truncate">{user.email}</p>
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mt-1">
                          MICAT
                        </Badge>
                      </div>
                      <LogIn className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* System Admins */}
            {admins.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-3">System Administrators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {admins.map(user => (
                    <button
                      key={user.id}
                      onClick={() => onLogin(user)}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 rounded-lg transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-sm truncate">{user.email}</p>
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 mt-1">
                          Admin
                        </Badge>
                      </div>
                      <LogIn className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              This is a demo system. Click any user to login and explore their dashboard.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Prototype Demo · Government Information Coordination System
          </p>
        </div>
      </div>
    </div>
  );
}
