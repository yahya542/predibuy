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


class AdminTrainModelResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    status: str
    model_path: str
    trained_at: str
    dataset: str
    feature_columns: list[str]
    metrics: dict


class AdminHealthResponse(BaseModel):
    status: str
    message: str
