import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      name: 'ISO 27001',
      description: 'Segurança da Informação',
      icon: 'Shield',
      verified: true
    },
    {
      name: 'LGPD',
      description: 'Conformidade de Dados',
      icon: 'FileCheck',
      verified: true
    },
    {
      name: 'SOC 2',
      description: 'Controles de Segurança',
      icon: 'Lock',
      verified: true
    }
  ];

  const testimonials = [
    {
      company: 'TechBrasil Ltda',
      text: 'Reduziu nosso tempo de integração em 70%',
      role: 'CTO'
    },
    {
      company: 'Inovação Digital',
      text: 'Plataforma confiável para nossas APIs críticas',
      role: 'Arquiteto de Sistemas'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Certifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Certificações de Segurança
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {certifications?.map((cert, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-card border border-border rounded-md"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name={cert?.icon} size={16} className="text-success" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">
                    {cert?.name}
                  </p>
                  {cert?.verified && (
                    <Icon name="CheckCircle" size={14} className="text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {cert?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonials */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Confiança de Empresas Brasileiras
        </h3>
        <div className="space-y-3">
          {testimonials?.map((testimonial, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 border border-border rounded-md"
            >
              <blockquote className="text-sm text-foreground mb-2">
                "{testimonial?.text}"
              </blockquote>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Building" size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {testimonial?.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial?.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Notice */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary mb-1">
              Conformidade Brasileira
            </p>
            <p className="text-xs text-muted-foreground">
              Todos os dados são processados em território brasileiro, em conformidade com a LGPD e regulamentações locais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;