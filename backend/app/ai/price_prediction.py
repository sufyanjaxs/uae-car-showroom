import numpy as np
import pandas as pd
from typing import Optional, List, Dict, Any
import joblib
import os

from app.config import settings


class PricePredictor:
    def __init__(self):
        self.model_path = os.path.join(settings.AI_MODEL_PATH, "price_model.pkl")
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception:
                self.model = None

    def _train_default(self, X: np.ndarray, y: np.ndarray):
        from sklearn.ensemble import GradientBoostingRegressor
        self.model = GradientBoostingRegressor(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
        )
        self.model.fit(X, y)
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def predict(self, features: Dict[str, Any]) -> float:
        if self.model is None:
            return features.get("price_base", 0) * 1.1
        X = np.array([[
            features.get("year", 2024),
            features.get("mileage", 0),
            features.get("brand_id", 0),
            features.get("model_year", 2024),
            features.get("engine_capacity", 2.0),
            1 if features.get("condition") == "new" else 0,
            1 if features.get("transmission") == "automatic" else 0,
        ]])
        return float(self.model.predict(X)[0])

    def train(self, vehicles_data: List[Dict[str, Any]]):
        if not vehicles_data:
            return
        df = pd.DataFrame(vehicles_data)
        required_cols = ["year", "mileage", "engine_capacity", "sale_price"]
        if not all(c in df.columns for c in required_cols):
            return
        features = df[["year", "mileage", "engine_capacity"]].fillna(0)
        df["is_new"] = (df["condition"] == "new").astype(int)
        df["is_auto"] = (df["transmission"] == "automatic").astype(int)
        features = pd.concat([
            features,
            df[["is_new", "is_auto"]],
        ], axis=1)
        self._train_default(features.values, df["sale_price"].values)


price_predictor = PricePredictor()
