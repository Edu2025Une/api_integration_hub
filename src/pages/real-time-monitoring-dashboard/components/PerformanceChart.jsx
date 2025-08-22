import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('responseTime');
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { value: '15m', label: '15 min' },
    { value: '1h', label: '1 hora' },
    { value: '6h', label: '6 horas' },
    { value: '24h', label: '24 horas' },
    { value: '7d', label: '7 dias' }
  ];

  const metrics = [
    { value: 'responseTime', label: 'Tempo de Resposta', color: '#1E40AF', unit: 'ms' },
    { value: 'requestVolume', label: 'Volume de Requisições', color: '#059669', unit: 'req/min' },
    { value: 'errorRate', label: 'Taxa de Erro', color: '#DC2626', unit: '%' },
    { value: 'throughput', label: 'Throughput', color: '#D97706', unit: 'req/s' }
  ];

  useEffect(() => {
    generateChartData();
  }, [timeRange, selectedMetric]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRange === '15m' || timeRange === '1h') {
        updateRealTimeData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const generateChartData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const dataPoints = getDataPointsForRange(timeRange);
      const data = [];
      
      for (let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(Date.now() - (dataPoints - i) * getIntervalForRange(timeRange));
        data?.push({
          time: timestamp?.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(timeRange === '7d' && { day: '2-digit', month: '2-digit' })
          }),
          timestamp: timestamp?.getTime(),
          responseTime: Math.floor(Math.random() * 200) + 100,
          requestVolume: Math.floor(Math.random() * 1000) + 500,
          errorRate: Math.random() * 3,
          throughput: Math.floor(Math.random() * 500) + 200
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    }, 500);
  };

  const updateRealTimeData = () => {
    setChartData(prev => {
      const newData = [...prev];
      const now = new Date();
      
      // Add new data point
      newData?.push({
        time: now?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: now?.getTime(),
        responseTime: Math.floor(Math.random() * 200) + 100,
        requestVolume: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 3,
        throughput: Math.floor(Math.random() * 500) + 200
      });
      
      // Keep only the required number of points
      const maxPoints = getDataPointsForRange(timeRange);
      return newData?.slice(-maxPoints);
    });
  };

  const getDataPointsForRange = (range) => {
    switch (range) {
      case '15m': return 30;
      case '1h': return 60;
      case '6h': return 72;
      case '24h': return 96;
      case '7d': return 168;
      default: return 60;
    }
  };

  const getIntervalForRange = (range) => {
    switch (range) {
      case '15m': return 30000; // 30 seconds
      case '1h': return 60000; // 1 minute
      case '6h': return 300000; // 5 minutes
      case '24h': return 900000; // 15 minutes
      case '7d': return 3600000; // 1 hour
      default: return 60000;
    }
  };

  const currentMetric = metrics?.find(m => m?.value === selectedMetric);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-popover-foreground">
                {entry?.value?.toFixed(entry?.dataKey === 'errorRate' ? 2 : 0)} {currentMetric?.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Gráfico de Performance
          </h2>
          {isLoading && (
            <Icon name="Loader2" size={16} className="text-muted-foreground animate-spin" />
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Metric Selection */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {metrics?.map((metric) => (
              <button
                key={metric?.value}
                onClick={() => setSelectedMetric(metric?.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                  selectedMetric === metric?.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {metric?.label}
              </button>
            ))}
          </div>
          
          {/* Time Range Selection */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => setTimeRange(range?.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                  timeRange === range?.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${currentMetric?.unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric?.color}
              strokeWidth={2}
              fill="url(#colorGradient)"
              dot={false}
              activeDot={{ r: 4, fill: currentMetric?.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Atualização automática a cada 5 segundos</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={generateChartData}
          iconName="RefreshCw"
          iconPosition="left"
          disabled={isLoading}
        >
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default PerformanceChart;