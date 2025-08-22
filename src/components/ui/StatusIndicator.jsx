import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ 
  status = 'connected', 
  showLabel = true, 
  size = 'default',
  className = '' 
}) => {
  const [connectionCount, setConnectionCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionCount(prev => prev + Math.floor(Math.random() * 3));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connected: {
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Connected',
      description: 'All systems operational'
    },
    warning: {
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Warning',
      description: 'Some issues detected'
    },
    error: {
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Error',
      description: 'Connection failed'
    },
    loading: {
      icon: 'Loader2',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: 'Connecting',
      description: 'Establishing connection'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.connected;
  
  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 14,
    default: 16,
    lg: 20
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config?.bgColor}`}>
        <Icon 
          name={config?.icon} 
          size={iconSizes?.[size]} 
          className={`${config?.color} ${status === 'loading' ? 'animate-spin' : ''}`}
        />
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-medium ${config?.color} ${sizeClasses?.[size]}`}>
            {config?.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {config?.description}
          </span>
        </div>
      )}
    </div>
  );
};

// Real-time status widget for dashboard
export const StatusWidget = ({ className = '' }) => {
  const [metrics, setMetrics] = useState({
    activeConnections: 24,
    totalRequests: 1247,
    errorRate: 0.2,
    avgResponseTime: 145
  });

  const [systemStatus, setSystemStatus] = useState('connected');

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeConnections: prev?.activeConnections + Math.floor(Math.random() * 5) - 2,
        totalRequests: prev?.totalRequests + Math.floor(Math.random() * 10),
        errorRate: Math.max(0, prev?.errorRate + (Math.random() - 0.5) * 0.1),
        avgResponseTime: Math.max(50, prev?.avgResponseTime + Math.floor(Math.random() * 20) - 10)
      }));

      // Update system status based on metrics
      if (metrics?.errorRate > 1.0) {
        setSystemStatus('error');
      } else if (metrics?.errorRate > 0.5 || metrics?.avgResponseTime > 200) {
        setSystemStatus('warning');
      } else {
        setSystemStatus('connected');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">System Status</h3>
        <StatusIndicator status={systemStatus} showLabel={false} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Active Connections</p>
          <p className="text-lg font-semibold text-foreground font-mono">
            {metrics?.activeConnections}
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Requests</p>
          <p className="text-lg font-semibold text-foreground font-mono">
            {metrics?.totalRequests?.toLocaleString()}
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Error Rate</p>
          <p className={`text-lg font-semibold font-mono ${
            metrics?.errorRate > 1.0 ? 'text-error' : 
            metrics?.errorRate > 0.5 ? 'text-warning' : 'text-success'
          }`}>
            {metrics?.errorRate?.toFixed(1)}%
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Avg Response</p>
          <p className={`text-lg font-semibold font-mono ${
            metrics?.avgResponseTime > 200 ? 'text-warning' : 'text-success'
          }`}>
            {metrics?.avgResponseTime}ms
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default StatusIndicator;