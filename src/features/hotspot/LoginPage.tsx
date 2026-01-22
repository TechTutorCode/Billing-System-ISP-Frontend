import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotspotApi } from '../../api/hotspot';
import { TemplateRenderer } from './components/TemplateRenderer';
import { TemplateWithComponents } from './components/TemplateWithComponents';
import { PackageSelector } from './components/PackageSelector';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

// Default template if backend doesn't provide one
// Templates support placeholders: {{mac}}, {{profile}}, {{linkLogin}}
// Templates can also include React components using data attributes:
// - <div data-package-selector></div> - renders PackageSelector component
// - <div data-submit-button></div> - renders Submit button
const DEFAULT_TEMPLATE = `
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
  <div class="w-full max-w-md">
    <div class="bg-white rounded-lg shadow-xl p-8">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Hotspot</h1>
        <p class="text-gray-600">Connect to our network</p>
      </div>
      
      <div class="mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p class="text-sm text-blue-800">
            <strong>Device MAC:</strong> {{mac}}
          </p>
        </div>
        
        <div data-package-selector></div>
      </div>
      
      <form id="login-form" class="space-y-4">
        <div data-submit-button></div>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>By connecting, you agree to our terms of service</p>
      </div>
    </div>
  </div>
</div>
`;

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const macAddress = searchParams.get('mac') || '';
  const dst = searchParams.get('dst') || '';
  const templateId = searchParams.get('template_id') || undefined;
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<string>(DEFAULT_TEMPLATE);
  const [useTemplate, setUseTemplate] = useState(false);
  const [mikrotikIp, setMikrotikIp] = useState<string>('');

  useEffect(() => {
    // Extract MikroTik IP from dst parameter if available
    if (dst) {
      try {
        const url = new URL(dst);
        setMikrotikIp(url.hostname);
      } catch {
        // If dst is not a full URL, try to extract IP from it
        const ipMatch = dst.match(/\d+\.\d+\.\d+\.\d+/);
        if (ipMatch) {
          setMikrotikIp(ipMatch[0]);
        }
      }
    }

    // Try to fetch template from backend
    const fetchTemplate = async () => {
      try {
        const templateData = await hotspotApi.getTemplate(templateId);
        if (templateData && templateData.content) {
          setTemplate(templateData.content);
          setUseTemplate(true);
        }
      } catch (error) {
        console.log('Using default template');
      }
    };

    fetchTemplate();
  }, [templateId, dst]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!macAddress) {
      setError('MAC address is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await hotspotApi.createMacVoucher({
        mac_address: macAddress,
        package_id: selectedPackageId || undefined,
        dst: dst || undefined,
      });

      if (response.status_code === 200 || response.status_code === 201) {
        // Build MikroTik login URL
        // Format: http://MIKROTIK_IP/login?username=<MAC>&password=
        const loginUrl = response.login_url || 
          (mikrotikIp 
            ? `http://${mikrotikIp}/login?username=${macAddress}&password=`
            : `http://${macAddress}/login?username=${macAddress}&password=`
          );

        // Auto-redirect to MikroTik login page
        window.location.href = loginUrl;
      } else {
        setError(response.message || 'Failed to create voucher');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to connect. Please try again.';
      setError(errorMessage);
      console.error('Error creating voucher:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If using custom template, render it with variable substitution and React component support
  if (useTemplate) {
    const variables = {
      mac: macAddress,
      profile: selectedPackageId || 'Default',
      linkLogin: mikrotikIp 
        ? `http://${mikrotikIp}/login?username=${macAddress}&password=`
        : '#',
    };

    return (
      <TemplateWithComponents
        template={template}
        variables={variables}
        selectedPackageId={selectedPackageId}
        onPackageSelect={setSelectedPackageId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Default UI (non-template mode)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Hotspot
          </h1>
          <p className="text-gray-600">
            Select a package and connect to our network
          </p>
        </div>

        {macAddress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Device MAC Address:</strong>{' '}
              <span className="font-mono">{macAddress}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PackageSelector
            onSelect={setSelectedPackageId}
            selectedPackageId={selectedPackageId}
            isLoading={isSubmitting}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !macAddress}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Connecting...
                </>
              ) : (
                'Connect to Internet'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By connecting, you agree to our terms of service</p>
        </div>
      </Card>
    </div>
  );
};
