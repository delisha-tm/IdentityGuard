import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class PhishingDetector:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("cybersectony/phishing-email-detection-distilbert_v2.4.1")
        self.model = AutoModelForSequenceClassification.from_pretrained("cybersectony/phishing-email-detection-distilbert_v2.4.1")
        self.model.eval()

        self.labels = [
            "legitimate_email",
            "phishing_url",
            "legitimate_url",
            "phishing_url_alt"
        ]

    def predict(self, email_text: str):
        inputs = self.tokenizer(
            email_text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)[0]

        probs_list = probs.tolist()

        label_probs = dict(zip(self.labels, probs_list))
        prediction, confidence = max(label_probs.items(), key=lambda x: x[1])

        return {
            "prediction": prediction,
            "confidence": float(confidence)
        }