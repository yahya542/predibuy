from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AdminDatasetInfo(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    filename: str
    path: str
    size_bytes: int
    uploaded_at: datetime
    rows: Optional[int] = None
    columns: Optional[int] = None
    valid: bool = False


class AdminDatasetList(BaseModel):
    status: str
    datasets: list[AdminDatasetInfo]


class AdminDatasetUploadResponse(BaseModel):
    status: str
    dataset: AdminDatasetInfo


class TrainSplitInfo(BaseModel):
    train_size: int
    test_size: int
    test_ratio: float


class ClassDistribution(BaseModel):
    impulsive: int
    wise: int
    total: int


class AdminTrainModelResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str
    model_path: str
    trained_at: str
    dataset: str
    best_params: dict
    feature_columns: list[str]
    feature_importance: dict[str, float]
    metrics: dict
    class_distribution: ClassDistribution
    split_info: TrainSplitInfo


class FeatureStat(BaseModel):
    mean: float
    std: float
    min: float
    max: float
    median: float


class IncomeStats(BaseModel):
    mean: float
    median: float
    min: float
    max: float
    std: float


class CategoryDistributions(BaseModel):
    gender: dict[int, int]
    paylater_status: dict[int, int]
    education: dict[int, int]
    job_status: dict[int, int]


class AdminDatasetAnalysisResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str
    dataset: AdminDatasetInfo
    class_distribution: ClassDistribution
    feature_stats: dict[str, FeatureStat]
    score_distributions: dict[str, dict[int, int]]
    category_distributions: CategoryDistributions
    income_stats: IncomeStats


class AdminHealthResponse(BaseModel):
    status: str
    message: str
