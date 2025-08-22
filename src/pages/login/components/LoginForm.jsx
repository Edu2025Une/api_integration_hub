import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');

  // Mock credentials for authentication
  const mockCredentials = {
    admin: { email: 'admin@apihub.com.br', password: 'Admin@2024' },
    developer: { email: 'dev@apihub.com.br', password: 'Dev@2024' },
    manager: { email: 'manager@apihub.com.br', password: 'Manager@2024' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (showCaptcha && !captchaValue) {
      newErrors.captcha = 'CAPTCHA é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check credentials
    const isValidCredentials = Object.values(mockCredentials)?.some(
      cred => cred?.email === formData?.email && cred?.password === formData?.password
    );
    
    if (isValidCredentials) {
      // Successful login
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData?.email);
      if (formData?.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/api-integration-dashboard');
    } else {
      // Failed login
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 3) {
        setShowCaptcha(true);
      }
      
      setErrors({
        general: `Credenciais inválidas. Use: admin@apihub.com.br / Admin@2024, dev@apihub.com.br / Dev@2024, ou manager@apihub.com.br / Manager@2024`
      });
    }
    
    setIsLoading(false);
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    return result;
  };

  const [captchaCode] = useState(generateCaptcha());

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="seu.email@empresa.com.br"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Digite sua senha"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-150"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* CAPTCHA - Show after 3 failed attempts */}
        {showCaptcha && (
          <div className="space-y-3">
            <div className="bg-muted p-4 rounded-md border border-border">
              <p className="text-sm text-muted-foreground mb-2">Digite o código abaixo:</p>
              <div className="bg-card border border-border rounded px-4 py-2 font-mono text-lg font-bold text-center tracking-wider">
                {captchaCode}
              </div>
            </div>
            <Input
              label="Código CAPTCHA"
              type="text"
              placeholder="Digite o código"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e?.target?.value)}
              error={errors?.captcha}
              required
              disabled={isLoading}
            />
          </div>
        )}

        {/* Remember Me */}
        <Checkbox
          label="Lembrar de mim"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        {/* General Error */}
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-md p-3">
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        )}

        {/* Rate Limiting Warning */}
        {failedAttempts >= 2 && failedAttempts < 3 && (
          <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
            <p className="text-sm text-warning">
              Atenção: Muitas tentativas falharam. CAPTCHA será exigido na próxima tentativa.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Alternative Actions */}
        <div className="space-y-3 text-center">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
            disabled={isLoading}
          >
            Esqueceu sua senha?
          </button>
          
          <div className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 transition-colors duration-150 font-medium"
              disabled={isLoading}
            >
              Criar conta
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;