-- Adição de campos específicos para a consultoria WSWM
ALTER TABLE public.leads_lpinvestidordazarabia 
ADD COLUMN IF NOT EXISTS patrimonio TEXT,
ADD COLUMN IF NOT EXISTS idade TEXT,
ADD COLUMN IF NOT EXISTS ocupacao TEXT,
ADD COLUMN IF NOT EXISTS mora_exterior BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pais TEXT,
ADD COLUMN IF NOT EXISTS mensagem TEXT;
