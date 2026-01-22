import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotspotAdminApi, HotspotPackageCreate } from '../../api/hotspot';
import { routersApi } from '../../api/routers';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useToast } from '../../components/ui/toast';
import { 
  Search, 
  Wifi, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Package,
  Router as RouterIcon,
  Plus
} from 'lucide-react';
import { Table } from '../../components/ui/table';

export const HotspotPackages = () => {
  const [search, setSearch] = useState('');
  const [routerFilter, setRouterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<HotspotPackageCreate>({
    name: '',
    download_speed: 0, // in Kbps
    upload_speed: 0, // in Kbps
    validity_minutes: 60,
    shared_users: 1,
    router_id: '',
  });

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['hotspot-packages'],
    queryFn: hotspotAdminApi.getHotspotPackages,
  });

  const { data: routers = [] } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: hotspotAdminApi.createHotspotPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotspot-packages'] });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setIsCreateOpen(false);
      resetForm();
      addToast({ title: 'Success', description: 'Hotspot package created successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create package',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      download_speed: 0,
      upload_speed: 0,
      validity_minutes: 60,
      shared_users: 1,
      router_id: '',
    });
  };

  const handleCreate = () => {
    // Validate required fields
    if (!formData.name) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Package name is required',
      });
      return;
    }
    if (!formData.router_id) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a router',
      });
      return;
    }
    if (formData.download_speed <= 0 || formData.upload_speed <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Download and upload speeds must be greater than 0',
      });
      return;
    }
    if (formData.validity_minutes <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Validity minutes must be greater than 0',
      });
      return;
    }

    createMutation.mutate(formData);
  };

  // Filter and search packages
  const filteredPackages = useMemo(() => {
    let filtered = packages;

    // Router filter
    if (routerFilter !== 'all') {
      filtered = filtered.filter((pkg) => pkg.router_id === routerFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((pkg) => 
        statusFilter === 'active' ? pkg.is_active : !pkg.is_active
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (pkg) => {
          const routerName = routers.find((r) => r.id === pkg.router_id)?.name?.toLowerCase() || '';
          return (
            pkg.name.toLowerCase().includes(searchLower) ||
            routerName.includes(searchLower) ||
            pkg.mikrotik_profile_name?.toLowerCase().includes(searchLower)
          );
        }
      );
    }

    return filtered;
  }, [packages, routerFilter, statusFilter, search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((pkg) => pkg.is_active).length;
    const synced = packages.filter((pkg) => pkg.mikrotik_profile_name).length;
    return { total, active, synced };
  }, [packages]);

  // Convert Kbps to Mbps for display
  const formatSpeed = (speedKbps: number) => {
    const speedMbps = speedKbps / 1000;
    if (speedMbps >= 1000) {
      return `${(speedMbps / 1000).toFixed(1)} Gbps`;
    }
    return `${speedMbps.toFixed(1)} Mbps`;
  };

  // Format validity minutes
  const formatValidity = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      }
      return `${hours}h ${remainingMinutes}m`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      if (remainingHours === 0) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
      return `${days}d ${remainingHours}h`;
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
          <h1 className="text-3xl font-bold text-gray-900">Hotspot Packages</h1>
          <p className="text-gray-600 mt-1">Manage hotspot-specific service packages</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['hotspot-packages'] })} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Packages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm text-gray-600 mb-2">MikroTik Synced</p>
                <p className="text-3xl font-bold text-purple-600">{stats.synced}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Wifi className="h-6 w-6 text-purple-600" />
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
                  placeholder="Search by name, router, or profile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={routerFilter}
                onChange={(e) => setRouterFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Routers</option>
                {routers.map((router) => (
                  <option key={router.id} value={router.id}>
                    {router.name}
                  </option>
                ))}
              </select>
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
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Package Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Router
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Download/Upload
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Shared Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    MikroTik Profile
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium">No hotspot packages found</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {search || routerFilter !== 'all' || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Create hotspot packages from the Packages page'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RouterIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {routers.find((r) => r.id === pkg.router_id)?.name || pkg.router_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">{formatSpeed(pkg.download_speed)}</div>
                          <div className="text-gray-500">{formatSpeed(pkg.upload_speed)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatValidity(pkg.validity_minutes)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {pkg.shared_users}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pkg.is_active ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            <XCircle className="h-3 w-3 mr-1" />Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-mono">
                          {pkg.mikrotik_profile_name || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Package Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Hotspot Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Hotspot Basic Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="router_id">Router *</Label>
              <Select
                id="router_id"
                value={formData.router_id}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, router_id: e.target.value })}
              >
                <option value="">Select a router...</option>
                {routers.map((router) => (
                  <option key={router.id} value={router.id}>
                    {router.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="download_speed">Download Speed (Mbps) *</Label>
                <Input
                  id="download_speed"
                  type="number"
                  value={formData.download_speed ? formData.download_speed / 1000 : ''}
                  onChange={(e) => {
                    const mbps = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, download_speed: mbps * 1000 }); // Convert to Kbps
                  }}
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500">Enter speed in Mbps (will be converted to Kbps)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload_speed">Upload Speed (Mbps) *</Label>
                <Input
                  id="upload_speed"
                  type="number"
                  value={formData.upload_speed ? formData.upload_speed / 1000 : ''}
                  onChange={(e) => {
                    const mbps = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, upload_speed: mbps * 1000 }); // Convert to Kbps
                  }}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-gray-500">Enter speed in Mbps (will be converted to Kbps)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validity_minutes">Validity (Minutes) *</Label>
                <Input
                  id="validity_minutes"
                  type="number"
                  value={formData.validity_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, validity_minutes: parseInt(e.target.value) || 60 })
                  }
                  placeholder="e.g., 60"
                />
                <p className="text-xs text-gray-500">Session timeout in minutes (e.g., 60 = 1 hour)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shared_users">Shared Users *</Label>
                <Input
                  id="shared_users"
                  type="number"
                  min="1"
                  value={formData.shared_users}
                  onChange={(e) =>
                    setFormData({ ...formData, shared_users: parseInt(e.target.value) || 1 })
                  }
                  placeholder="e.g., 1"
                />
                <p className="text-xs text-gray-500">Number of concurrent users allowed</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
