import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import IntegrationList from './components/IntegrationList';
import ConfigurationForm from './components/ConfigurationForm';
import VersionControl from './components/VersionControl';
import DeploymentModal from './components/DeploymentModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const APIConfigurationManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [activeTab, setActiveTab] = useState('configuration');
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [integrations, setIntegrations] = useState([]);

  // Mock integrations data
  useEffect(() => {
    setIntegrations([]);
    setSelectedIntegration(null);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleSelectIntegration = (integration) => {
    setSelectedIntegration(integration);
    setActiveTab('configuration');
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedIntegration(null);
    setActiveTab('configuration');
  };

  const handleSaveIntegration = (integrationData) => {
    if (integrationData?.id && integrations?.find(i => i?.id === integrationData?.id)) {
      // Update existing
      setIntegrations(prev => prev?.map(i => 
        i?.id === integrationData?.id ? integrationData : i
      ));
    } else {
      // Create new
      const newIntegration = {
        ...integrationData,
        id: Date.now()
      };
      setIntegrations(prev => [...prev, newIntegration]);
      setSelectedIntegration(newIntegration);
    }
  };

  const handleTestConnection = (integration) => {
    console.log('Testing connection for:', integration?.name);
  };

  const handleVersionRestore = (version) => {
    console.log('Restoring version:', version);
  };

  const handleViewDiff = (version) => {
    console.log('Viewing diff for version:', version);
  };

  const handleDeploy = (deploymentData) => {
    console.log('Deploying:', deploymentData);
    handleSaveIntegration(deploymentData);
  };

  const tabs = [
    { id: 'configuration', label: 'Configuração', icon: 'Settings' },
    { id: 'versions', label: 'Versões', icon: 'GitBranch' }
  ];

  return (
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
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Gerenciamento de Configuração de APIs
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure e gerencie integrações de API com controle de versão e implantação
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                >
                  Importar
                </Button>
                {selectedIntegration && (
                  <Button
                    variant="default"
                    iconName="Rocket"
                    iconPosition="left"
                    onClick={() => setShowDeploymentModal(true)}
                  >
                    Implantar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Integration List - Left Panel */}
            <div className="lg:col-span-1">
              <IntegrationList
                integrations={integrations}
                selectedIntegration={selectedIntegration}
                onSelectIntegration={handleSelectIntegration}
                onCreateNew={handleCreateNew}
              />
            </div>

            {/* Configuration Panel - Right Panel */}
            <div className="lg:col-span-3">
              {selectedIntegration || activeTab === 'configuration' ? (
                <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="border-b border-border bg-muted/30">
                    <div className="flex items-center">
                      {tabs?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                            activeTab === tab?.id
                              ? 'border-primary text-primary bg-background' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <Icon name={tab?.icon} size={16} />
                          <span>{tab?.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="h-full">
                    {activeTab === 'configuration' && (
                      <ConfigurationForm
                        integration={selectedIntegration}
                        onSave={handleSaveIntegration}
                        onTest={handleTestConnection}
                        onCancel={() => setSelectedIntegration(null)}
                      />
                    )}
                    
                    {activeTab === 'versions' && selectedIntegration && (
                      <div className="p-6">
                        <VersionControl
                          integration={selectedIntegration}
                          onRestore={handleVersionRestore}
                          onViewDiff={handleViewDiff}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty State */
                (<div className="h-full bg-card border border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Settings" size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Selecione uma Integração
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Escolha uma integração da lista para configurar ou criar uma nova
                    </p>
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={handleCreateNew}
                    >
                      Nova Integração
                    </Button>
                  </div>
                </div>)
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Deployment Modal */}
      <DeploymentModal
        isOpen={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
        integration={selectedIntegration}
        onDeploy={handleDeploy}
      />
    </div>
  );
};

export default APIConfigurationManagement;