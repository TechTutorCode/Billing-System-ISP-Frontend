import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../../api/subscriptions';
import { customersApi } from '../../api/customers';
import { routersApi } from '../../api/routers';
import { packagesApi } from '../../api/packages';
import { SubscriptionCreate } from '../../api/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { Plus, Play, Pause, User, Calendar, Users, Clock, TrendingUp, AlertCircle, Ban, Search } from 'lucide-react';

export const Subscriptions = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [formData, setFormData] = useState<SubscriptionCreate>({
    customer_id: '',
    router_id: '',
    package_id: '',
    username: '',
    password: '',
    ip_address: '',
  });

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.list({ limit: 1000 }),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersApi.list({ limit: 1000 }),
  });

  const { data: routers = [] } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages', formData.router_id],
    queryFn: () => packagesApi.listByRouter(formData.router_id),
    enabled: !!formData.router_id,
  });

  // Fetch all packages for search (we need to get packages from all routers)
  const { data: allRouters = [] } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  // Fetch packages from all routers for search functionality
  const allPackagesQueries = useQuery({
    queryKey: ['all-packages-for-search'],
    queryFn: async () => {
      if (allRouters.length === 0) return [];
      const packagePromises = allRouters.map((router) => 
        packagesApi.listByRouter(router.id).catch(() => [])
      );
      const packageArrays = await Promise.all(packagePromises);
      return packageArrays.flat();
    },
    enabled: allRouters.length > 0,
  });

  const allPackages = allPackagesQueries.data || [];

  const createMutation = useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setIsCreateOpen(false);
      resetForm();
      addToast({ title: 'Success', description: 'Subscription created successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create subscription',
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addToast({ title: 'Success', description: 'Subscription activated' });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addToast({ title: 'Success', description: 'Subscription suspended' });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.resume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      addToast({ title: 'Success', description: 'Subscription resumed' });
    },
  });

  const resetForm = () => {
    setFormData({
      customer_id: '',
      router_id: '',
      package_id: '',
      username: '',
      password: '',
      ip_address: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'secondary';
      case 'expired':
        return 'destructive';
      case 'terminated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : customerId;
  };

  const getPackageName = (packageId: string) => {
    // First check form packages, then all packages
    const pkg = packages.find((p) => p.id === packageId) || allPackages.find((p) => p.id === packageId);
    return pkg ? pkg.name : packageId;
  };

  // Filter subscriptions based on search and status
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((sub) => {
        const username = sub.username.toLowerCase();
        const customerName = getCustomerName(sub.customer_id).toLowerCase();
        const packageName = getPackageName(sub.package_id).toLowerCase();
        const ipAddress = sub.ip_address?.toLowerCase() || '';
        
        return (
          username.includes(query) ||
          customerName.includes(query) ||
          packageName.includes(query) ||
          ipAddress.includes(query)
        );
      });
    }

    return filtered;
  }, [subscriptions, searchQuery, statusFilter, customers, allPackages]);

  const handleCreate = () => {
    if (!formData.customer_id || !formData.router_id || !formData.package_id || !formData.username) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalSubscriptions = subscriptions.length;
    
    const expiringToday = subscriptions.filter((sub) => {
      if (!sub.end_at) return false;
      const endDate = new Date(sub.end_at);
      return endDate >= todayStart && endDate < todayEnd && 
             (sub.status === 'active' || sub.status === 'suspended');
    }).length;

    const newToday = subscriptions.filter((sub) => {
      if (!sub.created_at) return false;
      const createdDate = new Date(sub.created_at);
      return createdDate >= todayStart && createdDate < todayEnd;
    }).length;

    const newThisMonth = subscriptions.filter((sub) => {
      if (!sub.created_at) return false;
      const createdDate = new Date(sub.created_at);
      return createdDate >= monthStart && createdDate < monthEnd;
    }).length;

    const expired = subscriptions.filter((sub) => sub.status === 'expired').length;
    const suspended = subscriptions.filter((sub) => sub.status === 'suspended').length;

    return {
      totalSubscriptions,
      expiringToday,
      newToday,
      newThisMonth,
      expired,
      suspended,
    };
  }, [subscriptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 mt-1">Manage customer service subscriptions</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Subscription
        </Button>
      </div>

      {/* Search and Filter */}
      {!isLoading && subscriptions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by username, customer name, package, or IP address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </Select>
              </div>
            </div>
            {filteredSubscriptions.length !== subscriptions.length && (
              <p className="text-sm text-gray-500 mt-3">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Cards */}
      {!isLoading && subscriptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Subscriptions</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalSubscriptions}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Expire Today</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.expiringToday}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">New Today</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.newToday}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">New This Month</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.newThisMonth}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Expired</p>
                  <p className="text-3xl font-bold text-red-600">{analytics.expired}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Suspended</p>
                  <p className="text-3xl font-bold text-yellow-600">{analytics.suspended}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Ban className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            Loading subscriptions...
          </CardContent>
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No subscriptions found</p>
            <Button onClick={() => setIsCreateOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create First Subscription
            </Button>
          </CardContent>
        </Card>
      ) : filteredSubscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">
              {searchQuery || statusFilter 
                ? 'No subscriptions found matching your search criteria' 
                : 'No subscriptions found'}
            </p>
            {(searchQuery || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscriptions.map((sub) => (
            <Card key={sub.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{sub.username}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {getCustomerName(sub.customer_id)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(sub.status)}>{sub.status}</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Package:</span> {getPackageName(sub.package_id)}
                  </div>
                  {sub.start_at && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="font-medium">Start:</span>{' '}
                      {new Date(sub.start_at).toLocaleDateString()}
                    </div>
                  )}
                  {sub.end_at && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="font-medium">End:</span>{' '}
                      {new Date(sub.end_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {sub.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => activateMutation.mutate(sub.id)}
                      disabled={activateMutation.isPending}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  {sub.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => suspendMutation.mutate(sub.id)}
                      disabled={suspendMutation.isPending}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  )}
                  {sub.status === 'suspended' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => resumeMutation.mutate(sub.id)}
                      disabled={resumeMutation.isPending}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select
                id="customer"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              >
                <option value="">Select customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} (#{customer.account_number})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="router">Router *</Label>
              <Select
                id="router"
                value={formData.router_id}
                onChange={(e) => setFormData({ ...formData, router_id: e.target.value, package_id: '' })}
              >
                <option value="">Select router...</option>
                {routers.map((router) => (
                  <option key={router.id} value={router.id}>
                    {router.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="package">Package *</Label>
              <Select
                id="package"
                value={formData.package_id}
                onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                disabled={!formData.router_id}
              >
                <option value="">Select package...</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - KES {pkg.price}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g., customer123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (for PPPoE packages)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip_address">IP Address (for Static packages)</Label>
              <Input
                id="ip_address"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                placeholder="e.g., 192.168.1.100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
