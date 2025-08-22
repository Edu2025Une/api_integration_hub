import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';

import Select from '../../components/ui/Select';

import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import ApiCard from './components/ApiCard';
import FilterSidebar from './components/FilterSidebar';
import ApiTable from './components/ApiTable';
import BulkActions from './components/BulkActions';

const MyAPIsList = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedApis, setSelectedApis] = useState([]);
  const [apis, setApis] = useState([]);

  // Mock API data
  useEffect(() => {
    const mockApis = [
      {
        id: '1',
        name: 'User Authentication API',
        endpoint: 'https://api.myapp.com/auth',
        status: 'active',
        health: 'healthy',
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date('2024-01-20'),
        requestCount: 1250,
        category: 'Authentication',
        description: 'API para autenticação e gestão de usuários'
      },
      {
        id: '2',
        name: 'Payment Processing API',
        endpoint: 'https://api.myapp.com/payments',
        status: 'active',
        health: 'warning',
        createdAt: new Date('2024-01-10'),
        lastUsed: new Date('2024-01-19'),
        requestCount: 890,
        category: 'Payments',
        description: 'API para processamento de pagamentos e transações'
      },
      {
        id: '3',
        name: 'Data Analytics API',
        endpoint: 'https://api.myapp.com/analytics',
        status: 'inactive',
        health: 'error',
        createdAt: new Date('2024-01-05'),
        lastUsed: new Date('2024-01-10'),
        requestCount: 450,
        category: 'Analytics',
        description: 'API para coleta e análise de dados de negócio'
      },
      {
        id: '4',
        name: 'Notification Service API',
        endpoint: 'https://api.myapp.com/notifications',
        status: 'active',
        health: 'healthy',
        createdAt: new Date('2024-01-12'),
        lastUsed: new Date('2024-01-21'),
        requestCount: 2100,
        category: 'Communication',
        description: 'API para envio de notificações por email, SMS e push'
      },
      {
        id: '5',
        name: 'File Storage API',
        endpoint: 'https://api.myapp.com/storage',
        status: 'active',
        health: 'healthy',
        createdAt: new Date('2024-01-08'),
        lastUsed: new Date('2024-01-21'),
        requestCount: 756,
        category: 'Storage',
        description: 'API para upload, download e gestão de arquivos'
      }
    ];
    setApis(mockApis);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const filteredApis = apis?.filter(api => {
    const matchesSearch = api?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         api?.endpoint?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         api?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || api?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedApis = filteredApis?.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a?.name?.localeCompare(b?.name);
      case 'createdAt':
        return new Date(b?.createdAt) - new Date(a?.createdAt);
      case 'lastUsed':
        return new Date(b?.lastUsed) - new Date(a?.lastUsed);
      case 'requests':
        return b?.requestCount - a?.requestCount;
      default:
        return 0;
    }
  });

  const handleSelectApi = (apiId) => {
    setSelectedApis(prev => 
      prev?.includes(apiId) 
        ? prev?.filter(id => id !== apiId)
        : [...prev, apiId]
    );
  };

  const handleSelectAll = () => {
    setSelectedApis(
      selectedApis?.length === sortedApis?.length 
        ? [] 
        : sortedApis?.map(api => api?.id)
    );
  };

  return (
    <>
      <Helmet>
        <title>Minhas APIs - Lista | API Hub</title>
        <meta name="description" content="Gerencie suas APIs personalizadas com visão completa de status, uso e performance" />
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Minhas APIs
                </h1>
                <p className="text-muted-foreground">
                  Gerencie e monitore suas APIs personalizadas
                </p>
              </div>
              
              <Link to="/new-api-creation">
                <Button className="whitespace-nowrap">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Nova API
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar with Filters */}
              <div className="lg:col-span-1">
                <FilterSidebar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  apis={apis}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Controls Bar */}
                <div className="bg-card border border-border rounded-lg p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedApis?.length === sortedApis?.length && sortedApis?.length > 0}
                          indeterminate={selectedApis?.length > 0 && selectedApis?.length < sortedApis?.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm text-muted-foreground">
                          {selectedApis?.length > 0 
                            ? `${selectedApis?.length} selecionadas`
                            : `${sortedApis?.length} APIs`
                          }
                        </span>
                      </div>
                      
                      {selectedApis?.length > 0 && (
                        <BulkActions selectedCount={selectedApis?.length} />
                      )}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-3">
                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                        placeholder="Ordenar por"
                        className="w-40"
                      >
                        <option value="name">Nome</option>
                        <option value="createdAt">Data de Criação</option>
                        <option value="lastUsed">Último Uso</option>
                        <option value="requests">Requisições</option>
                      </Select>
                      
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('card')}
                          className="rounded-r-none"
                        >
                          <Icon name="LayoutGrid" size={16} />
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                          className="rounded-l-none border-l"
                        >
                          <Icon name="List" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* APIs Grid/Table */}
                {sortedApis?.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhuma API encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== 'all' ?'Tente ajustar os filtros de busca' :'Você ainda não criou nenhuma API personalizada'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Link to="/new-api-creation">
                        <Button>
                          <Icon name="Plus" size={16} className="mr-2" />
                          Criar Primeira API
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    {viewMode === 'card' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedApis?.map(api => (
                          <ApiCard
                            key={api?.id}
                            api={api}
                            isSelected={selectedApis?.includes(api?.id)}
                            onSelect={() => handleSelectApi(api?.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <ApiTable
                        apis={sortedApis}
                        selectedApis={selectedApis}
                        onSelectApi={handleSelectApi}
                        onSelectAll={handleSelectAll}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MyAPIsList;