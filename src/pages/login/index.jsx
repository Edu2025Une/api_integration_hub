import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import CompanyBranding from './components/CompanyBranding';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/api-integration-dashboard');
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Entrar - API Hub | Plataforma de Integração</title>
        <meta name="description" content="Acesse sua conta na API Hub - Plataforma brasileira de integração de APIs para equipes técnicas empresariais." />
        <meta name="keywords" content="login, API, integração, Brasil, plataforma, desenvolvimento" />
        <meta property="og:title" content="API Hub - Login" />
        <meta property="og:description" content="Plataforma de integração de APIs para empresas brasileiras" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="min-h-screen flex">
          {/* Left Panel - Desktop Only */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-card border-r border-border">
            <div className="flex flex-col justify-between w-full p-8 xl:p-12">
              {/* Company Branding */}
              <div className="flex-1 flex items-center">
                <CompanyBranding />
              </div>

              {/* Trust Signals */}
              <div className="mt-8">
                <TrustSignals />
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  © {new Date()?.getFullYear()} API Hub. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 lg:w-1/2 xl:w-3/5">
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-md space-y-8">
                {/* Mobile Branding */}
                <div className="lg:hidden">
                  <CompanyBranding />
                </div>

                {/* Login Form */}
                <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8">
                  <div className="space-y-6">
                    <div className="text-center lg:text-left">
                      <h2 className="text-2xl font-bold text-foreground">
                        Fazer Login
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Entre com suas credenciais para acessar o painel
                      </p>
                    </div>

                    <LoginForm />
                  </div>
                </div>

                {/* Mobile Trust Signals */}
                <div className="lg:hidden bg-card border border-border rounded-xl p-6">
                  <TrustSignals />
                </div>

                {/* Mobile Footer */}
                <div className="lg:hidden text-center">
                  <p className="text-xs text-muted-foreground">
                    © {new Date()?.getFullYear()} API Hub. Todos os direitos reservados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;