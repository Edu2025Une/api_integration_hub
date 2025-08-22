import React from 'react';
import Input from '../../../components/ui/Input';

import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterSidebar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange,
  apis 
}) => {
  const getCategoryStats = () => {
    const categories = {};
    apis?.forEach(api => {
      categories[api?.category] = (categories?.[api?.category] || 0) + 1;
    });
    return categories;
  };

  const getStatusStats = () => {
    const stats = {
      all: apis?.length || 0,
      active: apis?.filter(api => api?.status === 'active')?.length || 0,
      inactive: apis?.filter(api => api?.status === 'inactive')?.length || 0,
    };
    return stats;
  };

  const getHealthStats = () => {
    const stats = {
      healthy: apis?.filter(api => api?.health === 'healthy')?.length || 0,
      warning: apis?.filter(api => api?.health === 'warning')?.length || 0,
      error: apis?.filter(api => api?.health === 'error')?.length || 0,
    };
    return stats;
  };

  const categoryStats = getCategoryStats();
  const statusStats = getStatusStats();
  const healthStats = getHealthStats();

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Filtros</h3>
        {(searchTerm || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Buscar APIs
        </label>
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Nome, endpoint ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Status
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onStatusChange('all')}
            className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
              statusFilter === 'all' ?'bg-primary text-primary-foreground' :'hover:bg-muted text-muted-foreground'
            }`}
          >
            <span>Todas</span>
            <span>{statusStats?.all}</span>
          </button>
          <button
            onClick={() => onStatusChange('active')}
            className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
              statusFilter === 'active' ?'bg-primary text-primary-foreground' :'hover:bg-muted text-muted-foreground'
            }`}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              <span>Ativas</span>
            </div>
            <span>{statusStats?.active}</span>
          </button>
          <button
            onClick={() => onStatusChange('inactive')}
            className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
              statusFilter === 'inactive' ?'bg-primary text-primary-foreground' :'hover:bg-muted text-muted-foreground'
            }`}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2" />
              <span>Inativas</span>
            </div>
            <span>{statusStats?.inactive}</span>
          </button>
        </div>
      </div>

      {/* Health Status */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Status de Saúde
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Icon name="CheckCircle" size={16} className="text-success mr-2" />
              <span className="text-sm">Saudáveis</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {healthStats?.healthy}
            </span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
              <span className="text-sm">Atenção</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {healthStats?.warning}
            </span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Icon name="XCircle" size={16} className="text-destructive mr-2" />
              <span className="text-sm">Com Erro</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {healthStats?.error}
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {Object?.keys(categoryStats)?.length > 0 && (
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">
            Categorias
          </label>
          <div className="space-y-2">
            {Object?.entries(categoryStats)?.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-2">
                <span className="text-sm text-foreground">{category}</span>
                <span className="text-sm text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Resumo Geral
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total de APIs:</span>
            <span className="font-medium text-foreground">{apis?.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ativas:</span>
            <span className="font-medium text-success">{statusStats?.active}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Inativas:</span>
            <span className="font-medium text-muted-foreground">{statusStats?.inactive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;