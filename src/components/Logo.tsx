import React from 'react';
import { Activity, Zap, BarChart3 } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ 
  size = 'medium', 
  variant = 'horizontal', 
  showTagline = false,
  className = '' 
}: LogoProps) {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          icon: 'w-6 h-6',
          mainText: 'text-xl',
          subText: 'text-xs',
          tagline: 'text-xs'
        };
      case 'large':
        return {
          icon: 'w-12 h-12',
          mainText: 'text-4xl',
          subText: 'text-lg',
          tagline: 'text-sm'
        };
      default: // medium
        return {
          icon: 'w-8 h-8',
          mainText: 'text-2xl',
          subText: 'text-sm',
          tagline: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="relative">
          <Activity className={`${sizeClasses.icon} text-purple-600`} />
          <div className="absolute -bottom-1 -right-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <div className="relative mr-3">
            <Activity className={`${sizeClasses.icon} text-purple-600`} />
            <div className="absolute -bottom-1 -right-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <Zap className={`${sizeClasses.icon} text-blue-600`} />
        </div>
        <div className={`${sizeClasses.mainText} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
          Pulse of People
        </div>
        <div className={`${sizeClasses.subText} text-gray-600 font-medium`}>
          by BETTROI
        </div>
        {showTagline && (
          <div className={`${sizeClasses.tagline} text-gray-500 mt-1`}>
            Animal-i Initiative
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Animated Icon Group */}
      <div className="flex items-center space-x-1">
        <div className="relative">
          <Activity className={`${sizeClasses.icon} text-purple-600`} />
          <div className="absolute -bottom-1 -right-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <Zap className={`${sizeClasses.icon.replace('w-', 'w-').replace('h-', 'h-')} text-blue-600`} style={{
          width: size === 'small' ? '20px' : size === 'large' ? '40px' : '28px',
          height: size === 'small' ? '20px' : size === 'large' ? '40px' : '28px'
        }} />
      </div>

      {/* Text Content */}
      <div>
        <div className="flex items-baseline space-x-2">
          <span className={`${sizeClasses.mainText} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            Pulse of People
          </span>
          <span className={`${sizeClasses.subText} text-gray-600 font-medium`}>
            by BETTROI
          </span>
        </div>
        {showTagline && (
          <div className={`${sizeClasses.tagline} text-gray-500`}>
            Animal-i Initiative • Global HQ: Dubai
          </div>
        )}
      </div>
    </div>
  );
}

// Export individual logo variations for specific use cases
export const PulseLogoHorizontal = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="horizontal" />
);

export const PulseLogoStacked = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="stacked" />
);

export const PulseLogoIcon = (props: Omit<LogoProps, 'variant'>) => (
  <Logo {...props} variant="icon-only" />
);

// Simplified logo for mobile/small spaces
export const PulseLogoCompact = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Activity className="w-5 h-5 text-purple-600" />
    <div>
      <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Pulse
      </span>
      <span className="text-xs text-gray-600 ml-1">by BETTROI</span>
    </div>
  </div>
);