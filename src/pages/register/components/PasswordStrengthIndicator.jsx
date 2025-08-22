import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: pwd?.length >= 8,
      lowercase: /[a-z]/?.test(pwd),
      uppercase: /[A-Z]/?.test(pwd),
      numbers: /\d/?.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(pwd)
    };

    score = Object.values(checks)?.filter(Boolean)?.length;

    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Muito Fraca', color: 'text-error', bgColor: 'bg-error' },
      2: { label: 'Fraca', color: 'text-error', bgColor: 'bg-error' },
      3: { label: 'Regular', color: 'text-warning', bgColor: 'bg-warning' },
      4: { label: 'Forte', color: 'text-success', bgColor: 'bg-success' },
      5: { label: 'Muito Forte', color: 'text-success', bgColor: 'bg-success' }
    };

    return { score, checks, ...strengthLevels?.[score] };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Força da senha:</span>
        <span className={`text-xs font-medium ${strength?.color}`}>
          {strength?.label}
        </span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength?.score ? strength?.bgColor : 'bg-border'
            }`}
          />
        ))}
      </div>
      <div className="space-y-1">
        {Object.entries({
          length: 'Mínimo 8 caracteres',
          lowercase: 'Letra minúscula',
          uppercase: 'Letra maiúscula',
          numbers: 'Número',
          special: 'Caractere especial'
        })?.map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <Icon 
              name={strength?.checks?.[key] ? "CheckCircle" : "Circle"} 
              size={12} 
              className={strength?.checks?.[key] ? "text-success" : "text-muted-foreground"} 
            />
            <span className={`text-xs ${
              strength?.checks?.[key] ? "text-success" : "text-muted-foreground"
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;