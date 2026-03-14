-- Criação da tabela de leads para o Investidor Dazarábia
CREATE TABLE IF NOT EXISTS public.leads_lpinvestidordazarabia (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome TEXT,
    email TEXT,
    whatsapp TEXT,
    renda TEXT,
    moeda TEXT,
    origem TEXT,
    detalhes JSONB DEFAULT '{}'::jsonb
);

-- Comentários da tabela
COMMENT ON TABLE public.leads_lpinvestidordazarabia IS 'Captura de leads das landing pages do Investidor Dazarábia';

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.leads_lpinvestidordazarabia ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções de qualquer origem (útil para formulários anônimos)
-- Em produção, você pode restringir por origem se desejar
CREATE POLICY "Permitir inserção anônima" 
ON public.leads_lpinvestidordazarabia 
FOR INSERT 
WITH CHECK (true);
