import { useState } from "react";
import { User, MAC, UserRole } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Edit, Power } from "lucide-react";

interface UserManagementProps {
  users: User[];
  macs: MAC[];
  onCreateUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    macId?: string;
  }) => void;
  onToggleUserStatus: (userId: string) => void;
}

export function UserManagement({ users, macs, onCreateUser, onToggleUserStatus }: UserManagementProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("mac_officer");
  const [macId, setMacId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateUser({
      name,
      email,
      role,
      macId: role === 'mac_officer' ? macId : undefined,
    });
    setName("");
    setEmail("");
    setRole("mac_officer");
    setMacId("");
    setShowCreateModal(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'mac_officer': return 'MAC PR Officer';
      case 'micat_reviewer': return 'MICAT Reviewer';
      case 'admin': return 'System Admin';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'mac_officer': return 'bg-blue-100 text-blue-900 hover:bg-blue-100';
      case 'micat_reviewer': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'admin': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-900 hover:bg-blue-950">
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>MAC</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">
                  {user.macName || '—'}
                </TableCell>
                <TableCell className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={user.active ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserStatus(user.id)}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {user.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@ministry.gov"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mac_officer">MAC PR Officer</SelectItem>
                  <SelectItem value="micat_reviewer">MICAT Reviewer</SelectItem>
                  <SelectItem value="admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === 'mac_officer' && (
              <div>
                <Label htmlFor="mac">Ministry/Agency/Commission *</Label>
                <Select value={macId} onValueChange={setMacId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select MAC" />
                  </SelectTrigger>
                  <SelectContent>
                    {macs.map((mac) => (
                      <SelectItem key={mac.id} value={mac.id}>
                        {mac.name} ({mac.acronym})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" className="bg-blue-900 hover:bg-blue-950">
                Create User
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
