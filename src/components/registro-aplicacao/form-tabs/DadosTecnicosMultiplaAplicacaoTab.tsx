import React, { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RegistroAplicacaoSchema } from "@/validations/registroAplicacaoSchema";
import { RegistroCarga } from "@/types/registroCargas";
import { RegistroAplicacaoDetalhesFormValues } from "@/types/registroAplicacaoDetalhes";
import { ListaProgramacaoEntrega } from "@/types/programacaoEntrega";
import AplicacoesRegistradasList from "../AplicacoesRegistradasList";
import NovaAplicacaoForm from "../NovaAplicacaoForm";
import { useAplicacoesMultiplas } from "@/hooks/registro-aplicacao/useAplicacoesMultiplas";
import { useMultipleApplications } from "@/hooks/registro-aplicacao/useMultipleApplications";
import { createRegistroAplicacao } from "@/services/registro-aplicacao";
import { fetchRegistroAplicacaoExistente } from "@/services/registro-aplicacao/fetchRegistroAplicacaoExistente";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, Building } from "lucide-react";
import { formatMassaFromDatabase } from "@/utils/massaConversionUtils";

interface DadosTecnicosMultiplaAplicacaoTabProps {
  form: UseFormReturn<RegistroAplicacaoSchema>;
  onNext: () => void;
  onPrevious: () => void;
  registroCarga?: RegistroCarga | null;
  registroAplicacaoId?: string;
  listaEntregaId?: string;
  entrega?: ListaProgramacaoEntrega | null;
  onRegistroCreated?: (id: string) => void;
  isReadOnly?: boolean;
}

const DadosTecnicosMultiplaAplicacaoTab: React.FC<DadosTecnicosMultiplaAplicacaoTabProps> = ({
  form,
  onNext,
  onPrevious,
  registroCarga,
  registroAplicacaoId,
  listaEntregaId,
  entrega,
  onRegistroCreated,
  isReadOnly = false
}) => {
  const { toast } = useToast();
  const [currentRegistroId, setCurrentRegistroId] = React.useState<string | undefined>(registroAplicacaoId);
  const [isLoadingRegistro, setIsLoadingRegistro] = React.useState(false);
  const initializationRef = useRef(false);

  // Hook para informações da carga
  const { cargaInfo, refetch: refetchCargaInfo } = useMultipleApplications(registroCarga?.id);

  // CORREÇÃO: tonelada_real está em KG, converter para toneladas
  const massaTotalCarga = registroCarga?.tonelada_real 
    ? formatMassaFromDatabase(registroCarga.tonelada_real, 'bd_registro_cargas', 'tonelada_real')
    : 0;
  const massaRemanescente = cargaInfo ? cargaInfo.massaRemanescente : massaTotalCarga;

  // Verificar se a carga está finalizada
  const cargaFinalizada = cargaInfo?.cargaFinalizada || massaRemanescente <= 0.001 || isReadOnly;

  // Função para validar e formatar valores de hora
  const formatHoraValue = (value: string | number | boolean | null | undefined): string | null => {
    if (!value || value === "" || typeof value !== "string") {
      return null;
    }
    
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (horaRegex.test(value)) {
      return value;
    }
    
    console.warn(`Valor de hora inválido: ${value}`);
    return null;
  };

  // Verificar se pode criar novo registro
  const podeAdicionarAplicacao = !cargaFinalizada && massaRemanescente > 0 && !isReadOnly;

  // Lógica simplificada para buscar ou criar registro principal
  useEffect(() => {
    const initializeRegistro = async () => {
      console.log("🔄 [initializeRegistro] Verificando inicialização:", {
        currentRegistroId,
        hasEntrega: !!entrega,
        hasRegistroCarga: !!registroCarga,
        hasListaEntregaId: !!listaEntregaId,
        initializationDone: initializationRef.current,
        isReadOnly
      });

      if (!currentRegistroId && entrega && registroCarga && listaEntregaId && !initializationRef.current) {
        initializationRef.current = true;
        setIsLoadingRegistro(true);
        
        try {
          console.log("🔍 Buscando registro existente para lista_entrega_id:", listaEntregaId);
          
          const registroExistente = await fetchRegistroAplicacaoExistente(listaEntregaId);
          
          if (registroExistente) {
            console.log("✅ Registro existente encontrado:", {
              id: registroExistente.id
            });
            setCurrentRegistroId(registroExistente.id);
            onRegistroCreated?.(registroExistente.id);
            
            toast({
              title: isReadOnly ? "Registro Carregado" : "Registro Encontrado",
              description: isReadOnly 
                ? "Carregando aplicações registradas para visualização."
                : "Carregando aplicações existentes do registro de aplicação.",
            });
            
            return;
          }
          
          // Se não existir e não for modo somente leitura, criar novo registro
          if (!isReadOnly) {
            console.log("➕ Nenhum registro existente encontrado. Criando novo registro...");
            
            const dataAplicacao = form.getValues("data_aplicacao");
            const horaChegada = formatHoraValue(form.getValues("hora_chegada_local"));
            const temperaturaChegada = form.getValues("temperatura_chegada");
            
            console.log("📋 Dados que serão enviados para createRegistroAplicacao:");
            console.log("   - lista_entrega_id:", entrega.id);
            console.log("   - registro_carga_id:", registroCarga.id);
            console.log("   - data_aplicacao:", dataAplicacao);
            console.log("   - hora_chegada_local:", horaChegada || "08:00:00");
            console.log("   - temperatura_chegada:", temperaturaChegada ? Number(temperaturaChegada) : null);
            
            let registroAplicacao;
            try {
              registroAplicacao = await createRegistroAplicacao({
                lista_entrega_id: entrega.id,
                registro_carga_id: registroCarga.id,
                data_aplicacao: dataAplicacao,
                hora_chegada_local: horaChegada || "08:00:00",
                temperatura_chegada: temperaturaChegada ? Number(temperaturaChegada) : null,
              });
              
              console.log("✅ Registro principal criado com sucesso:", registroAplicacao);
            } catch (error) {
              console.error("❌ ERRO ao criar registro principal:", error);
              toast({
                title: "Erro ao criar registro",
                description: `Falha ao criar registro principal: ${error.message}`,
                variant: "destructive",
              });
              throw error;
            }
            
            console.log("✅ Novo registro criado:", registroAplicacao);
            setCurrentRegistroId(registroAplicacao.id);
            onRegistroCreated?.(registroAplicacao.id);
            
            toast({
              title: "Sucesso",
              description: "Registro de aplicação iniciado automaticamente",
            });
          }
        } catch (error) {
          console.error("❌ Erro ao inicializar registro:", error);
          toast({
            title: "Erro",
            description: "Erro ao carregar ou criar o registro de aplicação",
            variant: "destructive",
          });
        } finally {
          setIsLoadingRegistro(false);
        }
      }
    };

    initializeRegistro();
  }, [currentRegistroId, entrega, registroCarga, listaEntregaId, form, onRegistroCreated, toast, isReadOnly]);

  // Hook para gerenciar aplicações múltiplas com callback para atualizar massa remanescente
  const {
    aplicacoes,
    isLoading: isLoadingAplicacoes,
    editingAplicacao,
    totais,
    adicionarAplicacao,
    editarAplicacao,
    removerAplicacao,
    iniciarEdicao,
    cancelarEdicao,
    aplicacaoParaFormulario,
    forceReloadAplicacoes
  } = useAplicacoesMultiplas(
    currentRegistroId,
    registroCarga?.id,
    listaEntregaId,
    // Callback para atualizar massa remanescente quando aplicações mudarem
    () => {
      console.log("🔄 Atualizando massa remanescente após mudança nas aplicações");
      refetchCargaInfo();
    }
  );

  // CRÍTICO: Forçar reload quando currentRegistroId muda
  React.useEffect(() => {
    if (currentRegistroId) {
      console.log("🔄 [DadosTecnicosTab] currentRegistroId mudou - forçando reload:", currentRegistroId);
      // Pequeno delay para garantir que o hook interno já processou a mudança
      setTimeout(() => {
        forceReloadAplicacoes?.();
      }, 100);
    }
  }, [currentRegistroId, forceReloadAplicacoes]);

  // Log DETALHADO para debug
  console.log("📍 [DadosTecnicosTab] Estado atual DETALHADO:", {
    currentRegistroId,
    aplicacoesCount: aplicacoes.length,
    aplicacoesArray: aplicacoes,
    isLoadingRegistro,
    isLoadingAplicacoes,
    isReadOnly,
    massaRemanescente,
    registroAplicacaoIdProp: registroAplicacaoId,
    listaEntregaId,
    registroCargaId: registroCarga?.id,
    timestamp: new Date().toISOString()
  });

  // Salvar nova aplicação
  const handleSalvarAplicacao = async (dadosAplicacao: RegistroAplicacaoDetalhesFormValues) => {
    if (isReadOnly) {
      toast({
        title: "Modo Somente Leitura",
        description: "Esta entrega está finalizada e não pode ser editada.",
        variant: "destructive",
      });
      return;
    }

    if (!currentRegistroId) {
      toast({
        title: "Erro",
        description: "Registro principal não foi criado. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    if (massaRemanescente <= 0) {
      toast({
        title: "Erro",
        description: "Não há massa remanescente disponível para aplicação",
        variant: "destructive",
      });
      return;
    }

    if (dadosAplicacao.tonelada_aplicada > massaRemanescente) {
      toast({
        title: "Erro",
        description: `Tonelada aplicada (${dadosAplicacao.tonelada_aplicada}t) excede a massa remanescente (${massaRemanescente.toFixed(2)}t)`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAplicacao) {
        await editarAplicacao(editingAplicacao.id, dadosAplicacao);
      } else {
        await adicionarAplicacao(dadosAplicacao);
      }
    } catch (error) {
      console.error("❌ Erro ao salvar aplicação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a aplicação. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Editar aplicação existente
  const handleEditarAplicacao = (aplicacao: any) => {
    if (isReadOnly) {
      toast({
        title: "Modo Somente Leitura",
        description: "Esta entrega está finalizada e não pode ser editada.",
        variant: "destructive",
      });
      return;
    }

    const dadosFormulario = aplicacaoParaFormulario(aplicacao);
    iniciarEdicao({ ...aplicacao, ...dadosFormulario });
  };

  // Verificar se pode prosseguir
  const podeProxima = aplicacoes.length > 0;

  // Mostrar loading específico baseado no estado
  const isLoading = isLoadingRegistro || isLoadingAplicacoes;
  const loadingMessage = isLoadingRegistro 
    ? (isReadOnly ? "Carregando registro para visualização..." : "Carregando registro de aplicação...")
    : "Carregando aplicações...";

  // Mostrar loading apenas durante inicialização
  if (isLoadingRegistro) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">{loadingMessage}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert para modo somente leitura */}
      {isReadOnly && (
        <Alert className="bg-blue-50 border-blue-200">
          <Eye className="h-4 w-4" />
          <AlertDescription>
            Esta entrega está finalizada. Os dados são apresentados somente para visualização.
          </AlertDescription>
        </Alert>
      )}

      {/* Painel de Progresso da Carga */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          Progresso da Carga
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/70 p-3 rounded-md text-center">
            <div className="text-2xl font-bold text-blue-600">{massaTotalCarga.toFixed(1)}t</div>
            <div className="text-xs text-gray-600">Massa Total</div>
          </div>
          <div className="bg-white/70 p-3 rounded-md text-center">
            <div className="text-2xl font-bold text-green-600">{totais.totalAplicado.toFixed(1)}t</div>
            <div className="text-xs text-gray-600">Aplicado</div>
          </div>
          <div className="bg-white/70 p-3 rounded-md text-center">
            <div className="text-2xl font-bold text-orange-600">{massaRemanescente.toFixed(1)}t</div>
            <div className="text-xs text-gray-600">Remanescente</div>
          </div>
          <div className="bg-white/70 p-3 rounded-md text-center">
            <div className="text-2xl font-bold text-purple-600">{aplicacoes.length}</div>
            <div className="text-xs text-gray-600">Aplicações</div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progresso da Aplicação</span>
            <span>{massaTotalCarga > 0 ? ((totais.totalAplicado / massaTotalCarga) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${massaTotalCarga > 0 ? Math.min((totais.totalAplicado / massaTotalCarga) * 100, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lista de aplicações registradas */}
      <AplicacoesRegistradasList
        aplicacoes={aplicacoes}
        onEdit={handleEditarAplicacao}
        onDelete={isReadOnly ? () => {} : removerAplicacao}
        massaTotalCarga={massaTotalCarga}
        isLoading={isLoadingAplicacoes}
        isReadOnly={isReadOnly}
      />

      {/* Formulário para nova aplicação */}
      {podeAdicionarAplicacao ? (
        <NovaAplicacaoForm
          onSave={handleSalvarAplicacao}
          editingAplicacao={editingAplicacao ? aplicacaoParaFormulario(editingAplicacao) : null}
          onCancelEdit={cancelarEdicao}
          massaRemanescente={massaRemanescente}
          proximaSequencia={totais.proximaSequencia}
          isLoading={isLoadingAplicacoes}
          requisicaoId={entrega?.requisicao_id}
        />
      ) : (
        /* Mensagem para carga finalizada ou sem massa remanescente */
        <div className={`${isReadOnly ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${isReadOnly ? 'text-blue-400' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isReadOnly ? 'text-blue-800' : 'text-green-800'}`}>
                {isReadOnly ? 'Entrega Finalizada - Modo Somente Leitura' : 'Carga Finalizada'}
              </h3>
              <div className={`mt-2 text-sm ${isReadOnly ? 'text-blue-700' : 'text-green-700'}`}>
                <p>
                  {isReadOnly 
                    ? 'Esta entrega está finalizada e os dados são apresentados apenas para consulta.'
                    : `Esta carga foi totalmente aplicada (${massaTotalCarga.toFixed(2)}t).`
                  }
                </p>
                {!isReadOnly && (
                  <p className="mt-1">
                    Não é possível adicionar novas aplicações.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrevious}>
          Anterior
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!podeProxima}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {podeProxima ? "Próximo: Finalização" : "Adicione ao menos uma aplicação"}
        </Button>
      </div>
    </div>
  );
};

export default DadosTecnicosMultiplaAplicacaoTab;
