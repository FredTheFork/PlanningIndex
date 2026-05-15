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

    const body = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Handle set_admin_metadata action - sets admin role in app_metadata
    if (body.action === 'set_admin_metadata') {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const adminUser = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

      if (!adminUser) {
        return new Response(JSON.stringify({ error: 'Admin user not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { app_metadata: { role: 'admin' } }
      );

      if (updateError) {
        return new Response(JSON.stringify({ error: 'Failed to set admin metadata: ' + updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ message: 'Admin metadata set successfully', userId: adminUser.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle setup_admin action
    if (body.action === 'setup_admin') {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      let adminUser = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);
      let userId: string;

      if (adminUser) {
        userId = adminUser.id;
        // Update password and set admin metadata
        await supabase.auth.admin.updateUserById(userId, {
          password: ADMIN_PASSWORD,
          app_metadata: { role: 'admin' },
        });
      } else {
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          app_metadata: { role: 'admin' },
        });

        if (createError || !userData?.user) {
          return new Response(JSON.stringify({ error: 'Failed to create admin: ' + (createError?.message || 'No user returned') }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        userId = userData.user.id;
      }

      return new Response(
        JSON.stringify({ message: 'Admin user ready', email: ADMIN_EMAIL, userId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle list_users action (for admin dashboard)
    if (body.action === 'list_users') {
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        return new Response(JSON.stringify({ error: 'Failed to list users' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const users = usersData.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
      }));

      return new Response(
        JSON.stringify({ users }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Original set-password logic
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the user by email
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Failed to list users:', listError);
      return new Response(JSON.stringify({ error: 'Failed to find user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = usersData.users.find((u: any) => u.email === email);

    if (!user) {
      return new Response(JSON.stringify({ error: 'No account found for this email. Please complete your purchase first.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has a client_profile (i.e. they paid) OR is an admin
    const isAdmin = user.app_metadata?.role === 'admin';
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        return new Response(JSON.stringify({ error: 'No purchase found for this email. Please complete your purchase first.' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('Failed to update password:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to set password. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.info(`Password set for user: ${user.id}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Set password error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
