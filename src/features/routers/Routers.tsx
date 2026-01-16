import { useQuery } from '@tanstack/react-query';
import { routersApi } from '../../api/routers';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const Routers = () => {
  const { data: routers = [], isLoading } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

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
                      {router.last_seen
                        ? new Date(router.last_seen).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
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
    </div>
  );
};
