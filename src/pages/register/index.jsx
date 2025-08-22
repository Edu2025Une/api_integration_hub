import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import PersonalInfoStep from './components/PersonalInfoStep';
import CompanyInfoStep from './components/CompanyInfoStep';
import CustomFieldsStep from './components/CustomFieldsStep';
import TermsStep from './components/TermsStep';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const steps = [
    { title: 'Informações Pessoais', component: PersonalInfoStep },
    { title: 'Dados da Empresa', component: CompanyInfoStep },
    { title: 'Configurações Técnicas', component: CustomFieldsStep },
    { title: 'Termos e Condições', component: TermsStep }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData?.fullName?.trim()) newErrors.fullName = 'Nome é obrigatório';
        if (!formData?.email?.trim()) newErrors.email = 'Email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
          newErrors.email = 'Email inválido';
        }
        if (!formData?.password) newErrors.password = 'Senha é obrigatória';
        else if (formData?.password?.length < 8) {
          newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
        }
        if (formData?.password !== formData?.confirmPassword) {
          newErrors.confirmPassword = 'Senhas não coincidem';
        }
        if (!formData?.role) newErrors.role = 'Função é obrigatória';
        break;
        
      case 1: // Company Info
        if (!formData?.companyName?.trim()) newErrors.companyName = 'Nome da empresa é obrigatório';
        if (!formData?.cnpj?.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
        if (!formData?.companySize) newErrors.companySize = 'Tamanho da empresa é obrigatório';
        if (!formData?.industry) newErrors.industry = 'Setor é obrigatório';
        break;
        
      case 2: // Custom Fields
        if (!formData?.apiExperience) newErrors.apiExperience = 'Nível de experiência é obrigatório';
        if (!formData?.integrationComplexity) newErrors.integrationComplexity = 'Complexidade é obrigatória';
        if (!formData?.primaryTechnologies?.trim()) newErrors.primaryTechnologies = 'Tecnologias são obrigatórias';
        break;
        
      case 3: // Terms
        if (!formData?.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
        if (!formData?.acceptPrivacy) newErrors.acceptPrivacy = 'Você deve aceitar a política de privacidade';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps?.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Mock registration process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success - redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Conta criada com sucesso! Verifique seu email para ativar a conta.',
          type: 'success'
        }
      });
    } catch (error) {
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps?.[currentStep]?.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Workflow" size={20} className="text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">API Hub</span>
                <span className="text-xs text-muted-foreground">Integration Platform</span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Já tem uma conta?</span>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Criar Nova Conta
            </h1>
            <p className="text-lg text-muted-foreground">
              Junte-se à plataforma de integração de APIs mais avançada do Brasil
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-8">
            <ProgressIndicator 
              currentStep={currentStep}
              totalSteps={steps?.length}
              steps={steps}
            />

            <div className="mb-8">
              <CurrentStepComponent 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
              
              {/* Password Strength Indicator for Personal Info Step */}
              {currentStep === 0 && formData?.password && (
                <div className="mt-4">
                  <PasswordStrengthIndicator password={formData?.password} />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Anterior
              </Button>

              <div className="flex items-center space-x-3">
                {currentStep < steps?.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    loading={isLoading}
                    iconName="UserPlus"
                    iconPosition="left"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando Conta...' : 'Criar Conta'}
                  </Button>
                )}
              </div>
            </div>

            {errors?.submit && (
              <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.submit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-2 p-4 bg-card border border-border rounded-lg">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Segurança LGPD</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-4 bg-card border border-border rounded-lg">
                <Icon name="Clock" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Suporte 24/7</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 p-4 bg-card border border-border rounded-lg">
                <Icon name="Zap" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Setup Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date()?.getFullYear()} API Integration Hub. Todos os direitos reservados.
            </p>
            <div className="mt-2 space-x-4">
              <Link to="#" className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;