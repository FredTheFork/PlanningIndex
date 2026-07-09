// Content module barrel export

// Articles
export {
  articles,
  getArticleBySlug,
  getRelatedArticles,
} from './articles';

// FAQ
export type { FAQ } from './faq-data';
export { faqs } from './faq-data';

// Industry Pages
export {
  industryConfigs,
  industrySlugs,
  getIndustryConfig,
} from './industry-pages';
export type {
  IndustryTestimonial,
  IndustryFAQ,
  IndustryComplianceAlert,
  IndustryPageConfig,
} from './industry-pages';

// About Page Data
export {
  realityItems,
  riskItems,
  costItems,
  usualItems,
  differentItems,
  processSteps,
  feelItems,
  avoidItems,
  forYouItems,
  notForYouItems,
  ethicsItems,
  successItems,
  whyExistItems,
  founderPhilosophyItems,
  founderCommitmentItems,
} from './about-data';

// How It Works Data
export {
  howItWorksSteps,
  isItems,
  isntItems,
  howItWorksFaqs,
} from './how-it-works-data';

// Contact Data
export { contactExpectations } from './contact-data';

// Documents Data
export {
  documentsList,
  documentsFaqs,
  documentsFeatures,
  documentsBundles,
} from './documents-data';
