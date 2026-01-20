import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routersApi } from '../../api/routers';
import { Router, RouterCreate, RouterUpdate } from '../../api/types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useToast } from '../../components/ui/toast';
import { Wifi, WifiOff, Server, Clock, Plus, Edit2, Copy, Check, Search } from 'lucide-react';

export const Routers = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRouter, setEditingRouter] = useState<Router | null>(null);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [createFormData, setCreateFormData] = useState<RouterCreate>({
    name: '',
    mikrotik_api_username: 'admin',
    mikrotik_api_password: '',
  });
  const [editFormData, setEditFormData] = useState<RouterUpdate>({
    name: '',
    api_port: 8728,
    mikrotik_api_username: '',
    mikrotik_api_password: '',
  });
  const [openvpnConfig, setOpenvpnConfig] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: routers = [], isLoading } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: routersApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['routers'] });
      setIsCreateOpen(false);
      setOpenvpnConfig(response.openvpn_config);
      resetCreateForm();
      addToast({ title: 'Success', description: 'Router created successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create router',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RouterUpdate }) =>
      routersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routers'] });
      setEditingRouter(null);
      resetEditForm();
      addToast({ title: 'Success', description: 'Router updated successfully' });
    },
    onError: (error: any) => {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update router',
      });
    },
  });

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
      mikrotik_api_username: 'admin',
      mikrotik_api_password: '',
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      name: '',
      api_port: 8728,
      mikrotik_api_username: '',
      mikrotik_api_password: '',
    });
  };

  const handleCreate = () => {
    if (!createFormData.name) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Router name is required',
      });
      return;
    }
    createMutation.mutate(createFormData);
  };

  const handleUpdate = () => {
    if (!editingRouter) return;
    updateMutation.mutate({ id: editingRouter.id, data: editFormData });
  };

  const startEdit = (router: Router) => {
    setEditingRouter(router);
    setEditFormData({
      name: router.name,
      api_port: router.api_port,
      mikrotik_api_username: router.mikrotik_api_username,
      mikrotik_api_password: '',
    });
  };

  const copyConfig = () => {
    if (openvpnConfig) {
      navigator.clipboard.writeText(openvpnConfig);
      setCopiedConfig(openvpnConfig);
      setTimeout(() => setCopiedConfig(null), 2000);
      addToast({ title: 'Success', description: 'OpenVPN config copied to clipboard' });
    }
  };

  // Filter and sort routers
  const filteredAndSortedRouters = useMemo(() => {
    let filtered = routers;
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = routers.filter(
        (router) =>
          router.name.toLowerCase().includes(searchLower) ||
          router.vpn_ip?.toLowerCase().includes(searchLower) ||
          router.vpn_username.toLowerCase().includes(searchLower) ||
          router.mikrotik_api_username.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort: online first, then offline
    return filtered.sort((a, b) => {
      // Online routers first
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (a.status !== 'online' && b.status === 'online') return 1;
      
      // If same status, maintain order
      return 0;
    });
  }, [routers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Routers</h1>
          <p className="text-gray-500 mt-1">Monitor your MikroTik router connections</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Router
        </Button>
      </div>

      {/* Search */}
      {routers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, VPN IP, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Routers List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            Loading routers...
          </CardContent>
        </Card>
      ) : routers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No routers configured</p>
            <Button onClick={() => setIsCreateOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Router
            </Button>
          </CardContent>
        </Card>
      ) : filteredAndSortedRouters.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            No routers found matching your search
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRouters.map((router) => (
            <Card key={router.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{router.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">MikroTik Router</p>
                  </div>
                  {router.status === 'online' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">VPN IP:</span> {router.vpn_ip || 'Not assigned'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">API Port:</span> {router.api_port}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">API User:</span> {router.mikrotik_api_username}
                  </div>
                  {router.status === 'offline' && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Last Seen:</span>{' '}
                      {router.last_seen ? new Date(router.last_seen).toLocaleString() : 'Never'}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => startEdit(router)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Router
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Router</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Router Name *</Label>
              <Input
                id="name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                placeholder="e.g., Main Office Router"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mikrotik_api_username">MikroTik API Username</Label>
              <Input
                id="mikrotik_api_username"
                value={createFormData.mikrotik_api_username}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, mikrotik_api_username: e.target.value })
                }
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mikrotik_api_password">MikroTik API Password</Label>
              <Input
                id="mikrotik_api_password"
                type="password"
                value={createFormData.mikrotik_api_password}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, mikrotik_api_password: e.target.value })
                }
                placeholder="Optional - leave blank if not set"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Router'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OpenVPN Config Dialog */}
      <Dialog open={!!openvpnConfig} onOpenChange={(open) => !open && setOpenvpnConfig(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Router Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your router has been created. Copy the OpenVPN configuration below and use it to configure your MikroTik router.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>OpenVPN Configuration</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyConfig}
                  className="flex items-center gap-2"
                >
                  {copiedConfig === openvpnConfig ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <textarea
                readOnly
                value={openvpnConfig || ''}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenvpnConfig(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRouter} onOpenChange={(open) => !open && setEditingRouter(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Router</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Router Name</Label>
              <Input
                id="edit_name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Router name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_api_port">API Port</Label>
              <Input
                id="edit_api_port"
                type="number"
                value={editFormData.api_port}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, api_port: parseInt(e.target.value) || 8728 })
                }
                placeholder="8728"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_mikrotik_api_username">MikroTik API Username</Label>
              <Input
                id="edit_mikrotik_api_username"
                value={editFormData.mikrotik_api_username}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, mikrotik_api_username: e.target.value })
                }
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_mikrotik_api_password">MikroTik API Password</Label>
              <Input
                id="edit_mikrotik_api_password"
                type="password"
                value={editFormData.mikrotik_api_password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, mikrotik_api_password: e.target.value })
                }
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditingRouter(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
