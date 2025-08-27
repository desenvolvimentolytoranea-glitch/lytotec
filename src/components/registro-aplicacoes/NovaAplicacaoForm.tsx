import React from 'react';

interface NovaAplicacaoFormProps {
  onSubmit?: (data: any) => void;
  onSave?: (dadosAplicacao: any) => Promise<void>;
  editingAplicacao?: any;
  onCancel?: () => void;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  massaRemanescente?: number;
  proximaSequencia?: number;
  programacaoData?: any;
  isLoading?: boolean;
  requisicaoId?: string;
}

const NovaAplicacaoForm: React.FC<NovaAplicacaoFormProps> = ({ 
  onSubmit,
  onSave,
  editingAplicacao,
  onCancel,
  onCancelEdit,
  isSubmitting,
  massaRemanescente,
  proximaSequencia,
  programacaoData,
  isLoading,
  requisicaoId
}) => {
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">
        Formulário de nova aplicação
      </p>
    </div>
  );
};

export default NovaAplicacaoForm;