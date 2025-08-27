import React from 'react';

interface DisabledComponentProps {
  componentName: string;
  reason?: string;
}

const DisabledComponent: React.FC<DisabledComponentProps> = ({ 
  componentName, 
  reason = "Component temporarily disabled" 
}) => {
  return (
    <div className="p-4 text-center text-muted-foreground bg-muted/50 rounded-lg border-2 border-dashed">
      <p className="text-sm font-medium">{componentName}</p>
      <p className="text-xs mt-1">{reason}</p>
    </div>
  );
};

export default DisabledComponent;