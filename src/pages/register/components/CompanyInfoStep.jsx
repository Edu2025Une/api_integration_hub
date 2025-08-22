import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyInfoStep = ({ formData, setFormData, errors }) => {
  const companySizeOptions = [
    { value: 'startup', label: '1-10 funcionários (Startup)' },
    { value: 'small', label: '11-50 funcionários (Pequena)' },
    { value: 'medium', label: '51-200 funcionários (Média)' },
    { value: 'large', label: '201-1000 funcionários (Grande)' },
    { value: 'enterprise', label: '1000+ funcionários (Enterprise)' }
  ];

  const industryOptions = [
    { value: 'technology', label: 'Tecnologia' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'healthcare', label: 'Saúde' },
    { value: 'education', label: 'Educação' },
    { value: 'manufacturing', label: 'Manufatura' },
    { value: 'retail', label: 'Varejo' },
    { value: 'logistics', label: 'Logística' },
    { value: 'financial', label: 'Serviços Financeiros' },
    { value: 'other', label: 'Outros' }
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
          label="Nome da Empresa"
          type="text"
          placeholder="Digite o nome da empresa"
          value={formData?.companyName || ''}
          onChange={(e) => handleInputChange('companyName', e?.target?.value)}
          error={errors?.companyName}
          required
        />
        
        <Input
          label="CNPJ"
          type="text"
          placeholder="00.000.000/0000-00"
          value={formData?.cnpj || ''}
          onChange={(e) => handleInputChange('cnpj', e?.target?.value)}
          error={errors?.cnpj}
          required
          description="Formato: XX.XXX.XXX/XXXX-XX"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Tamanho da Empresa"
          placeholder="Selecione o tamanho"
          options={companySizeOptions}
          value={formData?.companySize || ''}
          onChange={(value) => handleInputChange('companySize', value)}
          error={errors?.companySize}
          required
        />
        
        <Select
          label="Setor de Atuação"
          placeholder="Selecione o setor"
          options={industryOptions}
          value={formData?.industry || ''}
          onChange={(value) => handleInputChange('industry', value)}
          error={errors?.industry}
          required
        />
      </div>
      <Input
        label="Website da Empresa"
        type="url"
        placeholder="https://www.empresa.com.br"
        value={formData?.website || ''}
        onChange={(e) => handleInputChange('website', e?.target?.value)}
        error={errors?.website}
        description="URL completa do website corporativo"
      />
      <Input
        label="Endereço"
        type="text"
        placeholder="Rua, número, bairro, cidade - UF"
        value={formData?.address || ''}
        onChange={(e) => handleInputChange('address', e?.target?.value)}
        error={errors?.address}
        description="Endereço completo da empresa"
      />
    </div>
  );
};

export default CompanyInfoStep;