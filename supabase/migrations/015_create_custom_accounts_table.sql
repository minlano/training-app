-- 자체 계정 테이블 생성
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 계정만 관리할 수 있음
CREATE POLICY "Users can manage own account" ON public.accounts
    FOR ALL USING (id = auth.uid()::text);

-- 기존 user_profiles 테이블 수정 (accounts 테이블 참조)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE;

-- 기존 workouts 테이블 수정 (accounts 테이블 참조)
ALTER TABLE public.workouts 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE;

-- 기존 weight_records 테이블 수정 (accounts 테이블 참조)
ALTER TABLE public.weight_records 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE; 