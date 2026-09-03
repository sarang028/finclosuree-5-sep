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

// AUTH APIs
export const authApi = {
  register: async (data: any) => {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await apiClient.post<{ message: string; token: string; user: User }>('/auth/login', data);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data;
  },
};

// DECEASED PROFILE APIs
export const deceasedApi = {
  create: async (data: Partial<DeceasedProfile>) => {
    const res = await apiClient.post<{ profile: DeceasedProfile }>('/deceased', data);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get<{ profiles: DeceasedProfile[] }>('/deceased');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<{ profile: DeceasedProfile }>(`/deceased/${id}`);
    return res.data;
  },
  update: async (id: string, data: Partial<DeceasedProfile>) => {
    const res = await apiClient.put<{ profile: DeceasedProfile }>(`/deceased/${id}`, data);
    return res.data;
  },
};

// ASSET APIs
export const assetApi = {
  getAll: async (params?: { category?: string; status?: string; search?: string; deceasedId?: string; sort?: string }) => {
    const res = await apiClient.get<{ assets: Asset[] }>('/assets', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<{ asset: Asset }>(`/assets/${id}`);
    return res.data;
  },
  create: async (data: Partial<Asset>) => {
    const res = await apiClient.post<{ asset: Asset }>('/assets', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Asset>) => {
    const res = await apiClient.put<{ asset: Asset }>(`/assets/${id}`, data);
    return res.data;
  },
  confirm: async (id: string) => {
    const res = await apiClient.put<{ message: string; asset: Asset }>(`/assets/${id}/confirm`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<{ message: string }>(`/assets/${id}`);
    return res.data;
  },
};

// DOCUMENT APIs
export const documentApi = {
  getAll: async (params?: { category?: string; assetId?: string; deceasedId?: string }) => {
    const res = await apiClient.get<{ documents: DocumentItem[] }>('/documents', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<{ document: DocumentItem }>(`/documents/${id}`);
    return res.data;
  },
  upload: async (formData: FormData) => {
    const res = await apiClient.post<{ document: DocumentItem }>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<{ message: string }>(`/documents/${id}`);
    return res.data;
  },
};

// CLAIM APIs
export const claimApi = {
  getAll: async (params?: { deceasedId?: string; status?: string }) => {
    const res = await apiClient.get<{ claims: Claim[] }>('/claims', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<{ claim: Claim; steps: ClaimStep[]; checklist: ChecklistItem[] }>(`/claims/${id}`);
    return res.data;
  },
  create: async (data: { deceasedId: string; assetId: string; institution: string; claimType: string; claimReferenceNumber?: string; notes?: string }) => {
    const res = await apiClient.post<{ claim: Claim }>('/claims', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Claim>) => {
    const res = await apiClient.put<{ claim: Claim }>(`/claims/${id}`, data);
    return res.data;
  },
  updateStep: async (stepId: string, status: string) => {
    const res = await apiClient.put<{ step: ClaimStep; overallProgress: number }>(`/claims/steps/${stepId}`, { status });
    return res.data;
  },
  toggleChecklistItem: async (claimId: string, itemId: string, isCompleted: boolean, associatedDocumentId?: string) => {
    const res = await apiClient.put<{ item: ChecklistItem }>(`/claims/${claimId}/checklist/${itemId}`, { isCompleted, associatedDocumentId });
    return res.data;
  },
};

// AI APIs
export const aiApi = {
  discoverAssets: async (deceasedId: string, textContext?: string) => {
    const res = await apiClient.post<{ message: string; discoveredCount: number; potentialAssets: Asset[] }>('/ai/discover-assets', { deceasedId, textContext });
    return res.data;
  },
  analyzeDocument: async (documentId: string) => {
    const res = await apiClient.post<{ document: DocumentItem; analysis: any }>('/ai/analyze-document', { documentId });
    return res.data;
  },
  generateChecklist: async (data: { assetCategory: string; institution: string; claimantRole: string; deceasedId?: string }) => {
    const res = await apiClient.post<{ checklist: any[] }>('/ai/generate-checklist', data);
    return res.data;
  },
  getClaimGuidance: async (claimId: string) => {
    const res = await apiClient.post<{ guidance: any }>('/ai/claim-guidance', { claimId });
    return res.data;
  },
  chat: async (userQuery: string, deceasedId?: string, language?: string) => {
    const res = await apiClient.post<{ response: any }>('/ai/chat', { userQuery, deceasedId, language });
    return res.data;
  },
};

// DASHBOARD API
export const dashboardApi = {
  getData: async (deceasedId?: string) => {
    const res = await apiClient.get<DashboardData>('/dashboard', { params: { deceasedId } });
    return res.data;
  },
};

// NOTIFICATION API
export const notificationApi = {
  getAll: async () => {
    const res = await apiClient.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications');
    return res.data;
  },
  markRead: async (id: string) => {
    const res = await apiClient.put<{ notification: NotificationItem }>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await apiClient.put<{ message: string }>('/notifications/read-all');
    return res.data;
  },
};

// DEMO SCENARIO API
export const demoApi = {
  seed: async () => {
    const res = await apiClient.post<{ message: string; deceasedProfile: DeceasedProfile }>('/demo/seed');
    return res.data;
  },
};
