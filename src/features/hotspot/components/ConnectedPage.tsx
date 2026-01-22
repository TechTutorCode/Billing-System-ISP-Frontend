import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotspotApi, SessionInfo } from '../../../api/hotspot';
import { Card } from '../../../components/ui/card';
import { CheckCircle2, Wifi, Clock, Download, Upload } from 'lucide-react';

export const ConnectedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const macAddress = searchParams.get('mac') || '';
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const fetchSessionInfo = async () => {
      if (!macAddress) {
        setLoading(false);
        return;
      }

      try {
        const info = await hotspotApi.getSessionInfo(macAddress);
        setSessionInfo(info);
      } catch (error) {
        console.error('Error fetching session info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, [macAddress]);

  useEffect(() => {
    if (!sessionInfo?.expires_at) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(sessionInfo.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeRemaining('Session Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [sessionInfo]);

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed} Mbps`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Successfully Connected!
            </h1>
            <p className="text-gray-600">
              You are now connected to the hotspot network
            </p>
          </div>

          {sessionInfo && (
            <div className="space-y-4 pt-4">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Package:</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {sessionInfo.package_name}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Download Speed:</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatSpeed(sessionInfo.download_speed)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Upload Speed:</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatSpeed(sessionInfo.upload_speed)}
                  </span>
                </div>

                {timeRemaining && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Time Remaining:</span>
                    </div>
                    <span className="font-bold text-orange-600 text-lg">
                      {timeRemaining}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!sessionInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-sm">
                Session information is not available. You are connected to the network.
              </p>
            </div>
          )}

          <div className="pt-4">
            <p className="text-sm text-gray-500">
              MAC Address: <span className="font-mono">{macAddress}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
