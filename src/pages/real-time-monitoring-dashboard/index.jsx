import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsGrid from './components/MetricsGrid';
import PerformanceChart from './components/PerformanceChart';
import ActivityFeed from './components/ActivityFeed';
import AlertsPanel from './components/AlertsPanel';
import FilterControls from './components/FilterControls';
import ConnectionStatus from './components/ConnectionStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RealTimeMonitoringDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setLastRefresh(new Date());
      }, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval]);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
    if (filters?.autoRefresh !== undefined) {
      setIsAutoRefresh(filters?.autoRefresh);
    }
    if (filters?.refreshInterval !== undefined) {
      setRefreshInterval(filters?.refreshInterval);
    }
  };

  const handleManualRefresh = () => {
    setLastRefresh(new Date());
  };

  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    return (activeFilters?.endpoints?.length || 0) + 
           (activeFilters?.environments?.length || 0) + 
           (activeFilters?.methods?.length || 0) + 
           (activeFilters?.statusCodes?.length || 0) +
           (activeFilters?.searchQuery ? 1 : 0);
  };

  return (
    <>
      <Helmet>
        <title>Monitoramento em Tempo Real - API Integration Hub</title>
        <meta name="description" content="Dashboard de monitoramento em tempo real para APIs com métricas de performance, alertas e análise de atividades" />
        <meta name="keywords" content="monitoramento, API, tempo real, dashboard, métricas, alertas, performance" />
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
          <div className="p-4 lg:p-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Monitoramento em Tempo Real
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visualização ao vivo de performance e atividades das APIs
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Última atualização:</span>
                  <span className="font-mono text-foreground">
                    {lastRefresh?.toLocaleTimeString('pt-BR')}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Atualizar
                </Button>
                
                <Button
                  variant={isAutoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  iconName={isAutoRefresh ? "Pause" : "Play"}
                  iconPosition="left"
                >
                  {isAutoRefresh ? 'Pausar' : 'Iniciar'}
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <FilterControls
              onFiltersChange={handleFiltersChange}
              isCollapsed={filtersCollapsed}
              onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
            />

            {/* Active Filters Summary */}
            {getActiveFilterCount() > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Filter" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {getActiveFilterCount()} filtro(s) ativo(s)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFiltersChange({})}
                    iconName="X"
                    iconPosition="left"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <MetricsGrid />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Charts and Activity */}
              <div className="xl:col-span-2 space-y-6">
                <PerformanceChart />
                <ActivityFeed />
              </div>
              
              {/* Right Column - Alerts and Status */}
              <div className="space-y-6">
                <ConnectionStatus />
                <AlertsPanel />
              </div>
            </div>

            {/* Mobile-specific Quick Actions */}
            <div className="lg:hidden fixed bottom-4 right-4 z-30">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleManualRefresh}
                  className="w-12 h-12 rounded-full shadow-lg"
                >
                  <Icon name="RefreshCw" size={20} />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                  className="w-12 h-12 rounded-full shadow-lg bg-card"
                >
                  <Icon name="Filter" size={20} />
                  {getActiveFilterCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* System Status Footer */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span>Sistema operacional</span>
                  </div>
                  <span>•</span>
                  <span>Timezone: America/Sao_Paulo (BRT)</span>
                  <span>•</span>
                  <span>Servidor: api-hub-prod-01</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Versão: 2.1.4</span>
                  <span>•</span>
                  <span>© {new Date()?.getFullYear()} API Integration Hub</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RealTimeMonitoringDashboard;