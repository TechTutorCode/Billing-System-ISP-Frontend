import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packagesApi } from '../../api/packages';
import { routersApi } from '../../api/routers';
import { Package, PackageCreate } from '../../api/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export const Packages = () => {
  const [selectedRouter, setSelectedRouter] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [syncingPackage, setSyncingPackage] = useState<Package | null>(null);
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

  const { data: routers = [] } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  const { data: packageTypes = [] } = useQuery({
    queryKey: ['package-types'],
    queryFn: packagesApi.listTypes,
  });

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages', selectedRouter],
    queryFn: () => packagesApi.listByRouter(selectedRouter),
    enabled: !!selectedRouter,
  });

  const createMutation = useMutation({
    mutationFn: packagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setIsCreateOpen(false);
      addToast({ title: 'Success', description: 'Package created successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create package',
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password?: string }) =>
      packagesApi.sync(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setIsSyncOpen(false);
      setSyncingPackage(null);
      addToast({ title: 'Success', description: 'Package synced to MikroTik successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to sync package',
      });
    },
  });

  const handleCreate = () => {
    if (!formData.router_id || !formData.package_type_id) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select router and package type',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleSync = (pkg: Package) => {
    setSyncingPackage(pkg);
    setIsSyncOpen(true);
  };

  const confirmSync = () => {
    if (syncingPackage) {
      syncMutation.mutate({ id: syncingPackage.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-600 mt-1">Manage service packages</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Router</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedRouter}
            onChange={(e) => setSelectedRouter(e.target.value)}
          >
            <option value="">Select a router...</option>
            {routers.map((router) => (
              <option key={router.id} value={router.id}>
                {router.name}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {selectedRouter && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : packages.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No packages found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.package_type.name}</TableCell>
                      <TableCell>
                        {pkg.download_speed}/{pkg.upload_speed} Mbps
                      </TableCell>
                      <TableCell>${pkg.price}</TableCell>
                      <TableCell>
                        {pkg.validity_value} {pkg.validity_unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {pkg.mikrotik_synced && (
                          <Badge variant="outline" className="ml-2">
                            Synced
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSync(pkg)}
                          disabled={!pkg.is_active}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl" onClose={() => setIsCreateOpen(false)}>
          <DialogHeader>
            <DialogTitle>Create Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="package_type">Package Type *</Label>
                <Select
                  id="package_type"
                  value={formData.package_type_id}
                  onChange={(e) => setFormData({ ...formData, package_type_id: e.target.value })}
                  required
                >
                  <option value="">Select type...</option>
                  {packageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="download_speed">Download Speed (Mbps) *</Label>
                <Input
                  id="download_speed"
                  type="number"
                  value={formData.download_speed}
                  onChange={(e) =>
                    setFormData({ ...formData, download_speed: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload_speed">Upload Speed (Mbps) *</Label>
                <Input
                  id="upload_speed"
                  type="number"
                  value={formData.upload_speed}
                  onChange={(e) =>
                    setFormData({ ...formData, upload_speed: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity_value">Validity Value *</Label>
                <Input
                  id="validity_value"
                  type="number"
                  value={formData.validity_value}
                  onChange={(e) =>
                    setFormData({ ...formData, validity_value: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity_unit">Validity Unit *</Label>
                <Select
                  id="validity_unit"
                  value={formData.validity_unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validity_unit: e.target.value as 'minutes' | 'hours' | 'days',
                    })
                  }
                  required
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </Select>
              </div>
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

      {/* Sync Dialog */}
      <Dialog open={isSyncOpen} onOpenChange={setIsSyncOpen}>
        <DialogContent onClose={() => setIsSyncOpen(false)}>
          <DialogHeader>
            <DialogTitle>Sync Package to MikroTik</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will sync the package to the MikroTik router. Make sure the router is online.
            </p>
          </div>
          <DialogFooter>
            <DialogClose onClick={() => setIsSyncOpen(false)} />
            <Button onClick={confirmSync} disabled={syncMutation.isPending}>
              {syncMutation.isPending ? 'Syncing...' : 'Sync'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
