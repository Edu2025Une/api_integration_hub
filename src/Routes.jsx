import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import APIIntegrationDashboard from './pages/api-integration-dashboard';
import IntegrationWorkflowAutomation from './pages/integration-workflow-automation';
import RealTimeMonitoringDashboard from './pages/real-time-monitoring-dashboard';
import APIConfigurationManagement from './pages/api-configuration-management';
import Register from './pages/register';
import MyAPIsList from './pages/my-ap-is-list';
import NewAPICreation from './pages/new-api-creation';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<APIConfigurationManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/api-integration-dashboard" element={<APIIntegrationDashboard />} />
        <Route path="/integration-workflow-automation" element={<IntegrationWorkflowAutomation />} />
        <Route path="/real-time-monitoring-dashboard" element={<RealTimeMonitoringDashboard />} />
        <Route path="/api-configuration-management" element={<APIConfigurationManagement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-ap-is-list" element={<MyAPIsList />} />
        <Route path="/new-api-creation" element={<NewAPICreation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;