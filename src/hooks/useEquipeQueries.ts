
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchEquipes, 
  getEquipeById, 
  createEquipe, 
  updateEquipe, 
  deleteEquipe,
  fetchFuncionariosByRole
} from "@/services/equipe";
import { EquipeFilter, EquipeFormData } from "@/types/equipe";
import { supabase } from "@/integrations/supabase/client";

export function useEquipeQueries(filters: EquipeFilter = {}) {
  const queryClient = useQueryClient();
  
  // Query to fetch equipes with filters and optimized member loading
  const { 
    data: equipes = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['equipes', filters],
    queryFn: async () => {
      console.log('🔄 [useEquipeQueries] Buscando equipes com filtros:', filters);
      const equipesData = await fetchEquipes(filters);
      console.log('📊 [useEquipeQueries] Equipes retornadas do serviço:', equipesData?.length || 0);

      // Coletar todos os IDs de membros, encarregados e apontadores para busca única
      const memberIds: string[] = [];
      const leaderIds: string[] = [];
      for (const eq of equipesData) {
        if (Array.isArray(eq.equipe)) {
          memberIds.push(...(eq.equipe as string[]));
        }
        if (eq.encarregado_id) leaderIds.push(eq.encarregado_id);
        if (eq.apontador_id) leaderIds.push(eq.apontador_id);
      }
      const allIds = Array.from(new Set([...memberIds, ...leaderIds]));

      // Buscar todos os funcionários necessários em uma única query
      let funcionariosMap = new Map<string, { id: string; nome_completo: string }>();
      if (allIds.length > 0) {
        try {
          const { data: funcionariosData, error } = await supabase
            .from('bd_funcionarios')
            .select('id, nome_completo')
            .in('id', allIds);
          if (error) throw error;
          funcionariosMap = new Map((funcionariosData || []).map((f) => [f.id, f]));
        } catch (err) {
          console.warn('⚠️ Erro ao carregar funcionários relacionados às equipes:', err);
          funcionariosMap = new Map();
        }
      }

      // Montar equipes com membros, encarregado e apontador resolvidos
      const equipesWithRelations = equipesData.map((eq) => {
        const membros = Array.isArray(eq.equipe)
          ? (eq.equipe as string[])
              .map((id) => funcionariosMap.get(id))
              .filter(Boolean) as { id: string; nome_completo: string }[]
          : [];

        const encarregadoRaw = eq.encarregado_id ? funcionariosMap.get(eq.encarregado_id) : undefined;
        const apontadorRaw = eq.apontador_id ? funcionariosMap.get(eq.apontador_id) : undefined;

        return {
          ...eq,
          membros,
          encarregado: encarregadoRaw ? { id: encarregadoRaw.id, nome_completo: encarregadoRaw.nome_completo } : undefined,
          apontador: apontadorRaw ? { id: apontadorRaw.id, nome_completo: apontadorRaw.nome_completo } : undefined,
        };
      });

      console.log('✅ [useEquipeQueries] Equipes com relações carregadas:', equipesWithRelations?.length || 0);
      return equipesWithRelations;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  
  // Function to get a single equipe by ID with its members
  const getEquipe = async (id: string) => {
    // Try to get from cache first
    const cachedEquipe = equipes.find(e => e.id === id);
    if (cachedEquipe && cachedEquipe.membros) {
      return cachedEquipe;
    }
    
    // If not in cache or no members, fetch fresh data
    return await getEquipeById(id);
  };
  
  // Query to fetch funcionarios with "Encarregado" role
  const { 
    data: encarregados = [], 
    isLoading: isLoadingEncarregados
  } = useQuery({
    queryKey: ['funcionarios', 'encarregados'],
    queryFn: () => fetchFuncionariosByRole('Encarregado'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to fetch funcionarios with "Apontador" role
  const { 
    data: apontadores = [], 
    isLoading: isLoadingApontadores 
  } = useQuery({
    queryKey: ['funcionarios', 'apontadores'],
    queryFn: () => fetchFuncionariosByRole('Apontador'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query to fetch all funcionarios (for team members selection)
  const { 
    data: allFuncionarios = [], 
    isLoading: isLoadingFuncionarios 
  } = useQuery({
    queryKey: ['funcionarios', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_funcionarios")
        .select("id, nome_completo, equipe_id");
        
      if (error) throw new Error(error.message);
      console.log("All funcionarios loaded:", data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Mutation to create a new equipe
  const createEquipeMutation = useMutation({
    mutationFn: (data: EquipeFormData) => createEquipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
    }
  });
  
  // Mutation to update an existing equipe
  const updateEquipeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EquipeFormData }) => 
      updateEquipe(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
    }
  });
  
  // Mutation to delete an equipe
  const deleteEquipeMutation = useMutation({
    mutationFn: (id: string) => deleteEquipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipes'] });
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
    }
  });
  
  return {
    equipes,
    isLoading,
    isError,
    refetch,
    encarregados,
    isLoadingEncarregados,
    apontadores,
    isLoadingApontadores,
    allFuncionarios,
    isLoadingFuncionarios,
    createEquipeMutation,
    updateEquipeMutation,
    deleteEquipeMutation,
    getEquipe
  };
}
