import { useState } from 'react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { Plus, Play, Pause } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export const Subscriptions = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
    queryFn: () => subscriptionsApi.list({ limit: 100 }),
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
    queryKey: ['packages'],
    queryFn: () => {
      // Get packages from all routers
      return Promise.all(routers.map((r) => packagesApi.listByRouter(r.id))).then((results) =>
        results.flat()
      );
    },
    enabled: routers.length > 0,
  });

  const createMutation = useMutation({
    mutationFn: subscriptionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setIsCreateOpen(false);
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

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage customer subscriptions</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Subscription
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No subscriptions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.customer_id}</TableCell>
                    <TableCell className="font-medium">{sub.username}</TableCell>
                    <TableCell>{sub.package_id}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sub.status)}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {sub.start_at ? new Date(sub.start_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {sub.end_at ? new Date(sub.end_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {sub.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => activateMutation.mutate(sub.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {sub.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => suspendMutation.mutate(sub.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {sub.status === 'suspended' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => resumeMutation.mutate(sub.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl" onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  id="customer"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="router">Router *</Label>
                <Select
                  id="router"
                  value={formData.router_id}
                  onChange={(e) => setFormData({ ...formData, router_id: e.target.value })}
                  required
                >
                  <option value="">Select router...</option>
                  {routers.map((router) => (
                    <option key={router.id} value={router.id}>
                      {router.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="package">Package *</Label>
              <Select
                id="package"
                value={formData.package_id}
                onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                required
              >
                <option value="">Select package...</option>
                {packages
                  .filter((p) => p.router_id === formData.router_id)
                  .map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (for PPPoE)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip_address">IP Address (for Static)</Label>
              <Input
                id="ip_address"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose onClick={() => setIsCreateOpen(false)} />
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
