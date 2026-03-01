
-- Fix: tighten matches INSERT to only allow participants
DROP POLICY "System can create matches" ON public.matches;
CREATE POLICY "Users can create matches they participate in" ON public.matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
