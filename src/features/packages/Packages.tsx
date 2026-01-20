import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packagesApi } from '../../api/packages';
import { routersApi } from '../../api/routers';
import { Package, PackageCreate } from '../../api/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { Plus, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export const Packages = () => {
  const [selectedRouter, setSelectedRouter] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
      resetForm();
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
    mutationFn: ({ id }: { id: string }) => packagesApi.sync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setSyncingPackage(null);
      addToast({ title: 'Success', description: 'Package synced successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to sync package',
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
      package_type_id: '',
    });
  };

  const handleCreate = () => {
    if (!formData.router_id || !formData.package_type_id || !formData.name) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleSync = (pkg: Package) => {
    setSyncingPackage(pkg);
    syncMutation.mutate({ id: pkg.id });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-500 mt-1">Manage service packages for your routers</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} disabled={!selectedRouter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Router Selection */}
      <Card>
        <CardContent className="p-6">
          <Label htmlFor="router-select" className="text-base font-medium mb-3 block">
            Select Router
          </Label>
          <Select
            id="router-select"
            value={selectedRouter}
            onChange={(e) => setSelectedRouter(e.target.value)}
          >
            <option value="">Choose a router...</option>
            {routers.map((router) => (
              <option key={router.id} value={router.id}>
                {router.name}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Packages List */}
      {!selectedRouter ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            Please select a router to view packages
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            Loading packages...
          </CardContent>
        </Card>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No packages found for this router</p>
            <Button onClick={() => setIsCreateOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create First Package
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{pkg.name}</h3>
                    <p className="text-sm text-gray-500">{pkg.package_type?.name || 'N/A'}</p>
                  </div>
                  {pkg.mikrotik_synced ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      Synced
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Not Synced
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Download:</span>
                    <span className="font-medium">{pkg.download_speed} Mbps</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Upload:</span>
                    <span className="font-medium">{pkg.upload_speed} Mbps</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${pkg.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Validity:</span>
                    <span className="font-medium">
                      {pkg.validity_value} {pkg.validity_unit}
                    </span>
                  </div>
                </div>
                {!pkg.mikrotik_synced && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSync(pkg)}
                    disabled={syncMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                    Sync to Router
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Basic Plan"
              />
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
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity_unit">Validity Unit *</Label>
                <Select
                  id="validity_unit"
                  value={formData.validity_unit}
                  onChange={(e) =>
                    setFormData({ ...formData, validity_unit: e.target.value as 'days' | 'months' })
                  }
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="package_type">Package Type *</Label>
              <Select
                id="package_type"
                value={formData.package_type_id}
                onChange={(e) => setFormData({ ...formData, package_type_id: e.target.value })}
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
