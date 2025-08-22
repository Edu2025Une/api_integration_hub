import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomFieldsStep = ({ formData, setFormData, errors }) => {
  const experienceOptions = [
    { value: 'junior', label: 'Júnior (0-2 anos)' },
    { value: 'pleno', label: 'Pleno (3-5 anos)' },
    { value: 'senior', label: 'Sênior (6-10 anos)' },
    { value: 'specialist', label: 'Especialista (10+ anos)' }
  ];

  const integrationComplexityOptions = [
    { value: 'basic', label: 'Básico - APIs REST simples' },
    { value: 'intermediate', label: 'Intermediário - Múltiplas APIs' },
    { value: 'advanced', label: 'Avançado - Sistemas complexos' },
    { value: 'expert', label: 'Expert - Arquiteturas distribuídas' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-2">
          Informações Técnicas Adicionais
        </h4>
        <p className="text-sm text-muted-foreground">
          Estes campos nos ajudam a personalizar sua experiência na plataforma
        </p>
      </div>
      <Select
        label="Nível de Experiência com APIs"
        placeholder="Selecione seu nível"
        options={experienceOptions}
        value={formData?.apiExperience || ''}
        onChange={(value) => handleInputChange('apiExperience', value)}
        error={errors?.apiExperience}
        required
        description="Seu nível de experiência trabalhando com integrações de API"
      />
      <Select
        label="Complexidade de Integrações"
        placeholder="Selecione a complexidade"
        options={integrationComplexityOptions}
        value={formData?.integrationComplexity || ''}
        onChange={(value) => handleInputChange('integrationComplexity', value)}
        error={errors?.integrationComplexity}
        required
        description="Tipo de integrações que você geralmente trabalha"
      />
      <Input
        label="Tecnologias Principais"
        type="text"
        placeholder="Ex: Node.js, Python, Java, React, etc."
        value={formData?.primaryTechnologies || ''}
        onChange={(e) => handleInputChange('primaryTechnologies', e?.target?.value)}
        error={errors?.primaryTechnologies}
        required
        description="Liste as principais tecnologias que você utiliza (separadas por vírgula)"
      />
      <div className="bg-muted/50 p-4 rounded-lg">
        <h5 className="text-sm font-semibold text-foreground mb-3">
          Configurações Personalizáveis
        </h5>
        <div className="space-y-4">
          <Input
            label="Prefixo de Nomenclatura"
            type="text"
            placeholder="Ex: api_, integration_, etc."
            value={formData?.namingPrefix || ''}
            onChange={(e) => handleInputChange('namingPrefix', e?.target?.value)}
            error={errors?.namingPrefix}
            description="Prefixo padrão para suas integrações"
          />
          
          <Input
            label="Ambiente Padrão"
            type="text"
            placeholder="Ex: development, staging, production"
            value={formData?.defaultEnvironment || ''}
            onChange={(e) => handleInputChange('defaultEnvironment', e?.target?.value)}
            error={errors?.defaultEnvironment}
            description="Ambiente padrão para novas configurações"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomFieldsStep;