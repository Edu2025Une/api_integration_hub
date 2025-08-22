import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const IntegrationHealthChart = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation based on time range
  useEffect(() => {
    setIsLoading(true);
    const generateData = () => {
      const now = new Date();
      const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
      const interval = timeRange === '24h' ? 'hour' : 'day';
      
      return Array.from({ length: dataPoints }, (_, i) => {
        const time = new Date(now);
        if (interval === 'hour') {
          time?.setHours(now?.getHours() - (dataPoints - 1 - i));
        } else {
          time?.setDate(now?.getDate() - (dataPoints - 1 - i));
        }
        
        return {
          time: interval === 'hour' ? time?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : time?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          health: Math.floor(Math.random() * 20) + 80,
          responseTime: Math.floor(Math.random() * 100) + 50,
          errorRate: Math.random() * 2,
          throughput: Math.floor(Math.random() * 500) + 200
        };
      });
    };

    setTimeout(() => {
      setChartData(generateData());
      setIsLoading(false);
    }, 500);
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.name === 'Taxa de Erro' ? `${entry?.value?.toFixed(1)}%` : 
                 entry?.name === 'Tempo de Resposta' ? `${entry?.value}ms` :
                 entry?.name === 'Throughput' ? `${entry?.value}/min` : `${entry?.value}%`}
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Saúde das Integrações</h3>
            <p className="text-sm text-muted-foreground">Monitoramento em tempo real</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeRangeOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setTimeRange(option?.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                timeRange === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Carregando dados...</span>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(226, 232, 240)" />
              <XAxis 
                dataKey="time" 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgb(100, 116, 139)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="health"
                stroke="rgb(34, 197, 94)"
                strokeWidth={2}
                fill="url(#healthGradient)"
                name="Saúde"
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="rgb(59, 130, 246)"
                strokeWidth={2}
                dot={false}
                name="Tempo de Resposta"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Saúde Média</p>
          <p className="text-lg font-semibold text-success">94.2%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Tempo Médio</p>
          <p className="text-lg font-semibold text-primary">127ms</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Taxa de Erro</p>
          <p className="text-lg font-semibold text-warning">0.8%</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHealthChart;