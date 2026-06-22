import { clearAuth } from 'auth/auth';
import type {
  DatasetAnalysisResponse,
  DatasetInfo,
  DatasetListResponse,
  DatasetUploadResponse,
  HealthResponse,
  HistoryResponse,
  ModelTreesResponse,
  PredictionRequest,
  PredictionResponse,
  TokenResponse,
  TrainModelResponse,
  UserOut,
} from 'types/predibuy';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const getErrorMessage = (data: unknown): string => {
  if (!data || typeof data !== 'object') {
    return 'Terjadi kesalahan pada server';
  }

  const record = data as Record<string, unknown>;
  const detail = record.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: string }).msg);
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (typeof record.message === 'string') {
    return record.message;
  }

  return 'Terjadi kesalahan pada server';
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('predibuy_access_token');
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!isFormData && options.body && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as T;
}

export const authApi = {
  register: (email: string, username: string, password: string) =>
    apiRequest<UserOut>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    }),
  login: (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    return apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: formData,
    });
  },
  me: () => apiRequest<UserOut>('/auth/me'),
  logout: () => {
    clearAuth();
  },
};

export const predictionApi = {
  predict: (payload: PredictionRequest) =>
    apiRequest<PredictionResponse>('/predict/predict', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  history: () => apiRequest<HistoryResponse>('/predict/history'),
};

export const adminApi = {
  health: () => apiRequest<HealthResponse>('/admin/health'),
  datasets: () => apiRequest<DatasetListResponse>('/admin/datasets'),
  uploadDataset: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<DatasetUploadResponse>('/admin/datasets/upload', {
      method: 'POST',
      body: formData,
    });
  },
  datasetInfo: (filename: string) =>
    apiRequest<DatasetInfo>(`/admin/datasets/${encodeURIComponent(filename)}/info`, {
      method: 'POST',
    }),
  analyzeDataset: () => apiRequest<DatasetAnalysisResponse>('/admin/datasets/analyze', { method: 'POST' }),
  getModelTrees: (treeLimit = 3, maxDepth = 4) =>
    apiRequest<ModelTreesResponse>(`/admin/model/trees?tree_limit=${treeLimit}&max_depth=${maxDepth}`),
  trainModel: () => apiRequest<TrainModelResponse>('/admin/models/train', { method: 'POST' }),
  formatBytes,
};
