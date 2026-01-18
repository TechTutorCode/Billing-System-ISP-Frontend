import { useState, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { routersApi } from '../../api/routers';
import { Router } from '../../api/types';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Wifi, WifiOff, RefreshCw, History } from 'lucide-react';

export const Routers = () => {
  const [selectedRouter, setSelectedRouter] = useState<Router | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: routers = [], isLoading } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  // Fetch the most recent status history record for each router
  const statusHistoryQueries = useQueries({
    queries: routers.map((router) => ({
      queryKey: ['router-status-history-latest', router.id],
      queryFn: () => routersApi.getStatusHistory(router.id, 1),
      enabled: routers.length > 0,
    })),
  });

  // Create a map of router ID to most recent last_seen from status history
  const lastSeenMap = useMemo(() => {
    const map = new Map<string, string | null>();
    statusHistoryQueries.forEach((query, index) => {
      const router = routers[index];
      if (router && query.data && query.data.length > 0) {
        const mostRecentRecord = query.data[0]; // Most recent record (limit=1)
        map.set(router.id, mostRecentRecord.last_seen);
      }
    });
    return map;
  }, [statusHistoryQueries, routers]);

  const { data: statusHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['router-status-history', selectedRouter?.id],
    queryFn: () => routersApi.getStatusHistory(selectedRouter!.id),
    enabled: !!selectedRouter && isHistoryOpen,
  });

  const handleViewHistory = (router: Router) => {
    setSelectedRouter(router);
    setIsHistoryOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Routers</h1>
        <p className="text-gray-600 mt-1">Manage MikroTik routers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : routers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No routers found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>VPN IP</TableHead>
                  <TableHead>API Port</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routers.map((router) => (
                  <TableRow key={router.id}>
                    <TableCell className="font-medium">{router.name}</TableCell>
                    <TableCell>{router.vpn_ip}</TableCell>
                    <TableCell>{router.api_port}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {router.status === 'online' ? (
                          <Wifi className="h-4 w-4 text-green-600" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant={router.status === 'online' ? 'default' : 'secondary'}>
                          {router.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const lastSeen = lastSeenMap.get(router.id);
                        return lastSeen
                          ? new Date(lastSeen).toLocaleString()
                          : '-';
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewHistory(router)}
                          title="View History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Refresh">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Status History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" onClose={() => setIsHistoryOpen(false)}>
          <DialogHeader>
            <DialogTitle>
              Status History - {selectedRouter?.name}
            </DialogTitle>
          </DialogHeader>
          {historyLoading ? (
            <div className="p-8 text-center text-gray-400">Loading history...</div>
          ) : statusHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No history records found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recorded At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>VPN IP</TableHead>
                  <TableHead>API Port</TableHead>
                  <TableHead>MikroTik API</TableHead>
                  <TableHead>Connected Since</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.recorded_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'online' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.vpn_ip || '-'}</TableCell>
                    <TableCell>{record.api_port}</TableCell>
                    <TableCell>
                      <Badge variant={record.mikrotik_api_accessible ? 'default' : 'secondary'}>
                        {record.mikrotik_api_accessible ? 'Accessible' : 'Not Accessible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.connected_since
                        ? new Date(record.connected_since).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.last_seen
                        ? new Date(record.last_seen).toLocaleString()
                        : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
