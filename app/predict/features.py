from datetime import date
from typing import Any

import pandas as pd

CURRENT_YEAR = date.today().year

RAW_DATASET_COLUMNS = [
    "Gender",
    "E-Paylater User Status",
    "Educational Background",
    "Year of Birth",
    "Job Status",
    "Monthly Income",
    "Average monthly expenditure for online shopping in relation to monthly income",
    "IBB1",
    "IBB2",
    "IBB3",
    "IBB4",
    "P1",
    "P2",
    "P3",
    "P4",
    "SI1",
    "SI2",
    "SI3",
    "SI4",
    "SI5",
    "SI6",
    "H1",
    "H2",
    "H3",
    "H4",
    "SC1",
    "SC2",
    "SC3",
    "SC4",
    "SC5",
    "NE1",
    "NE2",
    "NE3",
    "NE4",
    "NE5",
    "Impulsive_Target",
]

MODEL_FEATURE_COLUMNS = [
    "gender",
    "paylater_status",
    "education",
    "umur",
    "job_status",
    "monthly_income",
    "avg_expenditure_ratio",
    "skor_ibb",
    "skor_promosi",
    "skor_social_influence",
    "skor_hedonic",
    "skor_self_control",
    "skor_negative_emotion",
]


def build_feature_vector(request: Any, current_year: int = CURRENT_YEAR) -> list[float]:
    umur = current_year - request.year_of_birth
    return [
        float(request.gender),
        float(request.paylater_status),
        float(request.education),
        float(umur),
        float(request.job_status),
        float(request.monthly_income),
        float(request.avg_expenditure_ratio),
        float(request.skor_ibb),
        float(request.skor_promosi),
        float(request.skor_social_influence),
        float(request.skor_hedonic),
        float(request.skor_self_control),
        float(request.skor_negative_emotion),
    ]


def build_features_from_dataset(df: pd.DataFrame) -> pd.DataFrame:
    features = pd.DataFrame()
    features["gender"] = df["Gender"]
    features["paylater_status"] = df["E-Paylater User Status"]
    features["education"] = df["Educational Background"]
    features["umur"] = CURRENT_YEAR - df["Year of Birth"]
    features["job_status"] = df["Job Status"]
    features["monthly_income"] = df["Monthly Income"]
    features["avg_expenditure_ratio"] = df[
        "Average monthly expenditure for online shopping in relation to monthly income"
    ]
    features["skor_ibb"] = df[["IBB1", "IBB2", "IBB3", "IBB4"]].mean(axis=1)
    features["skor_promosi"] = df[["P1", "P2", "P3", "P4"]].mean(axis=1)
    features["skor_social_influence"] = df[["SI1", "SI2", "SI3", "SI4", "SI5", "SI6"]].mean(axis=1)
    features["skor_hedonic"] = df[["H1", "H2", "H3", "H4"]].mean(axis=1)
    features["skor_self_control"] = df[["SC1", "SC2", "SC3", "SC4", "SC5"]].mean(axis=1)
    features["skor_negative_emotion"] = df[["NE1", "NE2", "NE3", "NE4", "NE5"]].mean(axis=1)
    return features[MODEL_FEATURE_COLUMNS]
