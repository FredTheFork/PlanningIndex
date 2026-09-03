import { notFound } from 'next/navigation';
import { getApplicationById, mockApplications } from '@/lib/mock/applications';
import { ApplicationDetailContent } from '@/components/workspace/ApplicationDetailContent';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return mockApplications.map((app) => ({ id: app.id }));
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const application = getApplicationById(params.id);
  if (!application) notFound();

  return <ApplicationDetailContent application={application} />;
}
