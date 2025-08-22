import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ steps, currentStep, onStepClick }) => {
  const getStepIcon = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return 'Info';
      case 2:
        return 'Settings';
      case 3:
        return 'Shield';
      case 4:
        return 'TestTube';
      default:
        return 'Circle';
    }
  };

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorStyles = (stepNumber) => {
    return stepNumber < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Passo {currentStep} de {steps?.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / steps?.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps?.length) * 100}%` }}
          />
        </div>
        <div className="mt-2">
          <h3 className="font-medium text-foreground">{steps?.[currentStep - 1]?.title}</h3>
          <p className="text-sm text-muted-foreground">{steps?.[currentStep - 1]?.description}</p>
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.number);
            const isClickable = step?.number <= currentStep;
            
            return (
              <div key={step?.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isClickable && onStepClick?.(step?.number)}
                    disabled={!isClickable}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      getStepStyles(status)
                    } ${
                      isClickable 
                        ? 'cursor-pointer hover:scale-105' :'cursor-not-allowed opacity-60'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={getStepIcon(step?.number)} size={16} />
                    )}
                  </button>
                  
                  {/* Step Info */}
                  <div className="mt-3 text-center max-w-32">
                    <h4 className={`text-sm font-medium ${
                      status === 'current' ?'text-foreground' 
                        : status === 'completed' ?'text-success' :'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {step?.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps?.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 rounded-full transition-all duration-300 ${
                      getConnectorStyles(step?.number)
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;