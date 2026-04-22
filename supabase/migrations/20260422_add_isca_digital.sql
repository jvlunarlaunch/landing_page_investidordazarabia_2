-- Adição do campo isca_digital para identificar qual landing page gerou o lead
ALTER TABLE public.leads_lpinvestidordazarabia
ADD COLUMN IF NOT EXISTS isca_digital TEXT;

COMMENT ON COLUMN public.leads_lpinvestidordazarabia.isca_digital IS 'Identifica qual isca digital (landing page) gerou o lead';
