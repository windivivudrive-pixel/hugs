-- Create customer_leads table
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT,
    message_history JSONB,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS permissions
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to read leads
CREATE POLICY "Allow authenticated admins to read leads"
    ON public.customer_leads
    FOR SELECT
    TO authenticated
    USING (true);
