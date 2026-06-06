import numpy as np
from typing import Optional, Dict, Any
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

from app.config import settings


class LeadScorer:
    def __init__(self):
        self.model_path = os.path.join(settings.AI_MODEL_PATH, "lead_scorer.pkl")
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception:
                self.model = None

    def _init_default_model(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=5,
            random_state=42,
        )
        X_dummy = np.random.rand(100, 6)
        y_dummy = np.random.randint(0, 2, 100)
        self.model.fit(X_dummy, y_dummy)

    def score(self, lead_data: Dict[str, Any]) -> float:
        if self.model is None:
            self._init_default_model()
        features = np.array([[
            float(lead_data.get("budget_max", 0)) / 100000,
            float(lead_data.get("budget_min", 0)) / 100000,
            1 if lead_data.get("financing_required") else 0,
            1 if lead_data.get("trade_in_interest") else 0,
            lead_data.get("lead_value", 0) / 100000,
            len(lead_data.get("notes", "") or ""),
        ]])
        proba = self.model.predict_proba(features)[0]
        return round(float(proba[1]) * 100, 2)

    def train(self, leads_data: list):
        pass


lead_scorer = LeadScorer()
