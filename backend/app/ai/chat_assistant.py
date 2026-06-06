from typing import Optional, Dict, Any, List


class ChatAssistant:
    def __init__(self):
        self.context: Dict[str, Any] = {}

    def process_message(self, message: str, user_context: Optional[Dict] = None) -> Dict[str, Any]:
        message_lower = message.lower()
        if any(word in message_lower for word in ["hello", "hi", "hey", "salam", "marhaba"]):
            return {"response": "Welcome to our showroom! How can I help you today? You can ask about vehicles, financing, test drives, or our services.", "action": "greeting"}
        if any(word in message_lower for word in ["car", "vehicle", "model", "brand", "show"]):
            return self._handle_vehicle_query(message, user_context)
        if any(word in message_lower for word in ["finance", "loan", "emi", "installment", "lease"]):
            return self._handle_finance_query(message, user_context)
        if any(word in message_lower for word in ["test drive", "book", "appointment", "schedule"]):
            return {"response": "I can help you schedule a test drive! May I know which vehicle model you're interested in and your preferred date and time?", "action": "schedule_test_drive"}
        if any(word in message_lower for word in ["price", "cost", "how much"]):
            return {"response": "Our vehicle prices range from AED 50,000 to AED 500,000+. Could you tell me your budget and preferred vehicle type?", "action": "price_inquiry"}
        if any(word in message_lower for word in ["trade", "exchange", "sell"]):
            return {"response": "We offer trade-in services! We'll evaluate your current vehicle and provide a competitive offer. May I know the make, model, and year of your vehicle?", "action": "trade_in_inquiry"}
        if any(word in message_lower for word in ["service", "repair", "maintenance", "warranty"]):
            return {"response": "Our service center offers comprehensive maintenance, repairs, and warranty services. Would you like to book a service appointment?", "action": "service_inquiry"}
        return {"response": "Thank you for your inquiry. One of our sales representatives will contact you shortly. Is there anything specific you'd like to know about our vehicles or services?", "action": "general_inquiry"}

    def _handle_vehicle_query(self, message: str, context: Optional[Dict]) -> Dict[str, Any]:
        brands = ["toyota", "nissan", "honda", "bmw", "mercedes", "audi", "lexus", "ford", "chevrolet", "hyundai", "kia", "mitsubishi"]
        for brand in brands:
            if brand in message.lower():
                return {"response": f"Great choice! We have a wide selection of {brand.title()} vehicles. Would you like to see our current inventory or book a test drive?", "action": "brand_inquiry", "brand": brand}
        return {"response": "We carry a wide range of vehicles including Japanese, German, American, and Korean brands. What type of vehicle are you looking for?", "action": "vehicle_inquiry"}

    def _handle_finance_query(self, message: str, context: Optional[Dict]) -> Dict[str, Any]:
        return {"response": "We offer flexible financing options through multiple banks and financial institutions in the UAE. Our plans include 0% interest offers, low EMI options, and Islamic financing. Would you like to check your eligibility?", "action": "finance_inquiry"}
