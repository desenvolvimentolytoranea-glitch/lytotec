
import { supabase } from "@/integrations/supabase/client";
import { Equipe, EquipeFilter } from "@/types/equipe";

// Function to fetch equipes with filters
export const fetchEquipes = async (filters: EquipeFilter = {}): Promise<Equipe[]> => {
  console.log('🔄 [fetchEquipes] Iniciando busca de equipes com filtros:', filters);
  try {
    let query = supabase
      .from("bd_equipes")
      .select(`
        *
      `);

    // Apply filters
    if (filters.nome_equipe) {
      query = query.ilike("nome_equipe", `%${filters.nome_equipe}%`);
    }
    
    if (filters.encarregado_id) {
      query = query.eq("encarregado_id", filters.encarregado_id);
    }
    
    if (filters.apontador_id) {
      query = query.eq("apontador_id", filters.apontador_id);
    }

    const { data, error } = await query.order("nome_equipe", { ascending: true });

    if (error) {
      console.error('❌ [fetchEquipes] Erro na consulta Supabase:', error);
      throw new Error(error.message);
    }
    
    console.log('📊 [fetchEquipes] Dados retornados do Supabase:', {
      totalEquipes: data?.length || 0,
      primeiraEquipe: data?.[0] || null,
      temDados: !!data
    });
    
    return data as unknown as Equipe[];
  } catch (error) {
    console.error("Error fetching equipes:", error);
    throw error;
  }
};
