export interface HeroContentData {
  section: 'home_hero';
  heading?: string;
  introParagraph: string;
  steps: string[];
  imageUrl: string;
}

export interface WhyStudyContentData {
  section: 'home_why_study';
  heading?: string;
  paragraphs: string[];
  imageUrl: string;
}

export interface AboutWelcomeContentData {
  section: 'about_welcome';
  heading: string;
  paragraphs: string[];
  imageUrl: string;
  imageCaption: string;
}

export interface WebsiteContentMap {
  home_hero: HeroContentData;
  home_why_study: WhyStudyContentData;
  about_welcome: AboutWelcomeContentData;
}

export interface AboutCourseCardItem {
  _id: string;
  title: string;
  description: string;
  tag: string;
  iconName: string;
  order: number;
}

export interface EligibilityCardItem {
  _id: string;
  num: string;
  heading?: string;
  description: string;
  iconName: string;
  order: number;
}

export interface CourseItem {
  _id: string;
  slug: string;
  title: string;
  badge: string;
  tag: string;
  description: string;
  suitableFor: string;
  learningPoints: string[];
  iconName: string;
  popular: boolean;
  isActive: boolean;
  order: number;
}

export interface PricingPlanItem {
  _id: string;
  planName: string;
  subtitle: string;
  daysPerWeek: string;
  daysPerMonth?: string;
  classesPerMonth: string;
  classDuration: string;
  monthlyPrice: number;
  currency: string;
  currencySymbol: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular: boolean;
  popularBadgeText: string;
  ctaText: string;
  footnoteText: string;
  order: number;
}

export interface BlogItem {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  gradient: string;
  readTime: string;
  content: string[];
  status: 'published' | 'draft';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  order: number;
}

export interface TestimonialItem {
  _id: string;
  quote: string;
  author: string;
  location?: string | null;
  order: number;
}

export interface ContactInfoData {
  cardTitle: string;
  addressLocation: string;
  globalAvailabilityTitle: string;
  globalAvailabilityText: string;
  whatsappTitle: string;
  whatsappNumber: string;
  whatsappText: string;
  emailTitle: string;
  emailAddress: string;
  emailText: string;
  ctaButtonText: string;
  headerDescription: string;
}

export interface RegistrationSettingsData {
  hours: string[];
  minutes: string[];
  durations: string[];
  daysPerWeekOptions: string[];
  daysPerMonthOptions: string[];
  allowTimeSelection?: boolean;
  allowDurationSelection?: boolean;
  allowWeeklySelection: boolean;
  allowMonthlySelection: boolean;
}

export interface PublicBootstrapData {
  source: 'mongodb' | 'fallback';
  websiteContent: WebsiteContentMap;
  aboutCourseCards: AboutCourseCardItem[];
  eligibilityCards: EligibilityCardItem[];
  courses: CourseItem[];
  pricingPlans: PricingPlanItem[];
  blogs: BlogItem[];
  testimonials: TestimonialItem[];
  contactInfo: ContactInfoData;
  registrationSettings: RegistrationSettingsData;
}

export interface TrialRegistrationItem {
  _id: string;
  fullName: string;
  selectedCourse: string;
  courseId?: string | null;
  mobileNumber: string;
  email: string;
  classTime: {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
    formatted: string;
  };
  classDuration: string;
  selectedDays: string;
  scheduleType: 'weekly' | 'monthly';
  message: string;
  createdAt: string;
}

export interface ContactInquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt?: string;
  createdAt?: string;
}
