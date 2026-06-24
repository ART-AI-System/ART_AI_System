/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Mail, Shield, Key } from 'lucide-react';
import { Card } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { userService } from '../../services/user.service';
import type { User, UpdateUserDto } from '../../types/user';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset Password Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(id);
      setUser(data);
      setEditForm({
        fullName: data.fullName,
        email: data.email,
        studentCode: data.studentCode || ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsSaving(true);
      await userService.updateUser(id, editForm);
      await fetchUser();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!id || !user) return;
    const newRole = e.target.value;
    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;
    try {
      await userService.changeRole(id, { role: newRole });
      await fetchUser();
    } catch (err: any) {
      alert(err.message || 'Failed to change role');
    }
  };

  const handleStatusChange = async () => {
    if (!id || !user) return;
    try {
      await userService.changeStatus(id, { isActive: !user.isActive });
      await fetchUser();
    } catch (err: any) {
      alert(err.message || 'Failed to change status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsResetting(true);
      await userService.resetPassword(id, newPassword ? { newPassword } : {});
      alert('Password reset successfully');
      setIsResetModalOpen(false);
      setNewPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#4318FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-100">
        <h2 className="text-lg font-bold mb-2">Error Loading User</h2>
        <p>{error || 'User not found'}</p>
        <Button className="mt-4" onClick={() => navigate('/users')}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1B2559]">User Identity File</h1>
          <p className="text-sm text-gray-500">View and manage account details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Profile */}
        <Card className="md:col-span-1 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-[#4318FF] flex items-center justify-center text-4xl font-bold mb-4 shadow-sm border-4 border-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-[#1B2559]">{user.fullName}</h2>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>
            <StatusBadge 
              label={user.isActive ? 'Active' : 'Inactive'} 
              variant={user.isActive ? 'success' : 'error'} 
            />
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Role</span>
              <select 
                value={user.role} 
                onChange={handleRoleChange}
                className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-[#1B2559] focus:outline-none focus:ring-1 focus:ring-[#4318FF]"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUBJECT_HEAD">SUBJECT HEAD</option>
                <option value="LECTURER">LECTURER</option>
                <option value="STUDENT">STUDENT</option>
              </select>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Account Status</span>
              <button 
                onClick={handleStatusChange}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${user.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setIsResetModalOpen(true)}
            >
              <Key className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </Card>

        {/* Right Column: Detailed Info */}
        <Card className="md:col-span-2">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#1B2559]">Personal Information</h3>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit Details</Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => {
                setIsEditing(false);
                setEditForm({ fullName: user.fullName, email: user.email, studentCode: user.studentCode || '' });
              }}>Cancel</Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <UserIcon className="w-4 h-4" /> Full Name
                  </div>
                  <p className="font-medium text-[#1B2559]">{user.fullName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Mail className="w-4 h-4" /> Email Address
                  </div>
                  <p className="font-medium text-[#1B2559]">{user.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Shield className="w-4 h-4" /> Student/Staff Code
                  </div>
                  <p className="font-medium text-[#1B2559]">{user.studentCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4318FF] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4318FF] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student/Staff Code</label>
                  <input type="text" value={editForm.studentCode} onChange={e => setEditForm({...editForm, studentCode: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4318FF] focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isSaving}>Save Changes</Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#1B2559]">Force Reset Password</h2>
              <button onClick={() => setIsResetModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                You are about to reset the password for <strong>{user.fullName}</strong>.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                <input 
                  type="text" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4318FF] focus:outline-none" 
                  placeholder="Leave blank to auto-generate" 
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={isResetting} variant="danger">Reset Password</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
