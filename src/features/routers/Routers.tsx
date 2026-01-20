import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { routersApi } from '../../api/routers';
import { Router } from '../../api/types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Wifi, WifiOff, Server, Clock } from 'lucide-react';

export const Routers = () => {
  const { data: routers = [], isLoading } = useQuery({
    queryKey: ['routers'],
    queryFn: routersApi.list,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Routers</h1>
        <p className="text-gray-500 mt-1">Monitor your MikroTik router connections</p>
      </div>

      {/* Routers List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            Loading routers...
          </CardContent>
        </Card>
      ) : routers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            No routers configured
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routers.map((router) => (
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
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">VPN IP:</span> {router.vpn_ip}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Server className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">API Port:</span> {router.api_port}
                  </div>
                  {router.last_seen && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Last Seen:</span>{' '}
                      {new Date(router.last_seen).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
