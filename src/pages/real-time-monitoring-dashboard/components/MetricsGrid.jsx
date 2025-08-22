import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsGrid = () => {
  const [metrics, setMetrics] = useState({
    requestVolume: 15847,
    responseTime: 142,
    errorRate: 0.8,
    uptime: 99.97,
    activeConnections: 234,
    throughput: 1250
  });

  const [trends, setTrends] = useState({
    requestVolume: 12.5,
    responseTime: -8.2,
    errorRate: -15.3,
    uptime: 0.1,
    activeConnections: 18.7,
    throughput: 22.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        requestVolume: prev?.requestVolume + Math.floor(Math.random() * 50) - 25,
        responseTime: Math.max(50, prev?.responseTime + Math.floor(Math.random() * 20) - 10),
        errorRate: Math.max(0, prev?.errorRate + (Math.random() - 0.5) * 0.2),
        uptime: Math.min(100, Math.max(95, prev?.uptime + (Math.random() - 0.5) * 0.1)),
        activeConnections: Math.max(0, prev?.activeConnections + Math.floor(Math.random() * 10) - 5),
        throughput: Math.max(0, prev?.throughput + Math.floor(Math.random() * 100) - 50)
      }));

      setTrends(prev => ({
        requestVolume: (Math.random() - 0.5) * 30,
        responseTime: (Math.random() - 0.5) * 20,
        errorRate: (Math.random() - 0.5) * 25,
        uptime: (Math.random() - 0.5) * 0.5,
        activeConnections: (Math.random() - 0.5) * 40,
        throughput: (Math.random() - 0.5) * 50
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR')?.format(Math.floor(num));
  };

  const formatPercentage = (num) => {
    return new Intl.NumberFormat('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    })?.format(num);
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const metricCards = [
    {
      title: 'Volume de Requisições',
      value: formatNumber(metrics?.requestVolume),
      unit: '/min',
      trend: trends?.requestVolume,
      icon: 'Activity',
      color: 'text-primary'
    },
    {
      title: 'Tempo de Resposta',
      value: formatNumber(metrics?.responseTime),
      unit: 'ms',
      trend: trends?.responseTime,
      icon: 'Clock',
      color: metrics?.responseTime > 200 ? 'text-warning' : 'text-success'
    },
    {
      title: 'Taxa de Erro',
      value: formatPercentage(metrics?.errorRate),
      unit: '%',
      trend: trends?.errorRate,
      icon: 'AlertTriangle',
      color: metrics?.errorRate > 2 ? 'text-error' : 'text-success'
    },
    {
      title: 'Disponibilidade',
      value: formatPercentage(metrics?.uptime),
      unit: '%',
      trend: trends?.uptime,
      icon: 'Shield',
      color: metrics?.uptime > 99 ? 'text-success' : 'text-warning'
    },
    {
      title: 'Conexões Ativas',
      value: formatNumber(metrics?.activeConnections),
      unit: '',
      trend: trends?.activeConnections,
      icon: 'Users',
      color: 'text-accent'
    },
    {
      title: 'Throughput',
      value: formatNumber(metrics?.throughput),
      unit: 'req/s',
      trend: trends?.throughput,
      icon: 'Zap',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricCards?.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${metric?.color}`}>
              <Icon name={metric?.icon} size={20} />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(metric?.trend)}`}>
              <Icon name={getTrendIcon(metric?.trend)} size={16} />
              <span className="text-sm font-medium">
                {Math.abs(metric?.trend)?.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric?.title}
            </h3>
            <div className="flex items-baseline space-x-1">
              <span className={`text-2xl font-bold ${metric?.color}`}>
                {metric?.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {metric?.unit}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Última atualização</span>
              <span>{new Date()?.toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;