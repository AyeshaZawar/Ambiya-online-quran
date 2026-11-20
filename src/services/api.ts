import {
  PublicBootstrapData,
  AdminUser,
  BlogItem,
  CourseItem,
  PricingPlanItem,
  TestimonialItem,
  AboutCourseCardItem,
  EligibilityCardItem,
  ContactInfoData,
  RegistrationSettingsData,
  TrialRegistrationItem,
  ContactInquiryItem,
} from '../types/cms';

const ADMIN_TOKEN_KEY = 'amqa_admin_token';

function getStoredAdminToken(): string | null {
  try {
    return (
      window.localStorage.getItem(ADMIN_TOKEN_KEY) ||
      window.sessionStorage.getItem(ADMIN_TOKEN_KEY)
    );
  } catch {
    try {
      return window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  }
}

function setStoredAdminToken(token: string | undefined | null): void {
  if (!token) return;
  try {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota / privacy mode restrictions
  }
  try {
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Ignore storage restrictions
  }
}

export function clearStoredAdminToken(): void {
  try {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore
  }
  try {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const token = getStoredAdminToken();
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (
      res.status === 401 &&
      (url.startsWith('/api/admin') || url === '/api/auth/me')
    ) {
      clearStoredAdminToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('amqa-auth-expired'));
      }
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const publicApi = {
  getBootstrap: () => apiRequest<PublicBootstrapData>('/api/public/bootstrap'),
  submitTrialRegistration: (payload: {
    fullName: string;
    selectedCourse: string;
    courseId?: string | null;
    mobileNumber: string;
    email: string;
    classTime: { hour: string; minute: string; period: 'AM' | 'PM'; formatted: string };
    classDuration: string;
    selectedDays: string;
    scheduleType: 'weekly' | 'monthly';
    message: string;
  }) =>
    apiRequest<{ message: string; registration: TrialRegistrationItem }>(
      '/api/public/trial-registrations',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  submitContactInquiry: (payload: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) =>
    apiRequest<{ message: string; inquiry: ContactInquiryItem }>(
      '/api/public/contact-inquiries',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
};

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiRequest<{ admin: AdminUser; token?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      setStoredAdminToken(res.token);
    }
    return res;
  },
  logout: async () => {
    try {
      return await apiRequest<{ message: string }>('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredAdminToken();
    }
  },
  me: () => apiRequest<{ admin: AdminUser }>('/api/auth/me'),
  updateProfile: (name: string) =>
    apiRequest<{ message: string; admin: AdminUser }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  changeEmail: async (payload: {
    currentPassword: string;
    newEmail: string;
    confirmNewEmail: string;
  }) => {
    const res = await apiRequest<{ message: string; admin: AdminUser; token?: string }>(
      '/api/auth/change-email',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    if (res.token) {
      setStoredAdminToken(res.token);
    }
    return res;
  },
  requestPasswordChangeOtp: () =>
    apiRequest<{ message: string; sentViaSmtp: boolean; devPreviewOtp?: string }>(
      '/api/auth/request-password-change',
      { method: 'POST' }
    ),
  confirmPasswordChange: (payload: {
    otpOrToken: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    apiRequest<{ message: string }>('/api/auth/confirm-password-change', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string; sentViaSmtp: boolean; devPreviewOtp?: string }>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    ),
  resetPassword: (payload: {
    email: string;
    otpOrToken: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    apiRequest<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest<{ url: string; provider: string; size: number; mimetype: string }>(
      '/api/admin/upload/image',
      { method: 'POST', body: formData }
    );
  },

  // Website content sections
  getWebsiteContent: () =>
    apiRequest<{ websiteContent: Record<string, unknown> }>('/api/admin/content'),
  updateWebsiteSection: (section: string, payload: Record<string, unknown>) =>
    apiRequest<{ content: unknown }>(`/api/admin/content/${section}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Testimonials
  listTestimonials: () =>
    apiRequest<{ testimonials: TestimonialItem[] }>('/api/admin/testimonials'),
  createTestimonial: (payload: Omit<TestimonialItem, '_id'>) =>
    apiRequest<{ testimonial: TestimonialItem }>('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTestimonial: (id: string, payload: Omit<TestimonialItem, '_id'>) =>
    apiRequest<{ testimonial: TestimonialItem }>(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTestimonial: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // About course overview cards
  listAboutCourseCards: () =>
    apiRequest<{ aboutCourseCards: AboutCourseCardItem[] }>('/api/admin/about-courses'),
  createAboutCourseCard: (payload: Omit<AboutCourseCardItem, '_id'>) =>
    apiRequest<{ aboutCourseCard: AboutCourseCardItem }>('/api/admin/about-courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAboutCourseCard: (id: string, payload: Omit<AboutCourseCardItem, '_id'>) =>
    apiRequest<{ aboutCourseCard: AboutCourseCardItem }>(`/api/admin/about-courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAboutCourseCard: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/about-courses/${id}`, {
      method: 'DELETE',
    }),

  // Eligibility cards
  listEligibilityCards: () =>
    apiRequest<{ eligibilityCards: EligibilityCardItem[] }>('/api/admin/eligibility-cards'),
  createEligibilityCard: (payload: Omit<EligibilityCardItem, '_id'>) =>
    apiRequest<{ eligibilityCard: EligibilityCardItem }>('/api/admin/eligibility-cards', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateEligibilityCard: (id: string, payload: Omit<EligibilityCardItem, '_id'>) =>
    apiRequest<{ eligibilityCard: EligibilityCardItem }>(
      `/api/admin/eligibility-cards/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),
  deleteEligibilityCard: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/eligibility-cards/${id}`, {
      method: 'DELETE',
    }),
  reorderEligibilityCards: (orderedIds: string[]) =>
    apiRequest<{ eligibilityCards: EligibilityCardItem[] }>(
      '/api/admin/eligibility-cards/reorder',
      {
        method: 'PUT',
        body: JSON.stringify({ orderedIds }),
      }
    ),

  // Courses
  listCourses: () => apiRequest<{ courses: CourseItem[] }>('/api/admin/courses'),
  createCourse: (payload: Omit<CourseItem, '_id' | 'slug'>) =>
    apiRequest<{ course: CourseItem }>('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCourse: (id: string, payload: Omit<CourseItem, '_id' | 'slug'>) =>
    apiRequest<{ course: CourseItem }>(`/api/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteCourse: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/courses/${id}`, { method: 'DELETE' }),
  reorderCourses: (orderedIds: string[]) =>
    apiRequest<{ courses: CourseItem[] }>('/api/admin/courses/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
    }),

  // Pricing Plans
  listPricingPlans: () =>
    apiRequest<{ pricingPlans: PricingPlanItem[] }>('/api/admin/pricing-plans'),
  createPricingPlan: (payload: Omit<PricingPlanItem, '_id'>) =>
    apiRequest<{ pricingPlan: PricingPlanItem }>('/api/admin/pricing-plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updatePricingPlan: (id: string, payload: Omit<PricingPlanItem, '_id'>) =>
    apiRequest<{ pricingPlan: PricingPlanItem }>(`/api/admin/pricing-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deletePricingPlan: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/pricing-plans/${id}`, {
      method: 'DELETE',
    }),
  reorderPricingPlans: (orderedIds: string[]) =>
    apiRequest<{ pricingPlans: PricingPlanItem[] }>('/api/admin/pricing-plans/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
    }),

  // Contact Info & Registration Settings
  getContactInfo: () =>
    apiRequest<{ contactInfo: ContactInfoData }>('/api/admin/contact-info'),
  updateContactInfo: (payload: ContactInfoData) =>
    apiRequest<{ contactInfo: ContactInfoData }>('/api/admin/contact-info', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getRegistrationSettings: () =>
    apiRequest<{ registrationSettings: RegistrationSettingsData }>(
      '/api/admin/registration-settings'
    ),
  updateRegistrationSettings: (payload: RegistrationSettingsData) =>
    apiRequest<{ registrationSettings: RegistrationSettingsData }>(
      '/api/admin/registration-settings',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),

  // Blogs
  listBlogs: () => apiRequest<{ blogs: BlogItem[] }>('/api/admin/blogs'),
  createBlog: (payload: Omit<BlogItem, '_id' | 'slug'>) =>
    apiRequest<{ blog: BlogItem }>('/api/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateBlog: (id: string, payload: Omit<BlogItem, '_id' | 'slug'>) =>
    apiRequest<{ blog: BlogItem }>(`/api/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  setBlogStatus: (id: string, status: 'published' | 'draft') =>
    apiRequest<{ blog: BlogItem }>(`/api/admin/blogs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteBlog: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/blogs/${id}`, { method: 'DELETE' }),

  // Submissions (separate endpoints)
  listRegistrations: (params?: { search?: string; course?: string; scheduleType?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.course) qs.set('course', params.course);
    if (params?.scheduleType) qs.set('scheduleType', params.scheduleType);
    const query = qs.toString();
    return apiRequest<{ registrations: TrialRegistrationItem[] }>(
      `/api/admin/registrations${query ? `?${query}` : ''}`
    );
  },
  deleteRegistration: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/registrations/${id}`, {
      method: 'DELETE',
    }),

  listInquiries: (params?: { search?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    const query = qs.toString();
    return apiRequest<{ inquiries: ContactInquiryItem[] }>(
      `/api/admin/inquiries${query ? `?${query}` : ''}`
    );
  },
  toggleInquiryRead: (id: string, isRead: boolean) =>
    apiRequest<{ inquiry: ContactInquiryItem }>(`/api/admin/inquiries/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    }),
  deleteInquiry: (id: string) =>
    apiRequest<{ message: string }>(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
    }),
};
