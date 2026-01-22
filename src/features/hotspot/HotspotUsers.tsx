import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotspotAdminApi, HotspotUser } from '../../api/hotspot';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { 
  Search, 
  Trash2, 
  Wifi, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Table } from '../../components/ui/table';

export const HotspotUsers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [deletingUser, setDeletingUser] = useState<HotspotUser | null>(null);

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['hotspot-users'],
    queryFn: hotspotAdminApi.getHotspotUsers,
  });

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.mac_address.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower) ||
          user.package_name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [users, statusFilter, search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const expired = users.filter((u) => u.status === 'expired').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return { total, active, expired, suspended };
  }, [users]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotspotAdminApi.deleteHotspotUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotspot-users'] });
      setDeletingUser(null);
      addToast({ title: 'Success', description: 'Hotspot user revoked successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to revoke user',
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300"><Clock className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotspot Users</h1>
          <p className="text-gray-600 mt-1">Manage MAC-based hotspot vouchers and users</p>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['hotspot-users'] })}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Expired</p>
                <p className="text-3xl font-bold text-gray-600">{stats.expired}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Suspended</p>
                <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by MAC address, username, or package..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'expired' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('expired')}
              >
                Expired
              </Button>
              <Button
                variant={statusFilter === 'suspended' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('suspended')}
              >
                Suspended
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Expires At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium">No hotspot users found</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {search || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Hotspot users will appear here when vouchers are created'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{user.mac_address}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{user.username}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{user.package_name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(user.expires_at)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(user.created_at)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revoke Hotspot User</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to revoke access for user <span className="font-mono font-semibold">{deletingUser.mac_address}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeletingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutation.mutate(deletingUser.id);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Revoking...' : 'Revoke Access'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
