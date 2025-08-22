import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PersonalInfoStep = ({ formData, setFormData, errors }) => {
  const roleOptions = [
    { value: 'developer', label: 'Desenvolvedor' },
    { value: 'devops', label: 'Engenheiro DevOps' },
    { value: 'tech_lead', label: 'Líder Técnico' },
    { value: 'system_admin', label: 'Administrador de Sistema' },
    { value: 'integration_specialist', label: 'Especialista em Integração' },
    { value: 'it_manager', label: 'Gerente de TI' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome Completo"
          type="text"
          placeholder="Digite seu nome completo"
          value={formData?.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />
        
        <Input
          label="Email Corporativo"
          type="email"
          placeholder="seu.email@empresa.com"
          value={formData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          description="Use seu email corporativo para verificação"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Senha"
          type="password"
          placeholder="Crie uma senha segura"
          value={formData?.password || ''}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          description="Mínimo 8 caracteres com letras e números"
        />
        
        <Input
          label="Confirmar Senha"
          type="password"
          placeholder="Confirme sua senha"
          value={formData?.confirmPassword || ''}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      <Select
        label="Função/Cargo"
        placeholder="Selecione sua função"
        options={roleOptions}
        value={formData?.role || ''}
        onChange={(value) => handleInputChange('role', value)}
        error={errors?.role}
        required
        description="Sua função principal na equipe técnica"
      />
      <Input
        label="Telefone"
        type="tel"
        placeholder="(11) 99999-9999"
        value={formData?.phone || ''}
        onChange={(e) => handleInputChange('phone', e?.target?.value)}
        error={errors?.phone}
        description="Formato: (XX) XXXXX-XXXX"
      />
    </div>
  );
};

export default PersonalInfoStep;