import { apiClient } from './apiClient';
import {
  User,
  DeceasedProfile,
  Asset,
  DocumentItem,
  Claim,
  ClaimStep,
  ChecklistItem,
  NotificationItem,
  DashboardData,
} from '../types';
import {
  DEMO_USER,
  DEMO_DECEASED,
  DEMO_ASSETS,
  DEMO_DOCUMENTS,
  DEMO_CLAIMS,
  DEMO_CLAIM_STEPS,
  DEMO_CHECKLIST,
  DEMO_NOTIFICATIONS,
  DEMO_DASHBOARD,
  getDemoAiResponse,
} from './demoService';

const isDemo = () => typeof window !== 'undefined' && localStorage.getItem('finclosure_is_demo') === 'true';

// AUTH APIs
export const authApi = {
  register: async (data: any) => {
    if (isDemo()) return { message: 'Demo Mode', token: 'demo_session_token_xyz987', user: DEMO_USER };
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  login: async (data: any) => {
    if (isDemo()) return { message: 'Demo Mode', token: 'demo_session_token_xyz987', user: DEMO_USER };
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/login', data);
    return res.data;
  },
  getMe: async () => {
    if (isDemo()) return { user: DEMO_USER };
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data;
  },
};

// DECEASED PROFILE APIs
export const deceasedApi = {
  create: async (data: Partial<DeceasedProfile>) => {
    if (isDemo()) return { profile: { ...DEMO_DECEASED, ...data } };
    const res = await apiClient.post<{ profile: DeceasedProfile }>('/deceased', data);
    return res.data;
  },
  getAll: async () => {
    if (isDemo()) return { profiles: [DEMO_DECEASED] };
    const res = await apiClient.get<{ profiles: DeceasedProfile[] }>('/deceased');
    return res.data;
  },
  getById: async (id: string) => {
    if (isDemo()) return { profile: DEMO_DECEASED };
    const res = await apiClient.get<{ profile: DeceasedProfile }>(`/deceased/${id}`);
    return res.data;
  },
  update: async (id: string, data: Partial<DeceasedProfile>) => {
    if (isDemo()) return { profile: { ...DEMO_DECEASED, ...data } };
    const res = await apiClient.put<{ profile: DeceasedProfile }>(`/deceased/${id}`, data);
    return res.data;
  },
};

// ASSET APIs
export const assetApi = {
  getAll: async (params?: { category?: string; status?: string; search?: string; deceasedId?: string; sort?: string }) => {
    if (isDemo()) {
      let filtered = [...DEMO_ASSETS];
      if (params?.category) filtered = filtered.filter((a) => a.category === params.category);
      if (params?.status) filtered = filtered.filter((a) => a.status === params.status);
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((a) => a.institution.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
      }
      return { assets: filtered };
    }
    const res = await apiClient.get<{ assets: Asset[] }>('/assets', { params });
    return res.data;
  },
  getById: async (id: string) => {
    if (isDemo()) {
      const found = DEMO_ASSETS.find((a) => a._id === id) || DEMO_ASSETS[0];
      return { asset: found };
    }
    const res = await apiClient.get<{ asset: Asset }>(`/assets/${id}`);
    return res.data;
  },
  create: async (data: Partial<Asset>) => {
    if (isDemo()) {
      const newAsset: Asset = {
        _id: `demo_asset_${Date.now()}`,
        userId: 'demo_user_123',
        deceasedId: 'demo_deceased_1',
        name: data.name || 'New Asset',
        category: (data.category as any) || 'Other',
        institution: data.institution || 'Demo Bank / Insurer',
        estimatedValue: data.estimatedValue || 100000,
        status: (data.status as any) || 'Confirmed',
        notes: data.notes ? `[DEMO DATA] ${data.notes}` : '[DEMO DATA] Manually added asset',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { asset: newAsset };
    }
    const res = await apiClient.post<{ asset: Asset }>('/assets', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Asset>) => {
    if (isDemo()) {
      const asset = DEMO_ASSETS.find((a) => a._id === id) || DEMO_ASSETS[0];
      return { asset: { ...asset, ...data } };
    }
    const res = await apiClient.put<{ asset: Asset }>(`/assets/${id}`, data);
    return res.data;
  },
  confirm: async (id: string) => {
    if (isDemo()) {
      const asset = DEMO_ASSETS.find((a) => a._id === id) || DEMO_ASSETS[0];
      return { message: 'Asset confirmed (Demo Mode)', asset: { ...asset, status: 'Confirmed' } };
    }
    const res = await apiClient.put<{ message: string; asset: Asset }>(`/assets/${id}/confirm`);
    return res.data;
  },
  delete: async (id: string) => {
    if (isDemo()) return { message: 'Asset removed (Demo Mode)' };
    const res = await apiClient.delete<{ message: string }>(`/assets/${id}`);
    return res.data;
  },
};

// DOCUMENT APIs
export const documentApi = {
  getAll: async (params?: { category?: string; assetId?: string; deceasedId?: string }) => {
    if (isDemo()) return { documents: DEMO_DOCUMENTS };
    const res = await apiClient.get<{ documents: DocumentItem[] }>('/documents', { params });
    return res.data;
  },
  getById: async (id: string) => {
    if (isDemo()) return { document: DEMO_DOCUMENTS[0] };
    const res = await apiClient.get<{ document: DocumentItem }>(`/documents/${id}`);
    return res.data;
  },
  upload: async (formData: FormData) => {
    if (isDemo()) {
      const newDoc: DocumentItem = {
        _id: `demo_doc_${Date.now()}`,
        userId: 'demo_user_123',
        deceasedId: 'demo_deceased_1',
        name: 'Uploaded_Demo_Document.pdf',
        category: 'Other',
        fileUrl: '#',
        fileKey: 'demo_key',
        mimeType: 'application/pdf',
        size: 102400,
        status: 'Reviewed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { document: newDoc };
    }
    const res = await apiClient.post<{ document: DocumentItem }>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  delete: async (id: string) => {
    if (isDemo()) return { message: 'Document removed (Demo Mode)' };
    const res = await apiClient.delete<{ message: string }>(`/documents/${id}`);
    return res.data;
  },
};

// CLAIM APIs
export const claimApi = {
  getAll: async (params?: { deceasedId?: string; status?: string }) => {
    if (isDemo()) return { claims: DEMO_CLAIMS };
    const res = await apiClient.get<{ claims: Claim[] }>('/claims', { params });
    return res.data;
  },
  getById: async (id: string) => {
    if (isDemo()) return { claim: DEMO_CLAIMS[0], steps: DEMO_CLAIM_STEPS, checklist: DEMO_CHECKLIST };
    const res = await apiClient.get<{ claim: Claim; steps: ClaimStep[]; checklist: ChecklistItem[] }>(`/claims/${id}`);
    return res.data;
  },
  create: async (data: { deceasedId: string; assetId: string; institution: string; claimType: string; claimReferenceNumber?: string; notes?: string }) => {
    if (isDemo()) return { claim: DEMO_CLAIMS[0] };
    const res = await apiClient.post<{ claim: Claim }>('/claims', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Claim>) => {
    if (isDemo()) return { claim: { ...DEMO_CLAIMS[0], ...data } };
    const res = await apiClient.put<{ claim: Claim }>(`/claims/${id}`, data);
    return res.data;
  },
  updateStep: async (stepId: string, status: string) => {
    if (isDemo()) return { step: { ...DEMO_CLAIM_STEPS[0], status: status as any }, overallProgress: 85 };
    const res = await apiClient.put<{ step: ClaimStep; overallProgress: number }>(`/claims/steps/${stepId}`, { status });
    return res.data;
  },
  toggleChecklistItem: async (claimId: string, itemId: string, isCompleted: boolean, associatedDocumentId?: string) => {
    if (isDemo()) {
      const item = DEMO_CHECKLIST.find((c) => c._id === itemId) || DEMO_CHECKLIST[0];
      return { item: { ...item, isCompleted } };
    }
    const res = await apiClient.put<{ item: ChecklistItem }>(`/claims/${claimId}/checklist/${itemId}`, { isCompleted, associatedDocumentId });
    return res.data;
  },
};

// AI APIs
export const aiApi = {
  discoverAssets: async (deceasedId: string, textContext?: string) => {
    if (isDemo()) return { message: '[DEMO MODE] AI scanned text and discovered 1 potential Mutual Fund asset.', discoveredCount: 1, potentialAssets: [DEMO_ASSETS[3]] };
    const res = await apiClient.post<{ message: string; discoveredCount: number; potentialAssets: Asset[] }>('/ai/discover-assets', { deceasedId, textContext });
    return res.data;
  },
  analyzeDocument: async (documentId: string) => {
    if (isDemo()) return { document: DEMO_DOCUMENTS[0], analysis: { confidence: 0.98, extractedNames: ['Rajesh Sharma', 'Ankit Sharma'], documentCategory: 'death_certificate' } };
    const res = await apiClient.post<{ document: DocumentItem; analysis: any }>('/ai/analyze-document', { documentId });
    return res.data;
  },
  generateChecklist: async (data: { assetCategory: string; institution: string; claimantRole: string; deceasedId?: string }) => {
    if (isDemo()) return { checklist: DEMO_CHECKLIST };
    const res = await apiClient.post<{ checklist: any[] }>('/ai/generate-checklist', data);
    return res.data;
  },
  getClaimGuidance: async (claimId: string) => {
    if (isDemo()) return { guidance: { summary: '[DEMO MODE] Next step: LIC Divisional Office document verification.', actionItems: ['Verify Bank Mandate', 'Submit Cancelled Cheque'] } };
    const res = await apiClient.post<{ guidance: any }>('/ai/claim-guidance', { claimId });
    return res.data;
  },
  chat: async (userQuery: string, deceasedId?: string, language?: string) => {
    if (isDemo()) {
      const demoRes = getDemoAiResponse(userQuery);
      return { response: demoRes };
    }
    const res = await apiClient.post<{ response: any }>('/ai/chat', { userQuery, deceasedId, language });
    return res.data;
  },
};

// DASHBOARD API
export const dashboardApi = {
  getData: async (deceasedId?: string) => {
    if (isDemo()) return DEMO_DASHBOARD;
    const res = await apiClient.get<DashboardData>('/dashboard', { params: { deceasedId } });
    return res.data;
  },
};

// NOTIFICATION API
export const notificationApi = {
  getAll: async () => {
    if (isDemo()) return { notifications: DEMO_NOTIFICATIONS, unreadCount: 1 };
    const res = await apiClient.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
    return res.data;
  },
  markRead: async (id: string) => {
    if (isDemo()) return { notification: { ...DEMO_NOTIFICATIONS[0], isRead: true } };
    const res = await apiClient.put<{ notification: NotificationItem }>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    if (isDemo()) return { message: 'Notifications marked read (Demo Mode)' };
    const res = await apiClient.put<{ message: string }>('/notifications/read-all');
    return res.data;
  },
};

// DEMO SCENARIO API
export const demoApi = {
  seed: async () => {
    if (isDemo()) return { message: 'Demo scenario initialized locally', deceasedProfile: DEMO_DECEASED };
    const res = await apiClient.post<{ message: string; deceasedProfile: DeceasedProfile }>('/demo/seed');
    return res.data;
  },
};
