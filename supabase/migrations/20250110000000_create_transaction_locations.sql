-- Create transaction_locations table
CREATE TABLE IF NOT EXISTS public.transaction_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  place_name TEXT NOT NULL,
  place_category TEXT NOT NULL,
  district TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(transaction_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transaction_locations_transaction_id ON public.transaction_locations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_locations_user_id ON public.transaction_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_locations_district ON public.transaction_locations(district);
CREATE INDEX IF NOT EXISTS idx_transaction_locations_place_category ON public.transaction_locations(place_category);

-- Enable RLS
ALTER TABLE public.transaction_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own transaction locations"
  ON public.transaction_locations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transaction locations"
  ON public.transaction_locations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transaction locations"
  ON public.transaction_locations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transaction locations"
  ON public.transaction_locations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.transaction_locations IS 'Stores location information for transactions';
