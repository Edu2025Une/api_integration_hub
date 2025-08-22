import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterControls = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    timeRange: '1h',
    endpoints: [],
    environments: [],
    methods: [],
    statusCodes: [],
    searchQuery: '',
    autoRefresh: true,
    refreshInterval: 5
  });

  const timeRanges = [
    { value: '15m', label: '15 minutos' },
    { value: '1h', label: '1 hora' },
    { value: '6h', label: '6 horas' },
    { value: '24h', label: '24 horas' },
    { value: '7d', label: '7 dias' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const environments = [
    { value: 'production', label: 'Produção', color: 'bg-red-100 text-red-800' },
    { value: 'staging', label: 'Homologação', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'development', label: 'Desenvolvimento', color: 'bg-green-100 text-green-800' }
  ];

  const httpMethods = [
    { value: 'GET', label: 'GET', color: 'bg-blue-100 text-blue-800' },
    { value: 'POST', label: 'POST', color: 'bg-green-100 text-green-800' },
    { value: 'PUT', label: 'PUT', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'DELETE', label: 'DELETE', color: 'bg-red-100 text-red-800' },
    { value: 'PATCH', label: 'PATCH', color: 'bg-purple-100 text-purple-800' }
  ];

  const statusCodeRanges = [
    { value: '2xx', label: '2xx - Sucesso', color: 'text-success' },
    { value: '3xx', label: '3xx - Redirecionamento', color: 'text-primary' },
    { value: '4xx', label: '4xx - Erro do Cliente', color: 'text-warning' },
    { value: '5xx', label: '5xx - Erro do Servidor', color: 'text-error' }
  ];

  const popularEndpoints = [
    '/api/users',
    '/api/orders',
    '/api/products',
    '/api/payments',
    '/api/analytics',
    '/api/notifications',
    '/api/reports',
    '/api/auth/login'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleArrayFilterToggle = (key, value) => {
    const currentArray = filters?.[key];
    const newArray = currentArray?.includes(value)
      ? currentArray?.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      timeRange: '1h',
      endpoints: [],
      environments: [],
      methods: [],
      statusCodes: [],
      searchQuery: '',
      autoRefresh: filters?.autoRefresh,
      refreshInterval: filters?.refreshInterval
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return filters?.endpoints?.length + 
           filters?.environments?.length + 
           filters?.methods?.length + 
           filters?.statusCodes?.length +
           (filters?.searchQuery ? 1 : 0);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filtros Avançados</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              label="Buscar"
              type="search"
              placeholder="Buscar por endpoint, mensagem ou ID..."
              value={filters?.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Período de Tempo
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {timeRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => handleFilterChange('timeRange', range?.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ${
                    filters?.timeRange === range?.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {range?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Ambientes
            </label>
            <div className="flex flex-wrap gap-2">
              {environments?.map((env) => (
                <button
                  key={env.value}
                  onClick={() => handleArrayFilterToggle('environments', env.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                    filters?.environments?.includes(env.value)
                      ? env.color
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {env.label}
                </button>
              ))}
            </div>
          </div>

          {/* HTTP Methods */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Métodos HTTP
            </label>
            <div className="flex flex-wrap gap-2">
              {httpMethods?.map((method) => (
                <button
                  key={method?.value}
                  onClick={() => handleArrayFilterToggle('methods', method?.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                    filters?.methods?.includes(method?.value)
                      ? method?.color
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {method?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Codes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Códigos de Status
            </label>
            <div className="space-y-2">
              {statusCodeRanges?.map((status) => (
                <Checkbox
                  key={status?.value}
                  label={status?.label}
                  checked={filters?.statusCodes?.includes(status?.value)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      handleArrayFilterToggle('statusCodes', status?.value);
                    } else {
                      handleArrayFilterToggle('statusCodes', status?.value);
                    }
                  }}
                  className="text-sm"
                />
              ))}
            </div>
          </div>

          {/* Popular Endpoints */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Endpoints Populares
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {popularEndpoints?.map((endpoint) => (
                <Checkbox
                  key={endpoint}
                  label={endpoint}
                  checked={filters?.endpoints?.includes(endpoint)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      handleArrayFilterToggle('endpoints', endpoint);
                    } else {
                      handleArrayFilterToggle('endpoints', endpoint);
                    }
                  }}
                  className="text-sm font-mono"
                />
              ))}
            </div>
          </div>

          {/* Auto Refresh Settings */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Atualização Automática
              </label>
              <Checkbox
                checked={filters?.autoRefresh}
                onChange={(e) => handleFilterChange('autoRefresh', e?.target?.checked)}
              />
            </div>
            
            {filters?.autoRefresh && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Intervalo (segundos)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="300"
                  value={filters?.refreshInterval}
                  onChange={(e) => handleFilterChange('refreshInterval', parseInt(e?.target?.value) || 5)}
                  className="w-24"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;