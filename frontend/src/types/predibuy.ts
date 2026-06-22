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

export interface TrainSplitInfo {
  train_size: number;
  test_size: number;
  test_ratio: number;
}

export interface ClassDistribution {
  impulsive: number;
  wise: number;
  total: number;
}

export interface TrainModelResponse {
  status: string;
  model_path: string;
  trained_at: string;
  dataset: string;
  best_params: Record<string, unknown>;
  feature_columns: string[];
  feature_importance: Record<string, number>;
  metrics: Record<string, number | null>;
  class_distribution: ClassDistribution;
  split_info: TrainSplitInfo;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export interface FeatureStat {
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

export interface IncomeStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  std: number;
}

export interface CategoryDistributions {
  gender: Record<number, number>;
  paylater_status: Record<number, number>;
  education: Record<number, number>;
  job_status: Record<number, number>;
}

export interface DatasetAnalysisResponse {
  status: string;
  dataset: DatasetInfo;
  class_distribution: ClassDistribution;
  feature_stats: Record<string, FeatureStat>;
  score_distributions: Record<string, Record<number, number>>;
  category_distributions: CategoryDistributions;
  income_stats: IncomeStats;
}

export interface TreeNode {
  gini: number;
  samples: number;
  value: number[];
  class: string;
  feature?: string;
  threshold?: number;
  children?: TreeNode[];
}

export interface TreeData {
  tree_index: number;
  root: TreeNode;
}

export interface ModelTreesResponse {
  status: string;
  total_trees: number;
  shown_trees: number;
  max_depth: number;
  trained_at: string;
  feature_columns: string[];
  trees: TreeData[];
}
