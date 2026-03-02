
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fun_prompts jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS government_id_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS preferred_days jsonb DEFAULT '[]'::jsonb;
