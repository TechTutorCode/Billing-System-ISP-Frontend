import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packagesApi } from '../../api/packages';
import { routersApi } from '../../api/routers';
import { Package, PackageCreate, PackageUpdate } from '../../api/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/toast';
import { Plus, RefreshCw, Wifi, WifiOff, Edit2, Trash2, Box, CheckCircle, XCircle } from 'lucide-react';

export const Packages = () => {
  const [selectedRouter, setSelectedRouter] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);
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
  const [editFormData, setEditFormData] = useState<PackageUpdate>({
    name: '',
    download_speed: 0,
    upload_speed: 0,
    price: 0,
    validity_value: 1,
    validity_unit: 'days',
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PackageUpdate }) =>
      packagesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setEditingPackage(null);
      resetEditForm();
      addToast({ title: 'Success', description: 'Package updated successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update package',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => packagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setDeletingPackage(null);
      addToast({ title: 'Success', description: 'Package deleted successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete package',
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

  const resetEditForm = () => {
    setEditFormData({
      name: '',
      download_speed: 0,
      upload_speed: 0,
      price: 0,
      validity_value: 1,
      validity_unit: 'days',
    });
  };

  const handleCreate = () => {
    // Set router_id from selectedRouter
    const dataToSubmit = {
      ...formData,
      router_id: selectedRouter,
    };

    // Validate all required fields
    if (!dataToSubmit.router_id) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a router first',
      });
      return;
    }
    if (!dataToSubmit.package_type_id) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a package type',
      });
      return;
    }
    if (!dataToSubmit.name || dataToSubmit.name.trim() === '') {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Package name is required',
      });
      return;
    }
    if (!dataToSubmit.download_speed || dataToSubmit.download_speed <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Download speed must be greater than 0',
      });
      return;
    }
    if (!dataToSubmit.upload_speed || dataToSubmit.upload_speed <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Upload speed must be greater than 0',
      });
      return;
    }
    if (!dataToSubmit.price || dataToSubmit.price <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Price must be greater than 0',
      });
      return;
    }
    if (!dataToSubmit.validity_value || dataToSubmit.validity_value <= 0) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Validity value must be greater than 0',
      });
      return;
    }

    createMutation.mutate(dataToSubmit);
  };

  const handleUpdate = () => {
    if (!editingPackage || !editFormData.name) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Package name is required',
      });
      return;
    }
    updateMutation.mutate({ id: editingPackage.id, data: editFormData });
  };

  const handleDelete = () => {
    if (!deletingPackage) return;
    deleteMutation.mutate({ id: deletingPackage.id });
  };

  const startEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setEditFormData({
      name: pkg.name,
      download_speed: pkg.download_speed,
      upload_speed: pkg.upload_speed,
      price: parseFloat(pkg.price),
      validity_value: pkg.validity_value,
      validity_unit: pkg.validity_unit,
      data_limit_gb: pkg.data_limit_gb || undefined,
    });
  };

  const handleSync = (pkg: Package) => {
    syncMutation.mutate({ id: pkg.id });
  };

  // Calculate statistics for the selected router
  const stats = useMemo(() => {
    if (!selectedRouter || packages.length === 0) {
      return { total: 0, synced: 0, notSynced: 0 };
    }
    const total = packages.length;
    const synced = packages.filter((pkg) => pkg.mikrotik_synced).length;
    const notSynced = packages.filter((pkg) => !pkg.mikrotik_synced).length;
    return { total, synced, notSynced };
  }, [packages, selectedRouter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-500 mt-1">Manage service packages for your routers</p>
        </div>
        <Button
          onClick={() => {
            if (!selectedRouter) {
              addToast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a router first',
              });
              return;
            }
            setIsCreateOpen(true);
          }}
        >
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

      {/* Statistics Cards - Only show when router is selected */}
      {selectedRouter && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.total}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Box className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Synced</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.synced}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Not Synced</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.notSynced}
                  </p>
                </div>
                <div className="bg-saas-primary/10 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-saas-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{pkg.name}</h3>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {pkg.package_type?.name || 'N/A'}
                      </Badge>
                    </div>
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
                    <span className="text-gray-600">Package Type:</span>
                    <span className="font-medium">{pkg.package_type?.name || 'N/A'}</span>
                  </div>
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
                    <span className="font-medium">KES {pkg.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Validity:</span>
                    <span className="font-medium">
                      {pkg.validity_value} {pkg.validity_unit}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!pkg.mikrotik_synced && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSync(pkg)}
                      disabled={syncMutation.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className={!pkg.mikrotik_synced ? 'flex-1' : 'w-full'}
                    onClick={() => startEdit(pkg)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={!pkg.mikrotik_synced ? 'flex-1' : 'w-full'}
                    onClick={() => setDeletingPackage(pkg)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
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
              <Label htmlFor="price">Price (KES) *</Label>
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

      {/* Edit Dialog */}
      <Dialog open={!!editingPackage} onOpenChange={(open) => !open && setEditingPackage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Package Name *</Label>
              <Input
                id="edit_name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="e.g., Basic Plan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_download_speed">Download Speed (Mbps)</Label>
                <Input
                  id="edit_download_speed"
                  type="number"
                  value={editFormData.download_speed}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, download_speed: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_upload_speed">Upload Speed (Mbps)</Label>
                <Input
                  id="edit_upload_speed"
                  type="number"
                  value={editFormData.upload_speed}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, upload_speed: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_price">Price (KES)</Label>
              <Input
                id="edit_price"
                type="number"
                step="0.01"
                value={editFormData.price}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_validity_value">Validity Value</Label>
                <Input
                  id="edit_validity_value"
                  type="number"
                  value={editFormData.validity_value}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, validity_value: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_validity_unit">Validity Unit</Label>
                <Select
                  id="edit_validity_unit"
                  value={editFormData.validity_unit}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, validity_unit: e.target.value as 'minutes' | 'hours' | 'days' })
                  }
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_data_limit">Data Limit (GB)</Label>
              <Input
                id="edit_data_limit"
                type="number"
                step="0.01"
                value={editFormData.data_limit_gb || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, data_limit_gb: parseFloat(e.target.value) || undefined })
                }
                placeholder="Optional - leave empty for unlimited"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPackage(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPackage} onOpenChange={(open) => !open && setDeletingPackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the package <strong>{deletingPackage?.name}</strong>? This action cannot be undone.
            </p>
            <p className="text-sm text-gray-500">
              The package will be disabled and will no longer be available for new subscriptions.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPackage(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
