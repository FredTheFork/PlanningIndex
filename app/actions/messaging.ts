'use server';

interface MessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_content: string;
  message_type: string;
  created_at: string;
}

/**
 * Server action to trigger notification after message is inserted
 * Runs on the server with access to SUPABASE_SERVICE_ROLE_KEY
 * Calls the send-message-notification Edge Function
 */
export async function triggerMessageNotification(messageData: MessageData) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration for message notifications');
      return { success: false, error: 'Missing server configuration' };
    }

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/send-message-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(messageData),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Edge Function error:', errorData);
      return { success: false, error: `Edge function returned ${response.status}` };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error triggering message notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
