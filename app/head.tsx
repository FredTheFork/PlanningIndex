import { JsonLd } from '@/components/seo';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo';

export default function Head() {
  return (
    <JsonLd
      data={[
        generateOrganizationSchema(),
        generateWebSiteSchema(),
      ]}
    />
  );
}
