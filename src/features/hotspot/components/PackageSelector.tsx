import { useState, useEffect } from 'react';
import { hotspotApi, HotspotPackage } from '../../../api/hotspot';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

interface PackageSelectorProps {
  onSelect: (packageId: string) => void;
  selectedPackageId?: string;
  isLoading?: boolean;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  onSelect,
  selectedPackageId,
  isLoading = false,
}) => {
  const [packages, setPackages] = useState<HotspotPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotspotApi.getPackages();
        // Filter only active packages
        const activePackages = data.filter((pkg) => pkg.is_active);
        setPackages(activePackages);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load packages');
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const formatSpeed = (speed: number) => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed} Mbps`;
  };

  const formatValidity = (value: number, unit: string) => {
    const unitMap: Record<string, string> = {
      minutes: value === 1 ? 'minute' : 'minutes',
      hours: value === 1 ? 'hour' : 'hours',
      days: value === 1 ? 'day' : 'days',
    };
    return `${value} ${unitMap[unit] || unit}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading packages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-yellow-800 text-sm">No packages available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedPackageId === pkg.id
                ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50'
                : 'hover:shadow-lg border-gray-200'
            }`}
            onClick={() => !isLoading && onSelect(pkg.id)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                {selectedPackageId === pkg.id && (
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Download:</span>
                  <span className="font-semibold text-gray-900">
                    {formatSpeed(pkg.download_speed)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Upload:</span>
                  <span className="font-semibold text-gray-900">
                    {formatSpeed(pkg.upload_speed)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Validity:</span>
                  <span className="font-semibold text-gray-900">
                    {formatValidity(pkg.validity_value, pkg.validity_unit)}
                  </span>
                </div>
                {pkg.data_limit_gb && (
                  <div className="flex items-center justify-between">
                    <span>Data Limit:</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.data_limit_gb} GB
                    </span>
                  </div>
                )}
              </div>

              {pkg.price && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-lg font-bold text-blue-600">{pkg.price}</p>
                </div>
              )}

              <Button
                className="w-full mt-4"
                variant={selectedPackageId === pkg.id ? 'default' : 'outline'}
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(pkg.id);
                }}
              >
                {selectedPackageId === pkg.id ? 'Selected' : 'Select Package'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
