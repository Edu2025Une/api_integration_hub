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
    const mockIntegrations = [
      {
        id: 1,
        name: "API de Pagamentos Stripe",
        description: "Integração com gateway de pagamento Stripe para processamento de transações financeiras",
        endpoint: "https://api.stripe.com/v1/charges",
        method: "POST",
        environment: "production",
        status: "active",
        version: "1.2.1",
        lastTested: "22/01/2025 14:30",
        lastModified: "2025-01-22T14:30:00Z",
        authType: "bearer",
        authToken: "sk_live_*********************",
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer sk_live_***" }
        ],
        queryParams: [
          { key: "currency", value: "brl" }
        ],
        webhookUrl: "https://webhook.exemplo.com/stripe",
        enableRateLimit: true,
        rateLimitRequests: 100,
        rateLimitWindow: 60,
        customField1: "Conta Principal",
        customField2: "BR-001",
        customField3: "Ativo",
        customField1Label: "Tipo de Conta",
        customField2Label: "Código Regional",
        customField3Label: "Status Operacional"
      },
      {
        id: 2,
        name: "API de CEP ViaCEP",
        description: "Consulta de endereços através do CEP utilizando a API pública do ViaCEP",
        endpoint: "https://viacep.com.br/ws/{cep}/json/",
        method: "GET",
        environment: "production",
        status: "active",
        version: "2.0.0",
        lastTested: "22/01/2025 10:15",
        lastModified: "2025-01-22T10:15:00Z",
        authType: "none",
        timeout: 15000,
        retryAttempts: 2,
        retryDelay: 500,
        headers: [
          { key: "Accept", value: "application/json" }
        ],
        queryParams: [],
        webhookUrl: "",
        enableRateLimit: false,
        rateLimitRequests: 50,
        rateLimitWindow: 60,
        customField1: "Público",
        customField2: "Nacional",
        customField3: "Gratuito",
        customField1Label: "Tipo de API",
        customField2Label: "Abrangência",
        customField3Label: "Modelo de Cobrança"
      },
      {
        id: 3,
        name: "API de Notificações Firebase",
        description: "Envio de notificações push através do Firebase Cloud Messaging para aplicativos móveis",
        endpoint: "https://fcm.googleapis.com/fcm/send",
        method: "POST",
        environment: "staging",
        status: "testing",
        version: "1.5.2",
        lastTested: "21/01/2025 16:45",
        lastModified: "2025-01-21T16:45:00Z",
        authType: "bearer",
        authToken: "AAAA*********************",
        timeout: 25000,
        retryAttempts: 3,
        retryDelay: 2000,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "key=AAAA***" }
        ],
        queryParams: [],
        webhookUrl: "https://webhook.exemplo.com/firebase",
        enableRateLimit: true,
        rateLimitRequests: 200,
        rateLimitWindow: 60,
        customField1: "Mobile",
        customField2: "Push",
        customField3: "Em Teste",
        customField1Label: "Plataforma",
        customField2Label: "Tipo de Notificação",
        customField3Label: "Status de Desenvolvimento"
      },
      {
        id: 4,
        name: "API de E-mail SendGrid",
        description: "Serviço de envio de e-mails transacionais e marketing através da plataforma SendGrid",
        endpoint: "https://api.sendgrid.com/v3/mail/send",
        method: "POST",
        environment: "development",
        status: "inactive",
        version: "3.1.0",
        lastTested: "20/01/2025 09:30",
        lastModified: "2025-01-20T09:30:00Z",
        authType: "bearer",
        authToken: "SG.*********************",
        timeout: 20000,
        retryAttempts: 2,
        retryDelay: 1500,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer SG.***" }
        ],
        queryParams: [],
        webhookUrl: "",
        enableRateLimit: true,
        rateLimitRequests: 300,
        rateLimitWindow: 60,
        customField1: "Transacional",
        customField2: "SMTP",
        customField3: "Inativo",
        customField1Label: "Tipo de E-mail",
        customField2Label: "Protocolo",
        customField3Label: "Status Atual"
      },
      {
        id: 5,
        name: "API de Geolocalização Google Maps",
        description: "Serviços de geolocalização e mapas utilizando a API do Google Maps Platform",
        endpoint: "https://maps.googleapis.com/maps/api/geocode/json",
        method: "GET",
        environment: "production",
        status: "error",
        version: "1.0.5",
        lastTested: "19/01/2025 15:20",
        lastModified: "2025-01-19T15:20:00Z",
        authType: "apikey",
        authToken: "AIza*********************",
        timeout: 10000,
        retryAttempts: 1,
        retryDelay: 1000,
        headers: [],
        queryParams: [
          { key: "key", value: "AIza***" },
          { key: "language", value: "pt-BR" }
        ],
        webhookUrl: "",
        enableRateLimit: true,
        rateLimitRequests: 1000,
        rateLimitWindow: 86400,
        customField1: "Geolocalização",
        customField2: "Global",
        customField3: "Com Erro",
        customField1Label: "Categoria",
        customField2Label: "Cobertura",
        customField3Label: "Status de Saúde"
      }
    ];

    setIntegrations(mockIntegrations);
    setSelectedIntegration(mockIntegrations?.[0]);
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