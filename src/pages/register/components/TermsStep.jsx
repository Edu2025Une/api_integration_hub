import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TermsStep = ({ formData, setFormData, errors }) => {
  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-2">
          Termos e Condições
        </h4>
        <p className="text-sm text-muted-foreground">
          Leia e aceite os termos para finalizar seu cadastro
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <Checkbox
            label="Aceito os Termos de Uso da plataforma"
            description="Li e concordo com os termos de uso do API Integration Hub"
            checked={formData?.acceptTerms || false}
            onChange={(e) => handleCheckboxChange('acceptTerms', e?.target?.checked)}
            error={errors?.acceptTerms}
            required
          />

          <Checkbox
            label="Aceito a Política de Privacidade"
            description="Concordo com o tratamento dos meus dados conforme LGPD"
            checked={formData?.acceptPrivacy || false}
            onChange={(e) => handleCheckboxChange('acceptPrivacy', e?.target?.checked)}
            error={errors?.acceptPrivacy}
            required
          />

          <Checkbox
            label="Aceito receber comunicações por email"
            description="Notificações sobre atualizações, manutenções e novidades da plataforma"
            checked={formData?.acceptEmails || false}
            onChange={(e) => handleCheckboxChange('acceptEmails', e?.target?.checked)}
          />
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <Icon name="Shield" size={20} className="text-primary mt-0.5" />
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-foreground mb-1">
                Conformidade LGPD
              </h5>
              <p className="text-xs text-muted-foreground">
                Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD). 
                Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Certificação ISO 27001
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Compliance SOC 2 Type II
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Auditoria de Segurança Brasileira
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        <p>
          Ao criar sua conta, você concorda em seguir nossas diretrizes de uso 
          e reconhece que leu nossa documentação de segurança.
        </p>
      </div>
    </div>
  );
};

export default TermsStep;