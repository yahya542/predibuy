from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.admin import schemas
from app.admin.service import dataset_info, list_datasets, save_uploaded_dataset, train_model
from app.auth.security import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/health", response_model=schemas.AdminHealthResponse)
def admin_health(current_admin: User = Depends(get_current_admin)):
    return {"status": "success", "message": f"Admin authenticated: {current_admin.email}"}


@router.get("/datasets", response_model=schemas.AdminDatasetList)
def daftar_dataset(
    current_admin: User = Depends(get_current_admin),
):
    return {"status": "success", "datasets": list_datasets()}


@router.post("/datasets/upload", response_model=schemas.AdminDatasetUploadResponse)
def upload_dataset(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
):
    try:
        dataset = save_uploaded_dataset(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"status": "success", "dataset": dataset}


@router.post("/datasets/{filename}/info", response_model=schemas.AdminDatasetInfo)
def info_dataset(
    filename: str,
    current_admin: User = Depends(get_current_admin),
):
    try:
        from app.admin.service import resolve_dataset_path

        return dataset_info(resolve_dataset_path(filename))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/models/train", response_model=schemas.AdminTrainModelResponse)
def train_model_endpoint(
    current_admin: User = Depends(get_current_admin),
):
    try:
        return train_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
