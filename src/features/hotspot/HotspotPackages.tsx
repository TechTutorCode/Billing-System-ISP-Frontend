import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotspotAdminApi } from '../../api/hotspot';
import { routersApi } from '../../api/routers';
import { packagesApi } from '../../api/packages';
import { PackageCreate, PackageType } from '../../api/types';
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
  const [formData, setFormData] = useState<PackageCreate>({
    name: '',
    download_speed: 0,
    upload_speed: 0,
    price: 0,
    validity_value: 1,
    validity_unit: 'days',
    router_id: '',
    package_type_id: '',
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

  const { data: packageTypes = [] } = useQuery<PackageType[]>({
    queryKey: ['package-types'],
    queryFn: packagesApi.listTypes,
  });

  // Get hotspot package type ID
  const hotspotPackageType = useMemo(() => {
    return packageTypes.find((type) => type.name.toLowerCase() === 'hotspot');
  }, [packageTypes]);

  // Set hotspot package type when available
  useEffect(() => {
    if (hotspotPackageType && !formData.package_type_id) {
      setFormData((prev: PackageCreate) => ({ ...prev, package_type_id: hotspotPackageType.id }));
    }
  }, [hotspotPackageType, formData.package_type_id]);

  const createMutation = useMutation({
    mutationFn: packagesApi.create,
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
      price: 0,
      validity_value: 1,
      validity_unit: 'days',
      router_id: '',
      package_type_id: hotspotPackageType?.id || '',
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
    if (!formData.package_type_id) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Package type is required',
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
    if (formData.price <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Price must be greater than 0',
      });
      return;
    }
    if (formData.validity_value <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Validity value must be greater than 0',
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
        (pkg) =>
          pkg.name.toLowerCase().includes(searchLower) ||
          pkg.router_name?.toLowerCase().includes(searchLower) ||
          pkg.mikrotik_profile_name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [packages, routerFilter, statusFilter, search]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((pkg) => pkg.is_active).length;
    const synced = packages.filter((pkg) => pkg.mikrotik_synced).length;
    return { total, active, synced };
  }, [packages]);

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed} Mbps`;
  };

  const formatValidity = (value: number, unit: string) => {
    const unitMap: Record<string, string> = {
      minutes: value === 1 ? 'minute' : 'minutes',
      hours: value === 1 ? 'hour' : 'hours',
      days: value === 1 ? 'day' : 'days',
    };
    return `${value} ${unitMap[unit] || unit}`;
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
                    Data Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    MikroTik
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
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
                          {pkg.mikrotik_profile_name && (
                            <p className="text-xs text-gray-500 mt-1">
                              Profile: {pkg.mikrotik_profile_name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RouterIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{pkg.router_name || 'N/A'}</span>
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
                          {formatValidity(pkg.validity_value, pkg.validity_unit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {pkg.data_limit_gb ? `${pkg.data_limit_gb} GB` : 'Unlimited'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-blue-600">{pkg.price}</span>
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
                        {pkg.mikrotik_synced ? (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                            <CheckCircle className="h-3 w-3 mr-1" />Synced
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <XCircle className="h-3 w-3 mr-1" />Not Synced
                          </Badge>
                        )}
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
                  value={formData.download_speed}
                  onChange={(e) =>
                    setFormData({ ...formData, download_speed: parseInt(e.target.value) || 0 })
                  }
                  placeholder="e.g., 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload_speed">Upload Speed (Mbps) *</Label>
                <Input
                  id="upload_speed"
                  type="number"
                  value={formData.upload_speed}
                  onChange={(e) =>
                    setFormData({ ...formData, upload_speed: parseInt(e.target.value) || 0 })
                  }
                  placeholder="e.g., 5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="e.g., 500.00"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validity_value">Validity Value *</Label>
                <Input
                  id="validity_value"
                  type="number"
                  value={formData.validity_value}
                  onChange={(e) =>
                    setFormData({ ...formData, validity_value: parseInt(e.target.value) || 1 })
                  }
                  placeholder="e.g., 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity_unit">Validity Unit *</Label>
                <Select
                  id="validity_unit"
                  value={formData.validity_unit}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, validity_unit: e.target.value as 'minutes' | 'hours' | 'days' })
                  }
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_limit_gb">Data Limit (GB) - Optional</Label>
              <Input
                id="data_limit_gb"
                type="number"
                value={formData.data_limit_gb || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    data_limit_gb: e.target.value ? parseInt(e.target.value) : undefined 
                  })
                }
                placeholder="Leave empty for unlimited"
              />
            </div>
            {hotspotPackageType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Package Type:</strong> {hotspotPackageType.name} (automatically selected)
                </p>
              </div>
            )}
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
