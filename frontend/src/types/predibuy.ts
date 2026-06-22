export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserOut {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin?: boolean;
}

export interface CurrentUser {
  id: number;
  email: string;
  username: string;
  is_admin?: boolean;
}

export interface PredictionRequest {
  gender: number;
  paylater_status: number;
  education: number;
  year_of_birth: number;
  job_status: number;
  monthly_income: number;
  avg_expenditure_ratio: number;
  skor_ibb: number;
  skor_promosi: number;
  skor_social_influence: number;
  skor_hedonic: number;
  skor_self_control: number;
  skor_negative_emotion: number;
}

export interface PredictionData {
  id_riwayat: number;
  kesimpulan: string;
  persentase_kecenderungan: number;
  pesan: string;
}

export interface PredictionResponse {
  status: string;
  aplikasi: string;
  data: PredictionData;
}

export interface HistoryItem {
  id: number;
  user_id: number;
  umur: number;
  pendapatan: number;
  skor_diskon: number;
  skor_emosi: number;
  is_impulsive: number;
  confidence_rate: number;
  model_version?: string | null;
  input_json?: PredictionRequest | null;
  created_at: string;
}

export interface HistoryResponse {
  status: string;
  riwayat_user: HistoryItem[];
}

export interface DatasetInfo {
  filename: string;
  path: string;
  size_bytes: number;
  uploaded_at: string;
  rows?: number | null;
  columns?: number | null;
  valid: boolean;
}

export interface DatasetListResponse {
  status: string;
  datasets: DatasetInfo[];
}

export interface DatasetUploadResponse {
  status: string;
  dataset: DatasetInfo;
}

export interface TrainModelResponse {
  model_path: string;
  trained_at: string;
  dataset: string;
  feature_columns: string[];
  metrics: Record<string, number | null>;
}

export interface HealthResponse {
  status: string;
  message: string;
}
