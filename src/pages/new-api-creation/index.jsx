import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';


import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import BasicInfoStep from './components/BasicInfoStep';
import ConfigurationStep from './components/ConfigurationStep';
import AuthenticationStep from './components/AuthenticationStep';
import TestingStep from './components/TestingStep';
import ProgressIndicator from './components/ProgressIndicator';


const NewAPICreation = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    category: '',
    version: '1.0.0',
    
    // Configuration
    baseUrl: '',
    methods: ['GET'],
    contentType: 'application/json',
    timeout: 30,
    retryAttempts: 3,
    
    // Authentication
    authType: 'none',
    apiKey: '',
    bearerToken: '',
    basicAuth: { username: '', password: '' },
    
    // Rate Limiting
    rateLimitEnabled: false,
    rateLimit: { requests: 100, window: 60 },
    
    // Environment Configuration
    environments: {
      development: { baseUrl: '', enabled: true },
      staging: { baseUrl: '', enabled: false },
      production: { baseUrl: '', enabled: false }
    },
    
    // Custom Fields
    customFields: [
      { name: '', value: '', type: 'string' },
      { name: '', value: '', type: 'string' },
      { name: '', value: '', type: 'string' }
    ],
    
    // Schema
    requestSchema: null,
    responseSchema: null
  });

  const steps = [
    { number: 1, title: 'Informações Básicas', description: 'Nome, descrição e configurações gerais' },
    { number: 2, title: 'Configuração', description: 'Endpoint, métodos HTTP e parâmetros' },
    { number: 3, title: 'Autenticação', description: 'Configurações de segurança e acesso' },
    { number: 4, title: 'Teste e Validação', description: 'Teste da API e finalização' }
  ];

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData?.name?.trim() && formData?.description?.trim() && formData?.category;
      case 2:
        return formData?.baseUrl?.trim() && formData?.methods?.length > 0;
      case 3:
        if (formData?.authType === 'apiKey') {
          return formData?.apiKey?.trim();
        }
        if (formData?.authType === 'bearer') {
          return formData?.bearerToken?.trim();
        }
        if (formData?.authType === 'basic') {
          return formData?.basicAuth?.username?.trim() && formData?.basicAuth?.password?.trim();
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving API configuration:', formData);
      console.log('Is draft:', isDraft);
      
      // Navigate to the APIs list page after successful creation
      navigate('/my-ap-is-list');
      
    } catch (error) {
      console.error('Error saving API:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <ConfigurationStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 3:
        return (
          <AuthenticationStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 4:
        return (
          <TestingStep 
            formData={formData} 
            updateFormData={updateFormData}
            onSave={handleSave}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Nova API - Criação | API Hub</title>
        <meta name="description" content="Crie e configure uma nova API personalizada com nosso assistente step-by-step" />
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
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/my-ap-is-list')}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Voltar para Lista
                </Button>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Nova API
              </h1>
              <p className="text-muted-foreground">
                Configure sua nova API seguindo os passos abaixo
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <ProgressIndicator 
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg">
                {/* Step Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {currentStep}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {steps?.[currentStep - 1]?.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {steps?.[currentStep - 1]?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {renderStepContent()}
                </div>

                {/* Step Actions */}
                {currentStep < 4 && (
                  <div className="p-6 border-t border-border">
                    <div className="flex justify-between">
                      <div>
                        {currentStep > 1 && (
                          <Button
                            variant="outline"
                            onClick={handlePrevious}
                          >
                            <Icon name="ChevronLeft" size={16} className="mr-2" />
                            Anterior
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => handleSave(true)}
                          disabled={isLoading}
                        >
                          <Icon name="Save" size={16} className="mr-2" />
                          Salvar Rascunho
                        </Button>
                        
                        <Button
                          onClick={handleNext}
                          disabled={!validateCurrentStep()}
                        >
                          Próximo
                          <Icon name="ChevronRight" size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NewAPICreation;