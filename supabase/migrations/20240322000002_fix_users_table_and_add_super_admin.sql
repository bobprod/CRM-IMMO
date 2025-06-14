-- Fix the users table structure to match the expected schema
ALTER TABLE public.users DROP COLUMN IF EXISTS image;
ALTER TABLE public.users DROP COLUMN IF EXISTS name;
ALTER TABLE public.users DROP COLUMN IF EXISTS token_identifier;
ALTER TABLE public.users DROP COLUMN IF EXISTS user_id;

-- Add missing columns if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'manager', 'agent'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update the role constraint to include super_admin
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'admin', 'manager', 'agent'));

-- Create the super admin user in auth.users first
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'bouarada.amine@gmail.com',
  crypt('110284tunis', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('110284tunis', gen_salt('bf')),
  updated_at = NOW();

-- Get the user ID for the super admin
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'bouarada.amine@gmail.com';
    
    -- Insert or update the user in public.users table
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        agency_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        user_uuid,
        'bouarada.amine@gmail.com',
        'Amine Bouarada',
        'super_admin',
        (SELECT id FROM public.agencies LIMIT 1),
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'super_admin',
        full_name = 'Amine Bouarada',
        is_active = true,
        updated_at = NOW();
END $$;

-- Grant all permissions to super admin
INSERT INTO public.user_permissions (user_id, permission, granted_by, created_at)
SELECT 
    u.id,
    unnest(ARRAY['properties', 'prospects', 'matching', 'marketing', 'prospecting', 'settings', 'admin']) as permission,
    u.id,
    NOW()
FROM public.users u 
WHERE u.email = 'bouarada.amine@gmail.com'
ON CONFLICT DO NOTHING;

-- Update the handle_new_user function to properly handle the new schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'agent',
    true
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for the updated tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table agencies;
alter publication supabase_realtime add table user_permissions;
