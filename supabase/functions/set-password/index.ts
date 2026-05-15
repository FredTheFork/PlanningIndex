import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const ADMIN_EMAIL = 'admin@foundationary.co.uk';
const ADMIN_PASSWORD = 'F0und@tionary2025!';

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

    // Handle admin setup action
    if (body.action === 'setup_admin') {
      // Check if admin already exists
      const { data: existingAdmins } = await supabase
        .from('admin_users')
        .select('id')
        .limit(1);

      if (existingAdmins && existingAdmins.length > 0) {
        return new Response(
          JSON.stringify({ message: 'Admin account already exists', alreadyExists: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create the auth user
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });

      let userId: string;

      if (createError) {
        // User might already exist
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existing = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

        if (!existing) {
          console.error('Failed to create admin user:', createError);
          return new Response(JSON.stringify({ error: 'Failed to create admin user' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        userId = existing.id;
      } else {
        if (!userData?.user) {
          return new Response(JSON.stringify({ error: 'No user returned' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        userId = userData.user.id;
      }

      // Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ user_id: userId, role: 'super_admin' });

      if (adminError) {
        console.error('Failed to create admin_users record:', adminError);
        return new Response(JSON.stringify({ error: 'Failed to set admin role' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.info(`Admin user created: ${userId}`);

      return new Response(
        JSON.stringify({ message: 'Admin user created successfully', email: ADMIN_EMAIL }),
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

    // Check if user has a client_profile (i.e. they paid)
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
