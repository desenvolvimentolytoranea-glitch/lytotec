import React from 'react';

interface AplicacoesRegistradasListProps {
  aplicacoes?: any[];
  onEdit?: (aplicacao: any) => void;
  onDelete?: ((aplicacaoId: string) => Promise<void>) | (() => void);
  massaTotalCarga?: number;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

const AplicacoesRegistradasList: React.FC<AplicacoesRegistradasListProps> = ({ 
  aplicacoes = [],
  onEdit,
  onDelete,
  massaTotalCarga,
  isLoading,
  isReadOnly
}) => {
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">
        Lista de aplicações registradas ({aplicacoes.length} itens)
      </p>
    </div>
  );
};

export default AplicacoesRegistradasList;