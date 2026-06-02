-- ================================================================
--  🗄️  SUPABASE — Execute este SQL no SQL Editor do seu projeto
--  Painel: https://supabase.com → seu projeto → SQL Editor
-- ================================================================

-- 1. Cria a tabela de links
CREATE TABLE IF NOT EXISTS public.links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  clicks      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para busca rápida por slug (usada no redirecionamento)
CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links (slug);

-- 2. Habilita Row Level Security (RLS)
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acesso (anon = usuário não autenticado)
-- Permite ler todos os links (necessário para redirecionar e listar)
CREATE POLICY "allow_read" ON public.links
  FOR SELECT USING (true);

-- Permite inserir novos links
CREATE POLICY "allow_insert" ON public.links
  FOR INSERT WITH CHECK (true);

-- Permite deletar links
CREATE POLICY "allow_delete" ON public.links
  FOR DELETE USING (true);

-- Permite atualizar (para incrementar cliques)
CREATE POLICY "allow_update" ON public.links
  FOR UPDATE USING (true);

-- 4. Função para incrementar cliques com segurança
CREATE OR REPLACE FUNCTION increment_clicks(link_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.links
  SET clicks = clicks + 1
  WHERE id = link_id;
END;
$$;

-- ✅ Pronto! Volte ao README.md para os próximos passos.
