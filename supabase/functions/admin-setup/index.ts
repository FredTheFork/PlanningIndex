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

    if (createError) {
      // User might already exist, try to find them
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existing = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

      if (!existing) {
        console.error('Failed to create admin user:', createError);
        return new Response(JSON.stringify({ error: 'Failed to create admin user' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ user_id: existing.id, role: 'super_admin' });

      if (adminError) {
        console.error('Failed to create admin_users record:', adminError);
        return new Response(JSON.stringify({ error: 'Failed to set admin role' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ message: 'Admin role assigned to existing user', email: ADMIN_EMAIL }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userData?.user) {
      return new Response(JSON.stringify({ error: 'No user returned' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({ user_id: userData.user.id, role: 'super_admin' });

    if (adminError) {
      console.error('Failed to create admin_users record:', adminError);
      return new Response(JSON.stringify({ error: 'Failed to set admin role' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.info(`Admin user created: ${userData.user.id}`);

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', email: ADMIN_EMAIL }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Admin setup error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
