import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps?.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
              ${index < currentStep 
                ? 'bg-primary border-primary text-primary-foreground' 
                : index === currentStep 
                  ? 'bg-primary/10 border-primary text-primary' :'bg-muted border-border text-muted-foreground'
              }
            `}>
              {index < currentStep ? (
                <Icon name="Check" size={20} />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            {index < steps?.length - 1 && (
              <div className={`
                w-16 h-0.5 mx-2 transition-colors duration-200
                ${index < currentStep ? 'bg-primary' : 'bg-border'}
              `} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {steps?.[currentStep]?.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Passo {currentStep + 1} de {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;