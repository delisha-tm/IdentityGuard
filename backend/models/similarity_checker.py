import io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
from typing import List

class SimilarityChecker:
    def __init__(self):
        vgg = models.vgg16(weights=models.VGG16_Weights.IMAGENET1K_V1)
        self.model = nn.Sequential(*list(vgg.features.children())[:]).eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

    def get_embedding(self, image_bytes: bytes):
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = self.transform(img).unsqueeze(0)

        with torch.no_grad():
            embedding = self.model(img)
            return embedding.flatten().numpy()

    def cosine_similarity(self, vec1, vec2):
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def compare(self, candidate: bytes, samples: List[bytes]):
        candidate_vec = self.get_embedding(candidate)

        scores = []
        for s in samples:
            sample_vec = self.get_embedding(s)
            score = self.cosine_similarity(candidate_vec, sample_vec)
            scores.append(float(score))

        return {
            "individual_scores": scores,
            "average_similarity": float(sum(scores) / len(scores))
        }
    



    