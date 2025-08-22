import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { StatusWidget } from '../../components/ui/StatusIndicator';
import MetricsCard from './components/MetricsCard';
import IntegrationHealthChart from './components/IntegrationHealthChart';
import IntegrationsTable from './components/IntegrationsTable';
import AlertsPanel from './components/AlertsPanel';
import QuickActions from './components/QuickActions';

const APIIntegrationDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    totalIntegrations: 12,
    activeConnections: 8,
    errorRate: 1.2,
    avgResponseTime: 156
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        totalIntegrations: prev?.totalIntegrations + Math.floor(Math.random() * 2),
        activeConnections: Math.max(0, prev?.activeConnections + Math.floor(Math.random() * 3) - 1),
        errorRate: Math.max(0, prev?.errorRate + (Math.random() - 0.5) * 0.2),
        avgResponseTime: Math.max(50, prev?.avgResponseTime + Math.floor(Math.random() * 20) - 10)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const metricsData = [
    {
      title: 'Total de Integrações',
      value: realTimeData?.totalIntegrations,
      icon: 'Workflow',
      trend: 'up',
      trendValue: '+2',
      color: 'primary'
    },
    {
      title: 'Conexões Ativas',
      value: realTimeData?.activeConnections,
      icon: 'Activity',
      trend: 'up',
      trendValue: '+1',
      color: 'success'
    },
    {
      title: 'Taxa de Erro',
      value: realTimeData?.errorRate,
      unit: '%',
      icon: 'AlertTriangle',
      trend: 'down',
      trendValue: '-0.3%',
      color: realTimeData?.errorRate > 2 ? 'error' : 'warning'
    },
    {
      title: 'Tempo de Resposta',
      value: realTimeData?.avgResponseTime,
      unit: 'ms',
      icon: 'Clock',
      trend: realTimeData?.avgResponseTime > 200 ? 'up' : 'down',
      trendValue: realTimeData?.avgResponseTime > 200 ? '+15ms' : '-8ms',
      color: realTimeData?.avgResponseTime > 200 ? 'warning' : 'success'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard de Integrações API - API Hub</title>
        <meta name="description" content="Painel de controle para monitoramento e gerenciamento de integrações API em tempo real" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`pt-16 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}>
          <div className="p-6">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard de Integrações API
              </h1>
              <p className="text-muted-foreground">
                Monitoramento em tempo real do ecossistema de APIs e integrações
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  unit={metric?.unit}
                  icon={metric?.icon}
                  trend={metric?.trend}
                  trendValue={metric?.trendValue}
                  color={metric?.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Health Chart - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <IntegrationHealthChart />
              </div>
              
              {/* Status Widget */}
              <div className="space-y-6">
                <StatusWidget />
                <QuickActions />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Integrations Table - Takes 3 columns on xl screens */}
              <div className="xl:col-span-3">
                <IntegrationsTable />
              </div>
              
              {/* Alerts Panel - Takes 1 column on xl screens */}
              <div className="xl:col-span-1">
                <AlertsPanel />
              </div>
            </div>

            {/* Real-time Status Bar */}
            <div className="mt-8 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Sistema operacional - Última atualização: {new Date()?.toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>Uptime: 99.8%</span>
                  <span>Latência média: {realTimeData?.avgResponseTime}ms</span>
                  <span>Requisições/min: {Math.floor(Math.random() * 500) + 200}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default APIIntegrationDashboard;