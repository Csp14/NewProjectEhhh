'use client';

interface ApiStatusBannerProps {
  status: 'ok' | 'limited' | 'mock' | 'error';
  quotaRemaining: number;
  message?: string;
}

export default function ApiStatusBanner({
  status,
  quotaRemaining,
  message,
}: ApiStatusBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ok':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: '✅',
          title: 'API Operational',
          description: 'Fetching live data from YouTube',
        };
      case 'limited':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: '⚠️',
          title: 'API Quota Low',
          description: `${quotaRemaining.toLocaleString()} units remaining - may fallback to demo data soon`,
        };
      case 'mock':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-800 dark:text-orange-200',
          icon: '🔄',
          title: 'Using Demo Data',
          description: 'API quota exceeded - showing realistic mock data. Resets in 24h.',
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: '❌',
          title: 'API Error',
          description: message || 'Unable to fetch data - please try again later',
        };
    }
  };

  const config = getStatusConfig();

  // Don't show banner if everything is OK
  if (status === 'ok') {
    return null;
  }

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-4 mb-6`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.text} mb-1`}>
            {config.title}
          </h3>
          <p className={`text-sm ${config.text}`}>{config.description}</p>
        </div>
      </div>
    </div>
  );
}
