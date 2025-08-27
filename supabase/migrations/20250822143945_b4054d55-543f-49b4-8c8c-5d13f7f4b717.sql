
DO $$
DECLARE
  v_old uuid := '97fa7228-788e-4431-a287-22772a0dc3b7'; -- Duplicado (Pendente)
  v_new uuid := '0ad8d8d9-e853-4263-8dd0-8dd5613db6be'; -- Correto (CPF válido)
  v_count bigint;
BEGIN
  -- Segurança: garantir existência dos registros
  IF NOT EXISTS (SELECT 1 FROM bd_funcionarios WHERE id = v_new) THEN
    RAISE EXCEPTION 'Novo funcionário (v_new) não encontrado';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM bd_funcionarios WHERE id = v_old) THEN
    RAISE NOTICE 'Registro antigo (v_old) não encontrado (pode já ter sido excluído). Encerrando.';
    RETURN;
  END IF;

  -- 1) Reapontar referências diretas

  UPDATE bd_registro_apontamento_cam_equipa SET operador_id = v_new WHERE operador_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_registro_apontamento_cam_equipa.operador_id atualizados: %', v_count;

  UPDATE bd_apontamento_equipe SET colaborador_id = v_new WHERE colaborador_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_apontamento_equipe.colaborador_id atualizados: %', v_count;

  UPDATE profiles SET funcionario_id = v_new WHERE funcionario_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'profiles.funcionario_id atualizados: %', v_count;

  UPDATE bd_equipes SET apontador_id = v_new WHERE apontador_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_equipes.apontador_id atualizados: %', v_count;

  UPDATE bd_equipes SET encarregado_id = v_new WHERE encarregado_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_equipes.encarregado_id atualizados: %', v_count;

  -- Substituição no array equipe (uuid[])
  UPDATE bd_equipes SET equipe = array_replace(equipe, v_old, v_new) 
  WHERE equipe IS NOT NULL AND equipe @> ARRAY[v_old]::uuid[];
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_equipes.equipe (array) linhas atualizadas: %', v_count;

  UPDATE bd_lista_programacao_entrega SET apontador_id = v_new WHERE apontador_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_lista_programacao_entrega.apontador_id atualizados: %', v_count;

  UPDATE bd_chamados_os SET solicitante_id = v_new WHERE solicitante_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_chamados_os.solicitante_id atualizados: %', v_count;

  UPDATE bd_ordens_servico SET mecanico_id = v_new WHERE mecanico_id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_ordens_servico.mecanico_id atualizados: %', v_count;

  -- 2) Herdar equipe_id do antigo se o novo não tiver
  UPDATE bd_funcionarios fnew
     SET equipe_id = COALESCE(fnew.equipe_id, fold.equipe_id),
         updated_at = now()
    FROM bd_funcionarios fold
   WHERE fnew.id = v_new
     AND fold.id = v_old
     AND (fnew.equipe_id IS NULL) 
     AND fold.equipe_id IS NOT NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_funcionarios.equipe_id herdados: %', v_count;

  -- 3) Excluir o registro duplicado
  DELETE FROM bd_funcionarios WHERE id = v_old;
  GET DIAGNOSTICS v_count = ROW_COUNT; RAISE NOTICE 'bd_funcionarios removidos (duplicado): %', v_count;

END $$;

-- 4) Prevenir novas duplicidades (nome/CPF) - reativa trigger se necessário
DROP TRIGGER IF EXISTS trg_prevent_duplicate_funcionarios ON public.bd_funcionarios;

CREATE TRIGGER trg_prevent_duplicate_funcionarios
BEFORE INSERT OR UPDATE ON public.bd_funcionarios
FOR EACH ROW
EXECUTE FUNCTION public.prevent_duplicate_funcionarios();
