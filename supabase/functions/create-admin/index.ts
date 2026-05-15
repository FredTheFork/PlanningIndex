import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ADMIN_EMAIL = 'foundationarybusiness@gmail.com';
const ADMIN_PASSWORD = 'FoundationaryBusiness123@@';

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Step 1: Try to find existing user
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existing = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

    let userId: string;

    if (existing) {
      userId = existing.id;
      // Update password to ensure it's correct
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
      });
      if (updateError) {
        console.error('Failed to update password:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update password: ' + updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.info('Updated password for existing user:', userId);
    } else {
      // Create new user
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });

      if (createError) {
        console.error('Failed to create user:', createError);
        return new Response(JSON.stringify({ error: 'Failed to create user: ' + createError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!userData?.user) {
        return new Response(JSON.stringify({ error: 'No user returned' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      userId = userData.user.id;
      console.info('Created new user:', userId);
    }

    // Step 2: Ensure admin_users record exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingAdmin) {
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ user_id: userId, role: 'super_admin' });

      if (adminError) {
        console.error('Failed to create admin_users record:', adminError);
        return new Response(JSON.stringify({ error: 'Failed to set admin role: ' + adminError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Step 3: Verify login works
    const testClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { error: loginError } = await testClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (loginError) {
      return new Response(JSON.stringify({
        warning: 'User created but login verification failed',
        error: loginError.message,
        userId,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      message: 'Admin user created and login verified successfully',
      email: ADMIN_EMAIL,
      userId,
      loginVerified: true,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create admin error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
