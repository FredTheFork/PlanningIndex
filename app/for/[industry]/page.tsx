import { getServiceById, getServiceGroupById, getServicesInGroup } from '@/lib/services/service-catalog';
import { getIndustryConfig, industrySlugs } from '@/lib/content/industry-pages';
import { IndustryPageClient } from './IndustryPageClient';

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({
    industry: slug,
  }));
}

interface IndustryPageProps {
  params: Promise<{ industry: string }>;
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry } = await params;
  const config = getIndustryConfig(industry);

  if (!config) {
    return null;
  }

  const industryPack = getServiceById(config.packId);
  const foundationPack = getServiceById('business_foundations_pack');
  const industryBundle = getServiceGroupById(config.bundleId);

  if (!industryPack || !foundationPack || !industryBundle) {
    return null;
  }

  const bundleServices = getServicesInGroup(industryBundle.id);
  const bundlePrice = bundleServices.reduce((sum, s) => sum + s.price, 0);
  const discountedPrice = bundlePrice * (1 - industryBundle.discountPercent / 100);

  return (
    <IndustryPageClient
      config={config}
      industry={industry}
      industryPack={industryPack}
      foundationPack={foundationPack}
      industryBundle={industryBundle}
      bundleServices={bundleServices}
      bundlePrice={bundlePrice}
      discountedPrice={discountedPrice}
    />
  );
}
