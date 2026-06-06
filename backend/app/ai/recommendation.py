from typing import List, Dict, Any, Optional
import numpy as np
from sentence_transformers import SentenceTransformer


class RecommendationEngine:
    def __init__(self):
        self.encoder = None
        self.vehicle_embeddings = {}
        self._init_encoder()

    def _init_encoder(self):
        try:
            self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception:
            self.encoder = None

    def _encode(self, text: str) -> np.ndarray:
        if self.encoder:
            return self.encoder.encode(text)
        return np.random.rand(384)

    def recommend_vehicles(
        self,
        customer_profile: Dict[str, Any],
        available_vehicles: List[Dict[str, Any]],
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        if not available_vehicles:
            return []
        query = f"{customer_profile.get('preferences', '')} {customer_profile.get('budget_max', 0)}"
        query_vec = self._encode(query)
        scored = []
        for v in available_vehicles:
            v_text = f"{v.get('model_name', '')} {v.get('brand', '')} {v.get('year', '')} {v.get('price_aed', 0)}"
            v_vec = self._encode(v_text)
            sim = np.dot(query_vec, v_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(v_vec) + 1e-8)
            scored.append((v, float(sim)))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [
            {**v, "recommendation_score": round(s, 4)}
            for v, s in scored[:top_k]
        ]

    def recommend_financing(
        self,
        customer_profile: Dict[str, Any],
        available_plans: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        monthly_income = customer_profile.get("annual_income", 0) / 12
        affordable_emi = monthly_income * 0.4
        scored = []
        for plan in available_plans:
            if plan.get("emi", 0) <= affordable_emi:
                scored.append((plan, 1.0 - abs(plan["emi"] - affordable_emi) / affordable_emi))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [{**p, "affordability_score": round(s, 4)} for p, s in scored[:3]]

    def recommend_upsells(
        self,
        vehicle: Dict[str, Any],
        available_addons: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        vehicle_type = vehicle.get("vehicle_type", "sedan")
        relevant = [
            a for a in available_addons
            if a.get("compatible_types", []) and vehicle_type in a["compatible_types"]
        ]
        return sorted(relevant, key=lambda x: x.get("profit_margin", 0), reverse=True)[:5]


recommendation_engine = RecommendationEngine()
