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

    const body = await req.json().catch(() => ({}));

    // Handle force_reset: delete existing admin and recreate
    if (body.action === 'force_reset') {
      // Find and delete existing admin user
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existing = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

      if (existing) {
        // Delete from admin_users first (no FK cascade from auth side)
        await supabase.from('admin_users').delete().eq('user_id', existing.id);
        // Delete the auth user
        await supabase.auth.admin.deleteUser(existing.id);
      }
    }

    // Check if admin already exists and is valid
    if (body.action !== 'force_reset') {
      const { data: existingAdmins } = await supabase
        .from('admin_users')
        .select('id, user_id')
        .limit(1);

      if (existingAdmins && existingAdmins.length > 0) {
        // Verify the auth user actually works by checking they exist
        const adminUserId = existingAdmins[0].user_id;
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const authUser = usersData?.users?.find((u: any) => u.id === adminUserId);

        if (authUser) {
          // Also ensure password is correct by updating it
          await supabase.auth.admin.updateUserById(adminUserId, {
            password: ADMIN_PASSWORD,
          });

          return new Response(
            JSON.stringify({
              message: 'Admin account already exists, password refreshed',
              alreadyExists: true,
              email: ADMIN_EMAIL,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Auth user doesn't exist but admin_users row does - clean up
        await supabase.from('admin_users').delete().eq('id', existingAdmins[0].id);
      }
    }

    // Create the auth user via the proper Auth API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

    let userId: string;

    if (createError) {
      // User might already exist in auth - find them and update password
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existing = usersData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

      if (!existing) {
        console.error('Failed to create admin user:', createError);
        return new Response(JSON.stringify({ error: 'Failed to create admin user: ' + createError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      userId = existing.id;

      // Update password to ensure it's correct
      await supabase.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD });
    } else {
      if (!userData?.user) {
        return new Response(JSON.stringify({ error: 'No user returned' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      userId = userData.user.id;
    }

    // Add to admin_users table (use upsert to handle duplicates)
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({ user_id: userId, role: 'super_admin' }, { onConflict: 'user_id' });

    if (adminError) {
      console.error('Failed to create admin_users record:', adminError);
      return new Response(JSON.stringify({ error: 'Failed to set admin role: ' + adminError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.info(`Admin user created/refreshed: ${userId}`);

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', email: ADMIN_EMAIL, userId }),
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
