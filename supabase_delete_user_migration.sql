-- Function to delete the current user's account
-- This function should be run in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION delete_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_user_id uuid;
BEGIN
  -- Get the current user's ID
  deleted_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF deleted_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete the user from auth.users and related data
  DELETE FROM auth.users WHERE id = deleted_user_id;
  
  -- Return success
  RETURN json_build_object('success', true, 'user_id', deleted_user_id);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

