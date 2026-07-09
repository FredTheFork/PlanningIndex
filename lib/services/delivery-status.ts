import { supabase } from '@/lib/supabase/client';
import { getDocumentTypesForService, isOperationsService, isIndustryService } from './document-service-map';

export type DeliveryStatus = 'not_started' | 'in_progress' | 'delivered';

export interface DeliveryStatusResult {
  status: DeliveryStatus;
  totalExpected: number;
  totalDelivered: number;
  percentage: number;
}

/**
 * Calculate delivery status for a given user and service tier.
 * Shared across all admin tabs to ensure consistency.
 */
export async function calculateDeliveryStatus(
  userId: string,
  serviceId: string
): Promise<DeliveryStatusResult> {
  const expectedTypes = getDocumentTypesForService(serviceId);

  const { data: docs } = await supabase
    .from('generated_documents')
    .select('document_type, delivered_to_client')
    .eq('client_id', userId);

  const deliveredTypes = new Set(
    docs?.filter(d => d.delivered_to_client).map(d => d.document_type) || []
  );

  const deliveredCount = expectedTypes.filter(t => deliveredTypes.has(t)).length;
  const allDelivered = expectedTypes.length > 0 && expectedTypes.every(t => deliveredTypes.has(t));
  const anyDelivered = expectedTypes.some(t => deliveredTypes.has(t));

  let status: DeliveryStatus = 'not_started';
  if (allDelivered) status = 'delivered';
  else if (anyDelivered) status = 'in_progress';

  const percentage = expectedTypes.length > 0
    ? Math.round((deliveredCount / expectedTypes.length) * 100)
    : 0;

  return {
    status,
    totalExpected: expectedTypes.length,
    totalDelivered: deliveredCount,
    percentage,
  };
}

/**
 * Update the client_profiles.delivery_status based on ALL purchased services.
 * This should be called after any document delivery action.
 */
export async function updateOverallDeliveryStatus(userId: string): Promise<void> {
  // Get all purchased services for this user
  const { data: purchasedServices } = await supabase
    .from('services_purchased')
    .select('service_id')
    .eq('user_id', userId)
    .eq('status', 'active');

  const serviceIds = purchasedServices?.map(ps => ps.service_id) || [];

  // Also check for business_foundations_pack (may not be in services_purchased if purchased before that table existed)
  const { data: profile } = await supabase
    .from('client_profiles')
    .select('purchased_upsells')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile?.purchased_upsells) {
    profile.purchased_upsells.forEach((id: string) => {
      if (!serviceIds.includes(id)) serviceIds.push(id);
    });
  }

  // If no services found, default business_foundations_pack
  if (serviceIds.length === 0) {
    serviceIds.push('business_foundations_pack');
  }

  // Get all delivered document types
  const { data: docs } = await supabase
    .from('generated_documents')
    .select('document_type, delivered_to_client')
    .eq('client_id', userId);

  const deliveredTypes = new Set(
    docs?.filter(d => d.delivered_to_client).map(d => d.document_type) || []
  );

  // Check website delivery
  const { data: websiteDelivery } = await supabase
    .from('website_deliveries')
    .select('delivered_at')
    .eq('user_id', userId)
    .not('delivered_at', 'is', null)
    .maybeSingle();

  // Check social posts delivery
  const { count: deliveredPostsCount } = await supabase
    .from('social_media_posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('delivered_to_client', true);

  // Calculate expected document types across all services
  const allExpectedTypes = serviceIds.flatMap(sid => getDocumentTypesForService(sid));
  const uniqueExpectedTypes = [...new Set(allExpectedTypes)];

  const docDeliveredCount = uniqueExpectedTypes.filter(t => deliveredTypes.has(t)).length;
  const docAllDelivered = uniqueExpectedTypes.length > 0 && uniqueExpectedTypes.every(t => deliveredTypes.has(t));
  const docAnyDelivered = uniqueExpectedTypes.some(t => deliveredTypes.has(t));

  // Check if website and posts are included in purchases
  const hasWebsite = serviceIds.includes('website_copy_pack');
  const hasSocial = serviceIds.includes('social_media_pack');

  // Determine overall status
  let status: DeliveryStatus = 'not_started';

  // All document types delivered, and any website/posts (if purchased)
  const websiteDelivered = hasWebsite ? !!websiteDelivery?.delivered_at : true;
  const postsDelivered = hasSocial ? (deliveredPostsCount || 0) > 0 : true;

  if (docAllDelivered && websiteDelivered && postsDelivered) {
    status = 'delivered';
  } else if (docAnyDelivered || websiteDelivered || postsDelivered) {
    status = 'in_progress';
  }

  // Update client_profiles
  await supabase
    .from('client_profiles')
    .update({ delivery_status: status })
    .eq('user_id', userId);
}

/**
 * Mark a single document as delivered and update overall status.
 * Returns the auto_delete_at timestamp.
 */
export async function markDocumentDelivered(
  docId: string,
  options?: { autoDeleteDays?: number }
): Promise<{ deliveredAt: string; autoDeleteAt: string }> {
  const now = new Date();
  const autoDeleteDays = options?.autoDeleteDays ?? 14;
  const autoDeleteAt = new Date(now.getTime() + autoDeleteDays * 24 * 60 * 60 * 1000);

  const { data: doc } = await supabase
    .from('generated_documents')
    .update({
      delivered_to_client: true,
      delivered_at: now.toISOString(),
      auto_delete_at: autoDeleteAt.toISOString(),
    })
    .eq('id', docId)
    .select('client_id')
    .single();

  if (doc?.client_id) {
    await updateOverallDeliveryStatus(doc.client_id);
  }

  return {
    deliveredAt: now.toISOString(),
    autoDeleteAt: autoDeleteAt.toISOString(),
  };
}

/**
 * Bulk mark multiple documents as delivered.
 * Returns count of documents delivered.
 */
export async function bulkMarkDocumentsDelivered(
  docIds: string[],
  options?: { autoDeleteDays?: number }
): Promise<{ count: number; deliveredAt: string; autoDeleteAt: string }> {
  if (docIds.length === 0) {
    return { count: 0, deliveredAt: '', autoDeleteAt: '' };
  }

  const now = new Date();
  const autoDeleteDays = options?.autoDeleteDays ?? 14;
  const autoDeleteAt = new Date(now.getTime() + autoDeleteDays * 24 * 60 * 60 * 1000);

  const { data: docs } = await supabase
    .from('generated_documents')
    .update({
      delivered_to_client: true,
      delivered_at: now.toISOString(),
      auto_delete_at: autoDeleteAt.toISOString(),
    })
    .in('id', docIds)
    .select('client_id');

  // Update overall status for the first document's user
  const firstDoc = docs?.[0];
  if (firstDoc?.client_id) {
    await updateOverallDeliveryStatus(firstDoc.client_id);
  }

  return {
    count: docs?.length || 0,
    deliveredAt: now.toISOString(),
    autoDeleteAt: autoDeleteAt.toISOString(),
  };
}

/**
 * Get a summary of delivery status for a user.
 */
export async function getDeliverySummary(userId: string): Promise<{
  status: DeliveryStatus;
  documents: {
    total: number;
    delivered: number;
    pending: number;
  };
  website: {
    purchased: boolean;
    delivered: boolean;
  };
  socialPosts: {
    purchased: boolean;
    delivered: boolean;
    count: number;
  };
}> {
  // Get purchased services
  const { data: purchasedServices } = await supabase
    .from('services_purchased')
    .select('service_id')
    .eq('user_id', userId)
    .eq('status', 'active');

  const serviceIds = purchasedServices?.map(ps => ps.service_id) || [];

  // Also check client_profiles for legacy purchases
  const { data: profile } = await supabase
    .from('client_profiles')
    .select('purchased_upsells, delivery_status')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile?.purchased_upsells) {
    profile.purchased_upsells.forEach((id: string) => {
      if (!serviceIds.includes(id)) serviceIds.push(id);
    });
  }

  if (serviceIds.length === 0) {
    serviceIds.push('business_foundations_pack');
  }

  // Get all expected document types
  const allExpectedTypes = serviceIds.flatMap(sid => getDocumentTypesForService(sid));
  const uniqueExpectedTypes = [...new Set(allExpectedTypes)];

  // Get delivered documents
  const { data: docs } = await supabase
    .from('generated_documents')
    .select('document_type, delivered_to_client')
    .eq('client_id', userId);

  const deliveredTypes = new Set(
    docs?.filter(d => d.delivered_to_client).map(d => d.document_type) || []
  );

  const docDeliveredCount = uniqueExpectedTypes.filter(t => deliveredTypes.has(t)).length;

  // Check website
  const hasWebsite = serviceIds.includes('website_copy_pack');
  const { data: websiteDelivery } = await supabase
    .from('website_deliveries')
    .select('delivered_at')
    .eq('user_id', userId)
    .not('delivered_at', 'is', null)
    .maybeSingle();

  // Check social posts
  const hasSocial = serviceIds.includes('social_media_pack');
  const { count: deliveredPostsCount } = await supabase
    .from('social_media_posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('delivered_to_client', true);

  return {
    status: profile?.delivery_status || 'not_started',
    documents: {
      total: uniqueExpectedTypes.length,
      delivered: docDeliveredCount,
      pending: uniqueExpectedTypes.length - docDeliveredCount,
    },
    website: {
      purchased: hasWebsite,
      delivered: !!websiteDelivery?.delivered_at,
    },
    socialPosts: {
      purchased: hasSocial,
      delivered: (deliveredPostsCount || 0) > 0,
      count: deliveredPostsCount || 0,
    },
  };
}
