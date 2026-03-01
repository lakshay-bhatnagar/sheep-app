
-- Create enums
CREATE TYPE public.app_role AS ENUM ('user', 'cafe', 'admin');
CREATE TYPE public.match_status AS ENUM (
  'pending_cafe_selection', 'cafe_proposed', 'cafe_rejected',
  'awaiting_payment', 'confirmed', 'cancelled', 'expired', 'completed'
);
CREATE TYPE public.swipe_direction AS ENUM ('right', 'left');
CREATE TYPE public.payment_type AS ENUM ('commitment', 'refund', 'commission');
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed', 'forfeited');
CREATE TYPE public.proposal_status AS ENUM ('pending', 'accepted', 'rejected');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  religion TEXT,
  bio TEXT DEFAULT '',
  dating_prompt_answer TEXT DEFAULT '',
  profile_picture_url TEXT,
  voice_intro_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  preferred_gender TEXT,
  min_age INT DEFAULT 18,
  max_age INT DEFAULT 99,
  preferred_religion TEXT,
  budget_min INT DEFAULT 0,
  budget_max INT DEFAULT 10000,
  preferred_time_slots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Swipes
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL,
  swiped_id UUID NOT NULL,
  direction swipe_direction NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create own swipes" ON public.swipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = swiper_id);
CREATE POLICY "Users can view own swipes" ON public.swipes FOR SELECT TO authenticated USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);

-- Cafes
CREATE TABLE public.cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  commission_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  rating_score NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved cafes" ON public.cafes FOR SELECT TO authenticated USING (is_approved = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cafe owners can update own cafe" ON public.cafes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage cafes" ON public.cafes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  status match_status NOT NULL DEFAULT 'pending_cafe_selection',
  expires_at TIMESTAMPTZ,
  chat_unlocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "System can update matches" ON public.matches FOR UPDATE TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id OR public.has_role(auth.uid(), 'admin'));

-- Cafe proposals
CREATE TABLE public.cafe_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  cafe_id UUID NOT NULL REFERENCES public.cafes(id),
  proposed_time TIMESTAMPTZ NOT NULL,
  user1_status proposal_status NOT NULL DEFAULT 'pending',
  user2_status proposal_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cafe_proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match participants can view proposals" ON public.cafe_proposals FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.matches m WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Match participants can manage proposals" ON public.cafe_proposals FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.matches m WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid()))
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  match_id UUID REFERENCES public.matches(id),
  amount NUMERIC(10,2) NOT NULL,
  type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- SDP Tickets
CREATE TABLE public.sdp_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id),
  user_id UUID NOT NULL,
  ticket_code TEXT NOT NULL UNIQUE,
  is_validated BOOLEAN NOT NULL DEFAULT false,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sdp_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tickets" ON public.sdp_tickets FOR SELECT TO authenticated USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'cafe') OR public.has_role(auth.uid(), 'admin')
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  issue_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tickets" ON public.support_tickets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON public.support_tickets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Analytics logs
CREATE TABLE public.analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage analytics" ON public.analytics_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_id);
CREATE INDEX idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_match ON public.payments(match_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_sdp_ticket_code ON public.sdp_tickets(ticket_code);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
