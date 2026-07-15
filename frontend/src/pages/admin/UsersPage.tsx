/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Upload, Shield, Power, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { userService } from '../../services/user.service';
import type { User, UserListParams } from '../../types/user';
import { ROUTES } from '../../config/routes';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: UserListParams = { page, limit };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.isActive = statusFilter === 'true';

      const data = await userService.getUsers(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleStatus = async (user: User) => {
    try {
      await userService.changeStatus(user._id, { isActive: !user.isActive });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to change status');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
            <select 
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] bg-white"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="SUBJECT_HEAD">Subject Head</option>
              <option value="LECTURER">Lecturer</option>
              <option value="STUDENT">Student</option>
            </select>
          </form>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center"
            >
              + Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="py-4 font-semibold">Name</th>
                  <th className="py-4 font-semibold">Email</th>
                  <th className="py-4 font-semibold">Code</th>
                  <th className="py-4 font-semibold">Role</th>
                  <th className="py-4 font-semibold">Status</th>
                  <th className="py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <Link to={ROUTES.USER_DETAIL.replace(':id', user._id)} className="font-bold text-[#064E3B] hover:text-[#16A34A] transition-colors flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#16A34A] font-bold mr-3">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        {user.fullName}
                      </Link>
                    </td>
                    <td className="py-4 text-gray-600">{user.email}</td>
                    <td className="py-4 text-gray-600 font-medium">{user.studentCode || '-'}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                        user.role === 'SUBJECT_HEAD' ? 'bg-purple-100 text-purple-600' :
                        user.role === 'LECTURER' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 flex gap-2">
                      <button 
                        onClick={() => toggleStatus(user)}
                        title={user.isActive ? "Deactivate" : "Activate"}
                        className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        title="Delete User"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> results
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  disabled={page * limit >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchUsers();
          }} 
        />
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <ImportUserModal 
          onClose={() => setIsImportModalOpen(false)} 
          onSuccess={() => {
            setIsImportModalOpen(false);
            fetchUsers();
          }} 
        />
      )}
    </div>
  );
}

// ==========================================
// CREATE USER MODAL
// ==========================================
function CreateUserModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', role: 'STUDENT', studentCode: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userService.createUser(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#064E3B]">Create New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:outline-none bg-white">
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
                <option value="SUBJECT_HEAD">Subject Head</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input type="text" value={formData.studentCode} onChange={e => setFormData({...formData, studentCode: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:outline-none" placeholder="e.g. SE18D01" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:outline-none" placeholder="Leave blank to auto-generate" />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 font-bold bg-[#16A34A] text-white hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// IMPORT MODAL
// ==========================================
function ImportUserModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await userService.importUsers(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to import users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#064E3B]">Import Users</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="border-2 border-dashed border-green-200 bg-green-50/30 rounded-2xl p-8 text-center hover:bg-green-50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#064E3B]">
              {file ? file.name : 'Click or drag file to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">CSV or Excel files only</p>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={!file || loading} className="px-4 py-2 font-bold bg-[#16A34A] text-white hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload & Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
