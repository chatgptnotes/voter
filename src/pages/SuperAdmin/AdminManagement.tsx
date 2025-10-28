import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { usePermission } from '../../hooks/usePermission';
import { VersionFooter } from '../../components/VersionFooter';

interface Admin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  organizationId?: string;
  organizationName?: string;
  totalTenants: number;
  activeTenants: number;
  createdAt: string;
  lastActive?: string;
}

export function AdminManagement() {
  const navigate = useNavigate();
  const { supabase } = useAuth();
  const isSuperAdmin = usePermission('manage_organizations');

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/unauthorized');
      return;
    }

    loadAdmins();
  }, [isSuperAdmin, navigate, filterStatus]);

  async function loadAdmins() {
    try {
      setLoading(true);

      let query = supabase
        .from('users')
        .select(`
          *,
          organizations!user_organizations(
            id,
            name,
            total_tenants,
            active_tenants
          )
        `)
        .eq('role', 'admin')
        .eq('is_super_admin', false)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAdmins(
        data?.map((admin: any) => ({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          status: admin.status,
          organizationId: admin.organizations?.[0]?.id,
          organizationName: admin.organizations?.[0]?.name,
          totalTenants: admin.organizations?.[0]?.total_tenants || 0,
          activeTenants: admin.organizations?.[0]?.active_tenants || 0,
          createdAt: admin.created_at,
          lastActive: admin.last_active,
        })) || []
      );
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  async function handleSuspendAdmin(admin: Admin) {
    if (!confirm(`Are you sure you want to suspend ${admin.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', admin.id);

      if (error) throw error;

      await loadAdmins();
      setShowActionsMenu(null);
    } catch (error) {
      console.error('Failed to suspend admin:', error);
      alert('Failed to suspend admin. Please try again.');
    }
  }

  async function handleActivateAdmin(admin: Admin) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'active' })
        .eq('id', admin.id);

      if (error) throw error;

      await loadAdmins();
      setShowActionsMenu(null);
    } catch (error) {
      console.error('Failed to activate admin:', error);
      alert('Failed to activate admin. Please try again.');
    }
  }

  async function handleDeleteAdmin(admin: Admin) {
    if (!confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', admin.id);

      if (error) throw error;

      await loadAdmins();
      setShowActionsMenu(null);
    } catch (error) {
      console.error('Failed to delete admin:', error);
      alert('Failed to delete admin. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PeopleIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                <p className="text-sm text-gray-500">Manage client organization admins</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <AddIcon className="w-5 h-5 mr-2" />
              Create Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({admins.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({admins.filter((a) => a.status === 'active').length})
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive ({admins.filter((a) => a.status === 'inactive').length})
              </button>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <PeopleIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <EmailIcon className="w-4 h-4 mr-1" />
                              {admin.email}
                            </div>
                            {admin.phone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <PhoneIcon className="w-4 h-4 mr-1" />
                                {admin.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {admin.organizationName ? (
                          <div className="flex items-center text-sm text-gray-900">
                            <BusinessIcon className="w-4 h-4 mr-2 text-purple-600" />
                            {admin.organizationName}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No organization</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {admin.totalTenants} total
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.activeTenants} active
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {admin.status === 'active' ? (
                            <ActiveIcon className="w-4 h-4 mr-1" />
                          ) : (
                            <InactiveIcon className="w-4 h-4 mr-1" />
                          )}
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setShowActionsMenu(showActionsMenu === admin.id ? null : admin.id)
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreIcon className="w-5 h-5" />
                          </button>

                          {showActionsMenu === admin.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => navigate(`/super-admin/admins/${admin.id}`)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <EditIcon className="w-4 h-4 mr-2" />
                                  Edit Details
                                </button>
                                {admin.status === 'active' ? (
                                  <button
                                    onClick={() => handleSuspendAdmin(admin)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                  >
                                    <BlockIcon className="w-4 h-4 mr-2" />
                                    Suspend Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateAdmin(admin)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                  >
                                    <ActiveIcon className="w-4 h-4 mr-2" />
                                    Activate Admin
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteAdmin(admin)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                  <DeleteIcon className="w-4 h-4 mr-2" />
                                  Delete Admin
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <VersionFooter className="mt-12" />
    </div>
  );
}

export default AdminManagement;
