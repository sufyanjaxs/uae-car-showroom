import numpy as np
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import joblib
import os

from app.config import settings


class DemandForecaster:
    def __init__(self):
        self.model_path = os.path.join(settings.AI_MODEL_PATH, "demand_model.pkl")
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception:
                self.model = LinearRegression()

    def forecast(self, historical_data: List[Dict[str, Any]], months_ahead: int = 3) -> List[Dict[str, Any]]:
        if not historical_data:
            baseline = 30
            return [
                {
                    "month": (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m"),
                    "predicted_demand": baseline + i * 2,
                    "confidence": 0.7 - i * 0.05,
                }
                for i in range(1, months_ahead + 1)
            ]
        df = pd.DataFrame(historical_data)
        df["month_num"] = range(len(df))
        X = df[["month_num"]].values
        y = df.get("sales_count", np.array([10] * len(df))).values
        self.model = LinearRegression()
        self.model.fit(X, y)
        last_month = len(df)
        results = []
        for i in range(1, months_ahead + 1):
            pred = self.model.predict([[last_month + i]])[0]
            results.append({
                "month": (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m"),
                "predicted_demand": max(0, round(pred)),
                "confidence": round(max(0.5, 0.9 - i * 0.08), 2),
            })
        return results

    def predict_popular_models(self, sales_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not sales_data:
            return []
        df = pd.DataFrame(sales_data)
        model_counts = df.groupby("model_name").size().sort_values(ascending=False)
        total = model_counts.sum()
        return [
            {"model": model, "sales": int(count), "percentage": round(count / total * 100, 2)}
            for model, count in model_counts.head(10).items()
        ]


demand_forecaster = DemandForecaster()
